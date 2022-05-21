// Implements the Pool class for pool play in a tournament
import Team from './team';
import { validateRules } from './rules';
import { validateDivision } from './division';
import { validateSchedule } from './schedules';

// Team class for tournament entries
export default class Pool {
  constructor(division) {
    // Fill in initial fields
    validateDivision(division);
    this.courts = [];
    this.division = division;
    this.teams = [];
    this.schedule = [];
    this.numGames = 0;
    this.points = 0;
    this.playoffTeams = 0;
  }

  // Add a new player to the team
  addTeam(team) {
    if (team instanceof Team) {
      // Add new player
      this.teams.push(team);
    } else {
      // Not a valid Team
      throw new Error('Input object is not a Team class');
    }
  }

  // Setup pool
  setFormat(rules, schedule, playoffTeams) {
    // Validate pool rules
    validateRules(rules);
    // Validate schedule
    validateSchedule(schedule);
    // Check playoff teams
    if (playoffTeams > 0.8 * this.teams.length) {
      throw new Error('Number of playoff teams is too high');
    }

    // Set parameters
    const format = rules.poolFormat[this.teams.length];
    this.numGames = format.numGames;
    this.points = format.points;
    this.playoffTeams = playoffTeams;
    this.schedule = schedule;
  }
}
