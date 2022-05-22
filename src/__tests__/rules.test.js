// Tests rules functions
import { validateRules } from '../domain/rules';

test('Invalid rules throw', () => {
  /** Invalid Rules */
  // eslint-disable-next-line prettier/prettier
  expect(()=>{validateRules(1);}).toThrow(new Error("Rules must be an Object"));
  // eslint-disable-next-line prettier/prettier
  expect(()=>{validateRules('');}).toThrow(new Error("Rules must be an Object"));
  // eslint-disable-next-line prettier/prettier
  expect(()=>{validateRules(null);}).toThrow(new Error("Rules must be an Object"));
  // eslint-disable-next-line prettier/prettier
  expect(()=>{validateRules(1);}).toThrow(new Error("Rules must be an Object"));
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
  expect(()=>{validateRules(rules);}).toThrow(new Error("Rules are missing definition for poolFormat"));
  // Set to invalid
  rules.poolFormat = '1';
  // eslint-disable-next-line prettier/prettier
  expect(()=>{validateRules(rules);}).toThrow(new Error("Rules for poolFormat is not object"));
});
