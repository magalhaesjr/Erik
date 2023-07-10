// Defines rules for running tournaments. Rules are division based
// eslint-disable-next-line import/no-cycle
import cloneDeep from 'lodash/cloneDeep';
import { getDivisionKey } from './utility';

type PoolFormat = {
  numGames: number;
  points: number;
};

// Allowed team definitions
export type DivisionPoolFormat = {
  [key: number]: PoolFormat;
};

export type DivisionFormat = {
  poolFormat: Partial<DivisionPoolFormat>;
  centerCourt?: number;
};

export type DivisionRules = {
  [key: string]: DivisionFormat;
};

export const defaultFormat: DivisionFormat = {
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
};

const divisionRules: DivisionRules = {
  [getDivisionKey("Men's Open")]: {
    // Preferred center court
    centerCourt: 15,
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
  [getDivisionKey("Men's AA")]: {
    ...cloneDeep(defaultFormat),
    centerCourt: 12,
  },
  [getDivisionKey("Men's A")]: {
    ...cloneDeep(defaultFormat),
  },
  [getDivisionKey("Men's BB")]: {
    ...cloneDeep(defaultFormat),
  },
  [getDivisionKey("Men's B")]: {
    ...cloneDeep(defaultFormat),
  },
  [getDivisionKey("Women's Open")]: {
    ...cloneDeep(defaultFormat),
  },
  [getDivisionKey("Women's AA")]: {
    ...cloneDeep(defaultFormat),
  },
  [getDivisionKey("Women's A")]: {
    ...cloneDeep(defaultFormat),
  },
  [getDivisionKey("Women's BB")]: {
    ...cloneDeep(defaultFormat),
  },
  [getDivisionKey("Women's B")]: {
    ...cloneDeep(defaultFormat),
  },
  [getDivisionKey("Coed 2's Open")]: {
    ...cloneDeep(defaultFormat),
    centerCourt: 11,
  },
  [getDivisionKey("Coed 2's AA")]: {
    ...cloneDeep(defaultFormat),
    centerCourt: 12,
  },
  [getDivisionKey("Coed 2's A")]: {
    ...cloneDeep(defaultFormat),
  },
  [getDivisionKey("Coed 2's BB")]: {
    ...cloneDeep(defaultFormat),
  },
  [getDivisionKey("Coed 2's B")]: {
    ...cloneDeep(defaultFormat),
  },
};

export type TournamentRules = {
  maxCourts: number;
} & DivisionRules;

export const tournamentRules = {
  maxCourts: 26,
  ...cloneDeep(divisionRules),
};

export const importDivisionRules = (
  customRules?: Partial<DivisionRules>
): DivisionRules => {
  const rules = cloneDeep(divisionRules);

  if (customRules) {
    // Override default rules with custom ruleset
    Object.entries(cloneDeep(customRules)).forEach(([d, r]) => {
      rules[d] = {
        ...rules[d],
        ...r,
      };
    });
  }

  return rules;
};

export default divisionRules;
