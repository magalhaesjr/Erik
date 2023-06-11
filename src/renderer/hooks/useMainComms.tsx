/**
 * Custom hook for communicating with the main thread (i.e. NodeJs)
 *
 * @author Jeff Magalhaes
 */
import { useCallback } from 'react';
import { useStore } from 'react-redux';
import isEqual from 'lodash/isEqual';
import { useAppSelector, useAppDispatch } from '../redux/hooks';
import { loadTournament } from '../redux/tournament';
import Tournament from '../../domain/tournament';
import {
  importFinancials,
  exportFinancials,
  selectFinancials,
} from '../redux/financials';
import { notify, Notification } from '../redux/notifications';

const useMainComms = () => {
  const store = useStore();
  const dispatch = useAppDispatch();

  /** Notifications */
  const publishNotification = useCallback(
    (notification: Notification) => {
      dispatch(notify(notification));
    },
    [dispatch]
  );
  window.electron.publishNotification(publishNotification);

  /** Tournament I/O */
  window.electron.requestSave(() => {
    window.electron.saveTournament(store.getState());
  });

  window.electron.requestLoad(() => {
    window.electron
      .loadTournament()
      .then((tourny: unknown) => {
        dispatch(loadTournament(tourny as Tournament));
        return 0;
      })
      .catch((errors: unknown) => {
        // eslint-disable-next-line no-console
        console.log(errors);
      });
  });

  /** Financials I/O */
  // For export
  const financials = useAppSelector(selectFinancials, isEqual);

  const handleImportFinancials = useCallback(() => {
    dispatch(importFinancials());
  }, [dispatch]);
  window.electron.requestFinancialImport(handleImportFinancials);

  const handleExportFinancials = useCallback(() => {
    dispatch(exportFinancials(financials));
  }, [dispatch, financials]);
  window.electron.requestFinancialExport(handleExportFinancials);
};

export default useMainComms;
