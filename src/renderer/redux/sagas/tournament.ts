import { takeLatest } from 'redux-saga/effects';
import { TournamentActions } from '../tournament';
import {
  handleImportTournament,
  handleImportSheet,
  handleExportTournament,
} from './handlers/tournament';

export function* watchImportTournament() {
  yield takeLatest(TournamentActions.importTournament, handleImportTournament);
}

export function* watchImportSheet() {
  yield takeLatest(TournamentActions.importSheet, handleImportSheet);
}

export function* watchExportTournament() {
  yield takeLatest(TournamentActions.exportTournament, handleExportTournament);
}
