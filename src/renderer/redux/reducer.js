// Root reducer. Make this kind of global for now, until I get something going
import { hasProp } from '../../domain/validate';
import Player from '../../domain/player';
import Team from '../../domain/team';
import Tournament from '../../domain/tournament';
import { Division } from '../../domain/division';

// Helper functions
const getDivision = (state, div) => {
  let division = {};
  Object.keys(state).forEach((day) => {
    if (hasProp(state[day], 'divisions')) {
      if (hasProp(state[day].divisions, div)) {
        division = state[day].divisions[div];
      }
    }
  });
  return division;
};

const setDivision = (state, div, newDiv) => {
  Object.keys(state).forEach((day) => {
    if (hasProp(state[day], 'divisions')) {
      if (hasProp(state[day].divisions, div)) {
        state[day].divisions[div] = newDiv;
      }
    }
  });
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
      // Copy tournament
      const newState = JSON.parse(JSON.stringify(state));
      // Find division in state
      const division = getDivision(newState, action.payload.division);
      if (division !== null) {
        const { team, player, playerNum, waitList } = action.payload;
        // update player info
        if (waitList) {
          division.waitList[team].players[playerNum] = player;
        } else {
          division.teams[team].players[playerNum] = player;
        }
        // Update stae
        return newState;
      }
      // Return original state
      return state;
    }
    case 'updateDivision': {
      // Find division
      const division = getDivision(state, action.payload.division);
      // Update teams
      if (division !== null) {
        const divObj = new Division(division);
        const { teams, waitList } = action.payload;

        if (waitList) {
          divObj.waitList = [];
        } else {
          divObj.teams = [];
        }
        // Add all new teams
        teams.forEach((team) => {
          divObj.addTeam(new Team(team));
        });
        const newState = setDivision(
          JSON.parse(JSON.stringify(state)),
          action.payload.division,
          JSON.parse(JSON.stringify(divObj))
        );
        // Update stae
        return newState;
      }
      // Return original state
      return state;
    }
    case 'addTeam': {
      // Find division
      const division = getDivision(state, action.payload.division);
      // Update teams
      if (division !== null) {
        const divObj = new Division(division);
        const { team, waitList } = action.payload;
        const newTeam = new Team();
        if (team !== null) {
          newTeam.import(team);
        }
        newTeam.isWaitListed = waitList;
        newTeam.addPlayer(new Player());
        newTeam.addPlayer(new Player());
        // Add team
        divObj.addTeam(newTeam);
        const newState = setDivision(
          JSON.parse(JSON.stringify(state)),
          action.payload.division,
          JSON.parse(JSON.stringify(divObj))
        );
        // Update stae
        return newState;
      }
      return state;
    }
    case 'changeWaitStatus': {
      // Find division
      const division = getDivision(state, action.payload.division);
      // Update teams
      if (division !== null) {
        const divObj = new Division(division);
        const { waitList, team } = action.payload;
        // First grab team
        let newTeam = {};
        if (waitList) {
          newTeam = divObj.waitList[team];
        } else {
          newTeam = divObj.teams[team];
        }
        // Flip waitlist status
        newTeam.isWaitListed = !newTeam.isWaitListed;
        // Remove team from old list
        divObj.removeTeam(team, waitList);
        // Add team to new list
        divObj.addTeam(newTeam);
        const newState = setDivision(
          JSON.parse(JSON.stringify(state)),
          action.payload.division,
          JSON.parse(JSON.stringify(divObj))
        );
        // Update stae
        return newState;
      }
      return state;
    }
    case 'removeTeam': {
      // Find division
      const division = getDivision(state, action.payload.division);
      // Update teams
      if (division !== null) {
        const divObj = new Division(division);
        const { waitList, team } = action.payload;
        divObj.removeTeam(team, waitList);
        const newState = setDivision(
          JSON.parse(JSON.stringify(state)),
          action.payload.division,
          JSON.parse(JSON.stringify(divObj))
        );
        // Update stae
        return newState;
      }
      return state;
    }
    case 'generatePools': {
      // Find division
      const division = getDivision(state, action.payload.division);
      // Generate pools
      if (division !== null) {
        const divObj = new Division(division);
        // Generate pools
        divObj.assignCourts(Array(divObj.nets).fill(1));
        divObj.createPools();
        const newState = setDivision(
          JSON.parse(JSON.stringify(state)),
          action.payload.division,
          JSON.parse(JSON.stringify(divObj))
        );
        // Update stae
        return newState;
      }
      return state;
    }
    case 'updatePaidStatus': {
      // Get payload variables
      const { team, playerInd, paid, staff } = action.payload;
      // Find division
      const division = getDivision(state, action.payload.division);
      // Generate pools
      if (division !== null) {
        const divObj = new Division(division);
        // Update player paid status in this division
        divObj.teams[team].players[playerInd].paid = paid;
        divObj.teams[team].players[playerInd].staff = staff;
        const newState = setDivision(
          JSON.parse(JSON.stringify(state)),
          action.payload.division,
          JSON.parse(JSON.stringify(divObj))
        );
        // Update stae
        return newState;
      }
      return state;
    }
    default:
      // return state
      return state;
  }
}
