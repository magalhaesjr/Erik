// Functions for the avp america website
import Player from './player';
import Team from './team';
import { Division } from './division';
import Tournament from './tournament';

// Find columns indices for each category
function findCategoryCols(header) {
  // Initialize columns
  const columns = {};
  // Absolute header index
  let startIndex = 0;
  // Header map
  header.forEach((h) => {
    // Find how many columns this header spans
    const thisHeader = Array(h.colSpan)
      .fill()
      .map((_, i) => {
        return i + startIndex;
      });
    // Find next column index
    startIndex += thisHeader.length;

    // Assign to the right key
    columns[h.textContent] = thisHeader;
  });

  return columns;
}

// Find the inidividual data columns within a category
function findDataCols(header, columns) {
  // Initialize the header map
  const headerMap = {};
  // Find the headers for each category
  Object.keys(columns).forEach((key) => {
    // Initialize a new object in header map for this category
    headerMap[key] = {};
    // Cycle through each column in the category to find the data headers
    columns[key].forEach((index) => {
      // Extract the name of the header and save to the category
      const cellName = header[index].textContent;
      headerMap[key][cellName] = index;
    });
  });
  return headerMap;
}

// Extracts all team info from the table
function extractTeam(data, headerMap, division) {
  // Initialize a team
  let team = {};
  // Cycle through each entry category
  Object.keys(headerMap).forEach((type) => {
    // Cycle through each data column
    const category = {};
    Object.keys(headerMap[type]).forEach((field) => {
      // import data into the team
      category[field.toLowerCase()] = data[headerMap[type][field]].textContent;
      // Check for valid membership
      if (field.toLowerCase() === 'name') {
        // Valid membership is determined by color of name
        const membership = data[headerMap[type][field]].querySelector('font');
        if (membership === null) {
          // Not a valid player
          category.valid = false;
          return;
        }
        category.valid = true;
        // Get validity of membership
        category.membershipValid = membership.color === 'green';
      }
    });

    if (type === 'Entry') {
      category.division = division;
      team = new Team(category);
    } else if (type.includes('Player') && category.valid) {
      team.addPlayer(new Player(category));
    }
  });

  // Check of team is valid. If not, it won't have any players
  if (team.players.length < 2) {
    return null;
  }
  return team;
}

// Pulls all entries for a division from the input sheet
function extractDivision(table, name) {
  // Headers for tables
  let columns = {};
  const division = new Division(name);
  // Initialize a header Map
  let headerMap = {};

  // Cycle through each row and decode the table
  Array.from(table.rows).forEach((row) => {
    // Find if there are headers in this row
    const headers = row.querySelectorAll('th');
    // Decode table
    if (headers.length > 0 && Object.keys(columns).length === 0) {
      columns = findCategoryCols(headers);
    } else if (headers.length > 0) {
      headerMap = findDataCols(headers, columns);
    } else {
      // Get all data columns for this team
      const data = row.querySelectorAll('td');
      // Add team to entries
      const newTeam = extractTeam(data, headerMap, name);
      if (newTeam instanceof Team) {
        division.addTeam(newTeam);
      }
    }
  });
  return division;
}

// Extracts all teams for the tournament
export default function extractEntries(dom) {
  // Cycle through the dom objects to build an output JSON object with all tournament entries

  // Entries
  // Create a new tournament
  const tourny = new Tournament();
  let divisionName = null;
  let division = {};

  // Cycle through nodes until you find a division node
  dom.body.querySelectorAll('*').forEach((node) => {
    // If this is a division class, then set the current division
    if (node.className === 'LargeRedTitle' && divisionName === null) {
      divisionName = node.textContent;
    } else if (node.className === 'LargeRedTitle') {
      // Add division to tournament
      if (division instanceof Division) {
        tourny.addDivision(division);
      }
      divisionName = node.textContent;
      // reset division
      division = {};
    } else if (node.nodeName === 'TABLE') {
      division = extractDivision(node, divisionName);
    }
  });
  // Return tournament
  return tourny;
}
