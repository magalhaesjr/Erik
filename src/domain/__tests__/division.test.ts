/* eslint-disable no-new */
// Team dependency
import Team from '../team';
import Player from '../player';
// Tested: Division
import Division from '../division';
import { DivisionFormat } from '../rules';

// Create 5 test teams
function generateTeams(numTeams: number) {
  const testTeams = [];
  for (let i = 0; i < numTeams; i += 1) {
    const newTeam = new Team();
    // Add ranking points via players
    // eslint-disable-next-line array-callback-return, @typescript-eslint/no-unused-vars
    [...Array(2)].map((_) => {
      const player = new Player({
        name: 'test',
        email: 'test',
        org: 'test',
        'avpa#': '1',
        ranking: `${i * 10}`,
        membershipValid: true,
      });
      newTeam.addPlayer(player);
    });
    testTeams.push(newTeam);
  }
  return testTeams;
}

test('Valid input creates division', () => {
  // eslint-disable-next-line prettier/prettier
  expect(()=>{new Division("Mens's AA");}).not.toThrow(new Error);
});

/* ** REGISTRATION MANAGEMENT TESTs ** */
test('addTeam Adds Team to Division', () => {
  // Create a new division
  const testDiv = new Division("Men's Open");
  // Generate teams
  const testTeams = generateTeams(5);
  let expectedTeams = 0;
  expect(testDiv.numTeams()).toBe(expectedTeams);
  // Add teams and check length
  testTeams.forEach((team) => {
    testDiv.addTeam(team);
    expect(testDiv.numTeams()).toBe((expectedTeams += 1));
    // Teams are in ascending order for ranking points, so new team should always be 1 seed
    expect(team.props.seed).toBe(1);
    expect(testDiv.props.minNets).toBe(1);
    expect(testDiv.props.maxNets).toBe(1);
  });
});

test('addTeam Adds Team to Waitlist', () => {
  // Create a new division
  const testDiv = new Division("Men's Open");
  // Generate teams
  const testTeams = generateTeams(5);
  let expectedTeams = 0;
  expect(testDiv.numWaitListed()).toBe(expectedTeams);
  // Add teams and check length
  testTeams.forEach((team) => {
    team.props.isWaitListed = true;
    testDiv.addTeam(team);
    expect(testDiv.numWaitListed()).toBe((expectedTeams += 1));
    expect(testDiv.numTeams()).toBe(0);
    expect(testDiv.props.minNets).toBe(0);
    expect(testDiv.props.maxNets).toBe(0);
  });
});

test('Division implements custom rules', () => {
  // Custom rules
  const rules: DivisionFormat = {
    poolFormat: {
      1: {
        numGames: 1,
        points: 21,
      },
    },
  };
  const testDiv = new Division('Test', rules);
  expect(testDiv.props.rules).toStrictEqual(rules);
});

test('updateSeeding seeds division', () => {
  // new team
  const testDiv = new Division('Test');
  // Generate teams
  const testTeams = generateTeams(5);
  // Add teams
  testTeams.forEach((team) => {
    team.props.isWaitListed = false;
    // reset seed
    team.props.seed = null;
    testDiv.addTeam(team);
  });
  // Check seeding
  testDiv.props.teams.forEach((team, seed) => {
    expect(team).toBe(testTeams[testTeams.length - seed - 1]);
    expect(team.props.seed).toBe(seed + 1);
  });
});

/* ** POOL MANAGEMENT TESTs ** */
test('assignCourts sets courts for division', () => {
  // Create a test division
  const testDiv = new Division('Test');
  // Assign courts to the division
  testDiv.assignCourts([10, 11, 12]);
  // Expect courts to be that array
  expect(testDiv.props.courts).toEqual([10, 11, 12]);
  // Assign less courts and ensure it replaces the previous courts
  testDiv.assignCourts(5);
  expect(testDiv.props.courts).toEqual([5]);
});

