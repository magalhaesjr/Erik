// Adds validation checks for different types

// Makes sure the input is an {} object
export function isObject(info) {
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
export function isEmpty(inObject) {
  if (isObject(inObject) && Object.keys(inObject).length === 0) {
    return true;
  }
  return false;
}

// Validate input is an object (throws error if not)
export function validateObject(info) {
  if (!isObject(info)) {
    throw new Error('Input must be an object');
  }
}

export function hasProp(inObject, prop) {
  if (isObject(inObject) && !isEmpty(inObject)) {
    return Object.prototype.hasOwnProperty.call(inObject, prop);
  }
  return false;
}
