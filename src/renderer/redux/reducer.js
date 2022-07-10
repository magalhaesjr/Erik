// Root reducer. Make this kind of global for now, until I get something going
import { hasProp, isEmpty } from '../../domain/validate';
import Player from '../../domain/player';
import Team from '../../domain/team';
import Tournament from '../../domain/tournament';
import { Division } from '../../domain/division';

// Helper functions
const getDivision = (state, div, newFlag) => {
  let division = {};
  Object.keys(state).forEach((day) => {
    if (hasProp(state[day], 'divisions')) {
      if (hasProp(state[day].divisions, div)) {
        if (newFlag === undefined || newFlag) {
          // Make a new copy of the division object
          division = new Division(state[day].divisions[div]);
        } else {
          division = state[day].divisions[div];
        }
      }
    }
  });
  return division;
};

const setDivision = (state, newDiv) => {
  const div = newDiv.division;
  // Copy state to new state
  const outState = JSON.parse(JSON.stringify(state));
  Object.keys(outState).forEach((day) => {
    if (hasProp(outState[day], 'divisions')) {
      if (hasProp(outState[day].divisions, div)) {
        outState[day].divisions[div] = JSON.parse(JSON.stringify(newDiv));
      }
    }
  });
  return outState;
};

// Reset pools
const resetPools = (state, division) => {
  if (!isEmpty(division)) {
    // Reset pools
    division.pools = [];
    const newState = setDivision(state, division);

    // Reset pool numbers for courts
    division.courts.forEach((c) => {
      const court = newState.courts[c - 1];
      court.pool = null;
      newState.courts[c - 1] = court;
    });

    // Update stae
    return newState;
  }
  return state;
};

// Iniital state
const initialState = JSON.parse(JSON.stringify(new Tournament()));

export default function appReducer(state = initialState, action) {
  switch (action.type) {
    case 'loadTournament': {
      // Copy tournament
      return action.payload;
    }
    case 'updatePlayer': {
      // Find division in state
      const division = getDivision(
        JSON.parse(JSON.stringify(state)),
        action.payload.division,
        false
      );
      if (!isEmpty(division)) {
        const { team, player, playerNum, waitList } = action.payload;
        // update player info
        if (waitList) {
          division.waitList[team].players[playerNum] = player;
        } else {
          division.teams[team].players[playerNum] = player;
        }
        // Update stae
        return setDivision(state, division);
      }
      // Return original state
      return state;
    }
    case 'updateDivision': {
      // Find division
      const division = getDivision(state, action.payload.division);
      // Update teams
      if (!isEmpty(division)) {
        const { teams, waitList } = action.payload;

        if (waitList) {
          division.waitList = [];
        } else {
          division.teams = [];
        }
        // Add all new teams
        teams.forEach((team) => {
          division.addTeam(new Team(team));
        });
        const newState = setDivision(state, division);
        // Update state
        return newState;
      }
      // Return original state
      return state;
    }
    case 'addTeam': {
      // Find division
      const division = getDivision(state, action.payload.division);
      // Update teams
      if (!isEmpty(division)) {
        const { team, waitList } = action.payload;
        const newTeam = new Team();
        if (team !== null) {
          newTeam.import(team);
        }
        newTeam.isWaitListed = waitList;
        newTeam.addPlayer(new Player());
        newTeam.addPlayer(new Player());
        // Add team
        division.addTeam(newTeam);
        const newState = setDivision(state, division);
        // Update stae
        return newState;
      }
      return state;
    }
    case 'changeWaitStatus': {
      // Find division
      const division = getDivision(state, action.payload.division);
      // Update teams
      if (!isEmpty(division)) {
        const { waitList, team } = action.payload;
        // First grab team
        let newTeam = {};
        if (waitList) {
          newTeam = division.waitList[team];
        } else {
          newTeam = division.teams[team];
        }
        // Flip waitlist status
        newTeam.isWaitListed = !newTeam.isWaitListed;
        // Remove team from old list
        division.removeTeam(team, waitList);
        // Add team to new list
        division.addTeam(newTeam);
        const newState = setDivision(state, division);
        // Update stae
        return newState;
      }
      return state;
    }
    case 'removeTeam': {
      // Find division
      const division = getDivision(state, action.payload.division);
      // Update teams
      if (!isEmpty(division)) {
        const { waitList, team } = action.payload;
        division.removeTeam(team, waitList);
        const newState = setDivision(state, division);
        // Update stae
        return newState;
      }
      return state;
    }
    case 'generatePools': {
      // Find division
      const division = getDivision(state, action.payload.division);
      // Generate pools
      if (!isEmpty(division)) {
        // Generate pools
        division.createPools();
        // Update division
        const newState = setDivision(state, division);
        // Assign pool numbers to courts in main store
        division.pools.forEach((p, ind) => {
          newState.courts[p.courts - 1].pool = ind + 1;
        });

        // Update stae
        return newState;
      }
      return state;
    }
    case 'resetPools': {
      // Find division
      const division = getDivision(state, action.payload.division);

      // Reset pools
      return resetPools(state, division);
    }

    case 'updatePaidStatus': {
      // Get payload variables
      const { team, playerInd, paid, staff } = action.payload;
      // Find division
      const division = getDivision(state, action.payload.division);
      // Generate pools
      if (!isEmpty(division)) {
        // Update player paid status in this division
        division.teams[team].players[playerInd].paid = paid;
        division.teams[team].players[playerInd].staff = staff;
        const newState = setDivision(state, division);
        // Update stae
        return newState;
      }
      return state;
    }
    case 'updateCourt': {
      // Get the new court
      const { court } = action.payload;

      // Directly update the court number
      let newState = JSON.parse(JSON.stringify(state));

      // Previous division assigned to this court
      const prevDiv = getDivision(
        newState,
        newState.courts[court.number - 1].division
      );
      // assign new court
      newState.courts[court.number - 1] = court;

      // If court was previously assigned to a division, then remove that court assignment
      // from the division
      if (!isEmpty(prevDiv)) {
        // If there were previously pools, reset them
        if (prevDiv.pools.length > 0) {
          newState = resetPools(newState, prevDiv);
        }

        // Remove court from division
        prevDiv.assignCourts(
          [...prevDiv.courts].filter((c) => {
            return c !== court.number;
          })
        );

        // Replace division in state
        newState = setDivision(newState, prevDiv);
      }

      // Now assign the new court to the new division
      const newDiv = getDivision(newState, court.division);
      // Ensure that new division is real
      if (!isEmpty(newDiv)) {
        // Get previous courts
        const prevCourts = [...newDiv.courts];
        // Add court
        prevCourts.push(court.number);
        // Re-assign courts
        newDiv.assignCourts(prevCourts);
        // Replace division in state
        newState = setDivision(newState, newDiv);
      }

      return newState;
    }
    default:
      // return state
      return state;
  }
}
