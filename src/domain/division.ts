// Implements the Division class for organizing tournaments
import omit from 'lodash/omit';
import max from 'lodash/max';
import min from 'lodash/min';
import cloneDeep from 'lodash/cloneDeep';
import Team from './team';
// Default rules if none provided
import { NetHeight } from './court';
import Pool from './pool';
// Schedules
import { retrieveTemplate } from './schedules';
import { DivisionFormat, defaultFormat, importDivisionRules } from './rules';
import { getDivisionKey, validateDivision } from './utility';

/**
 * @brief Calculates the number of Playoff teams to break from a pool
 *
 * @param numTeams is the number of teams in a pool
 * @param totalTeams is the total number of teams in the division
 * @returns the number of playoff teams that break
 */
const getPlayoffTeams = (numTeams: number, totalTeams: number): number => {
  // General rule for number of playoff teams
  let playoffTeams = Math.floor(numTeams / 2);

  // Special cases
  if (numTeams === 7) {
    // Break 50% rule for pool of 7 (usually only pool)
    playoffTeams = 4;
  } else if (numTeams === totalTeams) {
    // 1 pool. Add team for playoff work team
    playoffTeams = 3;
  } else if (totalTeams === 10 || totalTeams === 11) {
    // 2 Pools of 5 or pool of 5/6. 3 teams for even playoffs with work teams
    playoffTeams = 3;
  }
  return playoffTeams;
};

type DivisionPropTypes = {
  courts: number[];
  division: string;
  minNets: number;
  maxNets: number;
  pools: Pool[];
  rules: DivisionFormat;
  teams: Team[];
  waitList: Team[];
  netHeight: NetHeight;
};

type DivisionProps = { [P in keyof DivisionPropTypes]: DivisionPropTypes[P] };

function isDivision(obj: string | Division): obj is Division {
  return (obj as Division).props !== undefined;
}

export default class Division {
  readonly props: DivisionProps;

  constructor(input: string | Division, format?: DivisionFormat) {
    // Get division name
    const divName = isDivision(input) ? input.props.division : input;
    validateDivision(divName);

    // Default division rules
    const allRules = importDivisionRules({ [getDivisionKey(divName)]: format });
    const rules = allRules[getDivisionKey(divName)];

    // Initialize
    this.props = {
      courts: [],
      division: divName,
      minNets: 0,
      maxNets: 0,
      pools: [],
      teams: [],
      waitList: [],
      netHeight: 'undefined',
      rules: rules.poolFormat ? rules : cloneDeep(defaultFormat),
    };

    // Import
    if (isDivision(input)) {
      // Import object
      this.import(input);
    } else {
      // Set the expected net height
      this.setNetHeight();
    }
  }

  /* ** IMPORT ** */
  import(input: Division) {
    // Loop through all fields in class and import as needed

    // Import generic properties first
    Object.assign(
      this.props,
      omit(input.props, ['pools', 'waitList', 'teams'])
    );

    // Now re-create teams
    input.props.teams.forEach((t) => this.addTeam(new Team(t)));
    input.props.waitList.forEach((t) => this.addTeam(new Team(t)));

    // Ensure seeding is up to date
    this.updateSeeding();

    // If pools were saved, re-create them now
    if (input.props.pools.length > 0) {
      // TODO fix kludge
      if (this.props.courts.length < this.props.minNets) {
        this.props.courts = Array(this.props.minNets).fill(1);
      }
      // Recreate the pools instead of loading them, which wouldn't properly link the teams
      this.createPools();
    }
  }

  /* ** Division Rules ** */
  setNetHeight() {
    // Set net height depending on name
    if (
      this.props.division.includes('Women') ||
      this.props.division.includes('Coed')
    ) {
      this.props.netHeight = 'women';
    } else {
      this.props.netHeight = 'men';
    }
  }

  /* ** REGISTRATION MANAGEMENT ** */
  // Add a team to the division
  addTeam(team: Team) {
    // Check if it goes into the tournament or wait list
    if (team.props.isWaitListed) {
      team.props.seed = this.props.waitList.length + 1;
      this.props.waitList.push(team);
    } else {
      this.props.teams.push(team);
      // Update ranking points
      this.updateSeeding();
      // Update nets
      this.updateNets();
    }
  }

  removeTeam(team: number, waitList: boolean) {
    // Remove input team index from teams
    if (waitList) {
      if (team < this.props.waitList.length) {
        this.props.waitList = this.props.waitList.filter(
          (_, ind) => ind !== team
        );
        this.updatePosition();
      }
    } else if (team < this.props.teams.length) {
      this.props.teams = this.props.teams.filter((_, ind) => ind !== team);
      this.updateSeeding();
      this.updateNets();
    }
  }

