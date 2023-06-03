/* eslint-disable no-new */
// Import player for dependency
import Player from '../player';
// Tests player class
import Team from '../team';
import type { TeamSheet } from '../team';

// Individual team fields to import
const SEED = '1';
const WAITLIST = '2';
const SIGNUP = 'eb (8/13/2019 8:24:00 AM)';
const DIVISION = "Men's Open";
const PAID = 'Y(-1)';
// Valid Team
const testTeam: TeamSheet = {
  seed: SEED,
  'sign-up': SIGNUP,
  paid: PAID,
  division: DIVISION,
};

// utiltiy to create player
const newPlayer = (ranking: number) => {
  return new Player({
    name: 'test player',
    email: '',
    org: '',
    'avpa#': '1',
    ranking: `${ranking}`,
    membershipValid: false,
  });
};

test('Valid Info Creates Team', () => {
  // eslint-disable-next-line prettier/prettier
  expect(()=>{new Team(testTeam);}).not.toThrow(new Error);

  // eslint-disable-next-line prettier/prettier
  let newTeam = new Team(testTeam);
  expect(newTeam.props.division).toBe("Men's Open");
  expect(newTeam.props.paid).toBeTruthy();

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
  expect(newTeam.props.paid).toBeFalsy();
  testTeam.paid = 'Y';
  newTeam = new Team(testTeam);
  expect(newTeam.props.paid).toBeTruthy();
});

test('Update Ranking Works', () => {
  // new team
  const newTeam = new Team(testTeam);
  // eslint-disable-next-line prettier/prettier
  expect(()=>{newTeam.updateRanking();}).not.toThrow(new Error);
  expect(newTeam.props.ranking).toBe(0.0);
  // set new players into ranking
  newTeam.props.players.push(newPlayer(34.9));
  newTeam.props.players.push(newPlayer(123.2));
  // eslint-disable-next-line prettier/prettier
  expect(()=>{newTeam.updateRanking();}).not.toThrow(new Error);
  expect(newTeam.props.ranking).toBe(158.1);
});

test('addPlayer Adds Player to Team', () => {
  // Create new mock player
  const testPlayer = newPlayer(100.2);
  // Create team
  const newTeam = new Team(testTeam);
  // Add player
  newTeam.addPlayer(testPlayer);
  expect(newTeam.props.players.length).toBe(1);
  expect(newTeam.props.ranking).toBe(testPlayer.props.ranking);
  // Modify ranking and add another one
  const partner = newPlayer(53.1);
  newTeam.addPlayer(partner);
  expect(newTeam.props.players.length).toBe(2);
  expect(newTeam.props.ranking).toBe(153.3);
});

test('import restores team object', () => {
  // New team
  const newTeam = new Team(testTeam);
  // Create new players
  const players = [newPlayer(100.0), newPlayer(50.0)];
  // add players to team
  players.forEach((p) => {
    newTeam.addPlayer(p);
  });
  // Export team using stringify
  const exported = JSON.stringify(newTeam);
  // Create a new team via import
  const importedTeam = new Team(JSON.parse(exported));
  // Verify they are the same
  expect(importedTeam).toStrictEqual(newTeam);
});
