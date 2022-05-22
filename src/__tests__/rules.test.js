// Tests rules functions
import { validateRules } from '../domain/rules';

test('missing rules throw', () => {
  /** Missing Rules */
  const rules = {};
  // eslint-disable-next-line prettier/prettier
  expect(()=>{validateRules(rules);}).toThrow(new Error("Rules are missing definition for minTeams"));
  // Set to invalid
  rules.minTeams = '1';
  // eslint-disable-next-line prettier/prettier
  expect(()=>{validateRules(rules);}).toThrow(new Error("Rules for minTeams is not number"));
  rules.minTeams = 4;
  // eslint-disable-next-line prettier/prettier
  expect(()=>{validateRules(rules);}).toThrow(new Error("Rules are missing definition for maxTeams"));
  // Set to invalid
  rules.maxTeams = '1';
  // eslint-disable-next-line prettier/prettier
  expect(()=>{validateRules(rules);}).toThrow(new Error("Rules for maxTeams is not number"));
  rules.maxTeams = 5;
  // eslint-disable-next-line prettier/prettier
  expect(()=>{validateRules(rules);}).toThrow(new Error("Rules are missing definition for maxCourts"));
  // Set to invalid
  rules.maxCourts = '1';
  // eslint-disable-next-line prettier/prettier
  expect(()=>{validateRules(rules);}).toThrow(new Error("Rules for maxCourts is not number"));
  rules.maxCourts = 4;
  // eslint-disable-next-line prettier/prettier
  expect(()=>{validateRules(rules);}).toThrow(new Error("Rules are missing definition for poolFormat"));
  // Set to invalid
  rules.poolFormat = '1';
  // eslint-disable-next-line prettier/prettier
  expect(()=>{validateRules(rules);}).toThrow(new Error("Rules for poolFormat is not object"));
});
