/* eslint-disable no-console */
/**
 * Defines redux slice for tournament entries for each division
 */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import cloneDeep from 'lodash/cloneDeep';
import orderBy from 'lodash/orderBy';
import type { RootState } from './store';
import { getDivisionKey, getTeamKey } from '../../domain/utility';
import type { PlayerName } from '../../domain/player';

/** Types */
export type OptionalPlayerProps = {
  membershipValid?: boolean;
  avpMembership?: number;
  paid?: boolean;
  staff?: boolean;
};

export type Player = {
  name: PlayerName;
  ranking: number;
} & OptionalPlayerProps;

export type TeamEntry = {
  ranking: number;
  division: string;
  players: Player[];
  registrationTime: number;
  isWaitlisted: boolean;
  paid: boolean;
};

// Payload to modify an existing entry
export type ModifyEntry = {
  id: string;
  entry: TeamEntry;
};

export type DivisionEntries = {
  [key: string]: TeamEntry;
};

export type TournamentEntries = {
  [key: string]: DivisionEntries;
};

export type WaitlistChange = {
  entry: TeamEntry;
  waitList: boolean;
};

export type TournamentEntryIO = {
  [key: string]: TeamEntry[];
};

/** Sagas */
export const entryActions = {
  add: 'ADD_NEW_ENTRY',
  changeDivision: 'CHANGE_ENTRY_DIVISION',
  changeWaitlist: 'CHANGE_ENTRY_WAITLIST_STATUS',
  modify: 'MODIFY_ENTRY',
  replaceAll: 'REPLACE_ALL_ENTRIES',
  remove: 'REMOVE_ENTRY',
};

export type EntryProps<T> = {
  [key: string]: T;
};

export type EntryActions = keyof typeof entryActions;
export const EntryActionChannel = 'ENTRY_ACTIONS';
export type EntryPayload = {
  type: string;
  action: string;
  entry: unknown;
  props?: EntryProps<unknown>;
};

export const updateEntries = (
  action: EntryActions,
  entry: unknown,
  props?: EntryProps<unknown>
): EntryPayload => ({
  type: EntryActionChannel,
  action: entryActions[action],
  entry,
  props,
});

/** Static functions */
export const isDivision = (entries: TournamentEntries, division: string) =>
  Object.keys(entries).includes(division);

const isEntry = (entries: DivisionEntries, entry: string) =>
  Object.keys(entries).includes(entry);

const updateRanking = (entry: TeamEntry) => {
  entry.ranking = 0;
  // Retotal the team ranking points from the players
  entry.players.forEach((p) => {
    entry.ranking += p.ranking;
  });

  return entry;
};

const extractEntryProps = (entry: TeamEntry) => {
  return {
    entry: updateRanking(cloneDeep(entry)),
    divKey: getDivisionKey(entry.division),
    teamKey: getTeamKey(entry),
  };
};

/** Slice Defintion */
const initialState: TournamentEntries = {};

export const entrySlice = createSlice({
  name: 'entries',
  initialState,
  reducers: {
    addEntry: (state, action: PayloadAction<TeamEntry>) => {
      const { entry, divKey, teamKey } = extractEntryProps(action.payload);

      // If no division yet, create it
      if (divKey && !isDivision(state, divKey)) {
        state[divKey] = {};
      }

      // Check if entry already exists
      if (isEntry(state[divKey], teamKey)) {
        throw new Error(
          'This entry already exists, use modify entry to change'
        );
      }

      state[divKey][teamKey] = cloneDeep(entry);
    },
    importEntries: (_, action: PayloadAction<TournamentEntries>) => {
      return action.payload;
    },
    modifyEntry: (state, action: PayloadAction<TeamEntry>) => {
      const { entry, divKey, teamKey } = extractEntryProps(action.payload);

      if (isDivision(state, divKey)) {
        if (isEntry(state[divKey], teamKey)) {
          state[divKey][teamKey] = entry;
        } else {
          throw new Error("Can't find entry to modify");
        }
      } else {
        throw new Error(`No division ${entry.division} entries`);
      }
    },
    replaceAll: (_, action: PayloadAction<TournamentEntryIO>) => {
      // Replace the entire state
      const newState = cloneDeep(initialState);

      // Cycle through each division
      Object.entries(action.payload).forEach(([division, entries]) => {
        const divKey = getDivisionKey(division);
        // Initialize division
        newState[divKey] = {};

        // Cycle through entries and add them
        entries.forEach((divEntry) => {
          const { entry, teamKey } = extractEntryProps(divEntry);
          newState[divKey][teamKey] = entry;
        });
      });

      return newState;
    },
    removeEntry: (state, action: PayloadAction<TeamEntry>) => {
      const { entry, divKey, teamKey } = extractEntryProps(action.payload);

      if (isDivision(state, divKey)) {
        if (isEntry(state[divKey], teamKey)) {
          delete state[divKey][teamKey];
        } else {
          throw new Error("Can't find entry to remove");
        }
      } else {
        throw new Error(`No division ${entry.division} entries`);
      }
    },
  },
});

export const { addEntry, importEntries, modifyEntry, removeEntry, replaceAll } =
  entrySlice.actions;
export default entrySlice.reducer;

/** Selectors */
export const selectDivisions = (state: RootState) => Object.keys(state.entries);
export const selectEntries = (state: RootState) => state.entries;

export const selectDivisionEntries = (
  state: RootState,
  division: string
): TeamEntry[] => {
  if (division.length === 0) {
    return [];
  }

  const divKey = getDivisionKey(division);

  if (isDivision(state.entries, divKey)) {
    const entries = Object.values(state.entries[divKey]).filter(
      (e) => !e.isWaitlisted
    );
    return orderBy(entries, ['ranking'], ['desc']) as TeamEntry[];
  }
  return [];
};

export const selectEntry = (state: RootState, id: string): TeamEntry | null => {
  // Search for entry in each division
  let entry = null;

  Object.values(state.entries).forEach((div) => {
    Object.entries(div).forEach(([k, v]) => {
      if (k === id) {
        entry = v;
      }
    });
  });

  return entry;
};

export const selectDivisionWaitlist = (
  state: RootState,
  division: string
): TeamEntry[] => {
  if (division.length === 0) {
    return [];
  }

  const divKey = getDivisionKey(division);

  if (isDivision(state.entries, divKey)) {
    const entries = Object.values(state.entries[divKey]).filter(
      (e) => e.isWaitlisted
    );
    return orderBy(entries, ['registrationTime']);
  }
  return [];
};
