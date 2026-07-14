// Math Studio Logic

// ── Quadratic Equation Solver ─────────────────────────────────────────
export interface QuadraticResult {
  hasRoots: boolean;
  discriminant: number;
  root1: string;
  root2: string;
  steps: string[];
}

export function solveQuadratic(a: number, b: number, c: number): QuadraticResult {
  if (a === 0) {
    throw new Error('Coefficient "a" cannot be 0 in a quadratic equation.');
  }

  const discriminant = b * b - 4 * a * c;
  const steps: string[] = [
    `Formula: x = [-b ± √(b² - 4ac)] / 2a`,
    `Calculate discriminant (D) = b² - 4ac`,
    `D = (${b})² - 4(${a})(${c}) = ${discriminant}`
  ];

  if (discriminant > 0) {
    const root1Val = (-b + Math.sqrt(discriminant)) / (2 * a);
    const root2Val = (-b - Math.sqrt(discriminant)) / (2 * a);
    steps.push(`D > 0, equation has two distinct real roots.`);
    steps.push(`x₁ = (-(${b}) + √${discriminant}) / 2(${a}) = ${root1Val.toFixed(4)}`);
    steps.push(`x₂ = (-(${b}) - √${discriminant}) / 2(${a}) = ${root2Val.toFixed(4)}`);
    return {
      hasRoots: true,
      discriminant,
      root1: root1Val.toFixed(4),
      root2: root2Val.toFixed(4),
      steps
    };
  } else if (discriminant === 0) {
    const rootVal = -b / (2 * a);
    steps.push(`D = 0, equation has one real double root.`);
    steps.push(`x = -(${b}) / 2(${a}) = ${rootVal.toFixed(4)}`);
    return {
      hasRoots: true,
      discriminant,
      root1: rootVal.toFixed(4),
      root2: rootVal.toFixed(4),
      steps
    };
  } else {
    // Complex roots
    const realPart = -b / (2 * a);
    const imagPart = Math.sqrt(-discriminant) / (2 * a);
    steps.push(`D < 0, equation has complex conjugate roots.`);
    steps.push(`x₁ = ${realPart.toFixed(4)} + ${imagPart.toFixed(4)}i`);
    steps.push(`x₂ = ${realPart.toFixed(4)} - ${imagPart.toFixed(4)}i`);
    return {
      hasRoots: true,
      discriminant,
      root1: `${realPart.toFixed(4)} + ${imagPart.toFixed(4)}i`,
      root2: `${realPart.toFixed(4)} - ${imagPart.toFixed(4)}i`,
      steps
    };
  }
}

// ── Statistics Calculator ─────────────────────────────────────────────
export interface StatsResult {
  mean: number;
  median: number;
  mode: number[];
  variance: number;
  stdDev: number;
  sum: number;
  count: number;
}

export function calculateStatistics(nums: number[]): StatsResult {
  if (nums.length === 0) {
    return { mean: 0, median: 0, mode: [], variance: 0, stdDev: 0, sum: 0, count: 0 };
  }

  const count = nums.length;
  const sum = nums.reduce((s, n) => s + n, 0);
  const mean = sum / count;

  // Median
  const sorted = [...nums].sort((a, b) => a - b);
  const mid = Math.floor(count / 2);
  const median = count % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;

  // Mode
  const freqs = new Map<number, number>();
  let maxFreq = 0;
  nums.forEach(n => {
    const f = (freqs.get(n) || 0) + 1;
    freqs.set(n, f);
    if (f > maxFreq) maxFreq = f;
  });
  const mode: number[] = [];
  if (maxFreq > 1) {
    freqs.forEach((f, n) => {
      if (f === maxFreq) mode.push(n);
    });
  }

  // Variance & Standard Deviation
  const variance = nums.reduce((acc, n) => acc + Math.pow(n - mean, 2), 0) / count;
  const stdDev = Math.sqrt(variance);

  return {
    mean,
    median,
    mode,
    variance,
    stdDev,
    sum,
    count
  };
}

// ── 2x2 Matrix Solver ──────────────────────────────────────────────────
export interface Matrix2x2Result {
  determinant: number;
  inverse?: [[number, number], [number, number]];
  transpose: [[number, number], [number, number]];
}

export function solveMatrix2x2(matrix: [[number, number], [number, number]]): Matrix2x2Result {
  const [[a, b], [c, d]] = matrix;
  const determinant = a * d - b * c;
  const transpose: [[number, number], [number, number]] = [
    [a, c],
    [b, d]
  ];

  if (determinant === 0) {
    return { determinant, transpose };
  }

  const inverse: [[number, number], [number, number]] = [
    [d / determinant, -b / determinant],
    [-c / determinant, a / determinant]
  ];

  return {
    determinant,
    transpose,
    inverse
  };
}
