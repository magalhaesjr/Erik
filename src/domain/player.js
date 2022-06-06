// Defines the player class for individual players in the tournament
import { isObject, validateObject } from './validate';

// Fields required for player construction
const PLAYER_FIELDS = [
  'name',
  'email',
  'org',
  'avpa#',
  'ranking',
  'membershipValid',
];

// Validates that all required inputs are available
function validateInput(info) {
  // Validate it's an object
  validateObject(info);
  PLAYER_FIELDS.forEach((key) => {
    if (!Object.prototype.hasOwnProperty.call(info, key)) {
      throw new Error(`Player input is missing ${key}`);
    } else if (info[key] === undefined || info[key] === null) {
      throw new Error(`Player input ${key} is undefined`);
    }
  });
}

// Validates required fields are filled in
function validatePlayer(player) {
  if (Number.isNaN(player.avpa)) {
    throw new Error('Avpa # is invalid');
  } else if (Number.isNaN(player.ranking)) {
    throw new Error('Ranking points are invalid');
  }
}

// Class representing a player in the tournament
export default class Player {
  constructor(playerIn) {
    this.firstName = '';
    this.lastName = '';
    this.avpa = 0;
    this.email = '';
    this.org = '';
    this.ranking = 0.0;
    this.membershipValid = false;
    this.paid = false;
    this.staff = false;

    // If more data was input
    if (
      isObject(playerIn) &&
      Object.prototype.hasOwnProperty.call(playerIn, 'name')
    ) {
      // Import from a parsed avpamerica html table
      this.importFromSheet(playerIn);
    } else if (isObject(playerIn)) {
      // Import from exported object
      this.import(playerIn);
    }
  }

  // Import info from a parsed HTML
  importFromSheet(playerInfo) {
    // Verify that the input object has all required fields
    validateInput(playerInfo);

    // Fill in properties of player
    this.parseName(playerInfo.name);
    this.avpa = parseInt(playerInfo['avpa#'], 10);
    this.email = playerInfo.email;
    this.org = playerInfo.org;
    this.ranking = parseFloat(playerInfo.ranking.replace(',', ''));
    this.membershipValid = playerInfo.membershipValid;
    this.staff = false;
    // Validate that player has all necessary fields
    validatePlayer(this);
  }

  // imports a player string from AVPAmerica into first and last name
  parseName(inputName) {
    // Remove location
    const fullName = inputName.split('(');
    const splitNames = fullName[0].trim().split(' ');
    // Pull out first and last
    this.firstName = splitNames[0].trim();
    this.lastName = splitNames.slice(1).join(' ');
  }

  // Export player info for saving
  export() {
    return JSON.stringify(this);
  }

  // Import player from a save
  import(player) {
    // Validate input object
    validateObject(player);
    // Loop through all fields in class and import as needed
    Object.keys(this).forEach((key) => {
      if (Object.prototype.hasOwnProperty.call(player, key)) {
        this[key] = player[key];
      }
    });
    // Check that numbers are numbers
    if (typeof this.avpa !== 'number') {
      this.avpa = parseInt(this.avpa, 10);
    }
    // Check that numbers are numbers
    if (typeof this.ranking !== 'number') {
      this.ranking = parseFloat(this.ranking, 10);
    }
    // Validate player
    validatePlayer(this);
  }
}
