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

export default function* rootSaga() {
  yield all([
    watchEntryChanges(),
    watchImportFinancials(),
    watchExportFinancials(),
    watchImportSheet(),
    watchImportTournament(),
    watchExportTournament(),
  ]);
}
