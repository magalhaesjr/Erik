/**
 * Defines redux slice for format rules
 */
import { PayloadAction, createSlice } from '@reduxjs/toolkit';
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

export type RuleExport = {
  type: string;
  rules: DivisionRules;
};

/** Sagas */
export const IMPORT_RULES = 'IMPORT_RULES';
export const requestImportRules = () => ({ type: IMPORT_RULES });
export const EXPORT_RULES = 'EXPORT_RULES';
export const exportRules = (rules: DivisionRules) => ({
  type: EXPORT_RULES,
  rules,
});

/** Slice Defintion */
const initialState: DivisionRules = divisionRules;

export const ruleSlice = createSlice({
  name: 'rules',
  initialState,
  reducers: {
    importRules: (_, action: PayloadAction<DivisionRules>) => {
      return action.payload;
    },
  },
});

export const { importRules } = ruleSlice.actions;
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
export const selectRules = (state: RootState) => state.rules;
export const selectDivisionRules = (
  state: RootState,
  division: string
): Partial<DivisionFormat> => {
  if (division.length > 0) {
    const divKey = getDivisionKey(division);
    if (Object.keys(state.rules).includes(divKey)) {
      return state.rules[divKey];
    }
  }
  return {};
};

export const selectRequiredCourts = (state: RootState, division: string) => {
  const rules = selectDivisionRules(state, division);
  const entries = selectDivisionEntries(state, division);

  return calcRequiredNets(entries.length, rules.poolFormat || {});
};
