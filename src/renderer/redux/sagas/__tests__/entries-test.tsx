/**
 * Implements unit tests for entries slice
 */
import { act, waitFor, cleanup } from '@testing-library/react';
import cloneDeep from 'lodash/cloneDeep';
import { createPlayer } from '../../../../domain/player';
import { getDivisionKey, getTeamKey } from '../../../../domain/utility';
import renderWithProviders from '../../../../test-utils';
import {
  TeamEntry,
  selectDivisionEntries,
  selectDivisionWaitlist,
  updateEntries,
} from '../../entries';

type MockEntry = {
  [key: string]: TeamEntry;
};

const div1 = "Men's Open";
const div2 = "Men's AA";

// Mock data
const mockEntries: MockEntry = {
  team_1: {
    ranking: 1000,
    players: [
      createPlayer('test', 'last', 600),
      createPlayer('first', 'last', 400),
    ],
    division: div1,
    isWaitlisted: false,
    registrationTime: 1,
    paid: false,
  },
  team_2: {
    ranking: 800,
    players: [
      createPlayer('test_2', 'last', 400),
      createPlayer('first2', 'last', 400),
    ],
    division: div1,
    isWaitlisted: false,
    registrationTime: 1,
    paid: true,
  },
  wait_1: {
    ranking: 800,
    players: [
      createPlayer('wait_first', 'last', 400),
      createPlayer('wait_first2', 'last', 400),
    ],
    division: div1,
    isWaitlisted: true,
    registrationTime: 100,
    paid: false,
  },
  wait_2: {
    ranking: 800,
    players: [
      createPlayer('wait2_first', 'last', 400),
      createPlayer('wait2_first2', 'last', 400),
    ],
    division: div1,
    isWaitlisted: true,
    registrationTime: 1,
    paid: false,
  },
  team_3: {
    ranking: 400,
    players: [
      createPlayer('test_3', 'last', 0),
      createPlayer('first3', 'last', 400),
    ],
    division: div2,
    isWaitlisted: false,
    registrationTime: 1,
    paid: false,
  },
};

