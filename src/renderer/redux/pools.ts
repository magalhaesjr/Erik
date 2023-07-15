/**
 * Defines redux slice for pools
 */
import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import type { RootState } from './store';
import { getDivisionKey } from '../../domain/utility';
import { Match } from '../../domain/schedules';
import { TeamEntry } from './entries';

/** Types */
export type PoolFormat = {
  playoffTeams: number;
  numGames: number;
  points: number;
};

export type Pool = {
  id: number;
  teams: TeamEntry[];
  division: string;
  courts: number[];
  schedule: Match[];
  format: PoolFormat;
};

export type TournamentPools = {
  [key: string]: Pool[];
};

export type PoolProps<T> = {
  [key: string]: T;
};

export type DivisionPoolPayload = {
  division: string;
  pools: Pool[];
};

/** Sagas */
export const poolActions = {
  generatePools: 'GENERATE_POOLS',
  updateFormat: 'UPDATE_POOL_FORMAT',
  updateCourt: 'UPDATE_POOL_COURT',
};

export type PoolPayload = {
  type: string;
  action: string;
  props?: PoolProps<unknown>;
};

export type PoolActions = keyof typeof poolActions;
export const PoolActionChannel = 'POOL_ACTIONS';

export const updatePools = (
  action: PoolActions,
  props?: PoolProps<unknown>
): PoolPayload => ({
  type: PoolActionChannel,
  action: poolActions[action],
  props,
});

/** Slice Defintion */
const initialState: TournamentPools = {};

export const entrySlice = createSlice({
  name: 'pools',
  initialState,
  reducers: {
    importPools: (_, action: PayloadAction<TournamentPools>) => {
      return action.payload;
    },
    resetPools: (state, action: PayloadAction<string>) => {
      const division = action.payload;

      if (division.length === 0) {
        return;
      }

      const divKey = getDivisionKey(division);
      if (Object.keys(state).includes(divKey)) {
        delete state[divKey];
      }
    },
    resetAllPools: () => {
      return {};
    },
    setDivisionPools: (state, action: PayloadAction<DivisionPoolPayload>) => {
      const { division, pools } = action.payload;
      state[getDivisionKey(division)] = pools;
    },
    updatePoolCourt: (state, action: PayloadAction<Pool>) => {
      const { id, division, courts } = action.payload;

      // Pool index is 0 based
      const poolInd = id - 1;
      const court = courts[0];

      const divKey = getDivisionKey(division);
      // Find the pool
      if (
        Object.keys(state).includes(divKey) &&
        state[divKey].length > poolInd
      ) {
        // Get division pools
        const divPools = state[divKey];

        // Find old court
        const oldCourt = divPools[poolInd].courts[0];

        if (oldCourt === court) {
          return;
        }

        // Find the pool that has this court
        const swapIndex = divPools.findIndex((p) => p.courts.includes(court));
        if (swapIndex >= 0) {
          state[divKey][swapIndex].courts = [oldCourt];
          state[divKey][poolInd].courts = [court];
        }
      }
    },
    updatePoolFormat: (state, action: PayloadAction<Pool>) => {
      const { id, division, format } = action.payload;

      // Pool index is 0 based
      const poolInd = id - 1;
      const divKey = getDivisionKey(division);
      // Find the pool
      if (
        Object.keys(state).includes(divKey) &&
        state[divKey].length > poolInd
      ) {
        // Replace the pool format with the updated one
        state[divKey][poolInd].format = format;
      }
    },
  },
});

export const {
  importPools,
  resetPools,
  resetAllPools,
  setDivisionPools,
  updatePoolFormat,
  updatePoolCourt,
} = entrySlice.actions;
export default entrySlice.reducer;

/** Selectors */
export const selectPools = (state: RootState) => state.pools;
export const selectDivisionPools = (
  state: RootState,
  division: string
): Pool[] => {
  if (division.length === 0) {
    return [];
  }

  const divKey = getDivisionKey(division);
  if (Object.keys(state.pools).includes(divKey)) {
    return Object.values(state.pools[divKey]);
  }

  return [];
};

export const selectPool = (
  state: RootState,
  division: string,
  poolNumber: number
): Pool | null => {
  if (division.length === 0) {
    return null;
  }

  const divKey = getDivisionKey(division);
  if (Object.keys(state.pools).includes(divKey)) {
    const pool = Object.values(state.pools[divKey]).find(
      (p) => p.id === poolNumber
    );
    return pool || null;
  }

  return null;
};
