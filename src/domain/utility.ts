// Some utitlity functions shared by multiple functions

export const validateDivision = (name: string) => {
  /* Check division input */
  if (name.length === 0) {
    throw new Error('Division name must not be empty');
  }
};

export const getDivisionKey = (name: string): string => {
  // Check name
  validateDivision(name);

  // Get common key to use for division
  const words = name.split(' ');
  if (words.length > 1) {
    return words[0].slice(0, 1).toLocaleLowerCase() + words[words.length - 1];
  }
  return name;
};
