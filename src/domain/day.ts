// Organizes a tournament day for a tournament weekend
import Division from './division';
import { getDivisionKey } from './utility';

type DayDivisions = {
  [key: string]: Division;
};

// Class for each tournament Day
export default class Day {
  divisions: DayDivisions;

  constructor(input?: Day) {
    // Initialize Divisions and for each day
    this.divisions = {};

    // If an object was input, import it now
    if (input) {
      this.import(input);
    }
  }

  /* ** IMPORT ** */
  import(input: Day) {
    // Loop through all fields in class and import as needed
    Object.entries(input.divisions).forEach(([, v]) => {
      this.addDivision(new Division(v));
    });
  }

  // Add a division to the tournament day
  addDivision(inputDivision: Division) {
    // Assign the division
    this.divisions[getDivisionKey(inputDivision.props.division)] =
      inputDivision;
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
      numNets += this.divisions[div].props.minNets;
    });
    return numNets;
  }
}
