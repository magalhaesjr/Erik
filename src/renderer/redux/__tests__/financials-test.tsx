/**
 * Implements unit tests for financial slice
 */
import { act, waitFor } from '@testing-library/react';
import renderWithProviders from '../../../test-utils';
import {
  TournamentFinancials,
  selectFinancials,
  updateFinancials,
} from '../financials';

// Mock data
const mockFinancials: TournamentFinancials = {
  prepaidCost: 50,
  walkOnCost: 60,
  payoutDivisions: {
    saturday: [
      { main: "Men's Open", sub: "Men's AA" },
      { main: "Women's Open", sub: "Women's AA" },
    ],
    sunday: [{ main: "Coed 2's Open", sub: "Coed 2's AA" }],
  },
  payoutParams: {
    prizePool: 35,
    saturday: {
      main: {
        '1st': 0.54,
        '2nd': 0.1,
        '3rd': 0.13,
      },
      sub: {
        '1st': 0.12,
        '2nd': 0.08,
      },
    },
    sunday: {
      main: {
        '1st': 0.34,
        '2nd': 0.2,
        '3rd': 0.13,
      },
    },
  },
};

test('selectFinancials recovers financial slice', async () => {
  const { store } = renderWithProviders(<div />);

  await waitFor(() =>
    expect(selectFinancials(store.getState())).toEqual(
      store.getState().financials
    )
  );
});

test('updateFinancials updates store', async () => {
  const { store } = renderWithProviders(<div />);

  // Update the store
  act(() => {
    store.dispatch(updateFinancials(mockFinancials));
  });

  // Verify that the state was updated
  await waitFor(() => {
    expect(store.getState().financials).toEqual(mockFinancials);
  });
});
