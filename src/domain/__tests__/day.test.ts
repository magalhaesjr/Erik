// Import Division for dependency
import Division from '../division';
// Tests Day class
import Day from '../day';
// Mocks
jest.mock('../division.ts');
jest.mock('../rules.ts');

// Mock
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
Division.mockImplementation(() => {
  return {
    props: {
      division: 'lll',
      minNets: 0,
      maxNets: 0,
    },
    numTeams: jest.fn().mockReturnValue(10),
  };
});
// eslint-disable-next-line @typescript-eslint/no-unused-vars
/*
const numTeamsMock = jest
  .spyOn(Division.prototype, 'numTeams')
  .mockImplementation(() => {
    return 10;
  });
  */
describe('day', () => {
  test('addDivision sets division correctly', () => {
    // Create a test day
    const testDay = new Day();
    // create a test division
    const testDiv = new Division('Test');
    testDiv.props.division = 'Test';
    testDiv.props.minNets = 5;
    testDiv.props.maxNets = 5;
    // Add division
    // eslint-disable-next-line prettier/prettier
    expect(() => {testDay.addDivision(testDiv)}).not.toThrow();
    // Change division nets
    const replaceDiv = new Division('Test');
    replaceDiv.props.division = 'Test';
    replaceDiv.props.minNets = 10;
    replaceDiv.props.maxNets = 10;
    testDay.addDivision(replaceDiv);
    // Reset division
    // eslint-disable-next-line prettier/prettier
    expect(Object.prototype.hasOwnProperty.call(testDay.divisions, 'Test')).toBeTruthy();
    // Expect teams to be the second
    expect(testDay.divisions.Test.props.minNets).toBe(10);
    expect(testDay.divisions.Test.props.maxNets).toBe(10);
  });

  test('Day accurately counts number of teams', () => {
    // Create a test day
    const testDay = new Day();
    // Create a test division
    const testDiv = new Division('Test');
    testDiv.props.division = 'Test';
    // Add division
    testDay.addDivision(testDiv);
    // Verify num teams is correct
    expect(testDay.numTeams()).toBe(10);
    // Add another division and test
    const newDiv = new Division('Test2');
    testDay.addDivision(newDiv);
    expect(testDay.numTeams()).toBe(20);
  });

  test('Day accurately counts required nets', () => {
    // Create a test day
    const testDay = new Day();
    // Create a test division
    const testDiv = new Division('Test');
    testDiv.props.division = 'Test';
    testDiv.props.minNets = 4;
    testDiv.props.maxNets = 4;
    // Add division
    testDay.addDivision(testDiv);
    // Verify num teams is correct
    expect(testDay.requiredNets()).toBe(4);
    // Add another division and test
    const newDiv = new Division('Test2');
    newDiv.props.division = 'Test2';
    newDiv.props.minNets = 6;
    newDiv.props.maxNets = 6;
    testDay.addDivision(newDiv);
    expect(testDay.requiredNets()).toBe(10);
  });

  test('import restores division object', () => {
    // Create a test day
    const testDay = new Day();
    // Create a test division
    const testDiv = new Division('Test');
    testDiv.props.division = 'Test';
    // Add division
    testDay.addDivision(testDiv);
    // Export day using stringify
    const exported = JSON.stringify(testDay);
    // Create a new division via import
    const importedDay = new Day(JSON.parse(exported));
    // Division is mocked, so the constructor won't work correctly. Fix it here for comparisons
    importedDay.divisions = { Test: testDiv };
    // Verify they are the same
    expect(importedDay).toStrictEqual(testDay);
  });
});
