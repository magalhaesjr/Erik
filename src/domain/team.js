// Implements the Team class for organizing tournaments
import Player from './player';
import { isObject, validateObject } from './validate';

// Fields required for player construction
const TEAM_FIELDS = ['sign-up', 'paid', 'division'];

// Validates that all required inputs are available
function validateInput(info) {
  // Validate object
  validateObject(info);
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
    // Build object
    this.seed = null;
    this.paid = false;
    this.isWaitListed = false;
    this.registrationTime = null;
    this.players = [];
    this.ranking = 0.0;
    this.court = 0;
    this.division = '';

    // if extra inputs, import
    if (
      isObject(teamInput) &&
      Object.prototype.hasOwnProperty.call(teamInput, 'sign-up')
    ) {
      this.importFromSheet(teamInput);
    } else if (isObject(teamInput)) {
      this.import(teamInput);
    }
  }

  // import parsed HTML table
  importFromSheet(teamInput) {
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
  }

  // Add a new player to the team
  addPlayer(player) {
    if (player instanceof Player) {
      // Update paid status
      if (this.paid) {
        player.paid = true;
      }
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

  // Export
  export() {
    return JSON.stringify(this);
  }

  // Import
  import(input) {
    // Validate input object
    validateObject(input);
    // Loop through all fields in class and import as needed
    Object.keys(this).forEach((key) => {
      if (Object.prototype.hasOwnProperty.call(input, key)) {
        if (key === 'players') {
          // Re-create player objects and add them to the team
          input[key].forEach((player) => {
            this.addPlayer(new Player(player));
          });
        } else {
          // Just assign the property
          this[key] = input[key];
        }
      }
    });
    // Ensure ranking is up to date
    this.updateRanking();
  }
}
