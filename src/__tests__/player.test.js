/* eslint-disable no-new */
// Tests player class
import Player from '../domain/player';

// Individual player fields to import
const name = 'Jeff Magalhaes (fakeland, usa)';
const email = 'fake@gmail.com';
const org = 'Newport Volleyball Club';
const avpa = '100231';
const ranking = '100.5';
const membershipValid = false;
// Valid player info
const sheetInfo = {
  name,
  email,
  org,
  'avpa#': avpa,
  ranking,
  membershipValid,
};

test('Missing Inputs Throw', () => {
  const info = {};
  // Create a test player
  const testPlayer = new Player();
  // eslint-disable-next-line prettier/prettier
  expect(()=>{testPlayer.importFromSheet(info);}).toThrow(new Error("Player input is missing name"));
  info.name = name;
  // eslint-disable-next-line prettier/prettier
  expect(()=>{testPlayer.importFromSheet(info);}).toThrow(new Error("Player input is missing email"));
  info.email = email;
  // eslint-disable-next-line prettier/prettier
  expect(()=>{testPlayer.importFromSheet(info);}).toThrow(new Error("Player input is missing org"));
  info.org = org;
  // eslint-disable-next-line prettier/prettier
  expect(()=>{testPlayer.importFromSheet(info);}).toThrow(new Error("Player input is missing avpa#"));
  info['avpa#'] = avpa;
  // eslint-disable-next-line prettier/prettier
  expect(()=>{testPlayer.importFromSheet(info);}).toThrow(new Error("Player input is missing ranking"));
  info.ranking = ranking;
  // eslint-disable-next-line prettier/prettier
  expect(()=>{testPlayer.importFromSheet(info);}).toThrow(new Error("Player input is missing membershipValid"));
});

test('Invalid Inputs Throw', () => {
  const info = {
    name: undefined,
    email: undefined,
    org: undefined,
    'avpa#': undefined,
    ranking: null,
    membershipValid: null,
  };
  // Test player
  const testPlayer = new Player();
  // eslint-disable-next-line prettier/prettier
  expect(()=>{testPlayer.importFromSheet(info);}).toThrow(new Error("Player input name is undefined"));
  info.name = name;
  // eslint-disable-next-line prettier/prettier
  expect(()=>{testPlayer.importFromSheet(info);}).toThrow(new Error("Player input email is undefined"));
  info.email = email;
  // eslint-disable-next-line prettier/prettier
  expect(()=>{testPlayer.importFromSheet(info);}).toThrow(new Error("Player input org is undefined"));
  info.org = org;
  // eslint-disable-next-line prettier/prettier
  expect(()=>{testPlayer.importFromSheet(info);}).toThrow(new Error("Player input avpa# is undefined"));
  info['avpa#'] = avpa;
  // eslint-disable-next-line prettier/prettier
  expect(()=>{testPlayer.importFromSheet(info);}).toThrow(new Error("Player input ranking is undefined"));
  info.ranking = ranking;
  // eslint-disable-next-line prettier/prettier
  expect(()=>{testPlayer.importFromSheet(info);}).toThrow(new Error("Player input membershipValid is undefined"));
});

test('Invalid numbers throw', () => {
  const info = {
    name,
    email,
    org,
    'avpa#': 'fjal',
    ranking: 'edi2',
    membershipValid,
  };
  // test player
  const testPlayer = new Player();
  // eslint-disable-next-line prettier/prettier
  expect(()=>{testPlayer.importFromSheet(info)}).toThrow(new Error("Avpa # is invalid"));
  info['avpa#'] = avpa;
  // eslint-disable-next-line prettier/prettier
  expect(()=>{testPlayer.importFromSheet(info)}).toThrow(new Error("Ranking points are invalid"));
});

test('Valid Info Creates Player', () => {
  // eslint-disable-next-line prettier/prettier
  // test player
  const testPlayer = new Player();

  expect(sheetInfo['avpa#']).toBe('100231');
  // eslint-disable-next-line prettier/prettier
  expect(()=>{testPlayer.importFromSheet(sheetInfo)}).not.toThrow();
  expect(testPlayer.firstName).toBe('Jeff');
  expect(testPlayer.lastName).toBe('Magalhaes');
  expect(testPlayer.email).toBe('fake@gmail.com');
  expect(testPlayer.org).toBe('Newport Volleyball Club');
  expect(testPlayer.avpa).toBe(100231);
  expect(testPlayer.ranking).toBe(100.5);
  expect(testPlayer.membershipValid).toBe(false);
});

test('Name is Correctly Extracted', () => {
  // Test new player
  const testPlayer = new Player();
  // Name with an '
  sheetInfo.name = "Kyle O'Neil (Fake land, usa)";
  testPlayer.importFromSheet(sheetInfo);
  expect(testPlayer.firstName).toBe('Kyle');
  expect(testPlayer.lastName).toBe("O'Neil");
  // Name with an -
  sheetInfo.name = 'Aaron Hall-Stinson(Fake land, usa)';
  testPlayer.importFromSheet(sheetInfo);
  expect(testPlayer.firstName).toBe('Aaron');
  expect(testPlayer.lastName).toBe('Hall-Stinson');
  // Name with a
  sheetInfo.name = 'Mr Annoying Pants    (Fake land, usa)';
  testPlayer.importFromSheet(sheetInfo);
  expect(testPlayer.firstName).toBe('Mr');
  expect(testPlayer.lastName).toBe('Annoying Pants');
});

test('export saves all properties', () => {
  // create a player using parser
  const testPlayer = new Player();
  // Import info from sheet
  sheetInfo.name = 'Jeff Magalhaes';
  testPlayer.importFromSheet(sheetInfo);
  // New player status is set when added to a team, just set it here
  testPlayer.paid = false;
  // export player info (save into an object for testing
  const outObject = JSON.parse(testPlayer.export());
  // Compare exported properties to testPlayer properties
  Object.keys(testPlayer).forEach((key) => {
    expect(Object.prototype.hasOwnProperty.call(outObject, key)).toBeTruthy();
    expect(outObject[key]).toBe(testPlayer[key]);
  });
});

test('import initializes player', () => {
  // create a player
  // Improt info from sheet
  sheetInfo.name = 'Jeff Magalhaes';
  const testPlayer = new Player(sheetInfo);
  testPlayer.paid = false;
  // Export the player info
  const playerInfo = testPlayer.export();
  // New player
  const newPlayer = new Player(JSON.parse(playerInfo));
  // Verify they are the same
  expect(newPlayer).toStrictEqual(testPlayer);
  // Explcitly use the import function
  const otherPlayer = new Player();
  otherPlayer.import(JSON.parse(playerInfo));
  expect(otherPlayer).toStrictEqual(testPlayer);
});
