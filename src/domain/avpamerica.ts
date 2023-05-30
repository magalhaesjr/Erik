// Functions for the avp america website
import Player, { PlayerInfo, PlayerInfoKey } from './player';
import Team, { TeamSheet, TeamSheetKey } from './team';
import Division from './division';
import Tournament from './tournament';
import { hasProp, isEmpty } from './validate';

type CategoryColumns = {
  [key: string]: number[];
};

type CategoryIndex = {
  [key: string]: number;
};

type HeaderMap = {
  [key: string]: CategoryIndex;
};

// Find columns indices for each category
function findCategoryCols(
  header: NodeListOf<HTMLTableCellElement>
): CategoryColumns {
  // Initialize columns
  const columns: CategoryColumns = {};

  // Absolute header index
  let startIndex = 0;
  // Header map
  header.forEach((h) => {
    // Find how many columns this header spans
    const thisHeader = Array(h.colSpan)
      .fill(1)
      .map((_, i) => {
        return i + startIndex;
      });
    // Find next column index
    startIndex += thisHeader.length;

    // Assign to the right key
    if (h.textContent) {
      columns[h.textContent] = thisHeader;
    }
  });

  return columns;
}

// Find the inidividual data columns within a category
function findDataCols(
  header: NodeListOf<HTMLTableCellElement>,
  columns: CategoryColumns
) {
  // Initialize the header map
  const headerMap: HeaderMap = {};
  // Find the headers for each category
  Object.keys(columns).forEach((key) => {
    // Initialize a new object in header map for this category
    headerMap[key] = {};
    // Cycle through each column in the category to find the data headers
    columns[key].forEach((index) => {
      // Extract the name of the header and save to the category
      const cellName = header[index].textContent;
      if (cellName) {
        headerMap[key][cellName] = index;
      }
    });
  });
  return headerMap;
}

// Extracts all team info from the table
function extractTeam(
  data: NodeListOf<HTMLTableCellElement>,
  headerMap: HeaderMap,
  division: string
): Team | null {
  // Initialize a team
  let team: Team = new Team();
  // Cycle through each entry category
  Object.keys(headerMap).forEach((type) => {
    // Cycle through each data column
    const teamInfo: TeamSheet = {
      seed: undefined,
      division,
      paid: 'N',
      'sign-up': '',
      'wait list': undefined,
    };
    const playerInfo: PlayerInfo = {
      name: 't',
      email: 't',
      org: 't',
      'avpa#': 't',
      ranking: 't',
      membershipValid: false,
    };
    let validPlayer = false;

    Object.keys(headerMap[type]).forEach((field) => {
      // Info from map
      const keyName = field.toLowerCase();
      // Data
      const valueData = data[headerMap[type][field]];

      if (valueData.textContent) {
        if (hasProp(teamInfo, keyName)) {
          teamInfo[keyName as TeamSheetKey] = valueData.textContent;
        }

        if (hasProp(playerInfo, keyName)) {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          playerInfo[keyName as PlayerInfoKey] = valueData.textContent;
        }

        // Check for valid membership
        if (field.toLowerCase() === 'name') {
          // Valid membership is determined by color of name
          const membership = valueData.querySelector('font');
          if (membership === null) {
            // Not a valid player
            validPlayer = false;
            return;
          }
          validPlayer = true;
          // Get validity of membership
          playerInfo.membershipValid = membership.color === 'green';
        }
      }
    });

    if (type === 'Entry') {
      team = new Team(teamInfo);
    } else if (type.includes('Player') && validPlayer) {
      team.addPlayer(new Player(playerInfo));
    }
  });

  // Check of team is valid. If not, it won't have any players
  if (team.props.players.length < 2) {
    return null;
  }
  return team;
}

// Pulls all entries for a division from the input sheet
function extractDivision(table: HTMLTableElement, name: string): Division {
  // Headers for tables
  let columns: CategoryColumns = {};
  const division = new Division(name);
  // Initialize a header Map
  let headerMap: HeaderMap;

  // Cycle through each row and decode the table
  Array.from(table.rows).forEach((row) => {
    // Find if there are headers in this row
    const headers = row.querySelectorAll('th');
    // Decode table
    if (headers.length > 0 && isEmpty(columns)) {
      columns = findCategoryCols(headers);
    } else if (headers.length > 0) {
      headerMap = findDataCols(headers, columns);
    } else {
      // Get all data columns for this team
      const data = row.querySelectorAll('td');
      // Add team to entries
      const newTeam = extractTeam(data, headerMap, name);
      if (newTeam) {
        division.addTeam(newTeam);
      }
    }
  });
  return division;
}

// Extracts all teams for the tournament
export default function extractEntries(dom: Document) {
  // Cycle through the dom objects to build an output JSON object with all tournament entries

  // Entries
  // Create a new tournament
  const tourny = new Tournament();
  let divisionName: string | null = null;
  let division: null | Division = null;

  // Cycle through nodes until you find a division node
  dom.body.querySelectorAll('*').forEach((node) => {
    // If this is a division class, then set the current division
    if (node.className === 'LargeRedTitle' && divisionName === null) {
      divisionName = node.textContent;
    } else if (node.className === 'LargeRedTitle') {
      // Add division to tournament
      if (division) {
        tourny.addDivision(division);
      }
      divisionName = node.textContent;
      // reset division
      division = null;
    } else if (node.nodeName === 'TABLE' && divisionName) {
      division = extractDivision(node as HTMLTableElement, divisionName);
    }
  });

  // Check to add the last division
  if (division) {
    tourny.addDivision(division);
  }

  // Return tournament
  return tourny;
}
