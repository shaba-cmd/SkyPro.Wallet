export const isValidEmail = (value: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());

export const isValidName = (value: string) =>
  /^[A-Za-zА-Яа-яЁё][A-Za-zА-Яа-яЁё\s-]+$/.test(value.trim());

export const isValidPassword = (value: string) => value.length >= 6;

export const isValidIsoDate = (value: string) =>
  /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(value));

export function parseSum(value: string): number | null {
  const normalized = value.replace(/[\s\u00a0₽]/g, "");
  if (!/^\d+$/.test(normalized)) return null;
  const sum = Number(normalized);
  return sum > 0 ? sum : null;
}

export const isValidDescription = (value: string) => value.trim().length >= 4;
