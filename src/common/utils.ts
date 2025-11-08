export function generateRandomAlphabet(length: number): string {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const randomAlphabet = Array.from({ length })
    .map(() => alphabet[Math.floor(Math.random() * alphabet.length)])
    .join('');
  return randomAlphabet;
}
