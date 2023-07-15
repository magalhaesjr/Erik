import { contextBridge, ipcRenderer } from 'electron';
import { Tournament } from '../domain/tournament';
import type { TournamentFinancials } from '../renderer/redux/financials';
import type { Notification } from '../renderer/redux/notifications';
import { TournamentEntryIO } from '../renderer/redux/entries';
import { DivisionRules } from '../domain/rules';

contextBridge.exposeInMainWorld('electron', {
  importSheet: (): Promise<TournamentEntryIO | null> => {
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

  /** Rules */
  // Menu requesting functions
  requestRuleImport(func: (...args: unknown[]) => void) {
    ipcRenderer.on('tournament:requestRuleImport', (_event, ...args) =>
      func(...args)
    );
  },
  requestRuleExport(func: (...args: unknown[]) => void) {
    ipcRenderer.on('tournament:requestRuleExport', (_event, ...args) =>
      func(...args)
    );
  },
  // Import/Export
  importRules: (): Promise<DivisionRules | null> => {
    return ipcRenderer.invoke('tournament:importRules');
  },
  exportRules: (rules: DivisionRules): void => {
    ipcRenderer.invoke('tournament:exportRules', rules);
  },
});
