import { call, put } from 'redux-saga/effects';
import { fetchFinancials, exportFinancials } from '../requests/financials';
import {
  FinancialExport,
  TournamentFinancials,
  updateFinancials,
} from '../../financials';

export function* handleImportFinancials() {
  const financials: TournamentFinancials = yield call(fetchFinancials);

  // If success, update rules
  if (financials !== null) {
    yield put(updateFinancials(financials));
  }
}

export function* handleExportFinancials(action: FinancialExport) {
  const { financials } = action;
  yield call(exportFinancials, financials);
}
