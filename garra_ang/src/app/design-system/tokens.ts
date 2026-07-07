export function obterTokenCor(nomeVariavel: string): string {
  return getComputedStyle(document.documentElement).getPropertyValue(nomeVariavel).trim();
}
