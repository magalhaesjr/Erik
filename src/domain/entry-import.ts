/**
 * Reads entries from AvpAmerica and creates tournamnet entries
 */
import { TeamEntry, TournamentEntryIO } from '../renderer/redux/entries';
import { createPlayer, parseName } from './player';
import { extractTime } from './team';
import { isEmpty } from './validate';

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
const findCategoryCols = (
  header: NodeListOf<HTMLTableCellElement>
): CategoryColumns => {
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
};

// Find the individual data columns within a category
const findDataCols = (
  header: NodeListOf<HTMLTableCellElement>,
  columns: CategoryColumns
) => {
  // Initialize the header map
  const headerMap: HeaderMap = {};
  // Find the headers for each category
  Object.entries(columns).forEach(([key, col]) => {
    // Initialize a new object in header map for this category
    headerMap[key] = {};
    // Cycle through each column in the category to find the data headers
    col.forEach((index) => {
      // Extract the name of the header and save to the category
      const cellName = header[index].textContent;
      if (cellName) {
        headerMap[key][cellName] = index;
      }
    });
  });
  return headerMap;
};

// Extracts all team info from the table
const extractEntry = (
  data: NodeListOf<HTMLTableCellElement>,
  headerMap: HeaderMap,
  division: string
): TeamEntry | null => {
  // Entry
  const entry: TeamEntry = {
    ranking: 0,
    division,
    players: [],
    registrationTime: 0,
    isWaitlisted: false,
    paid: false,
  };

  // Cycle through each entry category
  Object.entries(headerMap).forEach(([type, header]) => {
    // Extract depending on type
    if (type === 'Entry' || type === 'Wait List') {
      // Set waitlist
      entry.isWaitlisted = type === 'Wait List';

      // Extract other info
      Object.entries(header).forEach(([field, dataIndex]) => {
        // Data
        const fieldData = data[dataIndex].textContent;
        if (fieldData) {
          // Depends on field
          switch (field.toLowerCase()) {
            case 'ranking':
              entry.ranking = parseFloat(fieldData.replace(',', ''));
              break;
            case 'sign-up':
              entry.registrationTime = extractTime(fieldData);
              break;
            case 'paid':
              entry.paid = fieldData.includes('Y');
              break;
            default:
              break;
          }
        }
      });
    } else if (type.includes('Player')) {
      // Initialize a blank player
      const player = createPlayer('first', 'last', 0);

      Object.entries(header).forEach(([field, dataIndex]) => {
        const dataCell = data[dataIndex];
        const fieldData = dataCell.textContent;
        if (fieldData) {
          // Depends on field
          switch (field.toLowerCase()) {
            case 'name': {
              player.name = parseName(fieldData);

              const fontCell = dataCell.querySelector('font');
              player.membershipValid =
                fontCell !== null && fontCell.color === 'green';
              break;
            }
            case 'avpa#':
              player.avpMembership = parseInt(fieldData, 10);
              break;
            case 'ranking':
              player.ranking = parseFloat(fieldData.replace(',', ''));
              break;
            default:
              break;
          }
        }
      });
      // Add to team
      entry.players.push(player);
    }
  });

  // Check of team is valid. If not, it won't have any players
  if (entry.players.length < 2) {
    return null;
  }
  return entry;
};

// Pulls all entries for a division from the input sheet
const extractDivision = (
  table: HTMLTableElement,
  division: string
): TeamEntry[] => {
  // Headers for tables
  let columns: CategoryColumns = {};

  // Initialize a header Map
  let headerMap: HeaderMap;

  // Initialize team entries
  const entries: TeamEntry[] = [];

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
      const newEntry = extractEntry(data, headerMap, division);
      if (newEntry) {
        entries.push(newEntry);
      }
    }
  });
  return entries;
};

// Extracts all teams for the tournament
export default function extractEntries(dom: Document) {
  // Cycle through the dom objects to build an output JSON object with all tournament entries

  // Create a new tournament of entries
  const tourney: TournamentEntryIO = {};
  let divisionName: string | null = null;

  // Cycle through nodes until you find a division node
  dom.body.querySelectorAll('*').forEach((node) => {
    // If this is a division class, then set the current division
    if (node.className === 'LargeRedTitle') {
      const fullDiv = node.textContent?.split(' ') as string[];
      divisionName = fullDiv[0].concat(' ', fullDiv.at(-1) as string);
    } else if (node.nodeName === 'TABLE' && divisionName) {
      tourney[divisionName] = extractDivision(
        node as HTMLTableElement,
        divisionName
      );
    }
  });

  // Return tournament
  return tourney;
}
