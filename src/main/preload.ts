import { contextBridge, ipcRenderer } from 'electron';
import Tournament from '../domain/tournament';
import type { TournamentFinancials } from '../renderer/redux/financials';
import type { Notification } from '../renderer/redux/notifications';

contextBridge.exposeInMainWorld('electron', {
  importFile: (): Promise<Tournament | null> => {
    return ipcRenderer.invoke('tournament:importFile');
  },
  loadTournament: () => {
    return ipcRenderer.invoke('tournament:loadTournament');
  },
  requestSave(func: (...args: unknown[]) => void) {
    ipcRenderer.on('tournament:requestSave', (_event, ...args) =>
      func(...args)
    );
  },
  requestLoad(func: (...args: unknown[]) => void) {
    ipcRenderer.on('tournament:requestLoad', (_event, ...args) =>
      func(...args)
    );
  },
  saveTournament: (tourney: unknown) => {
    ipcRenderer.invoke('tournament:saveTournament', tourney);
  },

  /** Notifications */
  publishNotification(func: (notification: Notification) => void) {
    ipcRenderer.on('tournament:publishNotification', (_event, notification) =>
      func(notification)
    );
  },

  /** Financials */
  // Menu requesting functions
  requestFinancialImport(func: (...args: unknown[]) => void) {
    ipcRenderer.on('tournament:requestFinancialImport', (_event, ...args) =>
      func(...args)
    );
  },
  requestFinancialExport(func: (...args: unknown[]) => void) {
    ipcRenderer.on('tournament:requestFinancialExport', (_event, ...args) =>
      func(...args)
    );
  },
  // Import/Export
  importFinancials: (): Promise<TournamentFinancials | null> => {
    return ipcRenderer.invoke('tournament:importFinancials');
  },
  exportFinancials: (financials: TournamentFinancials): void => {
    ipcRenderer.invoke('tournament:exportFinancials', financials);
  },
});
