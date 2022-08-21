/* eslint-disable @typescript-eslint/lines-between-class-members */
// Defines the player class for individual players in the tournament
/* import { hasProp, isObject, validateObject } from './validate';

// Fields required for player construction
const PLAYER_FIELDS = [
  'name',
  'email',
  'org',
  'avpa#',
  'ranking',
  'membershipValid',
];
*/

// Player Info object (parsed from Avp America)
export type PlayerInfo = {
  name: string;
  email: string;
  org: string;
  'avpa#': string;
  ranking: string;
  membershipValid: boolean;
};

// Player name
type PlayerName = {
  firstName: string;
  lastName: string;
};

// Player properties
export interface PlayerProps {
  [key: string]: string | number | boolean | undefined;
  // Class properties
  firstName: string;
  lastName: string;
  avpa: number;
  email: string;
  org: string;
  ranking: number;
  membershipValid: boolean;
  paid?: boolean;
  staff: boolean;
}

// Type guard
function isPlayerInfo(obj: PlayerInfo | PlayerProps): obj is PlayerInfo {
  return (obj as PlayerInfo).name !== undefined;
}

// Validates that all required inputs are available
/* function validateInput(info: PlayerInfo) {
  // Validate it's an object
  validateObject(info);
  PLAYER_FIELDS.forEach((key) => {
    if (!hasProp(info, key)) {
      throw new Error(`Player input is missing ${key}`);
    } else if (info[key] === undefined || info[key] === null) {
      throw new Error(`Player input ${key} is undefined`);
    }
  });
}
*/

// Validates required fields are filled in
function validatePlayer(player: PlayerProps) {
  if (Number.isNaN(player.avpa)) {
    throw new Error('Avpa # is invalid');
  } else if (Number.isNaN(player.ranking)) {
    throw new Error('Ranking points are invalid');
  }
}

// Parse / split a name
export function parseName(inputName: string): PlayerName {
  // Remove location
  const fullName = inputName.split('(');
  const splitNames = fullName[0].trim().split(' ');

  // Pull out first and last
  const out: PlayerName = {
    firstName: splitNames[0].trim(),
    lastName: splitNames.slice(1).join(' '),
  };

  return out;
}

// Join a name
export function joinName(firstName: string, lastName: string): string {
  return firstName.concat(' ', lastName);
}

// Class representing a player in the tournament
export class Player {
  // Class properties
  props: PlayerProps;

  constructor(playerIn: PlayerProps | PlayerInfo) {
    // If more data was input
    if (isPlayerInfo(playerIn)) {
      // Import from a parsed avpamerica html table
      this.props = Player.importFromSheet(playerIn);
    } else {
      // Import from exported object
      this.props = playerIn;
    }
  }

  // Import info from a parsed HTML
  static importFromSheet(playerInfo: PlayerInfo): PlayerProps {
    // Verify that the input object has all required fields
    // validateInput(playerInfo);

    // Fill in properties of player
    const name = parseName(playerInfo.name);
    const newProps: PlayerProps = {
      firstName: name.firstName,
      lastName: name.lastName,
      avpa: parseInt(playerInfo['avpa#'], 10),
      email: playerInfo.email,
      org: playerInfo.org,
      ranking: parseFloat(playerInfo.ranking.replace(',', '')),
      membershipValid: playerInfo.membershipValid,
      staff: false,
    };
    // Validate that player has all necessary fields
    validatePlayer(newProps);

    return newProps;
  }

  // imports a player string from AVPAmerica into first and last name
  // Export player info for saving
  export() {
    return JSON.stringify(this.props);
  }

  /*
  // Import player from a save
  import(player: PlayerProps) {
    // Validate input object
    // Loop through all fields in class and import as needed
    Object.keys(player).forEach((key: string) => {
      this[key] = player[key];
    });
    // Check that numbers are numbers
    if (typeof this.avpa !== 'number') {
      this.avpa = parseInt(this.avpa, 10);
    }
    // Check that numbers are numbers
    if (typeof this.ranking !== 'number') {
      this.ranking = parseFloat(this.ranking);
    }
    // Validate player
    validatePlayer(this);
  } */
}
