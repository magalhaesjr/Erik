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

export default function* rootSaga() {
  yield all([
    watchImportFinancials(),
    watchExportFinancials(),
    watchImportSheet(),
    watchImportTournament(),
    watchExportTournament(),
  ]);
}
