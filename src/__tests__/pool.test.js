/* eslint-disable no-new */
// Dependencies
import Team from '../domain/team';
// Tested
import Pool from '../domain/pool';
// Mock objects
jest.mock('../domain/team.js');
jest.mock('../domain/division.js');
jest.mock('../domain/schedules.js');
jest.mock('../domain/rules.js');

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

test('Valid input creates Pool', () => {
  // eslint-disable-next-line prettier/prettier
  expect(()=>{new Pool("Mens's AA");}).not.toThrow(new Error);
});

test('addTeam Adds Team to pool', () => {
  // Create a new Pool
  const testPool = new Pool('Test');
  // Generate teams
  const testTeams = generateTeams(5);
  let expectedTeams = 0;
  expect(testPool.teams.length).toBe(expectedTeams);
  // Add teams and check length
  testTeams.forEach((team) => {
    testPool.addTeam(team);
    expect(testPool.teams.length).toBe((expectedTeams += 1));
  });
});

test('setFormat defines pool format', () => {
  // Create a new Pool
  const testPool = new Pool('Test');
  // Add teams to pool
  const testTeams = generateTeams(5);
  testTeams.forEach((team) => {
    testPool.addTeam(team);
  });
  // Invalid playoff teams will throw
  expect(() => {
    testPool.setFormat(
      { poolFormat: { 5: { numGames: 10, points: 29 } } },
      { test: 10 },
      5
    );
  }).toThrow(new Error('Number of playoff teams is too high'));

  // set the pool format
  testPool.setFormat(
    { poolFormat: { 5: { numGames: 10, points: 29 } } },
    { test: 10 },
    3
  );
  expect(testPool.numGames).toBe(10);
  expect(testPool.points).toBe(29);
  expect(testPool.playoffTeams).toBe(3);
});
