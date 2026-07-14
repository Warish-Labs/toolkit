export interface PrimeResult {
  isPrime: boolean;
  factors: number[];
  description: string;
}

export function checkIsPrime(num: number): PrimeResult {
  if (num <= 1) {
    return { isPrime: false, factors: [], description: `${num} is not a prime number (primes are integers greater than 1).` };
  }

  const factors: number[] = [];
  const limit = Math.sqrt(num);

  for (let i = 2; i <= limit; i++) {
    if (num % i === 0) {
      factors.push(i);
      if (i !== num / i) {
        factors.push(num / i);
      }
    }
  }

  // Sort factors ascending
  factors.sort((a, b) => a - b);

  if (factors.length === 0) {
    return {
      isPrime: true,
      factors: [1, num],
      description: `${num} is a prime number. It has exactly two divisors: 1 and ${num}.`
    };
  }

  return {
    isPrime: false,
    factors: [1, ...factors, num],
    description: `${num} is a composite number. It is divisible by ${factors.slice(0, 3).join(', ')}${factors.length > 3 ? '...' : ''}.`
  };
}

export function generatePrimes(limit: number): number[] {
  const primes: number[] = [];
  const sieve = new Uint8Array(limit + 1);
  sieve.fill(1);

  for (let p = 2; p * p <= limit; p++) {
    if (sieve[p] === 1) {
      for (let i = p * p; i <= limit; i += p) {
        sieve[i] = 0;
      }
    }
  }

  for (let p = 2; p <= limit; p++) {
    if (sieve[p] === 1) {
      primes.push(p);
    }
  }

  return primes;
}
