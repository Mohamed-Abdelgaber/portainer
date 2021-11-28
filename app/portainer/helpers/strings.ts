export function pluralize(val: number, word: string, plural = `${word}s`) {
  return [1, -1].includes(Number(val)) ? word : plural;
}
