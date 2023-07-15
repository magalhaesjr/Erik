import { takeLatest } from 'redux-saga/effects';
import { IMPORT_RULES, EXPORT_RULES } from '../rules';
import { handleImportRules, handleExportRules } from './handlers/rules';

export function* watchImportRules() {
  yield takeLatest(IMPORT_RULES, handleImportRules);
}

export function* watchExportRules() {
  yield takeLatest(EXPORT_RULES, handleExportRules);
}
