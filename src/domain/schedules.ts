// Defines the pool schedules

export class LegacyMatch {
  readonly team1: number;

  readonly team2: number;

  readonly work: number;

  constructor(t1: number, t2: number, work: number) {
    this.team1 = t1;
    this.team2 = t2;
    this.work = work;
  }
}

export type Match = {
  team1: number;
  team2: number;
  work: number;
};

export const createMatch = (
  team1: number,
  team2: number,
  work: number
): Match => ({ team1, team2, work });

// Defines the pool schedules for pools with different amount of teams
export function retrieveTemplate(numTeams: number) {
  switch (numTeams) {
    case 4:
      return [
        createMatch(2, 4, 3),
        createMatch(1, 3, 4),
        createMatch(2, 3, 1),
        createMatch(1, 4, 3),
        createMatch(3, 4, 2),
        createMatch(1, 2, 4),
      ];
    case 5:
      return [
        createMatch(2, 5, 3),
        createMatch(1, 4, 5),
        createMatch(3, 5, 1),
        createMatch(2, 4, 3),
        createMatch(1, 3, 2),
        createMatch(4, 5, 1),
        createMatch(2, 3, 4),
        createMatch(1, 5, 2),
        createMatch(3, 4, 5),
        createMatch(1, 2, 4),
      ];
    case 6:
      return [
        createMatch(4, 6, 5),
        createMatch(1, 5, 2),
        createMatch(2, 4, 3),
        createMatch(3, 5, 6),
        createMatch(2, 6, 1),
        createMatch(1, 3, 5),
        createMatch(4, 5, 6),
        createMatch(1, 6, 2),
        createMatch(2, 5, 3),
        createMatch(3, 6, 4),
        createMatch(1, 4, 2),
        createMatch(2, 3, 5),
        createMatch(5, 6, 4),
        createMatch(3, 4, 1),
        createMatch(1, 2, 3),
      ];
    case 7:
      return [
        createMatch(1, 4, 5),
        createMatch(2, 6, 3),
        createMatch(3, 5, 2),
        createMatch(6, 7, 4),
        createMatch(2, 3, 6),
        createMatch(4, 5, 1),
        createMatch(1, 7, 3),
        createMatch(2, 4, 6),
        createMatch(1, 3, 2),
        createMatch(5, 6, 7),
        createMatch(4, 7, 6),
        createMatch(1, 5, 3),
        createMatch(3, 6, 4),
        createMatch(2, 7, 5),
        createMatch(3, 7, 5),
        createMatch(1, 6, 2),
        createMatch(2, 5, 1),
        createMatch(4, 6, 7),
        createMatch(5, 7, 1),
        createMatch(3, 4, 2),
        createMatch(1, 2, 4),
      ];
    default:
      throw new Error(`Schedule for ${numTeams} teams is unsupported`);
  }
}
