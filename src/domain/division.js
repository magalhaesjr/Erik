// Implements the Division class for organizing tournaments
import Team from './team';
// Default rules if none provided
import { DIVISION_RULES, validateRules } from './rules';
import { isObject, validateObject } from './validate';
// Schedules
import { retrieveTemplate } from './schedules';
// Pool only imports the validation function, so no circular dependency here
// eslint-disable-next-line import/no-cycle
import Pool from './pool';

export function validateDivision(name) {
  /* Check division input */
  if (typeof name !== 'string') {
    throw new Error('Division name must be a string');
  } else if (name.length === 0 || name === undefined) {
    throw new Error('Division name must not be empty');
  }
}

// Number of playoff teams from a pool
function getPlayoffTeams(numTeams, totalTeams) {
  // General rule for number of playoff teams
  let playoffTeams = Math.floor(numTeams / 2);

  // Special cases
  if (numTeams === 7) {
    // Break 50% rule for pool of 7 (usually only pool)
    playoffTeams = 4;
  } else if (numTeams === totalTeams) {
    // 1 pool. Add team for playoff work team
    playoffTeams = 3;
  } else if (numTeams === 5 && (totalTeams === 10 || totalTeams === 11)) {
    // 2 Pools of 5 or pool of 5/6. 3 teams for even playoffs with work teams
    playoffTeams = 3;
  }
  return playoffTeams;
}

// Set division rules
function setDivisionRules(allRules, division) {
  // Creates a nested copy of the simple rules object
  const rules = JSON.parse(JSON.stringify(allRules));
  // If there are division specific rules, apply them here
  if (Object.prototype.hasOwnProperty.call(allRules, division)) {
    Object.keys(allRules[division]).forEach((rule) => {
      rules[rule] = allRules[division][rule];
    });
  }
  return rules;
}

// Represents a division in a tournament
export class Division {
  constructor(input, rules = DIVISION_RULES) {
    // Initialize
    this.courts = [];
    this.division = '';
    this.nets = 0;
    this.pools = [];
    this.rules = {};
    this.teams = [];
    this.waitList = [];

    // Override defaults
    if (isObject(input)) {
      // Import object
      this.import(input);
    } else {
      // Validate division name
      validateDivision(input);
      // validate rules
      validateRules(rules);
      this.division = input;
      // Set the rules for the division
      this.rules = setDivisionRules(rules, this.division);
    }
  }

  /* ** IMPORT ** */
  import(input) {
    // Validate input object
    validateObject(input);

    // Loop through all fields in class and import as needed
    Object.keys(this).forEach((key) => {
      if (Object.prototype.hasOwnProperty.call(input, key)) {
        if (key === 'teams' || key === 'waitList') {
          // Re-create team objects and add them to the team
          input[key].forEach((team) => {
            this.addTeam(new Team(team));
          });
        } else if (key !== 'pools') {
          // Just assign the property
          this[key] = input[key];
        }
      }
    });
    // Update seeding is up to date
    this.updateSeeding();

    // If pools were saved, re-create them now
    if (
      Object.prototype.hasOwnProperty.call(input, 'pools') &&
      input.pools.length > 0
    ) {
      // Recreate the pools instead of loading them, which wouldn't properly link the teams
      this.createPools();
    }
  }

  /* ** REGISTRATION MANAGEMENT ** */
  // Add a team to the division
  addTeam(team) {
    if (team instanceof Team) {
      // Check if it goes into the tournament or wait list
      if (team.isWaitListed) {
        this.waitList.push(team);
      } else {
        this.teams.push(team);
        // Update ranking points
        this.updateSeeding();
        // Update number of required nets
        this.nets = Math.ceil(this.numTeams() / this.rules.maxTeams);
      }
    } else {
      // Not a valid Team
      throw new Error('Input object is not a Team class');
    }
  }

  // Number of teams in tournament
  numTeams() {
    return this.teams.length;
  }

  // Number of teams on the waitlist
  numWaitListed() {
    return this.waitList.length;
  }

  // Update seeds in the tournament
  updateSeeding() {
    if (this.numTeams() > 0) {
      // Sorts the teams in the division by team descending ranking points
      this.teams.sort((a, b) => {
        return b.ranking - a.ranking;
      });

      // Set the seeds of the teams in the division
      this.teams.forEach((team, index) => {
        team.seed = index + 1;
      });
    }
  }

  /* ** POOL MANAGEMENT ** */
  // Assign courts numbers to division
  assignCourts(courts) {
    // Validate input
    if (!Array.isArray(courts) && typeof courts !== 'number') {
      throw new Error('Courts must be an array of numbers');
    } else if (!Array.isArray(courts)) {
      // If the input is just a single number, force it into an array
      // eslint-disable-next-line no-param-reassign
      courts = [courts];
    }

    // Check court numbers to ensure they are valid on the beach
    if (Math.max(...courts) > this.rules.maxCourts || Math.min(...courts) < 1) {
      throw new Error(
        `Court numbers must be >= 1 && <= ${this.rules.maxCourts}`
      );
    }
    // Remove previous courts
    this.courts = [];
    // Assign new courts
    this.courts = courts;

    // Check for center court and ensure it will be the first one out
    this.setCenterCourt();
  }

  setCenterCourt() {
    // If center court is in the rules, make sure seed 1 gets it
    if (
      Object.prototype.hasOwnProperty.call(this.rules, 'centerCourt') &&
      this.courts.includes(this.rules.centerCourt)
    ) {
      // Find center court
      const centerIndex = this.courts.findIndex((el) => {
        return el === this.rules.centerCourt;
      });
      // Remove center court and push it to the front of the array (it gets popped out first)
      const swap = (arr, index1, index2) => {
        [arr[index2], arr[index1]] = [arr[index1], arr[index2]];
      };
      // Swap first element with center court
      swap(this.courts, 0, centerIndex);
    }
  }

  // Create all pools
  createPools() {
    // Validate that you have enough courts for all the nets you need
    if (this.courts.length < this.nets || this.nets === 0) {
      throw new Error('There are not enough courts assigned to this division');
    }

    // Remove previous pools
    this.pools = [];
    // Create new pools with court assignment
    for (let court = 0; court < this.nets; court += 1) {
      // Create new pool
      const newPool = new Pool(this.division);
      // Assign court number to pool
      newPool.courts = this.courts[court];
      // Save pool in division
      this.pools.push(new Pool(this.division));
    }

    // Pool index
    let poolIndex = 0;
    let direction = 1;
    // Number of teams to do regular assignment in snake
    const teamCutoff =
      this.rules.maxTeams * Math.floor(this.numTeams() / this.rules.maxTeams);

    // Do a snake style assignment of teams to pools
    this.teams.forEach((team, index) => {
      // Assign team to pool
      this.pools[poolIndex].addTeam(team);
      // Increment pool Index
      poolIndex += direction;
      // Check for time to switch snake direction
      if (index === teamCutoff && this.numTeams() !== 11) {
        // Force reverse snake for last round
        direction = -1;
        poolIndex = this.nets - 1;
      } else if (poolIndex === this.nets || poolIndex < 0) {
        direction *= -1;
        poolIndex += direction;
      }
    });

    // Assign format to each pool
    this.pools.forEach((pool) => {
      pool.setFormat(
        this.rules,
        retrieveTemplate(pool.teams.length),
        getPlayoffTeams(pool.teams.length, this.numTeams())
      );
    });
  }
}
