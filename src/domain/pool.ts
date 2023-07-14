// Implements the Pool class for pool play in a tournament
import Team from './team';
import type { DivisionFormat, DivisionPoolFormat } from './rules';
import { Match, retrieveTemplate } from './schedules';
import type { Pool } from '../renderer/redux/pools';
import type { TeamEntry } from '../renderer/redux/entries';
import { Court } from './court';
import { calcRequiredNets } from '../renderer/redux/rules';

// Team class for tournament entries
export default class LegacyPool {
  courts: number[];

  division: string;

  teams: Team[];

  schedule: Match[];

  numGames: number;

  points: number;

  playoffTeams: number;

  constructor(division: string) {
    // Fill in initial fields
    this.courts = [];
    this.division = division;
    this.teams = [];
    this.schedule = [];
    this.numGames = 0;
    this.points = 0;
    this.playoffTeams = 0;
  }

  /**
   * @brief Adds a team to a pool
   *
   * @param team is the team to add to the pool
   */
  addTeam(team: Team) {
    // Add new team
    this.teams.push(team);
  }

  /**
   * @brief Creates the pool with a given format, schedule and number of playoff teams
   *
   * @param rules define the pool format
   * @param schedule is the schedule of matches for the pool
   * @param playoffTeams are the number of playoff teams from this pool
   */
  setFormat(rules: DivisionFormat, schedule: Match[], playoffTeams: number) {
    // Check playoff teams
    if (playoffTeams > 0.8 * this.teams.length) {
      throw new Error('Number of playoff teams is too high');
    }

    // Set parameters
    const format = rules.poolFormat[this.teams.length];
    if (!format) {
      throw new Error(`Pool format for ${this.teams.length} is not defined`);
    }

    this.numGames = format.numGames;
    this.points = format.points;
    this.playoffTeams = playoffTeams;
    // Deep copy schedule into pool
    this.schedule = JSON.parse(JSON.stringify(schedule));
  }
}

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

export const createPools = (
  courts: Court[],
  entries: TeamEntry[],
  rules: DivisionFormat
): Pool[] => {
  // Total number of teams
  const numTeams = entries.length;
  const poolFormat: DivisionPoolFormat = rules.poolFormat as DivisionPoolFormat;

  if (!poolFormat) {
    throw new Error('Pool format is not defined');
  }

  // Required nets
  const required = calcRequiredNets(numTeams, poolFormat);

  // Validate number of teams
  if (required.minNets === 0) {
    throw new Error(`Not enough teams: ${numTeams} to make a pool`);
  }

  // Validate that you have enough courts for all the nets you need
  if (courts.length < required.minNets || courts.length > required.maxNets) {
    throw new Error(
      `The number of courts for ${entries[0].division} must be >= \
        ${required.minNets} & <= ${required.maxNets}`
    );
  }

  // Create new pools with court assignment
  const pools: Pool[] = courts.map((court, ind) => {
    return {
      id: ind + 1,
      division: entries[0].division,
      teams: [],
      courts: [court.number],
      schedule: [],
      format: {
        playoffTeams: 0,
        numGames: 0,
        points: 0,
      },
    } as Pool;
  });

  // Pool index
  let poolIndex = 0;
  let direction = 1;
  // Number of pools required
  const numPools = pools.length;
  // Number of teams to do regular assignment in snake (-1 because index is 0 based)
  const teamCutoff = Math.floor(numTeams / numPools) * numPools - 1;

  // Do a snake style assignment of teams to pools
  entries.forEach((team, index) => {
    // Assign team to pool
    pools[poolIndex].teams.push(team);

    // Increment pool Index
    poolIndex += direction;
    // Check for time to switch snake direction
    if (index === teamCutoff && pools[0].teams.length < 5) {
      // Force reverse snake for last round
      direction = -1;
      poolIndex = numPools - 1;
    } else if (
      index === teamCutoff &&
      pools[0].teams.length === 5 &&
      numTeams !== 11
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
  pools.forEach((pool) => {
    const { numGames, points } = poolFormat[pool.teams.length];

    pool.schedule = retrieveTemplate(pool.teams.length);
    pool.format.playoffTeams = getPlayoffTeams(pool.teams.length, numTeams);
    pool.format.numGames = numGames;
    pool.format.points = points;
  });

  return pools;
};
