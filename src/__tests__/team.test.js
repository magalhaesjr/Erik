/* eslint-disable no-new */
// Import player for dependency
import Player from '../domain/player';
// Tests player class
import Team from '../domain/team';
// Mock Player
jest.mock('../domain/player.js');

// Individual team fields to import
const SEED = '1';
const WAITLIST = '2';
const SIGNUP = 'eb (8/13/2019 8:24:00 AM)';
const DIVISION = "Men's Open";
const PAID = 'Y(-1)';
// Valid Team
const testTeam = {
  seed: SEED,
  'sign-up': SIGNUP,
  paid: PAID,
  division: DIVISION,
};

test('Missing Inputs Throw', () => {
  const info = {};
  // empty input
  // eslint-disable-next-line prettier/prettier
  expect(()=>{new Team(info);}).toThrow(new Error("Team input is missing seed or waitlist"));
  info.seed = SEED;
  // eslint-disable-next-line prettier/prettier
  expect(()=>{new Team(info);}).toThrow(new Error("Team input is missing sign-up"));
  info['sign-up'] = SIGNUP;
  // eslint-disable-next-line prettier/prettier
  expect(()=>{new Team(info);}).toThrow(new Error("Team input is missing paid"));
  info.paid = PAID;
  // eslint-disable-next-line prettier/prettier
  expect(()=>{new Team(info);}).toThrow(new Error("Team input is missing division"));
});

test('Invalid Inputs Throw', () => {
  const info = {
    seed: SEED,
    'sign-up': undefined,
    paid: undefined,
    division: undefined,
  };
  // eslint-disable-next-line prettier/prettier
  expect(()=>{new Team(info);}).toThrow(new Error("Team input sign-up is undefined"));
  info['sign-up'] = SIGNUP;
  // eslint-disable-next-line prettier/prettier
  expect(()=>{new Team(info);}).toThrow(new Error("Team input paid is undefined"));
  info.paid = PAID;
  // eslint-disable-next-line prettier/prettier
  expect(()=>{new Team(info);}).toThrow(new Error("Team input division is undefined"));
});

test('Valid Info Creates Team', () => {
  // eslint-disable-next-line prettier/prettier
  expect(()=>{new Team(testTeam);}).not.toThrow(new Error);

  // eslint-disable-next-line prettier/prettier
  let newTeam = new Team(testTeam);
  expect(newTeam.division).toBe("Men's Open");
  expect(newTeam.paid).toBeTruthy();

  // Remove seed
  delete testTeam.seed;
  // eslint-disable-next-line prettier/prettier
  expect(()=>{new Team(testTeam);}).toThrow(new Error("Team input is missing seed or waitlist"));
  // Add waitlist
  testTeam['wait list'] = WAITLIST;
  newTeam = new Team(testTeam);
  // eslint-disable-next-line prettier/prettier
  expect(()=>{new Team(testTeam);}).not.toThrow(new Error);
});

test('Paid Field Set Correctly', () => {
  // Set paid field
  testTeam.paid = 'N';
  let newTeam = new Team(testTeam);
  expect(newTeam.paid).toBeFalsy();
  testTeam.paid = 'Y';
  newTeam = new Team(testTeam);
  expect(newTeam.paid).toBeTruthy();
});

test('Update Ranking Works', () => {
  // new team
  const newTeam = new Team(testTeam);
  // eslint-disable-next-line prettier/prettier
  expect(()=>{newTeam.updateRanking();}).not.toThrow(new Error);
  expect(newTeam.ranking).toBe(0.0);
  // set new players into ranking
  newTeam.players.push({ ranking: 34.9 });
  newTeam.players.push({ ranking: 123.2 });
  // eslint-disable-next-line prettier/prettier
  expect(()=>{newTeam.updateRanking();}).not.toThrow(new Error);
  expect(newTeam.ranking).toBe(158.1);
});

test('addPlayer With Invalid Class Throws', () => {
  // new team
  const newTeam = new Team(testTeam);
  // Try and add an invalid player object
  // eslint-disable-next-line prettier/prettier
  expect(()=>{newTeam.addPlayer(1);}).toThrow(new Error('Input object is not a Player class'));
  // eslint-disable-next-line prettier/prettier
  expect(()=>{newTeam.addPlayer({ranking: 1.0});}).toThrow(new Error('Input object is not a Player class'));
  // eslint-disable-next-line prettier/prettier
  expect(()=>{newTeam.addPlayer('badClass');}).toThrow(new Error('Input object is not a Player class'));
});

test('addPlayer Adds Player to Team', () => {
  // Create new mock player
  const testPlayer = new Player();
  // Add field to mock
  testPlayer.ranking = 100.2;
  // Create team
  const newTeam = new Team(testTeam);
  // Add player
  newTeam.addPlayer(testPlayer);
  expect(newTeam.players.length).toBe(1);
  expect(newTeam.ranking).toBe(testPlayer.ranking);
  // Modify ranking and add another one
  const partner = new Player();
  partner.ranking = 53.1;
  newTeam.addPlayer(partner);
  expect(newTeam.players.length).toBe(2);
  expect(newTeam.ranking).toBe(153.3);
});
