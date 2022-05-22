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

// Validate input is an object (throws error if not)
export function validateObject(info) {
  if (!isObject(info)) {
    throw new Error('Input must be an object');
  }
}
