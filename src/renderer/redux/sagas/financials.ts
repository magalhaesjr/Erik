import { takeLatest } from 'redux-saga/effects';
import { IMPORT_FINANCIALS, EXPORT_FINANCIALS } from '../financials';
import {
  handleImportFinancials,
  handleExportFinancials,
} from './handlers/financials';

export function* watchImportFinancials() {
  yield takeLatest(IMPORT_FINANCIALS, handleImportFinancials);
}

export function* watchExportFinancials() {
  yield takeLatest(EXPORT_FINANCIALS, handleExportFinancials);
}
