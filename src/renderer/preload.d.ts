import { DivisionRules } from '../domain/rules';
import { Tournament } from '../domain/tournament';
import { TournamentEntryIO } from './redux/entries';
import { TournamentFinancials } from './redux/financials';
import { Notification } from './redux/notifications';

declare global {
  interface Window {
    electron: {
      exportFinancials(financials: TournamentFinancials): void;
      exportRules(rules: DivisionRules): void;
      importSheet(): Promise<TournamentEntryIO | null>;
      importFinancials(): Promise<TournamentFinancials | null>;
      importRules(): Promise<DivisionRules | null>;
      importTournament(): Promise<Tournament | null>;
      exportTournament(tourney: Tournament): void;
      publishNotification(func: (notification: Notification) => void): void;
      requestTournamentImport(func: (...args: unknown[]) => void): void;
      requestTournamentExport(func: (...args: unknown[]) => void): void;
      requestFinancialExport(func: (...args: unknown[]) => void): void;
      requestFinancialImport(func: (...args: unknown[]) => void): void;
      requestRuleExport(func: (...args: unknown[]) => void): void;
      requestRuleImport(func: (...args: unknown[]) => void): void;
    };
  }
}

export {};
