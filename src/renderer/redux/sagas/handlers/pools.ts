/**
 * Handles pool actions from the saga
 */
import { call, put, select } from 'redux-saga/effects';
import {
  Pool,
  PoolPayload,
  PoolProps,
  poolActions,
  resetPools,
  setDivisionPools,
  updatePoolFormat,
  updatePoolCourt,
} from '../../pools';
// import { getDivisionKey } from '../../../../domain/utility';
import { notifyError } from './notifications';
import { selectDivisionCourts } from '../../courts';
import { TeamEntry, selectDivisionEntries } from '../../entries';
import { selectDivisionRules } from '../../rules';
import type { DivisionFormat } from '../../../../domain/rules';
import { Court } from '../../../../domain/court';
import { createPools } from '../../../../domain/pool';

function* handleGeneratePools({ division }: PoolProps<string>) {
  //
  yield put(resetPools(division));

  // Pull required info for this division
  const courts: Court[] = yield select(selectDivisionCourts, division);
  const entries: TeamEntry[] = yield select(selectDivisionEntries, division);
  const rules: DivisionFormat = yield select(selectDivisionRules, division);

  // Generate pools
  const pools = createPools(courts, entries, rules);

  // Assign pools
  yield put(setDivisionPools({ division, pools }));
}

function* handleUpdateFormat({ pool }: PoolProps<Pool>) {
  yield put(updatePoolFormat(pool));
}

function* handleUpdateCourt({ pool }: PoolProps<Pool>) {
  yield put(updatePoolCourt(pool));
}

function* handlePoolAction(updateMsg: PoolPayload) {
  // Take appropriate action based on action type
  const { action, props } = updateMsg;

  try {
    switch (action) {
      case poolActions.generatePools: {
        yield call(handleGeneratePools, props as PoolProps<string>);
        break;
      }
      case poolActions.updateCourt: {
        yield call(handleUpdateCourt, props as PoolProps<Pool>);
        break;
      }
      case poolActions.updateFormat: {
        yield call(handleUpdateFormat, props as PoolProps<Pool>);
        break;
      }
      default:
        throw new Error(`Unknown pool action: ${action}`);
    }
  } catch (e) {
    yield call(notifyError, (e as Error).message);
  }
}
export default handlePoolAction;
