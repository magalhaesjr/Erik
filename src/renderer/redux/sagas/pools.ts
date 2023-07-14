/**
 * Sagas for pools in the tournament
 */
import { takeEvery } from 'redux-saga/effects';
import { PoolActionChannel } from '../pools';
import handlePoolAction from './handlers/pools';

function* watchEntryChanges() {
  yield takeEvery(PoolActionChannel, handlePoolAction);
}

export default watchEntryChanges;
