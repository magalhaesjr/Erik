// Organizes a tournament day for a tournament weekend
import { Division } from './division';
import { DIVISION_RULES } from './rules';
import { hasProp, isObject, validateObject } from './validate';

// Class for each tournament Day
export default class Day {
  constructor(input) {
    // Initialize Divisions and courts for each day
    this.courts = Array.from(Array(DIVISION_RULES.maxCourts).keys());
    this.divisions = {};

    // If an object was input, import it now
    if (isObject(input)) {
      this.import(input);
    }
  }

  /* ** IMPORT ** */
  import(input) {
    // Validate input object
    validateObject(input);

    // Loop through all fields in class and import as needed
    Object.keys(this).forEach((key) => {
      if (hasProp(input, key)) {
        if (key === 'divisions') {
          // Re-create Division objects and add them to the day
          Object.keys(input.divisions).forEach((div) => {
            this.addDivision(new Division(input.divisions[div]));
          });
        }
      }
    });
  }

  // Add a division to the tournament day
  addDivision(inputDivision) {
    // Ensure division object is valid
    if (!(inputDivision instanceof Division)) {
      throw new Error('Input division is not a Division object');
    }

    // Assign the division
    this.divisions[inputDivision.division] = inputDivision;
  }

  /* ** Helpful getters about the tournament ** */
  // Number of teams in total tournament day
  numTeams() {
    let numTeams = 0;
    Object.keys(this.divisions).forEach((div) => {
      numTeams += this.divisions[div].numTeams();
    });
    return numTeams;
  }

  // Number of nets based on teams in division
  requiredNets() {
    let numNets = 0;
    Object.keys(this.divisions).forEach((div) => {
      numNets += this.divisions[div].nets;
    });
    return numNets;
  }
}
