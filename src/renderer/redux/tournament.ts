// Root reducer. Make this kind of global for now, until I get something going
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from './store';
import { hasProp } from '../../domain/validate';
import Player from '../../domain/player';
import Team from '../../domain/team';
import Tournament from '../../domain/tournament';
import Division from '../../domain/division';
import { Court } from '../../domain/court';
import { getDivisionKey } from '../../domain/utility';

/** Types */
type EntryUpdate = {
  waitList: boolean;
  division: string;
};

type TeamUpdate = {
  team: number;
} & EntryUpdate;

type DivisionUpdate = {
  teams: Team[];
} & EntryUpdate;

export type PlayerUpdate = {
  playerNum: number;
  player: Player;
} & TeamUpdate;

type PoolUpdate = {
  division: string;
  id: number;
  playoffTeams: number;
};

type RegUpdate = {
  division: string;
  team: number;
  playerInd: number;
  paid: boolean;
  staff: boolean;
};

type CourtUpdate = {
  court: Court;
};

// Helper functions
const getDivision = (
  tournament: Tournament,
  div: string,
  newFlag?: boolean
): Division | null => {
  if (div.length === 0) {
    return null;
  }
  // Check saturday first
  const divKey = getDivisionKey(div);
  if (hasProp(tournament.saturday.divisions, divKey)) {
    if (newFlag === undefined || newFlag) {
      // Make a new copy of the division object
      return new Division(tournament.saturday.divisions[divKey]);
    }

    return tournament.saturday.divisions[divKey];
  }

  if (hasProp(tournament.sunday.divisions, divKey)) {
    if (newFlag === undefined || newFlag) {
      // Make a new copy of the division object
      return new Division(tournament.sunday.divisions[divKey]);
    }

    return tournament.sunday.divisions[divKey];
  }

  return null;
};

const setDivision = (tournament: Tournament, newDiv: Division): Tournament => {
  const divName = getDivisionKey(newDiv.props.division);
  // Copy state to new state
  const outState = JSON.parse(JSON.stringify(tournament));

  if (hasProp(outState.saturday.divisions, divName)) {
    outState.saturday.divisions[divName] = JSON.parse(JSON.stringify(newDiv));
  } else if (hasProp(outState.sunday.divisions, divName)) {
    outState.sunday.divisions[divName] = JSON.parse(JSON.stringify(newDiv));
  }

  return outState;
};

// Reset pools
const resetAllPools = (
  tournament: Tournament,
  division: Division | null
): Tournament => {
  if (division) {
    // Reset pools
    division.props.pools = [];
    const newState = setDivision(tournament, division);

    // Reset pool numbers for courts
    division.props.courts.forEach((c) => {
      const court = newState.courts[c - 1];
      court.pool = null;
      newState.courts[c - 1] = court;
    });

    // Update stae
    return newState;
  }
  return tournament;
};

// Iniital state
const initialState: Tournament = JSON.parse(JSON.stringify(new Tournament()));

