// Root reducer. Make this kind of global for now, until I get something going
import Tournament from '../../domain/tournament';

// Iniital state
const initialState = JSON.parse(JSON.stringify(new Tournament()));

export default function appReducer(state = initialState, action) {
  switch (action.type) {
    case 'loadTournament': {
      // Copy tournament
      return action.payload;
    }
    default:
      // return state
      return state;
  }
}
