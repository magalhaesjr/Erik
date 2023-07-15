// Implements the Tournament class for organizing tournament weeekend
import cloneDeep from 'lodash/cloneDeep';
import Day from './day';
import Division from './division';
import { createCourt } from './court';
import type { Court } from './court';
import { TournamentFinancials, defaultPayout } from './payouts';
import { DivisionRules, tournamentRules } from './rules';
import { TournamentEntries } from '../renderer/redux/entries';
import { TournamentPools } from '../renderer/redux/pools';

/** Types */
export type Tournament = {
  courts: Court[];
  entries: TournamentEntries;
  pools: TournamentPools;
  rules: DivisionRules;
  financials: TournamentFinancials;
};

// Team class for tournament entries
export default class LegacyTournament {
  saturday: Day;

  sunday: Day;

  financials: TournamentFinancials;

  courts: Court[];

  constructor(input?: LegacyTournament) {
    // Saturday tournament
    this.saturday = new Day();
    // Sunday Tournament
    this.sunday = new Day();
    // Financial rules
    this.financials = cloneDeep(defaultPayout);
    // Total courts
    this.courts = [];

    // If input, import
    if (input) {
      this.import(input);
    }

    // If courts aren't filled in, add them
    if (this.courts.length === 0) {
      // Fill in default courts
      this.courts = Array.from(Array(tournamentRules.maxCourts).keys()).map(
        (num) => {
          return createCourt(num + 1);
        }
      );
    }
  }

  // Import tournament
  import(input: LegacyTournament) {
    // Import financials
    this.financials = input.financials;
    // Import days
    this.saturday = new Day(input.saturday);
    this.sunday = new Day(input.sunday);
    // remake the courts
    this.courts = input.courts.map((c) => createCourt(c.number));
  }

  // Add a new division to the tournament
  addDivision(inputDivision: Division) {
    // Determine what day the division goes to
    // Check name to see which day it goes in
    if (inputDivision.props.division.toLowerCase().includes('coed')) {
      this.sunday.addDivision(inputDivision);
    } else {
      this.saturday.addDivision(inputDivision);
    }
  }
}
