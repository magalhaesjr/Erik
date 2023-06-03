// Adds validation checks for different types
import Division from './division';

// Makes sure the input is an {} object
export function isObject(info: unknown) {
  return !(
    typeof info !== 'object' ||
    info === undefined ||
    info === null ||
    typeof info === 'number' ||
    typeof info === 'string' ||
    Array.isArray(info)
  );
}

// Validates that an object is not empty
export function isEmpty(inObject: object) {
  if (Object.keys(inObject).length === 0) {
    return true;
  }
  return false;
}

// Validate input is an object (throws error if not)
export function validateObject(info: object) {
  if (!isObject(info)) {
    throw new Error('Input must be an object');
  }
}

export function hasProp(inObject: object, prop: string) {
  if (isObject(inObject) && !isEmpty(inObject)) {
    return Object.prototype.hasOwnProperty.call(inObject, prop);
  }
  return false;
}

export function getPools(division?: Division) {
  if (division) {
    const allPools = Array.from(
      Array(division.props.pools.length),
      (_, index) => {
        return index + 1;
      }
    );
    return allPools;
  }
  return [];
}
