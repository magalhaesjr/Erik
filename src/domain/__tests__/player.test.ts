// Tests player class
import Player, { PlayerInfo } from '../player';

// Individual player fields to import
const name = 'Jeff Magalhaes (fakeland, usa)';
const email = 'fake@gmail.com';
const org = 'Newport Volleyball Club';
const avpa = '100231';
const ranking = '100.5';
const membershipValid = false;
// Valid player info
const sheetInfo: PlayerInfo = {
  name,
  email,
  org,
  'avpa#': avpa,
  ranking,
  membershipValid,
};

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
  // eslint-disable-next-line prettier/prettier
  expect(()=>{Player.importFromSheet(info)}).toThrow(new Error("Avpa # is invalid"));
  info['avpa#'] = avpa;
  // eslint-disable-next-line prettier/prettier
  expect(()=>{Player.importFromSheet(info)}).toThrow(new Error("Ranking points are invalid"));
});

test('Valid Info Creates Player', () => {
  // eslint-disable-next-line prettier/prettier
  // test player

  expect(sheetInfo['avpa#']).toBe('100231');
  // eslint-disable-next-line prettier/prettier
  expect(()=>{Player.importFromSheet(sheetInfo)}).not.toThrow();
  const testPlayer = new Player(sheetInfo);
  expect(testPlayer.props.firstName).toBe('Jeff');
  expect(testPlayer.props.lastName).toBe('Magalhaes');
  expect(testPlayer.props.email).toBe('fake@gmail.com');
  expect(testPlayer.props.org).toBe('Newport Volleyball Club');
  expect(testPlayer.props.avpa).toBe(100231);
  expect(testPlayer.props.ranking).toBe(100.5);
  expect(testPlayer.props.membershipValid).toBe(false);
});

test('Name is Correctly Extracted', () => {
  // Name with an '
  sheetInfo.name = "Kyle O'Neil (Fake land, usa)";
  // Test new player
  const testPlayer = new Player(sheetInfo);
  expect(testPlayer.props.firstName).toBe('Kyle');
  expect(testPlayer.props.lastName).toBe("O'Neil");
  // Name with an -
  sheetInfo.name = 'Aaron Hall-Stinson(Fake land, usa)';
  testPlayer.props = Player.importFromSheet(sheetInfo);
  expect(testPlayer.props.firstName).toBe('Aaron');
  expect(testPlayer.props.lastName).toBe('Hall-Stinson');
  // Name with a
  sheetInfo.name = 'Mr Annoying Pants    (Fake land, usa)';
  testPlayer.props = Player.importFromSheet(sheetInfo);
  expect(testPlayer.props.firstName).toBe('Mr');
  expect(testPlayer.props.lastName).toBe('Annoying Pants');
});

test('export saves all properties', () => {
  // Import info from sheet
  sheetInfo.name = 'Jeff Magalhaes';
  const testPlayer = new Player(sheetInfo);
  // New player status is set when added to a team, just set it here
  testPlayer.props.paid = false;
  // export player info (save into an object for testing
  const outObject = JSON.parse(testPlayer.export());
  // Compare exported properties to testPlayer properties
  expect(outObject.props).toStrictEqual(testPlayer.props);
});

test('import initializes player', () => {
  // create a player
  // Improt info from sheet
  sheetInfo.name = 'Jeff Magalhaes';
  const testPlayer = new Player(sheetInfo);
  testPlayer.props.paid = false;
  // Export the player info
  const playerInfo = testPlayer.export();
  // New player
  const newPlayer = new Player(JSON.parse(playerInfo));
  // Verify they are the same
  expect(newPlayer).toStrictEqual(testPlayer);
});
