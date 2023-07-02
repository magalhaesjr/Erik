/**
 * Implements unit tests for entries slice
 */
import { act, waitFor } from '@testing-library/react';
import cloneDeep from 'lodash/cloneDeep';
import { createPlayer } from '../../../domain/player';
import { getDivisionKey, getTeamKey } from '../../../domain/utility';
import renderWithProviders from '../../../test-utils';
import {
  TeamEntry,
  addEntry,
  modifyEntry,
  removeEntry,
  replaceAll,
  selectDivisionEntries,
  selectDivisionWaitlist,
  selectEntry,
} from '../entries';

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
    paid: true,
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
    paid: false,
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

describe('reducer', () => {
  test('addEntry adds teams to store', async () => {
    const { store } = renderWithProviders(<div />);

    // Update the store
    act(() => {
      store.dispatch(addEntry(mockEntries.team_1));
      store.dispatch(addEntry(mockEntries.team_3));
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

  test('addEntry calculates correct team ranking', async () => {
    const { store } = renderWithProviders(<div />);

    // Create a team with incorrect ranking points for the team
    const wrongTeam = cloneDeep(mockEntries.team_1);
    wrongTeam.ranking = 100000;

    // Update the store
    act(() => {
      store.dispatch(addEntry(wrongTeam));
    });

    // Verify that the team ranking is correct
    await waitFor(() => {
      expect(store.getState().entries).toEqual(
        expect.objectContaining({
          [getDivisionKey(mockEntries.team_1.division)]: {
            [getTeamKey(mockEntries.team_1)]: mockEntries.team_1,
          },
        })
      );
    });
  });

  test('modifyEntry updates existing entry', async () => {
    const { store } = renderWithProviders(<div />);

    // Add an initial entry to store
    act(() => {
      store.dispatch(addEntry(mockEntries.team_1));
    });

    // Create a team with incorrect ranking points for the team
    const modTeam = cloneDeep(mockEntries.team_1);

    // Set the team options that don't contribute to identification (player names)
    modTeam.isWaitlisted = !modTeam.isWaitlisted;
    modTeam.players[0].ranking = 0;

    // Update the store
    act(() => {
      store.dispatch(modifyEntry(modTeam));
    });

    // The team ranking should have been updated
    modTeam.ranking = modTeam.players[0].ranking + modTeam.players[1].ranking;

    // Verify that the team ranking is correct
    await waitFor(() => {
      expect(store.getState().entries).toEqual(
        expect.objectContaining({
          [getDivisionKey(mockEntries.team_1.division)]: {
            [getTeamKey(mockEntries.team_1)]: modTeam,
          },
        })
      );
    });
  });

  test('replaceAll replaces all entries', async () => {
    const { store } = renderWithProviders(<div />);

    // Add all entries
    act(() => {
      Object.values(mockEntries).forEach((e) => store.dispatch(addEntry(e)));
    });

    await waitFor(() => {
      expect(Object.keys(store.getState().entries)).toEqual([
        getDivisionKey(div1),
        getDivisionKey(div2),
      ]);
    });

    // New division
    const newDiv = "Coed 2's Open";

    // Replace division of all entries
    const newEntries = {
      [newDiv]: Object.values(cloneDeep(mockEntries)).map((v) => ({
        ...v,
        division: newDiv,
      })),
    };

    // Replace all entries
    act(() => {
      store.dispatch(replaceAll(newEntries));
    });

    // Expect only entries from new division
    await waitFor(() => {
      expect(Object.keys(store.getState().entries)).toEqual([
        getDivisionKey(newDiv),
      ]);
    });
  });

  test('removeEntry removes existing entry', async () => {
    const { store } = renderWithProviders(<div />);

    // Add an initial entry to store
    act(() => {
      store.dispatch(addEntry(mockEntries.team_1));
      store.dispatch(addEntry(mockEntries.team_2));
    });

    // Verify that the state was updated
    await waitFor(() => {
      expect(store.getState().entries).toEqual(
        expect.objectContaining({
          [getDivisionKey(mockEntries.team_1.division)]: {
            [getTeamKey(mockEntries.team_1)]: mockEntries.team_1,
            [getTeamKey(mockEntries.team_2)]: mockEntries.team_2,
          },
        })
      );
    });

    // remove 1 entry
    act(() => {
      store.dispatch(removeEntry(mockEntries.team_1));
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

describe('selector', () => {
  test('selectDivisionEntries recovers entries for input division', async () => {
    const { store } = renderWithProviders(<div />);

    // Update the store
    act(() => {
      store.dispatch(addEntry(mockEntries.team_1));
      store.dispatch(addEntry(mockEntries.team_2));
      store.dispatch(addEntry(mockEntries.team_3));
      store.dispatch(addEntry(mockEntries.wait_1));
      store.dispatch(addEntry(mockEntries.wait_2));
    });

    await waitFor(() =>
      expect(selectDivisionEntries(store.getState(), "Men's Open")).toEqual([
        mockEntries.team_1,
        mockEntries.team_2,
      ])
    );
  });

  test('selectDivisionWaitList recovers waitlist sorted by time', async () => {
    const { store } = renderWithProviders(<div />);

    // Update the store
    act(() => {
      store.dispatch(addEntry(mockEntries.team_1));
      store.dispatch(addEntry(mockEntries.team_2));
      store.dispatch(addEntry(mockEntries.team_3));
      store.dispatch(addEntry(mockEntries.wait_1));
      store.dispatch(addEntry(mockEntries.wait_2));
    });

    await waitFor(() =>
      expect(selectDivisionWaitlist(store.getState(), "Men's Open")).toEqual([
        mockEntries.wait_2,
        mockEntries.wait_1,
      ])
    );

    // Verify order
    const waitlist = selectDivisionWaitlist(store.getState(), "Men's Open");
    expect(waitlist[0]).toEqual(mockEntries.wait_2);
  });

  test('selectEntry recovers entry', async () => {
    const { store } = renderWithProviders(<div />);

    // Update the store
    act(() => {
      store.dispatch(addEntry(mockEntries.team_1));
      store.dispatch(addEntry(mockEntries.team_2));
      store.dispatch(addEntry(mockEntries.team_3));
      store.dispatch(addEntry(mockEntries.wait_1));
      store.dispatch(addEntry(mockEntries.wait_2));
    });

    Object.values(mockEntries).forEach(async (e) => {
      await waitFor(() =>
        expect(selectEntry(store.getState(), getTeamKey(e))).toEqual(e)
      );
    });
  });
});
