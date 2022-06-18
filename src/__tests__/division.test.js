/* eslint-disable no-new */
// Team dependency
import Team from '../domain/team';
import Player from '../domain/player';
// Tested: Division
import { Division, validateDivision } from '../domain/division';

// Create 5 test teams
function generateTeams(numTeams) {
  const testTeams = [];
  for (let i = 0; i < numTeams; i += 1) {
    const newTeam = new Team();
    // Add ranking points via players
    // eslint-disable-next-line array-callback-return
    [...Array(2)].map((_, ind) => {
      const player = new Player();
      player.ranking = i * 10;
      newTeam.addPlayer(player);
    });
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

/* ** REGISTRATION MANAGEMENT TESTs ** */
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
  const rules = { minTeams: 1, maxTeams: 1, maxCourts: 1, poolFormat: {} };
  const testDiv = new Division('Test', rules);
  Object.keys(rules).forEach((key) => {
    expect(testDiv.rules[key]).toStrictEqual(rules[key]);
  });
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

test('Division rules override default rules', () => {
  // Custom rules
  const rules = {
    minTeams: 1,
    maxTeams: 1,
    maxCourts: 1,
    poolFormat: {},
    Test: { minTeams: 4 },
  };
  const testDiv = new Division('Test', rules);
  expect(testDiv.rules.minTeams).toBe(rules.Test.minTeams);
});

/* ** POOL MANAGEMENT TESTs ** */
test('assignCourts with bad inputs throw', () => {
  // Create a new division
  const testDiv = new Division('Test');
  // Try to assign bad court types
  // eslint-disable-next-line prettier/prettier
  expect(()=>{testDiv.assignCourts()}).toThrowError(new Error('Courts must be an array of numbers'));
  // eslint-disable-next-line prettier/prettier
  expect(()=>{testDiv.assignCourts({})}).toThrowError(new Error('Courts must be an array of numbers'));
  // eslint-disable-next-line prettier/prettier
  expect(()=>{testDiv.assignCourts('t')}).toThrowError(new Error('Courts must be an array of numbers'));
  // eslint-disable-next-line prettier/prettier
  expect(()=>{testDiv.assignCourts(null)}).toThrowError(new Error('Courts must be an array of numbers'));
  // bad court numbers
  // eslint-disable-next-line prettier/prettier
  expect(()=>{testDiv.assignCourts([0, 20])}).toThrowError(new Error('Court numbers must be >= 1 && <= 22'));
  // eslint-disable-next-line prettier/prettier
  expect(()=>{testDiv.assignCourts([1, 21, 40])}).toThrowError(new Error('Court numbers must be >= 1 && <= 22'));
});

test('assignCourts sets courts for division', () => {
  // Create a test division
  const testDiv = new Division('Test');
  // Assign courts to the division
  testDiv.assignCourts([10, 11, 12]);
  // Expect courts to be that array
  expect(testDiv.courts).toEqual([10, 11, 12]);
  // Assign less courts and ensure it replaces the previous courts
  testDiv.assignCourts(5);
  expect(testDiv.courts).toEqual([5]);
});

test('setCenterCourt makes center court first court', () => {
  // create a test division with a center court preference
  const testDiv = new Division("Men's Open");
  // Assign courts
  testDiv.assignCourts([7, 9, 11]);
  // Ensure center court is first out
  expect(testDiv.courts[0]).toBe(9);
  expect(testDiv.courts.shift()).toBe(9);
});

test('createPools without enough pools throws', () => {
  // Create a test division
  const testDiv = new Division('Test');
  // Generate a bunch of teams
  const testTeams = generateTeams(15);
  // Add teams to division
  testTeams.forEach((team) => {
    testDiv.addTeam(team);
  });
  // expect throw
  const courts = [];
  for (let i = 0; i < 3; i += 1) {
    // eslint-disable-next-line prettier/prettier
    expect(()=>{testDiv.createPools()}).toThrowError(new Error('There are not enough courts assigned to this division'));
    // Add a court
    courts.push(i + 1);
    testDiv.assignCourts(courts);
  }
});

test('createPools with full pools assigns teams correctly', () => {
  // Create a test division
  const testDiv = new Division('Test');
  // create 3 pools of teams
  const testTeams = generateTeams(15);
  // Assign them
  testTeams.forEach((team) => {
    testDiv.addTeam(team);
  });
  // Assign courts
  testDiv.assignCourts([1, 2, 3]);
  // Assign pools and check outcomes
  testDiv.createPools();
  // Check expected assignment
  expect(testDiv.pools[0].teams).toEqual([
    testDiv.teams[0],
    testDiv.teams[5],
    testDiv.teams[6],
    testDiv.teams[11],
    testDiv.teams[12],
  ]);
  expect(testDiv.pools[1].teams).toEqual([
    testDiv.teams[1],
    testDiv.teams[4],
    testDiv.teams[7],
    testDiv.teams[10],
    testDiv.teams[13],
  ]);
  expect(testDiv.pools[2].teams).toEqual([
    testDiv.teams[2],
    testDiv.teams[3],
    testDiv.teams[8],
    testDiv.teams[9],
    testDiv.teams[14],
  ]);
  // Check format
  testDiv.pools.forEach((pool) => {
    expect(pool.numGames).toBe(1);
    expect(pool.points).toBe(28);
    expect(pool.playoffTeams).toBe(2);
  });
});
test('createPools with 11 teams assigns teams correctly', () => {
  // Create a test division
  const testDiv = new Division('Test');
  // create 3 pools of teams
  const testTeams = generateTeams(11);
  // Assign them
  testTeams.forEach((team) => {
    testDiv.addTeam(team);
  });
  // Assign courts
  testDiv.assignCourts([1, 2]);
  // Assign pools and check outcomes
  testDiv.createPools();
  // Check expected assignment
  expect(testDiv.pools[0].teams).toEqual([
    testDiv.teams[0],
    testDiv.teams[3],
    testDiv.teams[4],
    testDiv.teams[7],
    testDiv.teams[8],
  ]);
  expect(testDiv.pools[1].teams).toEqual([
    testDiv.teams[1],
    testDiv.teams[2],
    testDiv.teams[5],
    testDiv.teams[6],
    testDiv.teams[9],
    testDiv.teams[10],
  ]);
  // Check format
  expect(testDiv.pools[0].numGames).toBe(1);
  expect(testDiv.pools[1].numGames).toBe(1);
  expect(testDiv.pools[0].points).toBe(28);
  expect(testDiv.pools[1].points).toBe(21);
});
test('createPools with full even pools assigns teams correctly', () => {
  // Create a test division
  const testDiv = new Division('Test');
  // create 3 pools of teams
  const testTeams = generateTeams(20);
  // Assign them
  testTeams.forEach((team) => {
    testDiv.addTeam(team);
  });
  // Assign courts
  testDiv.assignCourts([1, 2, 3, 4]);
  // Assign pools and check outcomes
  testDiv.createPools();
  // Check expected assignment
  expect(testDiv.pools[0].teams).toEqual([
    testDiv.teams[0],
    testDiv.teams[7],
    testDiv.teams[8],
    testDiv.teams[15],
    testDiv.teams[16],
  ]);
  expect(testDiv.pools[1].teams).toEqual([
    testDiv.teams[1],
    testDiv.teams[6],
    testDiv.teams[9],
    testDiv.teams[14],
    testDiv.teams[17],
  ]);
  expect(testDiv.pools[2].teams).toEqual([
    testDiv.teams[2],
    testDiv.teams[5],
    testDiv.teams[10],
    testDiv.teams[13],
    testDiv.teams[18],
  ]);
  expect(testDiv.pools[3].teams).toEqual([
    testDiv.teams[3],
    testDiv.teams[4],
    testDiv.teams[11],
    testDiv.teams[12],
    testDiv.teams[19],
  ]);
  // Check format
  testDiv.pools.forEach((pool) => {
    expect(pool.numGames).toBe(1);
    expect(pool.points).toBe(28);
    expect(pool.playoffTeams).toBe(2);
  });
});

test('createPools with uneven pools assigns teams correctly', () => {
  // Create a test division
  const testDiv = new Division('Test');
  // create 4 pools of teams
  const testTeams = generateTeams(18);
  // Assign them
  testTeams.forEach((team) => {
    testDiv.addTeam(team);
  });
  // Assign courts
  testDiv.assignCourts([1, 2, 3, 4]);
  // Assign pools and check outcomes
  testDiv.createPools();
  // Check expected assignment
  expect(testDiv.pools[0].teams).toEqual([
    testDiv.teams[0],
    testDiv.teams[7],
    testDiv.teams[8],
    testDiv.teams[15],
  ]);
  expect(testDiv.pools[1].teams).toEqual([
    testDiv.teams[1],
    testDiv.teams[6],
    testDiv.teams[9],
    testDiv.teams[14],
  ]);
  expect(testDiv.pools[2].teams).toEqual([
    testDiv.teams[2],
    testDiv.teams[5],
    testDiv.teams[10],
    testDiv.teams[13],
    testDiv.teams[17],
  ]);
  expect(testDiv.pools[3].teams).toEqual([
    testDiv.teams[3],
    testDiv.teams[4],
    testDiv.teams[11],
    testDiv.teams[12],
    testDiv.teams[16],
  ]);
  // Check format
  testDiv.pools.forEach((pool) => {
    expect(pool.playoffTeams).toBe(2);
  });
  expect(testDiv.pools[0].numGames).toBe(2);
  expect(testDiv.pools[1].numGames).toBe(2);
  expect(testDiv.pools[2].numGames).toBe(1);
  expect(testDiv.pools[3].numGames).toBe(1);
  expect(testDiv.pools[0].points).toBe(21);
  expect(testDiv.pools[1].points).toBe(21);
  expect(testDiv.pools[2].points).toBe(28);
  expect(testDiv.pools[3].points).toBe(28);
});

test('createPools with single B pool works', () => {
  // Create a test division
  const testDiv = new Division("Men's B");
  // create 3 pools of teams
  const testTeams = generateTeams(7);
  // Assign them
  testTeams.forEach((team) => {
    testDiv.addTeam(team);
  });
  // Assign courts
  testDiv.assignCourts(1);
  // Assign pools and check outcomes
  testDiv.createPools();
  // Check expected assignment
  expect(testDiv.pools[0].teams).toEqual(testDiv.teams);
});

test('import restores division object', () => {
  // Create a test division
  const testDiv = new Division('Test');
  // create 4 pools of teams
  const testTeams = generateTeams(18);
  // Assign them
  testTeams.forEach((team) => {
    testDiv.addTeam(team);
  });
  // Assign courts
  testDiv.assignCourts([1, 2, 3, 4]);
  // Assign pools and check outcomes
  testDiv.createPools();
  // Export division using stringify
  const exported = JSON.stringify(testDiv);
  // Create a new division via import
  const importedDiv = new Division(JSON.parse(exported));
  // Verify they are the same
  expect(importedDiv).toStrictEqual(testDiv);
});
