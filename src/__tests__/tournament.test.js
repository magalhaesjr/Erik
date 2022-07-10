/* eslint-disable no-new */
// Import Division for dependency
import { Division } from '../domain/division';
import { DIVISION_RULES } from '../domain/rules';
// Tests Tournament class
import Tournament from '../domain/tournament';
// Mocks
jest.mock('../domain/division.js');

test('Tournament constructs without error', () => {
  // Create test day
  // eslint-disable-next-line prettier/prettier
  expect(()=>{new Tournament()}).not.toThrow();
});

test('addDivision with bad inputs throws', () => {
  // Create a test day
  const testTourny = new Tournament();
  // Call addDivision with bad inputs
  // eslint-disable-next-line prettier/prettier
  expect(()=>{testTourny.addDivision(1)}).toThrowError(new Error('Input division is not a Division object'));
  // eslint-disable-next-line prettier/prettier
  expect(()=>{testTourny.addDivision('')}).toThrowError(new Error('Input division is not a Division object'));
  // eslint-disable-next-line prettier/prettier
  expect(()=>{testTourny.addDivision({})}).toThrowError(new Error('Input division is not a Division object'));
  // eslint-disable-next-line prettier/prettier
  expect(()=>{testTourny.addDivision([])}).toThrowError(new Error('Input division is not a Division object'));
});

test('Tournament initializes courts', () => {
  // Create test day
  const testTournament = new Tournament();
  // Expect courts to be initialized
  expect(testTournament.courts.length).toBe(DIVISION_RULES.maxCourts);
  expect(testTournament.courts[0].number).toBe(1);
  expect(testTournament.courts.pop().number).toBe(DIVISION_RULES.maxCourts);
});

test('addDivision adds division to correct day', () => {
  // Create a test tourney
  const testTourny = new Tournament();
  // create a test division
  const testDiv = new Division();
  testDiv.division = "Men's A";
  // Add division
  // eslint-disable-next-line prettier/prettier
  expect(() => {testTourny.addDivision(testDiv)}).not.toThrow();
  // Expect tourney to be on saturday
  // eslint-disable-next-line prettier/prettier
  expect(Object.prototype.hasOwnProperty.call(testTourny.saturday.divisions, "Men's A")).toBeTruthy();
  // new division
  const coedDiv = new Division();
  coedDiv.division = "Coed 2's Open";
  testTourny.addDivision(coedDiv);
  // eslint-disable-next-line prettier/prettier
  expect(Object.prototype.hasOwnProperty.call(testTourny.sunday.divisions, "Coed 2's Open")).toBeTruthy();
});

test('import restores division object', () => {
  // Create a test tourney
  const testTourny = new Tournament();
  // create a test division
  const testDiv = new Division();
  testDiv.division = "Men's A";
  // Add division
  testTourny.addDivision(testDiv);
  // new division
  const coedDiv = new Division();
  coedDiv.division = "Coed 2's Open";
  testTourny.addDivision(coedDiv);
  // Export day using stringify
  const exported = JSON.stringify(testTourny);
  // Create a new tourny via import
  const importedTourny = new Tournament(JSON.parse(exported));
  // Division is mocked, so the constructor won't work correctly.
  // eslint-disable-next-line prettier/prettier
  expect(importedTourny.saturday.divisions.undefined instanceof Division).toBeTruthy();
  // eslint-disable-next-line prettier/prettier
  expect(importedTourny.sunday.divisions.undefined instanceof Division).toBeTruthy();
});
