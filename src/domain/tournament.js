// Implements the Tournament class for organizing tournament weeekend
import Day from './day';
import { DIVISION_RULES } from './rules';
import { Division } from './division';
import Court from './court';
import { hasProp, isObject, validateObject } from './validate';

// Team class for tournament entries
export default class Tournament {
  constructor(input) {
    // Saturday tournament
    this.saturday = new Day();
    // Sunday Tournament
    this.sunday = new Day();
    // Financial rules
    this.financials = {};
    // If input, import
    if (isObject(input)) {
      this.import(input);
    }

    // If courts aren't filled in, add them
    if (!hasProp(this, 'courts')) {
      // Fill in default courts
      this.courts = Array.from(Array(DIVISION_RULES.maxCourts).keys()).map(
        (num) => {
          return new Court(num + 1);
        }
      );
    }
  }

  // Import tournament
  import(input) {
    validateObject(input);
    // Import days
    Object.keys(input).forEach((key) => {
      if (key === 'saturday' || key === 'sunday') {
        this[key] = new Day(input[key]);
      } else if (key === 'courts') {
        this[key] = input[key].map((court) => {
          return new Court(court);
        });
      } else {
        this[key] = input[key];
      }
    });
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