describe('update saga', () => {
  afterEach(() => {
    cleanup();
  });
  test('adds new entry', async () => {
    const { store } = renderWithProviders(<div />);

    // Update the store
    act(() => {
      store.dispatch(updateEntries('add', mockEntries.team_1));
      store.dispatch(updateEntries('add', mockEntries.team_3));
    });

    // Verify that the state was updated
    await waitFor(() => {
      expect(store.getState().entries).toEqual(
        expect.objectContaining({
          [getDivisionKey(mockEntries.team_1.division)]: {
            [getTeamKey(mockEntries.team_1)]: mockEntries.team_1,
          },
          [getDivisionKey(mockEntries.team_3.division)]: {
            [getTeamKey(mockEntries.team_3)]: mockEntries.team_3,
          },
        })
      );
    });
  });

  test('changes waitlist status', async () => {
    const { store } = renderWithProviders(<div />);

    // Add to the store
    act(() => {
      store.dispatch(updateEntries('add', mockEntries.team_1));
      store.dispatch(updateEntries('add', mockEntries.team_2));
      store.dispatch(updateEntries('add', mockEntries.wait_1));
    });

    // Store is predictable state
    await waitFor(() => {
      expect(selectDivisionEntries(store.getState(), div1)).toEqual([
        mockEntries.team_1,
        mockEntries.team_2,
      ]);
    });
    await waitFor(() => {
      expect(selectDivisionWaitlist(store.getState(), div1)).toEqual([
        mockEntries.wait_1,
      ]);
    });

    // Change waitlist
    act(() => {
      store.dispatch(
        updateEntries('changeWaitlist', mockEntries.team_1, {
          isWaitlisted: true,
        })
      );
      store.dispatch(
        updateEntries('changeWaitlist', mockEntries.wait_1, {
          isWaitlisted: false,
        })
      );
    });

    // Store is predictable state
    await waitFor(() => {
      expect(selectDivisionEntries(store.getState(), div1)).toStrictEqual([
        mockEntries.team_2,
        { ...mockEntries.wait_1, isWaitlisted: false },
      ]);
    });
    await waitFor(() => {
      expect(selectDivisionWaitlist(store.getState(), div1)).toStrictEqual([
        { ...mockEntries.team_1, isWaitlisted: true },
      ]);
    });
  });

  test('changes division', async () => {
    const { store } = renderWithProviders(<div />);

    // Add to the store
    act(() => {
      store.dispatch(updateEntries('add', mockEntries.team_1));
      store.dispatch(updateEntries('add', mockEntries.team_2));
      store.dispatch(updateEntries('add', mockEntries.team_3));
    });

    // Store is predictable state
    await waitFor(() => {
      expect(selectDivisionEntries(store.getState(), div1)).toEqual([
        mockEntries.team_1,
        mockEntries.team_2,
      ]);
    });
    await waitFor(() => {
      expect(selectDivisionEntries(store.getState(), div2)).toEqual([
        mockEntries.team_3,
      ]);
    });

    // Change division
    act(() => {
      store.dispatch(
        updateEntries('changeDivision', mockEntries.team_1, {
          division: div2,
        })
      );
    });

    // Store is predictable state
    await waitFor(() => {
      expect(selectDivisionEntries(store.getState(), div1)).toStrictEqual([
        mockEntries.team_2,
      ]);
    });
    await waitFor(() => {
      expect(selectDivisionEntries(store.getState(), div2)).toStrictEqual([
        { ...mockEntries.team_1, division: div2 },
        mockEntries.team_3,
      ]);
    });
  });

  test('modifies entry', async () => {
    const { store } = renderWithProviders(<div />);

    // Add to the store
    act(() => {
      store.dispatch(updateEntries('add', mockEntries.team_1));
      store.dispatch(updateEntries('add', mockEntries.team_2));
    });

    // Store is predictable state
    await waitFor(() => {
      expect(selectDivisionEntries(store.getState(), div1)).toEqual([
        mockEntries.team_1,
        mockEntries.team_2,
      ]);
    });

    // Get previous id
    const id = getTeamKey(mockEntries.team_1);
    // Change entry
    const newTeam1 = cloneDeep(mockEntries.team_1);
    newTeam1.players[0].ranking = 0;

    // Change entry
    act(() => {
      store.dispatch(
        updateEntries('modify', newTeam1, {
          id,
        })
      );
    });

    // The team ranking should have been updated
    newTeam1.ranking =
      newTeam1.players[0].ranking + newTeam1.players[1].ranking;

    // Store is predictable state
    await waitFor(() => {
      expect(selectDivisionEntries(store.getState(), div1)).toEqual([
        mockEntries.team_2,
        newTeam1,
      ]);
    });

    // Change entry
    const newPlayer = cloneDeep(newTeam1);
    newPlayer.players[0] = createPlayer('new', 'guy', 0);

    // Change entry
    act(() => {
      store.dispatch(
        updateEntries('modify', newPlayer, {
          id,
        })
      );
    });

    // Store is predictable state
    await waitFor(() => {
      expect(selectDivisionEntries(store.getState(), div1)).toEqual([
        mockEntries.team_2,
        newPlayer,
      ]);
    });
  });

  test('removes entry', async () => {
    const { store } = renderWithProviders(<div />);

    // Add to the store
    act(() => {
      store.dispatch(updateEntries('add', mockEntries.team_1));
      store.dispatch(updateEntries('add', mockEntries.team_2));
    });

    // remove 1 entry
    act(() => {
      store.dispatch(updateEntries('remove', mockEntries.team_1));
    });

    // Verify that the entry is no longer in the store
    await waitFor(() => {
      expect(store.getState().entries).toEqual(
        expect.objectContaining({
          [getDivisionKey(mockEntries.team_1.division)]: {
            [getTeamKey(mockEntries.team_2)]: mockEntries.team_2,
          },
        })
      );
    });
  });
});
