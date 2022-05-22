/* eslint-disable no-new */
// Import Division for dependency
import { Division } from '../domain/division';
import { DIVISION_RULES } from '../domain/rules';
// Tests Day class
import Day from '../domain/day';
// Mocks
jest.mock('../domain/division.js');
jest.mock('../domain/rules.js');

// Mock
DIVISION_RULES.maxCourts = 101;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const numTeamsMock = jest
  .spyOn(Division.prototype, 'numTeams')
  .mockImplementation(() => {
    return 10;
  });

test('Day initializes courts', () => {
  // Create test day
  const testDay = new Day();
  // Expect courts to be initialized
  expect(testDay.courts.length).toBe(DIVISION_RULES.maxCourts);
  expect(testDay.courts[0]).toBe(0);
  expect(testDay.courts.pop()).toBe(DIVISION_RULES.maxCourts - 1);
});

test('addDivision with bad inputs throws', () => {
  // Create a test day
  const testDay = new Day();
  // Call addDivision with bad inputs
  // eslint-disable-next-line prettier/prettier
  expect(()=>{testDay.addDivision(1)}).toThrowError(new Error('Input division is not a Division object'));
  // eslint-disable-next-line prettier/prettier
  expect(()=>{testDay.addDivision('')}).toThrowError(new Error('Input division is not a Division object'));
  // eslint-disable-next-line prettier/prettier
  expect(()=>{testDay.addDivision({})}).toThrowError(new Error('Input division is not a Division object'));
  // eslint-disable-next-line prettier/prettier
  expect(()=>{testDay.addDivision([])}).toThrowError(new Error('Input division is not a Division object'));
});

test('addDivision sets division correctly', () => {
  // Create a test day
  const testDay = new Day();
  // create a test division
  const testDiv = new Division();
  testDiv.division = 'Test';
  testDiv.nets = 5;
  // Add division
  // eslint-disable-next-line prettier/prettier
  expect(() => {testDay.addDivision(testDiv)}).not.toThrow();
  // Change division nets
  const replaceDiv = new Division();
  replaceDiv.division = 'Test';
  replaceDiv.nets = 10;
  testDay.addDivision(replaceDiv);
  // Reset division
  // eslint-disable-next-line prettier/prettier
  expect(Object.prototype.hasOwnProperty.call(testDay.divisions, 'Test')).toBeTruthy();
  // Expect teams to be the second
  expect(testDay.divisions.Test.nets).toBe(10);
});

test('Day accurately counts number of teams', () => {
  // Create a test day
  const testDay = new Day();
  // Create a test division
  const testDiv = new Division();
  testDiv.division = 'Test';
  // Add division
  testDay.addDivision(testDiv);
  // Verify num teams is correct
  expect(testDay.numTeams()).toBe(10);
  // Add another division and test
  const newDiv = new Division();
  newDiv.division = 'Test2';
  testDay.addDivision(newDiv);
  expect(testDay.numTeams()).toBe(20);
});

test('Day accurately counts required nets', () => {
  // Create a test day
  const testDay = new Day();
  // Create a test division
  const testDiv = new Division();
  testDiv.division = 'Test';
  testDiv.nets = 4;
  // Add division
  testDay.addDivision(testDiv);
  // Verify num teams is correct
  expect(testDay.requiredNets()).toBe(4);
  // Add another division and test
  const newDiv = new Division();
  newDiv.division = 'Test2';
  newDiv.nets = 6;
  testDay.addDivision(newDiv);
  expect(testDay.requiredNets()).toBe(10);
});

test('import restores division object', () => {
  // Create a test day
  const testDay = new Day();
  // Create a test division
  const testDiv = new Division();
  testDiv.division = 'Test';
  // Add division
  testDay.addDivision(testDiv);
  // Export day using stringify
  const exported = JSON.stringify(testDay);
  // Create a new division via import
  const importedDay = new Day(JSON.parse(exported));
  // Division is mocked, so the constructor won't work correctly. Fix it here for comparisons
  expect(importedDay.divisions.undefined instanceof Division).toBeTruthy();
  importedDay.divisions = { Test: testDiv };
  // Verify they are the same
  expect(importedDay).toStrictEqual(testDay);
});
