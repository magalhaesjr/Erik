// Implements the Team class for organizing tournaments
import Player from './player';

// Fields required for player construction
const TEAM_FIELDS = ['sign-up', 'paid', 'division'];

// Validates that all required inputs are available
function validateInput(info) {
  // Verify that you have either seed or wait-list
  if (
    !Object.prototype.hasOwnProperty.call(info, 'seed') &&
    !Object.prototype.hasOwnProperty.call(info, 'wait list')
  ) {
    throw new Error(`Team input is missing seed or waitlist`);
  }
  // Check remaining fields
  TEAM_FIELDS.forEach((key) => {
    if (!Object.prototype.hasOwnProperty.call(info, key)) {
      throw new Error(`Team input is missing ${key}`);
    } else if (info[key] === undefined || info[key] === null) {
      throw new Error(`Team input ${key} is undefined`);
    }
  });
}

// Extract the signup date string and convert it to posixtime (unix time)
function extractTime(regString) {
  // Grab the date portion
  const regex = /\(([^)]+)\)/g;
  const regDate = new Date(regString.split(regex));
  // Convert to posix time
  return regDate.getTime() / 1000;
}

// Team class for tournament entries
export default class Team {
  constructor(teamInput) {
    // Verify inputs
    validateInput(teamInput);

    // Fill in remaining data
    this.seed = null;
    this.paid = teamInput.paid.includes('Y');
    this.isWaitListed = Object.prototype.hasOwnProperty.call(
      teamInput,
      'wait list'
    );
    this.registrationTime = extractTime(teamInput['sign-up']);
    this.players = [];
    this.ranking = 0.0;
    this.court = 0;
    this.division = teamInput.division;
    this.pool = 0;
  }

  // Add a new player to the team
  addPlayer(player) {
    if (player instanceof Player) {
      // Add new player
      this.players.push(player);
      // Update ranking points
      this.updateRanking();
    } else {
      // Not a valid player
      throw new Error('Input object is not a Player class');
    }
  }

  updateRanking() {
    // calculates the total ranking of the team, using all the individual player ranking points
    this.ranking = 0.0;
    this.players.forEach((player) => {
      this.ranking += player.ranking;
    });
  }
}
