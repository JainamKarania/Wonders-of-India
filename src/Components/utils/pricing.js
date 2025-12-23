export const PRICE_MAP = {
  Adult: 6000,
  Child: 3500,
};

export const calculateTotalPrice = (persons = []) =>
  persons.reduce((sum, p) => sum + (PRICE_MAP[p.type] || 0), 0);
