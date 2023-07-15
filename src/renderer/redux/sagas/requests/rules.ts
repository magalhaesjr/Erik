import { DivisionRules } from '../../../../domain/rules';

export const fetchRules = async (): Promise<DivisionRules | null> => {
  return window.electron.importRules();
};

export const exportRules = async (rules: DivisionRules) => {
  window.electron.exportRules(rules);
};
