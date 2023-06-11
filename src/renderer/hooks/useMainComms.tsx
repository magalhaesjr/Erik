/**
 * Custom hook for communicating with the main thread (i.e. NodeJs)
 *
 * @author Jeff Magalhaes
 */
import { useCallback, useEffect, useRef } from 'react';
import cloneDeep from 'lodash/cloneDeep';
import isEqual from 'lodash/isEqual';
import { useAppSelector, useAppDispatch } from '../redux/hooks';
import {
  exportTournament,
  importTournament,
  selectTournament,
} from '../redux/tournament';
import {
  importFinancials,
  exportFinancials,
  selectFinancials,
  TournamentFinancials,
} from '../redux/financials';
import Tournament from '../../domain/tournament';
import { notify, Notification } from '../redux/notifications';

const useMainComms = () => {
  const dispatch = useAppDispatch();
  const tournament = useAppSelector(selectTournament, isEqual);
  const financials = useAppSelector(selectFinancials, isEqual);

  // References for state, the window functions can only be called once
  const financialRef = useRef<TournamentFinancials>(financials);
  const tournamentRef = useRef<Tournament>(tournament);

  // Ensure the reference is always up to date
  useEffect(() => {
    financialRef.current = financials;
  }, [financials]);

  useEffect(() => {
    tournamentRef.current = tournament;
  }, [tournament]);

  /** Notifications */
  const publishNotification = useCallback(
    (notification: Notification) => {
      dispatch(notify(notification));
    },
    [dispatch]
  );

  /** Callbacks */

  /** Tournament I/O */
  const handleImportTournament = useCallback(() => {
    dispatch(importTournament());
  }, [dispatch]);

  const handleExportTournament = useCallback(() => {
    const outTournament = cloneDeep(tournamentRef.current);
    outTournament.financials = financialRef.current;

    dispatch(exportTournament(outTournament));
  }, [dispatch]);

  /** Financials I/O */
  const handleImportFinancials = useCallback(() => {
    dispatch(importFinancials());
  }, [dispatch]);

  const handleExportFinancials = useCallback(() => {
    dispatch(exportFinancials(cloneDeep(financialRef.current)));
  }, [dispatch]);

  // NOTE: These can only be called once
  useEffect(() => {
    window.electron.requestTournamentImport(handleImportTournament);
    window.electron.requestTournamentExport(handleExportTournament);
    window.electron.requestFinancialImport(handleImportFinancials);
    window.electron.requestFinancialExport(handleExportFinancials);
    window.electron.publishNotification(publishNotification);
  }, [
    publishNotification,
    handleImportTournament,
    handleExportTournament,
    handleImportFinancials,
    handleExportFinancials,
  ]);
};

export default useMainComms;
