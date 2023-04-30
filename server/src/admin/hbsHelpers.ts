export const typeIsBool = (type: string): boolean => {
  return type === 'bool';
}

export const isStringTrue = (v: string | boolean): boolean => {
  return v === 'true' || v === true;
}