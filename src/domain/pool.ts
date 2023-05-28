// Implements the Pool class for pool play in a tournament
import Team from './team';
import type { DivisionFormat } from './rules';
import { Match } from './schedules';

// Team class for tournament entries
export default class Pool {
  courts: number[] | number;

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
