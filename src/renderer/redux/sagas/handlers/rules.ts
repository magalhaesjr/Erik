import { call, put } from 'redux-saga/effects';
import { fetchRules, exportRules } from '../requests/rules';
import { DivisionRules } from '../../../../domain/rules';
import { RuleExport, importRules } from '../../rules';

export function* handleImportRules() {
  const rules: DivisionRules = yield call(fetchRules);

  // If success, update rules
  if (rules !== null) {
    yield put(importRules(rules));
  }
}

export function* handleExportRules(action: RuleExport) {
  const { rules } = action;
  yield call(exportRules, rules);
}
