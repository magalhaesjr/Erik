// Test utiltiy functions
import { validateDivision } from '../utility';

test('Invalid Inputs Throw', () => {
  // eslint-disable-next-line prettier/prettier
  expect(()=>{validateDivision('');}).toThrow(new Error("Division name must not be empty"));
});
