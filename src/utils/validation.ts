export const isValidEmail = (value: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());

export const isValidName = (value: string) =>
  /^[A-Za-zА-Яа-яЁё][A-Za-zА-Яа-яЁё\s-]+$/.test(value.trim());

export const isValidPassword = (value: string) => value.length >= 6;

export function parseDate(value: string): string | null {
  const match = /^(\d{2})\.(\d{2})\.(\d{4})$/.exec(value.trim());
  if (!match) return null;
  const [, day, month, year] = match;
  const date = new Date(Number(year), Number(month) - 1, Number(day));
  if (
    date.getFullYear() !== Number(year) ||
    date.getMonth() !== Number(month) - 1 ||
    date.getDate() !== Number(day)
  ) {
    return null;
  }
  return `${year}-${month}-${day}`;
}

export function parseSum(value: string): number | null {
  const normalized = value.replace(/[\s\u00a0₽]/g, "");
  if (!/^\d+$/.test(normalized)) return null;
  const sum = Number(normalized);
  return sum > 0 ? sum : null;
}

export const isValidDescription = (value: string) => value.trim().length >= 4;
