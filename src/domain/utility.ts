// Some utitlity functions shared by multiple functions

import type { TeamEntry } from '../renderer/redux/entries';

export const validateDivision = (name: string) => {
  /* Check division input */
  if (name.length === 0) {
    throw new Error('Division name must not be empty');
  }
};

export const getDivisionKey = (name: string): string => {
  // Check name
  validateDivision(name);

  // Get common key to use for division
  const words = name.split(' ');
  if (words.length > 1) {
    return words[0].slice(0, 1).toLocaleLowerCase() + words[words.length - 1];
  }
  return name;
};

export const getTeamKey = (entry: TeamEntry): string => {
  if (entry.players.length === 0) {
    throw new Error('Team must have players');
  }

  // String of all player names
  const playerString = entry.players.map(
    (p) =>
      `${p.name.first.toLocaleLowerCase()}-${p.name.last.toLocaleLowerCase()}`
  );

  const id = playerString.join('/');
  return id;
};

const getFullDiv = (abv: string) => {
  switch (abv) {
    case 'm':
      return "Men's ";
    case 'w':
      return "Women's ";
    case 'c':
      return 'Coed ';
    default:
      return abv;
  }
};

export const getDivisionName = (name: string): string => {
  // Replace the first letter with the appropriate name
  if (name.length > 0) {
    return name.replace(name[0], getFullDiv(name[0]));
  }

  return name;
};
