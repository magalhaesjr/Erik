import { call, put } from 'redux-saga/effects';
import { fetchFinancials, exportFinancials } from '../requests/financials';
import {
  FinancialExport,
  TournamentFinancials,
  updateFinancials,
} from '../../financials';
import { notify } from '../../notifications';
import type { Notification } from '../../notifications';

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
  const failure: boolean = yield call(exportFinancials, financials);

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
