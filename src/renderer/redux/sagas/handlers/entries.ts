/**
 * Handles entries actions from the saga
 */
import { call, put, select } from 'redux-saga/effects';
import cloneDeep from 'lodash/cloneDeep';
import {
  entryActions,
  EntryPayload,
  EntryProps,
  TeamEntry,
  addEntry,
  modifyEntry,
  replaceAll,
  removeEntry,
  selectEntry,
  TournamentEntryIO,
} from '../../entries';
import { getTeamKey } from '../../../../domain/utility';
import { notifyError } from './notifications';
import { resetAllPools, resetPools } from '../../pools';

function* handleAddEntry(entry: TeamEntry) {
  // Adds a new entry to the tournament

  if (!entry.isWaitlisted) {
    // Invalidate any pools for division
    yield put(resetPools(entry.division));
  }

  // Push entry to entry slice
  yield put(addEntry(entry));
}

function* handleReplaceAll(tourney: TournamentEntryIO) {
  // Replaces all entries in a tournament

  // Invalidate all pools
  yield put(resetAllPools());
  // Push entry to entry slice
  yield put(replaceAll(tourney));
}

function* handleRemoveEntry(entry: TeamEntry) {
  // removes a new entry to the tournament

  if (!entry.isWaitlisted) {
    // Invalidate any pools for division
    yield put(resetPools(entry.division));
  }
  // Push entry to entry slice
  yield put(removeEntry(entry));
}

function* handleChangeDivision(entry: TeamEntry, props: EntryProps<unknown>) {
  // Changes the waitlist status of a team
  const { division } = props as EntryProps<string>;

  const newEntry = {
    ...cloneDeep(entry),
    division,
  };

  if (!entry.isWaitlisted) {
    // Invalidate any pools for both divisions
    yield put(resetPools(entry.division));
    yield put(resetPools(division));
  }

  // Remove previous entry, which is no longer in the division
  yield call(handleRemoveEntry, entry);

  // Push entry to entry slice (entry properties are still the same)
  yield put(addEntry(newEntry));
}

function* handleChangeWaitlist(entry: TeamEntry, props: EntryProps<unknown>) {
  // Changes the waitlist status of a team
  const { isWaitlisted } = props as EntryProps<boolean>;

  const newEntry = {
    ...cloneDeep(entry),
    isWaitlisted,
  };

  // Invalidate any pools for this division
  yield put(resetPools(newEntry.division));

  // Push entry to entry slice (entry properties are still the same)
  yield put(modifyEntry(newEntry));
}

function* handleModifyEntry(entry: TeamEntry, props: EntryProps<unknown>) {
  // Change an existing entry (could change distinguishing props)

  // Get previous id
  const { id } = props as EntryProps<string>;
  const prevEntry: TeamEntry | null = yield select(selectEntry, id);

  // If id is the same you can just replace
  if (id === getTeamKey(entry)) {
    // If the division has changed, you need to change the division as well
    if (prevEntry && entry.division !== prevEntry.division) {
      // This is a 2-step process
      // 1) update the existing entry
      const modEntry = { ...entry, division: prevEntry.division };
      yield put(modifyEntry(modEntry));

      // 2) Update the modified entries division
      yield call(handleChangeDivision, modEntry, { division: entry.division });
    } else {
      // Just modify the entry
      yield put(modifyEntry(entry));
    }
    return;
  }

  // Get previous entry
  if (prevEntry) {
    // Remove previous entry
    yield call(handleRemoveEntry, prevEntry);
  }

  // Add new entry (because it's a new key)
  yield call(handleAddEntry, entry);
}

function* handleUpdateEntry(updateMsg: EntryPayload) {
  // Take appropriate action based on action type
  const { action, entry, props } = updateMsg;

  try {
    switch (action) {
      case entryActions.add: {
        yield call(handleAddEntry, entry as TeamEntry);
        break;
      }
      case entryActions.changeDivision: {
        if (props) {
          yield call(handleChangeDivision, entry as TeamEntry, props);
        }
        break;
      }
      case entryActions.changeWaitlist: {
        if (props) {
          yield call(handleChangeWaitlist, entry as TeamEntry, props);
        }
        break;
      }
      case entryActions.modify: {
        if (props) {
          yield call(handleModifyEntry, entry as TeamEntry, props);
        }
        break;
      }
      case entryActions.replaceAll: {
        yield call(handleReplaceAll, entry as TournamentEntryIO);
        break;
      }
      case entryActions.remove: {
        yield call(handleRemoveEntry, entry as TeamEntry);
        break;
      }
      default:
        throw new Error(`Unknown entry action: ${action}`);
    }
  } catch (e) {
    yield call(notifyError, (e as Error).message);
  }
}
export default handleUpdateEntry;
