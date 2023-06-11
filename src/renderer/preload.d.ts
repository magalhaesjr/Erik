import Tournament from '../domain/tournament';
import { TournamentFinancials } from './redux/financials';
import { Notification } from './redux/notifications';

declare global {
  interface Window {
    electron: {
      exportFinancials(financials: TournamentFinancials): void;
      importSheet(): Promise<Tournament | null>;
      importFinancials(): Promise<TournamentFinancials | null>;
      importTournament(): Promise<Tournament | null>;
      exportTournament(tourney: Tournament): void;
      publishNotification(func: (notification: Notification) => void): void;
      requestTournamentImport(func: (...args: unknown[]) => void): void;
      requestTournamentExport(func: (...args: unknown[]) => void): void;
      requestFinancialExport(func: (...args: unknown[]) => void): void;
      requestFinancialImport(func: (...args: unknown[]) => void): void;
    };
  }
}

export {};
