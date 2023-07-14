/**
 * Handles pool actions from the saga
 */
import { call, put, select } from 'redux-saga/effects';
import { resetPools } from '../../pools';
import { notifyError } from './notifications';
import {
  ChangeDivisionPayload,
  ChangeHeightPayload,
  CourtPayload,
  courtActions,
  changeDivision,
  changeHeight,
  selectCourt,
} from '../../courts';
import { Court } from '../../../../domain/court';

function* handleChangeDivision(payload: ChangeDivisionPayload) {
  // Retrieve current division of pool
  const court: Court = yield select(selectCourt, payload.court);

  // Reset pools of previous division
  yield put(resetPools(court.division));

  // Change court
  yield put(changeDivision(payload));
}

function* handleChangeHeight(payload: ChangeHeightPayload) {
  // Change court
  yield put(changeHeight(payload));
}

function* handleCourtAction(updateMsg: CourtPayload) {
  // Take appropriate action based on action type
  const { action, props } = updateMsg;

  try {
    switch (action) {
      case courtActions.changeDivision: {
        yield call(handleChangeDivision, props as ChangeDivisionPayload);
        break;
      }
      case courtActions.changeHeight: {
        yield call(handleChangeHeight, props as ChangeHeightPayload);
        break;
      }
      default:
        throw new Error(`Unknown pool action: ${action}`);
    }
  } catch (e) {
    yield call(notifyError, (e as Error).message);
  }
}
export default handleCourtAction;
