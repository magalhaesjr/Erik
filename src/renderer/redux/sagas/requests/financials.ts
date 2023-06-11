import { TournamentFinancials } from '../../financials';

export const fetchFinancials =
  async (): Promise<TournamentFinancials | null> => {
    return window.electron.importFinancials();
  };

export const exportFinancials = async (financials: TournamentFinancials) => {
  window.electron.exportFinancials(financials);
};
