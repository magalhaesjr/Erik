// Defines the player class for individual players in the tournament

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
  constructor(playerInfo) {
    // Verify that the input object has all required fields
    validateInput(playerInfo);

    // Fill in properties of player
    this.importName(playerInfo.name);
    this.avpa = parseInt(playerInfo['avpa#'], 10);
    this.email = playerInfo.email;
    this.org = playerInfo.org;
    this.ranking = parseFloat(playerInfo.ranking);
    this.membershipValid = playerInfo.membershipValid;
    this.staff = false;
    // Validate that player has all necessary fields
    validatePlayer(this);
  }

  // imports a player string from AVPAmerica into first and last name
  importName(inputName) {
    // Remove location
    const fullName = inputName.split('(');
    const splitNames = fullName[0].trim().split(' ');
    // Pull out first and last
    this.firstName = splitNames[0].trim();
    this.lastName = splitNames.slice(1).join(' ');
  }
}
