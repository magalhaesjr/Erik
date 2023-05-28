// Import Division for dependency
import Division from '../division';
import { tournamentRules } from '../rules';
import { getDivisionKey } from '../utility';
// Tests Tournament class
import Tournament from '../tournament';
// Mocks
jest.mock('../division.ts');

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
  };
});

test('Tournament initializes courts', () => {
  // Create test day
  const testTournament = new Tournament();
  // Expect courts to be initialized
  expect(testTournament.courts.length).toBe(tournamentRules.maxCourts);
  expect(testTournament.courts[0].number).toBe(1);
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  expect(testTournament.courts.pop().number).toBe(tournamentRules.maxCourts);
});

test('addDivision adds division to correct day', () => {
  // Create a test tourney
  const testTourny = new Tournament();
  // create a test division
  const testDiv = new Division('test');
  testDiv.props.division = "Men's A";
  // Add division
  // eslint-disable-next-line prettier/prettier
  expect(() => {testTourny.addDivision(testDiv)}).not.toThrow();
  // Expect tourney to be on saturday
  // eslint-disable-next-line prettier/prettier
  expect(Object.prototype.hasOwnProperty.call(testTourny.saturday.divisions, getDivisionKey("Men's A"))).toBeTruthy();
  // new division
  const coedDiv = new Division('test');
  coedDiv.props.division = "Coed 2's Open";
  testTourny.addDivision(coedDiv);
  // eslint-disable-next-line prettier/prettier
  expect(Object.prototype.hasOwnProperty.call(testTourny.sunday.divisions, getDivisionKey("Coed 2's Open"))).toBeTruthy();
});

test('import restores division object', () => {
  // Create a test tourney
  const testTourny = new Tournament();
  // create a test division
  const testDiv = new Division('');
  testDiv.props.division = "Men's A";
  // Add division
  testTourny.addDivision(testDiv);
  // new division
  const coedDiv = new Division('');
  coedDiv.props.division = "Coed 2's Open";
  testTourny.addDivision(coedDiv);
  // Export day using stringify
  const exported = JSON.stringify(testTourny);
  // Create a new tourny via import
  const importedTourny = new Tournament(JSON.parse(exported));
  expect(Object.keys(importedTourny.saturday.divisions).length).toBeGreaterThan(
    0
  );
  expect(Object.keys(importedTourny.sunday.divisions).length).toBeGreaterThan(
    0
  );
});
