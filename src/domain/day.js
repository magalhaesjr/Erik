// Organizes a tournament day for a tournament weekend
import { Division } from './division';
import { DIVISION_RULES } from './rules';

// Class for each tournament Day
export default class Day {
  constructor() {
    // Initialize Divisions and courts for each day
    this.courts = Array.from(Array(DIVISION_RULES.maxCourts).keys());
    this.divisions = {};
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
