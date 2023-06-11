import Tournament from '../../../../domain/tournament';

export const fetchTournament = async (): Promise<Tournament | null> => {
  return window.electron.importTournament();
};

export const fetchEntrySheet = async (): Promise<Tournament | null> => {
  return window.electron.importSheet();
};

export const exportTournament = async (tournament: Tournament) => {
  window.electron.exportTournament(tournament);
};
