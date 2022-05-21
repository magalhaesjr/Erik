// Implements the Division class for organizing tournaments
import Team from './team';
// Default rules if none provided
import { DIVISION_RULES, validateRules } from './rules';

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
  const rules = allRules;
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
  constructor(name, rules = DIVISION_RULES) {
    // Validate division name
    validateDivision(name);
    // validate rules
    validateRules(rules);
    this.division = name;
    this.nets = 0;
    this.teams = [];
    this.waitList = [];
    this.pools = [];

    // Set the rules for the division
    this.rules = setDivisionRules(rules, this.division);
  }

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
}
