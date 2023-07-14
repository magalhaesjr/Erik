import { all } from 'redux-saga/effects';
import {
  watchImportFinancials,
  watchExportFinancials,
} from './sagas/financials';
import {
  watchImportSheet,
  watchImportTournament,
  watchExportTournament,
} from './sagas/tournament';
import watchEntryChanges from './sagas/entries';
import watchPoolChanges from './sagas/pools';

export default function* rootSaga() {
  yield all([
    watchEntryChanges(),
    watchPoolChanges(),
    watchImportFinancials(),
    watchExportFinancials(),
    watchImportSheet(),
    watchImportTournament(),
    watchExportTournament(),
  ]);
}
