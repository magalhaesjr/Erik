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
const testPlayer = {
  name,
  email,
  org,
  'avpa#': avpa,
  ranking,
  membershipValid,
};

test('Missing Inputs Throw', () => {
  const info = {};
  // empty input
  // eslint-disable-next-line prettier/prettier
  expect(()=>{new Player(info);}).toThrow(new Error("Player input is missing name"));
  info.name = name;
  // eslint-disable-next-line prettier/prettier
  expect(()=>{new Player(info);}).toThrow(new Error("Player input is missing email"));
  info.email = email;
  // eslint-disable-next-line prettier/prettier
  expect(()=>{new Player(info);}).toThrow(new Error("Player input is missing org"));
  info.org = org;
  // eslint-disable-next-line prettier/prettier
  expect(()=>{new Player(info);}).toThrow(new Error("Player input is missing avpa#"));
  info['avpa#'] = avpa;
  // eslint-disable-next-line prettier/prettier
  expect(()=>{new Player(info);}).toThrow(new Error("Player input is missing ranking"));
  info.ranking = ranking;
  // eslint-disable-next-line prettier/prettier
  expect(()=>{new Player(info);}).toThrow(new Error("Player input is missing membershipValid"));
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
  // eslint-disable-next-line prettier/prettier
  expect(()=>{new Player(info);}).toThrow(new Error("Player input name is undefined"));
  info.name = name;
  // eslint-disable-next-line prettier/prettier
  expect(()=>{new Player(info);}).toThrow(new Error("Player input email is undefined"));
  info.email = email;
  // eslint-disable-next-line prettier/prettier
  expect(()=>{new Player(info);}).toThrow(new Error("Player input org is undefined"));
  info.org = org;
  // eslint-disable-next-line prettier/prettier
  expect(()=>{new Player(info);}).toThrow(new Error("Player input avpa# is undefined"));
  info['avpa#'] = avpa;
  // eslint-disable-next-line prettier/prettier
  expect(()=>{new Player(info);}).toThrow(new Error("Player input ranking is undefined"));
  info.ranking = ranking;
  // eslint-disable-next-line prettier/prettier
  expect(()=>{new Player(info);}).toThrow(new Error("Player input membershipValid is undefined"));
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
  // eslint-disable-next-line prettier/prettier
  expect(()=>{new Player(info);}).toThrow(new Error("Avpa # is invalid"));
  info['avpa#'] = avpa;
  // eslint-disable-next-line prettier/prettier
  expect(()=>{new Player(info);}).toThrow(new Error("Ranking points are invalid"));
});

test('Valid Info Creates Player', () => {
  // eslint-disable-next-line prettier/prettier
  expect(()=>{new Player(testPlayer);}).not.toThrow(new Error);

  expect(testPlayer['avpa#']).toBe('100231');
  // eslint-disable-next-line prettier/prettier
  const newPlayer = new Player(testPlayer);
  expect(newPlayer.firstName).toBe('Jeff');
  expect(newPlayer.lastName).toBe('Magalhaes');
  expect(newPlayer.email).toBe('fake@gmail.com');
  expect(newPlayer.org).toBe('Newport Volleyball Club');
  expect(newPlayer.avpa).toBe(100231);
  expect(newPlayer.ranking).toBe(100.5);
  expect(newPlayer.membershipValid).toBe(false);
});

test('Name is Correctly Extracted', () => {
  // Name with an '
  testPlayer.name = "Kyle O'Neil (Fake land, usa)";
  let newPlayer = new Player(testPlayer);
  expect(newPlayer.firstName).toBe('Kyle');
  expect(newPlayer.lastName).toBe("O'Neil");
  // Name with an -
  testPlayer.name = 'Aaron Hall-Stinson(Fake land, usa)';
  newPlayer = new Player(testPlayer);
  expect(newPlayer.firstName).toBe('Aaron');
  expect(newPlayer.lastName).toBe('Hall-Stinson');
  // Name with a
  testPlayer.name = 'Mr Annoying Pants    (Fake land, usa)';
  newPlayer = new Player(testPlayer);
  expect(newPlayer.firstName).toBe('Mr');
  expect(newPlayer.lastName).toBe('Annoying Pants');
});
