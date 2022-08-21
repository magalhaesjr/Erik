// Defines rules for running tournaments. Rules can be division based
import { hasProp, validateObject } from './validate';

// Required rules and their associated types
const RULE_FIELDS = {
  minTeams: 'number',
  maxTeams: 'number',
  maxCourts: 'number',
  poolFormat: 'object',
};

// Validates that all required inputs are available
export function validateRules(rules) {
  /* Check Rules */
  validateObject(rules);
  // Check required rule parameters and types
  Object.keys(RULE_FIELDS).forEach((ruleField) => {
    if (!hasProp(rules, ruleField)) {
      throw new Error(`Rules are missing definition for ${ruleField}`);
      // eslint-disable-next-line valid-typeof
    } else if (typeof rules[ruleField] !== RULE_FIELDS[ruleField]) {
      throw new Error(
        `Rules for ${ruleField} is not ${RULE_FIELDS[ruleField]}`
      );
    }
  });
}

export const DIVISION_RULES = {
  /* Global rules */
  // Maximum number of courts allowed on the beach
  maxCourts: 20,
  // Minimum number of teams per net
  minTeams: 4,
  maxTeams: 7,
  // Pool Format
  poolFormat: {
    4: {
      numGames: 2,
      points: 21,
    },
    5: {
      numGames: 1,
      points: 28,
    },
    6: {
      numGames: 1,
      points: 21,
    },
    7: {
      numGames: 1,
      points: 21,
    },
  },

  /* Division specific rules can override globals */
  "Men's Open": {
    // Preferred center court
    centerCourt: 11,
    // Pool Format
    poolFormat: {
      4: {
        numGames: 1,
        points: 28,
      },
      5: {
        numGames: 1,
        points: 21,
      },
      6: {
        numGames: 1,
        points: 21,
      },
    },
  },
  "Men's AA": {
    centerCourt: 12,
  },
  "Coed 2's Open": {
    // Preferred center court
    centerCourt: 11,
  },
  "Coed 2's AA": {
    // Preferred center court
    centerCourt: 12,
  },
};
