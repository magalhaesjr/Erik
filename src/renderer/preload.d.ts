import { TournamentFinancials } from './redux/financials';
import { Notification } from './redux/notifications';

declare global {
  interface Window {
    electron: {
      exportFinancials(): Promise<Notification>;
      importFile(): Promise<unknown>;
      importFinancials(): Promise<TournamentFinancials | null>;
      loadTournament(): Promise<unknown>;
      requestLoad(func: (...args: unknown[]) => void): void;
      requestSave(func: (...args: unknown[]) => void): void;
      requestFinancialExport(func: (...args: unknown[]) => void): void;
      requestFinancialImport(func: (...args: unknown[]) => void): void;
      saveTournament(tourney: unknown): void;
    };
  }
}

export {};
