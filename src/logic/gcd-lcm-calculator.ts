export interface GcdLcmStep {
  a: number;
  b: number;
  r: number;
  equation: string;
}

export interface GcdLcmResult {
  gcd: number;
  lcm: number;
  steps: GcdLcmStep[];
}

export function calculateGcdLcm(numbers: number[]): GcdLcmResult {
  if (numbers.length < 2) {
    throw new Error('At least two numbers are required to compute GCD and LCM.');
  }

  // Ensure positive integers
  const cleanNums = numbers.map(n => {
    const val = Math.round(Math.abs(n));
    if (val === 0) throw new Error('GCD/LCM cannot be calculated for zero.');
    return val;
  });

  const steps: GcdLcmStep[] = [];

  // Helper GCD for two numbers with step tracking
  const getGcdTwo = (x: number, y: number): number => {
    let a = Math.max(x, y);
    let b = Math.min(x, y);
    
    while (b !== 0) {
      const q = Math.floor(a / b);
      const r = a % b;
      steps.push({
        a,
        b,
        r,
        equation: `${a} = ${b} × ${q} + ${r}`
      });
      a = b;
      b = r;
    }
    return a;
  };

  let currentGcd = cleanNums[0];
  for (let i = 1; i < cleanNums.length; i++) {
    currentGcd = getGcdTwo(currentGcd, cleanNums[i]);
  }

  // Calculate LCM of two numbers: (x * y) / gcd(x, y)
  const getLcmTwo = (x: number, y: number): number => {
    const gcd = getGcdTwo(x, y);
    return (x * y) / gcd;
  };

  let currentLcm = cleanNums[0];
  for (let i = 1; i < cleanNums.length; i++) {
    currentLcm = getLcmTwo(currentLcm, cleanNums[i]);
  }

  return {
    gcd: currentGcd,
    lcm: currentLcm,
    steps
  };
}
