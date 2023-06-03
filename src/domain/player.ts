import omit from 'lodash/omit';

// Player Info object (parsed from Avp America)
export type PlayerInfoProps = {
  name: string;
  email: string;
  org: string;
  'avpa#': string;
  ranking: string;
  membershipValid: boolean;
};

export type PlayerInfo = { [P in keyof PlayerInfoProps]: PlayerInfoProps[P] };
export type PlayerInfoKey = keyof PlayerInfoProps;

// Player name
type PlayerName = {
  firstName: string;
  lastName: string;
};

// Player properties
interface PlayerPropTypes {
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

export type PlayerProps = { [P in keyof PlayerPropTypes]: PlayerPropTypes[P] };

// Type guard
function isPlayerInfo(obj: PlayerInfo | Player): obj is PlayerInfo {
  return (obj as PlayerInfo).name !== undefined;
}

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
class Player {
  // Class properties
  props: PlayerProps;

  constructor(playerIn?: Player | PlayerInfo) {
    // Defaults
    this.props = {
      firstName: 'first',
      lastName: 'last',
      avpa: NaN,
      email: 'not-real',
      org: '',
      ranking: 0.0,
      membershipValid: false,
      paid: false,
      staff: false,
    };

    // If more data was input
    if (playerIn && isPlayerInfo(playerIn)) {
      // Import from a parsed avpamerica html table
      this.props = Player.importFromSheet(playerIn);
    } else if (playerIn) {
      // Import from exported object
      this.import(playerIn);
    }
  }

  // Import info from a parsed HTML
  static importFromSheet(playerInfo: PlayerInfo): PlayerProps {
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
    return JSON.stringify(this);
  }

  // Import player from a save
  import(player: Player) {
    // Validate input object
    // Import generic properties first
    Object.assign(this.props, omit(player.props, ['avpa', 'ranking']));

    // handle possibly not a number inputs
    this.props.avpa = player.props.avpa;
    this.props.ranking = player.props.ranking;
  }
}

export default Player;
