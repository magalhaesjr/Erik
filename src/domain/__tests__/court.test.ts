// Tests functions from rules
import { createCourt } from '../court';

test('createCourt returns blank court', () => {
  expect(createCourt()).toEqual({
    netHeight: 'undefined',
    number: null,
    division: '',
    pool: null,
  });
});
