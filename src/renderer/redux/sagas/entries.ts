/**
 * Sagas for entries in the tournament
 */
import { takeEvery } from 'redux-saga/effects';
import { EntryActionChannel } from '../entries';
import handleUpdateEntry from './handlers/entries';

function* watchEntryChanges() {
  yield takeEvery(EntryActionChannel, handleUpdateEntry);
}

export default watchEntryChanges;
