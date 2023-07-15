import { call, put, select } from 'redux-saga/effects';
import {
  fetchTournament,
  fetchEntrySheet,
  exportTournament,
} from '../requests/tournament';
import { Tournament } from '../../../../domain/tournament';
import {
  updateFinancials,
  TournamentFinancials,
  selectFinancials,
} from '../../financials';
import {
  TournamentEntries,
  TournamentEntryIO,
  importEntries,
  selectEntries,
  updateEntries,
} from '../../entries';
import { TournamentPools, importPools, selectPools } from '../../pools';
import { importCourts, selectCourts } from '../../courts';
import { importRules, selectRules } from '../../rules';
import { Court } from '../../../../domain/court';
import { DivisionRules } from '../../../../domain/rules';

export function* handleImportTournament() {
  const tournament: Tournament = yield call(fetchTournament);

  // If success, update all the slices with the data
  if (tournament !== null) {
    yield put(importEntries(tournament.entries));
    yield put(
      updateFinancials(tournament.financials as Partial<TournamentFinancials>)
    );
    yield put(importPools(tournament.pools));
    yield put(importCourts(tournament.courts));
    yield put(importRules(tournament.rules));
  }
}

export function* handleImportSheet() {
  const tournament: TournamentEntryIO | null = yield call(fetchEntrySheet);

  // If success, update rules
  if (tournament !== null) {
    yield put(updateEntries('replaceAll', tournament));
  }
}

export function* handleExportTournament() {
  // Select all the slices to save
  const entries: TournamentEntries = yield select(selectEntries);
  const pools: TournamentPools = yield select(selectPools);
  const courts: Court[] = yield select(selectCourts);
  const financials: TournamentFinancials = yield select(selectFinancials);
  const rules: DivisionRules = yield select(selectRules);

  const tournament: Tournament = {
    courts,
    entries,
    financials,
    pools,
    rules,
  };

  yield call(exportTournament, tournament);
}
