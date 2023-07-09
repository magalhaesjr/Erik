/* eslint-disable no-console */
/**
 * Defines redux slice for pools
 */
import { createSlice } from '@reduxjs/toolkit';
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

type TournamentPools = {
  [key: string]: Pool[];
};

/** Sagas */
// FILL in later

/** Slice Defintion */
const initialState: TournamentPools = {};

export const entrySlice = createSlice({
  name: 'pools',
  initialState,
  reducers: {
    replacePools: () => {
      console.log('replace me');
    },
  },
});

export const { replacePools } = entrySlice.actions;
export default entrySlice.reducer;

/** Selectors */
export const selectDivisionPools = (
  state: RootState,
  division: string
): Pool[] => {
  if (division.length === 0) {
    return [];
  }

  if (Object.keys(state.pools).includes(division)) {
    return Object.values(state.pools[division]);
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

  if (Object.keys(state.pools).includes(division)) {
    const pool = Object.values(state.pools[division]).find(
      (p) => p.id === poolNumber
    );
    return pool || null;
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
