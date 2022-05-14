// Functions for the avp america website
import Player from './player';

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
function extractTeam(data, headerMap) {
  // Initialize a team
  const team = {};
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
        category.membershipValid =
          data[headerMap[type][field]].querySelector('font').color === 'green';
      }
    });

    if (type.includes('Player')) {
      team[type] = new Player(category);
    } else {
      team[type] = category;
    }
  });
  return team;
}

// Pulls all entries for a division from the input sheet
function extractDivision(table) {
  // Headers for tables
  let columns = {};
  const entries = [];
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
      entries.push(extractTeam(data, headerMap));
    }
  });
  return entries;
}

// Extracts all teams for the tournament
export default function extractEntries(dom) {
  // Cycle through the dom objects to build an output JSON object with all tournament entries

  // Entries
  const entries = {};
  let division = null;
  let divisionEntries = {};

  // Cycle through nodes until you find a division node
  dom.body.querySelectorAll('*').forEach((node) => {
    // If this is a division class, then set the current division
    if (node.className === 'LargeRedTitle' && division === null) {
      division = node.textContent;
    } else if (node.className === 'LargeRedTitle') {
      // Save previous object
      entries[division] = divisionEntries;
      division = node.textContent;
      divisionEntries = {};
    } else if (node.nodeName === 'TABLE') {
      divisionEntries = extractDivision(node);
    }
  });
  console.log(entries);
}
