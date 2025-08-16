export type Variant = 'A' | 'B' | 'C';

export function chooseVariant(): Variant {
  if (typeof window === 'undefined') return 'A';
  const key = 'ab_variant';
  const saved = window.localStorage.getItem(key) as Variant | null;
  if (saved === 'A' || saved === 'B' || saved === 'C') return saved;
  const variants: Variant[] = ['A', 'B', 'C'];
  const pick = variants[Math.floor(Math.random() * variants.length)];
  window.localStorage.setItem(key, pick);
  return pick;
}

export function getCopy(v: Variant) {
  switch (v) {
    case 'A':
      return {
        title1: 'TAKE THE PILL.',
        title2: 'MAKE THEM COPE.',
        sub: 'Be early or be coped.',
        ctaPrimary: 'Generate Now',
        ctaSecondary: 'Dose ×2',
      };
    case 'B':
      return {
        title1: 'PRINT YELLOW,',
        title2: 'PRINT CLOUT.',
        sub: '1→2→4→8, keep up.',
        ctaPrimary: 'Generate Now',
        ctaSecondary: 'Dose ×2',
      };
    case 'C':
      return {
        title1: 'MEME FIRST,',
        title2: 'THINK LATER.',
        sub: 'Rent-free guaranteed.',
        ctaPrimary: 'Share & Boost',
        ctaSecondary: 'Dose ×2',
      };
    default:
      return getCopy('A');
  }
}