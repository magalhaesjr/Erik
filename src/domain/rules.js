// Defines rules for running tournaments. Rules can be division based

const DIVISION_RULES = {
  /* Global rules */
  // Minimum number of teams per net
  minTeams: 4,
  maxTeams: 5,
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
    centerCourt: 9,
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
    },
  },
  "Men's AA": {
    centerCourt: 10,
  },
  "Men's B": {
    maxTeams: 7,
  },
  "Women's B": {
    maxTeams: 7,
  },
  "Coed 2's B": {
    maxTeams: 7,
  },
};

export default DIVISION_RULES;