/** Slice */
const tournamentSlice = createSlice({
  name: 'tournament',
  initialState,
  reducers: {
    loadTournament: (_, action: PayloadAction<Tournament>) => {
      // Copy tournament
      return action.payload;
    },
    updatePlayer: (state, action: PayloadAction<PlayerUpdate>) => {
      // Update
      const playerUpdate = action.payload as PlayerUpdate;
      const {
        division: divName,
        team,
        player,
        playerNum,
        waitList,
      } = playerUpdate;

      // Find division in state
      const division = getDivision(
        JSON.parse(JSON.stringify(state)),
        divName,
        false
      );

      if (division) {
        // update player info
        if (waitList) {
          division.props.waitList[team].props.players[playerNum] = player;
        } else {
          division.props.teams[team].props.players[playerNum] = player;
        }
        // Update stae
        return setDivision(state, division);
      }
      // Return original state
      return state;
    },
    updateDivision: (state, action: PayloadAction<DivisionUpdate>) => {
      const divUpdate = action.payload;

      const { division: divName, waitList, teams } = divUpdate;

      // Find division
      const division = getDivision(state, divName);
      // Update teams
      if (division) {
        if (waitList) {
          division.props.waitList = [];
        } else {
          division.props.teams = [];
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
    },
    addTeam: (state, action: PayloadAction<TeamUpdate>) => {
      const teamUpdate = action.payload;
      const { division: divName, waitList } = teamUpdate;
      // Find division
      const division = getDivision(state, divName);
      // Update teams
      if (division) {
        const newTeam = new Team();
        newTeam.props.isWaitListed = waitList;
        newTeam.addPlayer(new Player());
        newTeam.addPlayer(new Player());
        // Add team
        division.addTeam(newTeam);
        const newState = setDivision(state, division);
        // Update stae
        return newState;
      }
      return state;
    },
    changeWaitStatus: (state, action: PayloadAction<TeamUpdate>) => {
      const { division: divName, waitList, team } = action.payload;
      // Find division
      const division = getDivision(state, divName);
      // Update teams
      if (division) {
        // First grab team
        let newTeam: Team;
        if (waitList) {
          newTeam = division.props.waitList[team];
        } else {
          newTeam = division.props.teams[team];
        }
        // Flip waitlist status
        newTeam.props.isWaitListed = !newTeam.props.isWaitListed;
        // Remove team from old list
        division.removeTeam(team, waitList);
        // Add team to new list
        division.addTeam(newTeam);
        const newState = setDivision(state, division);
        // Update stae
        return newState;
      }
      return state;
    },
    removeTeam: (state, action: PayloadAction<TeamUpdate>) => {
      const { division: divName, waitList, team } = action.payload;
      // Find division
      const division = getDivision(state, divName);
      // Update teams
      if (division) {
        division.removeTeam(team, waitList);
        const newState = setDivision(state, division);
        // Update stae
        return newState;
      }
      return state;
    },
    generatePools: (state, action: PayloadAction<EntryUpdate>) => {
      const { division: divName } = action.payload;
      // Find division
      const division = getDivision(state, divName);
      // Generate pools
      if (division) {
        // Generate pools
        division.createPools();
        // Update division
        const newState = setDivision(state, division);

        // Assign pool numbers to courts in main store
        division.props.pools.forEach((p, ind) => {
          p.courts.forEach((c) => {
            newState.courts[c - 1].pool = ind + 1;
          });
        });

        // Update stae
        return newState;
      }
      return state;
    },
    resetPools: (state, action: PayloadAction<EntryUpdate>) => {
      const { division: divName } = action.payload;
      // Find division
      const division = getDivision(state, divName);

      // Reset pools
      return resetAllPools(state, division);
    },
    updatePool: (state, action: PayloadAction<PoolUpdate>) => {
      const { division: divName, id, playoffTeams } = action.payload;
      // Find division
      const division = getDivision(state, divName);

      if (division) {
        // Get pool
        division.props.pools[id].playoffTeams = playoffTeams;

        // Update state
        return setDivision(state, division);
      }

      return state;
    },
    updatePaidStatus: (state, action: PayloadAction<RegUpdate>) => {
      // Get payload variables
      const {
        division: divName,
        team,
        playerInd,
        paid,
        staff,
      } = action.payload;
      // Find division
      const division = getDivision(state, divName);
      // Generate pools
      if (division) {
        // Update player paid status in this division
        division.props.teams[team].props.players[playerInd].props.paid = paid;
        division.props.teams[team].props.players[playerInd].props.staff = staff;
        const newState = setDivision(state, division);
        // Update stae
        return newState;
      }
      return state;
    },
    updateCourt: (state, action: PayloadAction<CourtUpdate>) => {
      // Get the new court
      const { court } = action.payload;

      // If court number is invalid, there is nothing to do
      if (court.number === null) {
        return state;
      }

      // Directly update the court number
      let newState: Tournament = JSON.parse(JSON.stringify(state));

      // Previous division assigned to this court
      const prevDiv = getDivision(
        newState,
        newState.courts[court.number - 1].division
      );
      // assign new court
      newState.courts[court.number - 1] = court;

      // If court was previously assigned to a division, then remove that court assignment
      // from the division
      if (prevDiv) {
        // If there were previously pools, reset them
        if (prevDiv.props.pools.length > 0) {
          newState = resetAllPools(newState, prevDiv);
        }

        // Remove court from division
        prevDiv.assignCourts(
          [...prevDiv.props.courts].filter((c) => {
            return c !== court.number;
          })
        );

        // Replace division in state
        newState = setDivision(newState, prevDiv);
      }

      // Now assign the new court to the new division
      const newDiv = getDivision(newState, court.division);
      // Ensure that new division is real
      if (newDiv) {
        // Re-assign courts
        newDiv.assignCourts([...newDiv.props.courts, court.number]);
        // Replace division in state
        newState = setDivision(newState, newDiv);
      }

      return newState;
    },
  },
});

export const {
  addTeam,
  changeWaitStatus,
  generatePools,
  loadTournament,
  removeTeam,
  resetPools,
  updateCourt,
  updateDivision,
  updatePaidStatus,
  updatePlayer,
  updatePool,
} = tournamentSlice.actions;

export default tournamentSlice.reducer;

/** Selectors */
export const selectTournament = (state: RootState) => state.tournament;
export const selectSaturdayDivisions = (state: RootState) =>
  state.tournament.saturday.divisions;
export const selectSundayDivisions = (state: RootState) =>
  state.tournament.sunday.divisions;
