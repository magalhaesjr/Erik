import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from './store';

/** Types */
type Finish = '1st' | '2nd' | '3rd' | '5th';
export type Day = 'saturday' | 'sunday';
type PayoutBreakdown = {
  [key in Finish]?: number;
};

type PayoutDay = {
  main: PayoutBreakdown;
  sub?: PayoutBreakdown;
};

export type PrizePayout = {
  [key: string]: PayoutBreakdown;
};

type DivisionPayoutDefinition = {
  main: string;
  sub?: string;
};

type DayPayoutDefinition = DivisionPayoutDefinition[];
type TournamentPayoutDefinition = {
  saturday: DayPayoutDefinition;
  sunday: DayPayoutDefinition;
};

type TournamentPayout = {
  prizePool: number;
  saturday: PayoutDay;
  sunday: PayoutDay;
};

export type TournamentFinancials = {
  prepaidCost: number;
  walkOnCost: number;
  payoutDivisions: TournamentPayoutDefinition;
  payoutParams: TournamentPayout;
};

export type DayFinancials = {
  prepaidCost: number;
  walkOnCost: number;
  prizePool: number;
  divisions: DayPayoutDefinition;
  params: PayoutDay;
};

export type FinancialExport = {
  type: string;
  financials: TournamentFinancials;
};

/** State */
const initialState: TournamentFinancials = {
  prepaidCost: 80,
  walkOnCost: 90,
  payoutDivisions: {
    saturday: [
      { main: "Men's Open", sub: "Men's AA" },
      { main: "Women's Open", sub: "Women's AA" },
    ],
    sunday: [{ main: "Coed 2's Open", sub: "Coed 2's AA" }],
  },
  payoutParams: {
    prizePool: 45,
    saturday: {
      main: {
        '1st': 0.34,
        '2nd': 0.2,
        '3rd': 0.13,
      },
      sub: {
        '1st': 0.12,
        '2nd': 0.08,
      },
    },
    sunday: {
      main: {
        '1st': 0.34,
        '2nd': 0.2,
        '3rd': 0.13,
      },
    },
  },
};

/** Sagas */
export const IMPORT_FINANCIALS = 'IMPORT_FINANCIALS';
export const importFinancials = () => ({ type: IMPORT_FINANCIALS });
export const EXPORT_FINANCIALS = 'EXPORT_FINANCIALS';
export const exportFinancials = (financials: TournamentFinancials) => ({
  type: EXPORT_FINANCIALS,
  financials,
});

/** Slice */
export const financialSlice = createSlice({
  name: 'financials',
  initialState,
  reducers: {
    updateFinancials: (
      state,
      payload: PayloadAction<Partial<TournamentFinancials>>
    ) => {
      // Use current state, in case the payload is missing any information
      return { ...state, ...payload.payload };
    },
  },
});

export const { updateFinancials } = financialSlice.actions;
export default financialSlice.reducer;

export const selectDayPayout = (state: RootState, day: Day): DayFinancials => {
  const divisions: DayPayoutDefinition =
    day === 'saturday'
      ? state.financials.payoutDivisions.saturday
      : state.financials.payoutDivisions.sunday;
  const params: PayoutDay =
    day === 'saturday'
      ? state.financials.payoutParams.saturday
      : state.financials.payoutParams.sunday;

  return {
    prepaidCost: state.financials.prepaidCost,
    walkOnCost: state.financials.walkOnCost,
    prizePool: state.financials.payoutParams.prizePool,
    divisions,
    params,
  };
};

export const selectFinancials = (state: RootState): TournamentFinancials =>
  state.financials;