test('setCenterCourt makes center court first court', () => {
  // create a test division with a center court preference
  const testDiv = new Division("Men's Open");
  // Expected center
  const expectedCenter = testDiv.props.rules.centerCourt || 11;
  // Assign courts
  testDiv.assignCourts([7, 9, expectedCenter]);
  // Ensure center court is first out
  expect(testDiv.props.courts[0]).toBe(expectedCenter);
  expect(testDiv.props.courts.shift()).toBe(expectedCenter);
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
    expect(()=>{testDiv.createPools()}).toThrowError(new Error('The number of courts for Test must be >= 3 & <= 3'));
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
  expect(testDiv.props.pools[0].teams).toEqual([
    testDiv.props.teams[0],
    testDiv.props.teams[5],
    testDiv.props.teams[6],
    testDiv.props.teams[11],
    testDiv.props.teams[12],
  ]);
  expect(testDiv.props.pools[1].teams).toEqual([
    testDiv.props.teams[1],
    testDiv.props.teams[4],
    testDiv.props.teams[7],
    testDiv.props.teams[10],
    testDiv.props.teams[13],
  ]);
  expect(testDiv.props.pools[2].teams).toEqual([
    testDiv.props.teams[2],
    testDiv.props.teams[3],
    testDiv.props.teams[8],
    testDiv.props.teams[9],
    testDiv.props.teams[14],
  ]);
  // Check format
  testDiv.props.pools.forEach((pool) => {
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
  expect(testDiv.props.pools[0].teams).toEqual([
    testDiv.props.teams[0],
    testDiv.props.teams[3],
    testDiv.props.teams[4],
    testDiv.props.teams[7],
    testDiv.props.teams[8],
  ]);
  expect(testDiv.props.pools[1].teams).toEqual([
    testDiv.props.teams[1],
    testDiv.props.teams[2],
    testDiv.props.teams[5],
    testDiv.props.teams[6],
    testDiv.props.teams[9],
    testDiv.props.teams[10],
  ]);
  // Check format
  expect(testDiv.props.pools[0].numGames).toBe(1);
  expect(testDiv.props.pools[1].numGames).toBe(1);
  expect(testDiv.props.pools[0].points).toBe(28);
  expect(testDiv.props.pools[1].points).toBe(21);
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
  expect(testDiv.props.pools[0].teams).toEqual([
    testDiv.props.teams[0],
    testDiv.props.teams[7],
    testDiv.props.teams[8],
    testDiv.props.teams[15],
    testDiv.props.teams[16],
  ]);
  expect(testDiv.props.pools[1].teams).toEqual([
    testDiv.props.teams[1],
    testDiv.props.teams[6],
    testDiv.props.teams[9],
    testDiv.props.teams[14],
    testDiv.props.teams[17],
  ]);
  expect(testDiv.props.pools[2].teams).toEqual([
    testDiv.props.teams[2],
    testDiv.props.teams[5],
    testDiv.props.teams[10],
    testDiv.props.teams[13],
    testDiv.props.teams[18],
  ]);
  expect(testDiv.props.pools[3].teams).toEqual([
    testDiv.props.teams[3],
    testDiv.props.teams[4],
    testDiv.props.teams[11],
    testDiv.props.teams[12],
    testDiv.props.teams[19],
  ]);
  // Check format
  testDiv.props.pools.forEach((pool) => {
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
  expect(testDiv.props.pools[0].teams).toEqual([
    testDiv.props.teams[0],
    testDiv.props.teams[7],
    testDiv.props.teams[8],
    testDiv.props.teams[15],
  ]);
  expect(testDiv.props.pools[1].teams).toEqual([
    testDiv.props.teams[1],
    testDiv.props.teams[6],
    testDiv.props.teams[9],
    testDiv.props.teams[14],
  ]);
  expect(testDiv.props.pools[2].teams).toEqual([
    testDiv.props.teams[2],
    testDiv.props.teams[5],
    testDiv.props.teams[10],
    testDiv.props.teams[13],
    testDiv.props.teams[17],
  ]);
  expect(testDiv.props.pools[3].teams).toEqual([
    testDiv.props.teams[3],
    testDiv.props.teams[4],
    testDiv.props.teams[11],
    testDiv.props.teams[12],
    testDiv.props.teams[16],
  ]);
  // Check format
  testDiv.props.pools.forEach((pool) => {
    expect(pool.playoffTeams).toBe(2);
  });
  expect(testDiv.props.pools[0].numGames).toBe(2);
  expect(testDiv.props.pools[1].numGames).toBe(2);
  expect(testDiv.props.pools[2].numGames).toBe(1);
  expect(testDiv.props.pools[3].numGames).toBe(1);
  expect(testDiv.props.pools[0].points).toBe(21);
  expect(testDiv.props.pools[1].points).toBe(21);
  expect(testDiv.props.pools[2].points).toBe(28);
  expect(testDiv.props.pools[3].points).toBe(28);
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
  expect(testDiv.props.pools[0].teams).toEqual(testDiv.props.teams);
});

test('createPools with flexible nets works', () => {
  // Create a test division
  const testDiv = new Division('Test');
  // create 3 pools of teams
  const testTeams = generateTeams(16);
  // Assign them
  testTeams.forEach((team) => {
    testDiv.addTeam(team);
  });
  // Assign courts
  testDiv.assignCourts([1, 2, 3, 4]);
  // Assign pools and check outcomes
  testDiv.createPools();
  // Check expected assignment
  expect(testDiv.props.pools[0].teams).toEqual([
    testDiv.props.teams[0],
    testDiv.props.teams[7],
    testDiv.props.teams[8],
    testDiv.props.teams[15],
  ]);
  expect(testDiv.props.pools[1].teams).toEqual([
    testDiv.props.teams[1],
    testDiv.props.teams[6],
    testDiv.props.teams[9],
    testDiv.props.teams[14],
  ]);
  expect(testDiv.props.pools[2].teams).toEqual([
    testDiv.props.teams[2],
    testDiv.props.teams[5],
    testDiv.props.teams[10],
    testDiv.props.teams[13],
  ]);
  expect(testDiv.props.pools[3].teams).toEqual([
    testDiv.props.teams[3],
    testDiv.props.teams[4],
    testDiv.props.teams[11],
    testDiv.props.teams[12],
  ]);
  // Check format
  testDiv.props.pools.forEach((pool) => {
    expect(pool.numGames).toBe(2);
    expect(pool.points).toBe(21);
    expect(pool.playoffTeams).toBe(2);
  });

  // Assign different number of courts
  testDiv.assignCourts([1, 2, 3]);
  // Assign pools and check outcomes
  testDiv.createPools();
  // Check expected assignment
  expect(testDiv.props.pools[0].teams).toEqual([
    testDiv.props.teams[0],
    testDiv.props.teams[5],
    testDiv.props.teams[6],
    testDiv.props.teams[11],
    testDiv.props.teams[12],
    testDiv.props.teams[15],
  ]);
  expect(testDiv.props.pools[1].teams).toEqual([
    testDiv.props.teams[1],
    testDiv.props.teams[4],
    testDiv.props.teams[7],
    testDiv.props.teams[10],
    testDiv.props.teams[13],
  ]);
  expect(testDiv.props.pools[2].teams).toEqual([
    testDiv.props.teams[2],
    testDiv.props.teams[3],
    testDiv.props.teams[8],
    testDiv.props.teams[9],
    testDiv.props.teams[14],
  ]);
  expect(testDiv.props.pools[0].numGames).toBe(1);
  expect(testDiv.props.pools[1].numGames).toBe(1);
  expect(testDiv.props.pools[2].numGames).toBe(1);
  expect(testDiv.props.pools[0].points).toBe(21);
  expect(testDiv.props.pools[1].points).toBe(28);
  expect(testDiv.props.pools[2].points).toBe(28);
  expect(testDiv.props.pools[0].playoffTeams).toBe(3);
  expect(testDiv.props.pools[1].playoffTeams).toBe(2);
  expect(testDiv.props.pools[2].playoffTeams).toBe(2);
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
