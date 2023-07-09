// Implements the Team class for organizing tournaments
import omit from 'lodash/omit';
import Player from './player';

// Extract the signup date string and convert it to posixtime (unix time)
export const extractTime = (regString: string): number => {
  // Grab the date portion
  const regex = /\(([^)]+)\)/g;
  const regDate = new Date(regString.split(regex)[1]);

  // Convert to posix time
  return regDate.getTime() / 1000;
};

export type TeamSheetPropTypes = {
  seed?: string;
  division: string;
  paid: string;
  'wait list'?: string;
  'sign-up': string;
};

export type TeamSheet = {
  [P in keyof TeamSheetPropTypes]: TeamSheetPropTypes[P];
};

export type TeamSheetKey = keyof TeamSheet;

type TeamPropsTypes = {
  seed: number | null;
  paid: boolean;
  isWaitListed: boolean;
  registrationTime: null | number;
  players: Player[];
  ranking: number;
  court: number;
  division: string;
};

export type TeamProps = { [P in keyof TeamPropsTypes]: TeamPropsTypes[P] };

// Type guard
function isTeamSheet(obj: TeamSheet | Team): obj is TeamSheet {
  return (obj as TeamSheet)['sign-up'] !== undefined;
}

// Team class for tournament entries
export default class Team {
  props: TeamProps;

  constructor(teamInput?: TeamSheet | Team) {
    // Build object
    this.props = {
      seed: null,
      paid: false,
      isWaitListed: false,
      registrationTime: null,
      players: [],
      ranking: 0.0,
      court: 0,
      division: '',
    };

    // if extra inputs, import
    if (teamInput && isTeamSheet(teamInput)) {
      this.importFromSheet(teamInput);
    } else if (teamInput) {
      this.import(teamInput);
    }
  }

  // import parsed HTML table
  importFromSheet(teamInput: TeamSheet) {
    // Fill in remaining data
    this.props.paid = teamInput.paid.includes('Y');
    this.props.isWaitListed = teamInput['wait list'] !== undefined;
    this.props.registrationTime = extractTime(teamInput['sign-up']);
    this.props.division = teamInput.division;
  }

  // Add a new player to the team
  addPlayer(player: Player) {
    // Update paid status
    if (!player.props.paid) {
      player.props.paid = this.props.paid;
    }
    // Add new player
    this.props.players.push(player);
    // Update ranking points
    this.updateRanking();
  }

  updateRanking() {
    // calculates the total ranking of the team, using all the individual player ranking points
    this.props.ranking = 0.0;
    this.props.players.forEach((player) => {
      this.props.ranking += player.props.ranking;
    });
  }

  // Export
  export() {
    return JSON.stringify(this);
  }

  // Import
  import(input: Team) {
    // Import generic properties first
    Object.assign(this.props, omit(input.props, ['players']));

    // Import players
    input.props.players.forEach((p) => this.addPlayer(new Player(p)));

    // Ensure ranking is up to date
    this.updateRanking();
  }
}
