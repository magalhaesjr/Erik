// Tests functions from rules
import { getDivisionKey } from '../utility';
import defaultRules, { importDivisionRules } from '../rules';
import type { DivisionRules } from '../rules';

describe('importDivisionRules', () => {
  test('returns default rules', () => {
    expect(importDivisionRules()).toEqual(defaultRules);
  });

  test('overrides rules', () => {
    const testDiv = getDivisionKey("Men's Open");
    const customRules: DivisionRules = {
      [testDiv]: {
        poolFormat: {
          5: {
            numGames: 2,
            points: 21,
          },
        },
        centerCourt: 20,
      },
    };

    const newRules = importDivisionRules(customRules);
    const mo = newRules[testDiv];

    // Verify new rules
    expect(mo.centerCourt).toEqual(customRules[testDiv].centerCourt);
    expect(mo.poolFormat[5]).toEqual(customRules[testDiv].poolFormat[5]);
    // Verify didn't change previous
    expect(mo.poolFormat[4]).toEqual(customRules[testDiv].poolFormat[4]);
  });
});
