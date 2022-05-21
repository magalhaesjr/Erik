/* eslint-disable no-new */
// Team dependency
import Team from '../domain/team';
// Tested: Division
import { Division, validateDivision } from '../domain/division';
// Mock Team
jest.mock('../domain/team.js');

// Create 5 test teams
function generateTeams(numTeams) {
  const testTeams = [];
  for (let i = 0; i < numTeams; i += 1) {
    const newTeam = new Team();
    // Add ranking points
    newTeam.ranking = i * 10;
    testTeams.push(newTeam);
  }
  return testTeams;
}

test('Invalid Inputs Throw', () => {
  // eslint-disable-next-line prettier/prettier
  expect(()=>{validateDivision(undefined);}).toThrow(new Error("Division name must be a string"));
  // eslint-disable-next-line prettier/prettier
  expect(()=>{validateDivision(1);}).toThrow(new Error("Division name must be a string"));
  // eslint-disable-next-line prettier/prettier
  expect(()=>{validateDivision({name: 'test'});}).toThrow(new Error("Division name must be a string"));
  // eslint-disable-next-line prettier/prettier
  expect(()=>{validateDivision(null);}).toThrow(new Error("Division name must be a string"));
  // eslint-disable-next-line prettier/prettier
  expect(()=>{validateDivision([]);}).toThrow(new Error("Division name must be a string"));
  // eslint-disable-next-line prettier/prettier
  expect(()=>{validateDivision('');}).toThrow(new Error("Division name must not be empty"));
});

test('Valid input creates division', () => {
  // eslint-disable-next-line prettier/prettier
  expect(()=>{new Division("Mens's AA");}).not.toThrow(new Error);
});

test('addTeam Adds Team to Division', () => {
  // Create a new division
  const testDiv = new Division('Test');
  // Generate teams
  const testTeams = generateTeams(5);
  let expectedTeams = 0;
  expect(testDiv.numTeams()).toBe(expectedTeams);
  // Add teams and check length
  testTeams.forEach((team) => {
    testDiv.addTeam(team);
    expect(testDiv.numTeams()).toBe((expectedTeams += 1));
    // Teams are in ascending order for ranking points, so new team should always be 1 seed
    expect(team.seed).toBe(1);
    expect(testDiv.nets).toBe(1);
  });
});

test('addTeam Adds Team to Waitlist', () => {
  // Create a new division
  const testDiv = new Division('Test');
  // Generate teams
  const testTeams = generateTeams(5);
  let expectedTeams = 0;
  expect(testDiv.numWaitListed()).toBe(expectedTeams);
  // Add teams and check length
  testTeams.forEach((team) => {
    team.isWaitListed = true;
    testDiv.addTeam(team);
    expect(testDiv.numWaitListed()).toBe((expectedTeams += 1));
    expect(testDiv.numTeams()).toBe(0);
    expect(testDiv.nets).toBe(0);
  });
});

test('Division implements custom rules', () => {
  // Custom rules
  const rules = { minTeams: 1, maxTeams: 1, poolFormat: {} };
  const testDiv = new Division('Test', rules);
  Object.keys(rules).forEach((key) => {
    expect(testDiv.rules[key]).toBe(rules[key]);
  });
});

test('Division rules override default rules', () => {
  // Custom rules
  const rules = {
    minTeams: 1,
    maxTeams: 1,
    poolFormat: {},
    Test: { minTeams: 4 },
  };
  const testDiv = new Division('Test', rules);
  expect(testDiv.rules.minTeams).toBe(rules.Test.minTeams);
});

test('updateSeeding seeds division', () => {
  // new team
  const testDiv = new Division('Test');
  // Generate teams
  const testTeams = generateTeams(5);
  // Add teams
  testTeams.forEach((team) => {
    team.isWaitListed = false;
    // reset seed
    team.seed = undefined;
    testDiv.addTeam(team);
  });
  // Check seeding
  testDiv.teams.forEach((team, seed) => {
    expect(team).toBe(testTeams[testTeams.length - seed - 1]);
    expect(team.seed).toBe(seed + 1);
  });
});