  // Number of teams in tournament
  numTeams() {
    return this.props.teams.length;
  }

  // Number of teams on the waitlist
  numWaitListed() {
    return this.props.waitList.length;
  }

  // Update seeds in the tournament
  updateSeeding() {
    if (this.numTeams() > 0) {
      // Sorts the teams in the division by team descending ranking points
      this.props.teams.sort((a, b) => {
        return b.props.ranking - a.props.ranking;
      });

      // Set the seeds of the teams in the division
      this.props.teams.forEach((team, index) => {
        team.props.seed = index + 1;
      });
    }
  }

  // Update number of required nets
  updateNets() {
    const poolTeams = Object.keys(this.props.rules.poolFormat).map((r) =>
      parseInt(r, 10)
    );
    const maxTeams = max(poolTeams);
    const minTeams = min(poolTeams);
    if (maxTeams && minTeams) {
      this.props.minNets = Math.ceil(this.numTeams() / maxTeams);
      this.props.maxNets = Math.max(1, Math.floor(this.numTeams() / minTeams));
    }
  }

  // Update seeds in the tournament
  updatePosition() {
    if (this.numWaitListed() > 0) {
      // Sorts the teams in the waitlist by sign-up time
      this.props.waitList.sort((a, b) => {
        return (
          (b.props.registrationTime || 0) - (a.props.registrationTime || 0)
        );
      });

      // Set the seeds of the teams in the division
      this.props.waitList.forEach((team, index) => {
        team.props.seed = index + 1;
      });
    }
  }

  /* ** POOL MANAGEMENT ** */
  // Assign courts numbers to division
  assignCourts(courts: number[] | number) {
    if (!Array.isArray(courts)) {
      // If the input is just a single number, force it into an array
      this.props.courts = [courts];
    } else {
      this.props.courts = courts;
    }
    // Check for center court and ensure it will be the first one out
    this.setCenterCourt();
  }

  setCenterCourt() {
    // If center court is in the rules, make sure seed 1 gets it
    if (this.props.rules.centerCourt) {
      // Find center court
      const centerIndex = this.props.courts.findIndex((el) => {
        return el === this.props.rules.centerCourt;
      });

      if (centerIndex > 0) {
        // Remove center court and push it to the front of the array (it gets popped out first)
        const swap = (arr: number[], index1: number, index2: number) => {
          [arr[index2], arr[index1]] = [arr[index1], arr[index2]];
        };
        // Swap first element with center court
        swap(this.props.courts, 0, centerIndex);
      }
    }
  }

  // Create all pools
  createPools() {
    // Validate that you have enough courts for all the nets you need
    if (
      this.props.courts.length < this.props.minNets ||
      this.props.courts.length > this.props.maxNets
    ) {
      throw new Error(
        `The number of courts for ${this.props.division} must be >= ${this.props.minNets} & <= ${this.props.maxNets}`
      );
    }

    // Remove previous pools
    this.props.pools = [];
    // Create new pools with court assignment
    for (let court = 0; court < this.props.courts.length; court += 1) {
      // Create new pool
      const newPool = new Pool(this.props.division);
      // Assign court number to pool
      newPool.courts = [this.props.courts[court]];

      // Save pool in division
      this.props.pools.push(newPool);
    }

    // Pool index
    let poolIndex = 0;
    let direction = 1;
    // Number of pools required
    const numPools = this.props.courts.length;
    // Number of teams to do regular assignment in snake (-1 because index is 0 based)
    const teamCutoff = Math.floor(this.numTeams() / numPools) * numPools - 1;
    // Do a snake style assignment of teams to pools
    this.props.teams.forEach((team, index) => {
      // Assign team to pool
      this.props.pools[poolIndex].addTeam(team);
      // Increment pool Index
      poolIndex += direction;
      // Check for time to switch snake direction
      if (index === teamCutoff && this.props.pools[0].teams.length < 5) {
        // Force reverse snake for last round
        direction = -1;
        poolIndex = numPools - 1;
      } else if (
        index === teamCutoff &&
        this.props.pools[0].teams.length === 5 &&
        this.numTeams() !== 11
      ) {
        // Force the snake to start at pool 1
        direction = 1;
        poolIndex = 0;
      } else if (poolIndex === numPools || poolIndex < 0) {
        direction *= -1;
        poolIndex += direction;
      }
    });

    // Assign format to each pool
    this.props.pools.forEach((pool) => {
      pool.setFormat(
        this.props.rules,
        retrieveTemplate(pool.teams.length),
        getPlayoffTeams(pool.teams.length, this.numTeams())
      );
    });
  }
}
