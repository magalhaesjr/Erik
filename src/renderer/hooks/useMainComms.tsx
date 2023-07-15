/**
 * Custom hook for communicating with the main thread (i.e. NodeJs)
 *
 * @author Jeff Magalhaes
 */
import { useCallback, useEffect, useRef } from 'react';
import cloneDeep from 'lodash/cloneDeep';
import isEqual from 'lodash/isEqual';
import { useAppSelector, useAppDispatch } from '../redux/hooks';
import { exportTournament, importTournament } from '../redux/tournament';
import {
  importFinancials,
  exportFinancials,
  selectFinancials,
  TournamentFinancials,
} from '../redux/financials';
import { notify, Notification } from '../redux/notifications';
import { requestImportRules, exportRules, selectRules } from '../redux/rules';
import { DivisionRules } from '../../domain/rules';

const useMainComms = () => {
  const dispatch = useAppDispatch();
  const rules = useAppSelector(selectRules, isEqual);
  const financials = useAppSelector(selectFinancials, isEqual);

  // References for state, the window functions can only be called once
  const financialRef = useRef<TournamentFinancials>(financials);
  const ruleRef = useRef<DivisionRules>(rules);

  // Ensure the reference is always up to date
  useEffect(() => {
    financialRef.current = financials;
  }, [financials]);

  useEffect(() => {
    ruleRef.current = rules;
  }, [rules]);

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
    dispatch(exportTournament());
  }, [dispatch]);

  /** Financials I/O */
  const handleImportFinancials = useCallback(() => {
    dispatch(importFinancials());
  }, [dispatch]);

  const handleExportFinancials = useCallback(() => {
    dispatch(exportFinancials(cloneDeep(financialRef.current)));
  }, [dispatch]);

  /** Rules I/O */
  const handleImportRules = useCallback(() => {
    dispatch(requestImportRules());
  }, [dispatch]);

  const handleExportRules = useCallback(() => {
    dispatch(exportRules(cloneDeep(ruleRef.current)));
  }, [dispatch]);

  // NOTE: These can only be called once
  useEffect(() => {
    window.electron.requestTournamentImport(handleImportTournament);
    window.electron.requestTournamentExport(handleExportTournament);
    window.electron.requestFinancialImport(handleImportFinancials);
    window.electron.requestFinancialExport(handleExportFinancials);
    window.electron.requestRuleImport(handleImportRules);
    window.electron.requestRuleExport(handleExportRules);
    window.electron.publishNotification(publishNotification);
  }, [
    publishNotification,
    handleImportTournament,
    handleExportTournament,
    handleImportFinancials,
    handleExportFinancials,
    handleImportRules,
    handleExportRules,
  ]);
};

export default useMainComms;
