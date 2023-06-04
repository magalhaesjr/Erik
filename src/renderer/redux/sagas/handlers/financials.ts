import { call, put } from 'redux-saga/effects';
import { fetchFinancials, exportFinancials } from '../requests/financials';
import {
  FinancialExport,
  TournamentFinancials,
  updateFinancials,
} from '../../financials';
import { notify } from '../../notifications';
import type { Notification } from '../../notifications';
import { FAILURE, SUCCESS } from '../../../../domain/validate';

export function* handleImportFinancials() {
  const financials: TournamentFinancials = yield call(fetchFinancials);

  // result of import
  const failure = financials === null;

  // Status msg
  const fetchResult: Notification = {
    status: failure ? 'error' : 'success',
    message: failure
      ? 'Failure importing financials'
      : 'Imported financial parameters',
  };

  // Notify user
  yield put(notify(fetchResult));

  // If success, update rules
  if (!failure) {
    yield put(updateFinancials(financials));
  }
}

export function* handleExportFinancials(action: FinancialExport) {
  const { financials } = action;
  const result: boolean = yield call(exportFinancials, financials);

  // Status msg
  const fetchResult: Notification = {
    status: result === FAILURE ? 'error' : 'success',
    message:
      result === FAILURE
        ? 'Failure exporting financials'
        : 'Exported financial parameters',
  };

  // Notify user
  yield put(notify(fetchResult));

  // If success, update rules
  if (result === SUCCESS) {
    yield put(updateFinancials(financials));
  }
}
