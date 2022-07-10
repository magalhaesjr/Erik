// Defines the court object and enum for height
import { isObject, validateObject } from './validate';

// Create an enum for net height
export const Net = Object.freeze({
  UNDEFINED: 'undefined',
  MEN: 'men',
  WOMEN: 'women',
});

export default class Court {
  constructor(input) {
    // Court number
    this.number = null;
    // Height
    this.netHeight = Net.UNDEFINED;
    // Division
    this.division = '';
    // Pool number
    this.pool = null;

    // Import as needed
    if (isObject(input)) {
      this.import(input);
    } else if (typeof input === 'number') {
      this.number = input;
    } else {
      throw new Error('Input must be a court or a number');
    }
  }

  // Import court
  import(input) {
    validateObject(input);
    // Import days
    Object.keys(input).forEach((key) => {
      this[key] = input[key];
    });
  }
}
