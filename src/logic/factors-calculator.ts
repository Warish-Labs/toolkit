export interface FactorizationResult {
  factors: number[];
  primeFactors: { prime: number; exponent: number }[];
  primeFactorizationString: string;
  numberOfFactors: number;
  sumOfFactors: number;
  productOfFactors: number;
}

export function calculateFactors(num: number): FactorizationResult {
  if (num < 1) {
    throw new Error('Factors are only defined for positive integers.');
  }

  const factors: number[] = [];
  const limit = Math.sqrt(num);

  for (let i = 1; i <= limit; i++) {
    if (num % i === 0) {
      factors.push(i);
      if (i !== num / i) {
        factors.push(num / i);
      }
    }
  }

  factors.sort((a, b) => a - b);

  // Prime factorization
  let temp = num;
  const primeMap = new Map<number, number>();

  for (let i = 2; i * i <= temp; i++) {
    while (temp % i === 0) {
      primeMap.set(i, (primeMap.get(i) || 0) + 1);
      temp /= i;
    }
  }
  if (temp > 1) {
    primeMap.set(temp, (primeMap.get(temp) || 0) + 1);
  }

  const primeFactors = Array.from(primeMap.entries()).map(([prime, exponent]) => ({
    prime,
    exponent
  })).sort((a, b) => a.prime - b.prime);

  const primeFactorizationString = primeFactors
    .map(pf => `${pf.prime}^${pf.exponent}`)
    .join(' × ') || `${num}`;

  const sumOfFactors = factors.reduce((sum, f) => sum + f, 0);

  // Compute product securely to avoid infinite Infinity
  let productOfFactors = 1;
  for (const f of factors) {
    productOfFactors *= f;
    if (productOfFactors === Infinity) break;
  }

  return {
    factors,
    primeFactors,
    primeFactorizationString,
    numberOfFactors: factors.length,
    sumOfFactors,
    productOfFactors
  };
}
