import { all } from 'redux-saga/effects';
import {
  watchImportFinancials,
  watchExportFinancials,
} from './sagas/financials';
import { watchImportRules, watchExportRules } from './sagas/rules';
import {
  watchImportSheet,
  watchImportTournament,
  watchExportTournament,
} from './sagas/tournament';
import watchEntryChanges from './sagas/entries';
import watchCourtChanges from './sagas/courts';
import watchPoolChanges from './sagas/pools';

export default function* rootSaga() {
  yield all([
    watchEntryChanges(),
    watchCourtChanges(),
    watchPoolChanges(),
    watchImportFinancials(),
    watchExportFinancials(),
    watchImportRules(),
    watchExportRules(),
    watchImportSheet(),
    watchImportTournament(),
    watchExportTournament(),
  ]);
}
