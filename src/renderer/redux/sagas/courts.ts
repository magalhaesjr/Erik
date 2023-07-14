/**
 * Sagas for courts in the tournament
 */
import { takeEvery } from 'redux-saga/effects';
import { CourtActionChannel } from '../courts';
import handleCourtAction from './handlers/courts';

function* watchCourtChanges() {
  yield takeEvery(CourtActionChannel, handleCourtAction);
}

export default watchCourtChanges;
