/* eslint-disable no-new */
// Dependencies
import Team from '../team';
import { Match } from '../schedules';
// Tested
import Pool from '../pool';
// Mock objects
// jest.mock('../team.ts');
jest.mock('../division.ts');
jest.mock('../schedules.ts');
jest.mock('../rules.ts');

// Create 5 test teams
function generateTeams(numTeams: number) {
  const testTeams = [];
  for (let i = 0; i < numTeams; i += 1) {
    const newTeam = new Team();
    // Add ranking points
    newTeam.props.ranking = i * 10;
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

test('setFormat throws with no division format', () => {
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
      { poolFormat: { 4: { numGames: 10, points: 29 } } },
      [new Match(1, 2, 3)],
      2
    );
  }).toThrow(new Error(`Pool format for ${testTeams.length} is not defined`));
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
      [new Match(1, 2, 3)],
      5
    );
  }).toThrow(new Error('Number of playoff teams is too high'));

  // set the pool format
  testPool.setFormat(
    { poolFormat: { 5: { numGames: 10, points: 29 } } },
    [new Match(1, 2, 3)],
    3
  );
  expect(testPool.numGames).toBe(10);
  expect(testPool.points).toBe(29);
  expect(testPool.playoffTeams).toBe(3);
});
