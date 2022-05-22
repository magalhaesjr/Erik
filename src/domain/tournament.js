// Implements the Tournament class for organizing tournament weeekend
import Day from './day';
import { Division } from './division';

// Team class for tournament entries
export default class Tournament {
  constructor() {
    // Saturday tournament
    this.saturday = new Day();
    // Sunday Tournament
    this.sunday = new Day();
  }

  // Add a new division to the tournament
  addDivision(inputDivision) {
    // Determine what day the division goes to
    // Ensure division object is valid
    if (!(inputDivision instanceof Division)) {
      throw new Error('Input division is not a Division object');
    }
    // Check name to see which day it goes in
    if (inputDivision.division.toLowerCase().includes('coed')) {
      this.sunday.addDivision(inputDivision);
    } else {
      this.saturday.addDivision(inputDivision);
    }
  }
}
