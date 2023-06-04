import { TournamentFinancials } from '../../financials';

export const fetchFinancials =
  async (): Promise<TournamentFinancials | null> => {
    return window.electron.importFinancials();
  };

export const exportFinancials = async (
  financials: TournamentFinancials
): Promise<boolean> => {
  return window.electron.exportFinancials(financials);
};
