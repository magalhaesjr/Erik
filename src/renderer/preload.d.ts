import Tournament from '../domain/tournament';

declare global {
  interface Window {
    electron: {
      importFile(): Promise<unknown>;
      loadTournament(): Promise<unknown>;
      requestLoad(func: (...args: unknown[]) => void): void;
      requestSave(func: (...args: unknown[]) => void): void;
      saveTournament(tourney: unknown): void;
    };
  }
}

export {};
