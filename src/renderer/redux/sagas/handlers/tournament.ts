import { call, put } from 'redux-saga/effects';
import {
  fetchTournament,
  fetchEntrySheet,
  exportTournament,
} from '../requests/tournament';
import Tournament from '../../../../domain/tournament';
import { loadTournament, TournamentExport } from '../../tournament';
import { updateFinancials, TournamentFinancials } from '../../financials';
import { TournamentEntryIO, updateEntries } from '../../entries';

export function* handleImportTournament() {
  const tournament: Tournament = yield call(fetchTournament);

  // If success, update rules
  if (tournament !== null) {
    yield put(loadTournament(tournament));

    // Load financials
    yield put(
      updateFinancials(tournament.financials as Partial<TournamentFinancials>)
    );
  }
}

export function* handleImportSheet() {
  const tournament: TournamentEntryIO | null = yield call(fetchEntrySheet);

  // If success, update rules
  if (tournament !== null) {
    yield put(updateEntries('replaceAll', tournament));
  }
}

export function* handleExportTournament(action: TournamentExport) {
  const { tournament } = action;
  yield call(exportTournament, tournament);
}
