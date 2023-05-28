// Defines the court object and enum for height

// Types for net height
export type NetHeight = 'men' | 'women' | 'undefined';

export type Court = {
  netHeight: NetHeight;
  number: null | number;
  division: string;
  pool: null | number;
};

/**
 *
 * @returns a blank court defintion
 */
export const createCourt = (court?: number | null): Court => ({
  netHeight: 'undefined',
  number: court || null,
  division: '',
  pool: null,
});
