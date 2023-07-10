/**
 * Defines redux slice for format rules
 */
import { createSlice } from '@reduxjs/toolkit';
import max from 'lodash/max';
import min from 'lodash/min';
import { getDivisionKey } from '../../domain/utility';
import type { RootState } from './store';
import divisionRules, {
  DivisionFormat,
  DivisionPoolFormat,
  DivisionRules,
} from '../../domain/rules';
import { selectDivisionEntries } from './entries';

/** Types */
export type RequiredCourts = {
  minNets: number;
  maxNets: number;
};

/** Slice Defintion */
const initialState: DivisionRules = divisionRules;

export const ruleSlice = createSlice({
  name: 'rules',
  initialState,
  reducers: {},
});

// export const { changeDivision } = courtSlice.actions;
export default ruleSlice.reducer;

/** Static functions */
export const calcRequiredNets = (
  numTeams: number,
  rules: Partial<DivisionPoolFormat>
): RequiredCourts => {
  const poolTeams = Object.keys(rules).map((r) => parseInt(r, 10));
  const maxTeams = max(poolTeams);
  const minTeams = min(poolTeams);
  if (maxTeams && minTeams) {
    return {
      minNets: Math.ceil(numTeams / maxTeams),
      maxNets: Math.max(1, Math.floor(numTeams / minTeams)),
    };
  }
  return {
    minNets: 0,
    maxNets: 0,
  };
};

/** Selectors */
export const selectDivisionRules = (
  state: RootState,
  division: string
): Partial<DivisionFormat> => {
  const divKey = getDivisionKey(division);
  if (Object.keys(state.rules).includes(divKey)) {
    return state.rules[divKey].poolFormat;
  }
  return {};
};

export const selectRequiredCourts = (state: RootState, division: string) => {
  const rules = selectDivisionRules(state, division);
  const entries = selectDivisionEntries(state, division);

  return calcRequiredNets(entries.length, rules);
};
