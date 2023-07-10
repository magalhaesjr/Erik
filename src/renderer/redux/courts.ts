/**
 * Defines redux slice for courts
 */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from './store';
import { Court, createCourt, NetHeight } from '../../domain/court';

/** Types */
export type ChangeDivisionPayload = {
  court: number;
  division: string;
};
export type ChangeHeightPayload = {
  court: number;
  netHeight: NetHeight;
};

/** Slice Defintion */
const maxCourts = 26;
const initialState: Court[] = [...Array(maxCourts)].map((_, c) =>
  createCourt(c + 1)
);

export const courtSlice = createSlice({
  name: 'courts',
  initialState,
  reducers: {
    changeDivision: (state, action: PayloadAction<ChangeDivisionPayload>) => {
      const { court, division } = action.payload;
      state[court - 1].division =
        division.toLocaleLowerCase() === 'available' ? '' : division;
    },
    changeHeight: (state, action: PayloadAction<ChangeHeightPayload>) => {
      const { court, netHeight } = action.payload;
      state[court - 1].netHeight = netHeight;
    },
  },
});

export const { changeDivision, changeHeight } = courtSlice.actions;
export default courtSlice.reducer;

/** Selectors */
export const selectCourts = (state: RootState) => state.courts;
export const selectCourt = (state: RootState, court: number) => {
  if (court <= 0 || court > state.courts.length) {
    return null;
  }
  return state.courts[court - 1];
};

export const selectDivisionCourts = (state: RootState, division: string) =>
  state.courts.filter((c) => c.division === division);
