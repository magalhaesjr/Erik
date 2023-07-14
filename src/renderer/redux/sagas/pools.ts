/**
 * Sagas for pools in the tournament
 */
import { takeEvery } from 'redux-saga/effects';
import { PoolActionChannel } from '../pools';
import handlePoolAction from './handlers/pools';

function* watchPoolChanges() {
  yield takeEvery(PoolActionChannel, handlePoolAction);
}

export default watchPoolChanges;
