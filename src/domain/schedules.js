// Defines the pool schedules

class Match {
  constructor(t1, t2, work) {
    this.setField('team1', t1);
    this.setField('team2', t2);
    this.setField('work', work);
  }

  // Validate & set a field
  setField(name, input) {
    if (typeof input !== 'number' || input === undefined || input === null) {
      throw new Error(`${name} must be a number`);
    }
    this[name] = input;
  }
}

// Define schedule validation
export function validateSchedule(schedule) {
  // Must be an array
  if (!Array.isArray(schedule)) {
    throw new Error('Schedule must be an array of matches');
  }

  // Check that all elements are matches
  schedule.forEach((round) => {
    if (!(round instanceof Match)) {
      throw new Error('Schedule must be an array of matches');
    }
  });
}

// Defines the pool schedules for pools with different amount of teams
export function retrieveTemplate(numTeams) {
  switch (numTeams) {
    case 4:
      return [
        new Match(2, 4, 3),
        new Match(1, 3, 4),
        new Match(2, 3, 1),
        new Match(1, 4, 3),
        new Match(3, 4, 2),
        new Match(1, 2, 4),
      ];
    case 5:
      return [
        new Match(2, 5, 3),
        new Match(1, 4, 5),
        new Match(3, 5, 1),
        new Match(2, 4, 3),
        new Match(1, 3, 2),
        new Match(4, 5, 1),
        new Match(2, 3, 4),
        new Match(1, 5, 2),
        new Match(3, 4, 5),
        new Match(1, 2, 4),
      ];
    case 6:
      return [
        new Match(4, 6, 5),
        new Match(1, 5, 2),
        new Match(2, 4, 3),
        new Match(3, 5, 6),
        new Match(2, 6, 1),
        new Match(1, 3, 5),
        new Match(4, 5, 6),
        new Match(1, 6, 2),
        new Match(2, 5, 3),
        new Match(3, 6, 4),
        new Match(1, 4, 2),
        new Match(2, 3, 5),
        new Match(5, 6, 4),
        new Match(3, 4, 1),
        new Match(1, 2, 3),
      ];
    case 7:
      return [
        new Match(1, 4, 5),
        new Match(2, 6, 3),
        new Match(3, 5, 2),
        new Match(6, 7, 4),
        new Match(2, 3, 6),
        new Match(4, 5, 1),
        new Match(1, 7, 3),
        new Match(2, 4, 6),
        new Match(1, 3, 2),
        new Match(5, 6, 7),
        new Match(4, 7, 6),
        new Match(1, 5, 3),
        new Match(3, 6, 4),
        new Match(2, 7, 5),
        new Match(3, 7, 5),
        new Match(1, 6, 2),
        new Match(2, 5, 1),
        new Match(4, 6, 7),
        new Match(5, 7, 1),
        new Match(3, 4, 2),
        new Match(1, 2, 4),
      ];
    default:
      throw new Error(`Schedule for ${numTeams} teams is unsupported`);
  }
}
