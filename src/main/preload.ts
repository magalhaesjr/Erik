import { contextBridge, ipcRenderer } from 'electron';
import Tournament from '../domain/tournament';
import type { TournamentFinancials } from '../renderer/redux/financials';
import type { Notification } from '../renderer/redux/notifications';

contextBridge.exposeInMainWorld('electron', {
  importSheet: (): Promise<Tournament | null> => {
    return ipcRenderer.invoke('tournament:importSheet');
  },
  importTournament: () => {
    return ipcRenderer.invoke('tournament:importTournament');
  },
  requestTournamentExport(func: (...args: unknown[]) => void) {
    ipcRenderer.on('tournament:requestTournamentExport', (_event, ...args) =>
      func(...args)
    );
  },
  requestTournamentImport(func: (...args: unknown[]) => void) {
    ipcRenderer.on('tournament:requestTournamentImport', (_event, ...args) =>
      func(...args)
    );
  },
  exportTournament: (tourney: Tournament) => {
    ipcRenderer.invoke('tournament:exportTournament', tourney);
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
