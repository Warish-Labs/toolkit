"use client";

import { useState } from "react";
import { solveQuadratic, calculateStatistics, solveMatrix2x2 } from "@/src/logic/math-studio";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/src/ui/shared/tabs";

export function MathStudioTool() {
  const [activeTab, setActiveTab] = useState("calculator");

  // --- Scientific Calculator States ---
  const [calcInput, setCalcInput] = useState("");
  const [calcResult, setCalcResult] = useState("");

  const handleCalcClick = (val: string) => {
    if (val === "=") {
      try {
        // Safe evaluation of mathematical expressions using simple replacement
        const sanitized = calcInput
          .replace(/π/g, "Math.PI")
          .replace(/e/g, "Math.E")
          .replace(/sin\(/g, "Math.sin(")
          .replace(/cos\(/g, "Math.cos(")
          .replace(/tan\(/g, "Math.tan(")
          .replace(/log\(/g, "Math.log10(")
          .replace(/ln\(/g, "Math.log(")
          .replace(/sqrt\(/g, "Math.sqrt(")
          .replace(/\^/g, "**");

        // Simple evaluation logic for safe math expression
        const fn = new Function(`return ${sanitized}`);
        const res = fn();
        setCalcResult(String(res));
      } catch (err) {
        setCalcResult("Error");
      }
    } else if (val === "C") {
      setCalcInput("");
      setCalcResult("");
    } else if (val === "⌫") {
      setCalcInput(calcInput.slice(0, -1));
    } else {
      setCalcInput(calcInput + val);
    }
  };

  // --- Quadratic Solver States ---
  const [quadA, setQuadA] = useState("1");
  const [quadB, setQuadB] = useState("-5");
  const [quadC, setQuadC] = useState("6");
  const [quadResult, setQuadResult] = useState<any>(null);
  const [quadError, setQuadError] = useState("");

  const handleSolveQuadratic = () => {
    setQuadError("");
    setQuadResult(null);
    const a = Number(quadA);
    const b = Number(quadB);
    const c = Number(quadC);

    if (isNaN(a) || isNaN(b) || isNaN(c)) {
      setQuadError("Please enter valid numeric coefficients.");
      return;
    }
    if (a === 0) {
      setQuadError("Coefficient 'a' cannot be zero.");
      return;
    }

    try {
      const res = solveQuadratic(a, b, c);
      setQuadResult(res);
    } catch (err: any) {
      setQuadError(err.message || "An error occurred.");
    }
  };

  // --- Statistics Calculator States ---
  const [statsInput, setStatsInput] = useState("10, 20, 30, 40, 50");
  const [statsResult, setStatsResult] = useState<any>(null);

  const handleStatsCalc = () => {
    const nums = statsInput
      .split(",")
      .map((s) => Number(s.trim()))
      .filter((n) => !isNaN(n));
    
    if (nums.length === 0) return;
    const res = calculateStatistics(nums);
    setStatsResult(res);
  };

  // --- Matrix Calculator States ---
  const [matA, setMatA] = useState("1");
  const [matB, setMatB] = useState("2");
  const [matC, setMatC] = useState("3");
  const [matD, setMatD] = useState("4");
  const [matrixResult, setMatrixResult] = useState<any>(null);

  const handleMatrixSolve = () => {
    const a = Number(matA);
    const b = Number(matB);
    const c = Number(matC);
    const d = Number(matD);

    const res = solveMatrix2x2([[a, b], [c, d]]);
    setMatrixResult(res);
  };

  // --- Geometry Calculator States ---
  const [geoShape, setGeoShape] = useState("circle");
  const [circleRadius, setCircleRadius] = useState("5");
  const [triangleBase, setTriangleBase] = useState("6");
  const [triangleHeight, setTriangleHeight] = useState("4");
  const [rectWidth, setRectWidth] = useState("8");
  const [rectHeight, setRectHeight] = useState("5");
  const [geoResult, setGeoResult] = useState<any>(null);

  const handleGeoCalc = () => {
    if (geoShape === "circle") {
      const r = Number(circleRadius);
      if (r <= 0 || isNaN(r)) return;
      setGeoResult({
        area: (Math.PI * r * r).toFixed(4),
        perimeter: (2 * Math.PI * r).toFixed(4),
        perimeterLabel: "Circumference",
      });
    } else if (geoShape === "triangle") {
      const b = Number(triangleBase);
      const h = Number(triangleHeight);
      if (b <= 0 || h <= 0 || isNaN(b) || isNaN(h)) return;
      setGeoResult({
        area: (0.5 * b * h).toFixed(4),
        perimeter: "N/A (Requires all sides)",
        perimeterLabel: "Perimeter",
      });
    } else if (geoShape === "rectangle") {
      const w = Number(rectWidth);
      const h = Number(rectHeight);
      if (w <= 0 || h <= 0 || isNaN(w) || isNaN(h)) return;
      setGeoResult({
        area: (w * h).toFixed(4),
        perimeter: (2 * (w + h)).toFixed(4),
        perimeterLabel: "Perimeter",
      });
    }
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={(val) => setActiveTab(val)}>
        <TabsList className="grid w-full grid-cols-5 text-[10px] sm:text-xs">
          <TabsTrigger value="calculator">Calculator</TabsTrigger>
          <TabsTrigger value="quadratic">Quadratic</TabsTrigger>
          <TabsTrigger value="statistics">Stats</TabsTrigger>
          <TabsTrigger value="matrix">Matrix</TabsTrigger>
          <TabsTrigger value="geometry">Geometry</TabsTrigger>
        </TabsList>

        {/* ── Calculator Tab ── */}
        <TabsContent value="calculator" className="pt-4 space-y-4">
          <div className="max-w-md mx-auto border border-border/60 bg-muted/20 p-5 rounded-2xl space-y-4">
            <div className="space-y-1">
              <input
                type="text"
                readOnly
                value={calcInput}
                className="w-full text-right bg-transparent text-lg font-mono tracking-wider focus:outline-none"
                placeholder="0"
              />
              <div className="text-right text-2xl font-bold font-mono text-primary min-h-[36px]">
                {calcResult}
              </div>
            </div>

            <div className="grid grid-cols-4 gap-2">
              {["C", "⌫", "(", ")"].map((btn) => (
                <button
                  key={btn}
                  onClick={() => handleCalcClick(btn)}
                  className="bg-secondary/60 hover:bg-secondary py-3.5 rounded-lg text-sm font-semibold transition"
                >
                  {btn}
                </button>
              ))}
              {["sin(", "cos(", "tan(", "/"].map((btn) => (
                <button
                  key={btn}
                  onClick={() => handleCalcClick(btn)}
                  className="bg-secondary/40 hover:bg-secondary/80 py-3.5 rounded-lg text-xs font-mono transition"
                >
                  {btn}
                </button>
              ))}
              {["7", "8", "9", "*"].map((btn) => (
                <button
                  key={btn}
                  onClick={() => handleCalcClick(btn)}
                  className="bg-card hover:bg-muted border py-3.5 rounded-lg text-sm font-semibold transition"
                >
                  {btn}
                </button>
              ))}
              {["4", "5", "6", "-"].map((btn) => (
                <button
                  key={btn}
                  onClick={() => handleCalcClick(btn)}
                  className="bg-card hover:bg-muted border py-3.5 rounded-lg text-sm font-semibold transition"
                >
                  {btn}
                </button>
              ))}
              {["1", "2", "3", "+"].map((btn) => (
                <button
                  key={btn}
                  onClick={() => handleCalcClick(btn)}
                  className="bg-card hover:bg-muted border py-3.5 rounded-lg text-sm font-semibold transition"
                >
                  {btn}
                </button>
              ))}
              {["0", ".", "π", "="].map((btn) => (
                <button
                  key={btn}
                  onClick={() => handleCalcClick(btn)}
                  className={
                    btn === "="
                      ? "bg-primary text-primary-foreground hover:bg-primary/95 py-3.5 rounded-lg text-sm font-semibold transition"
                      : "bg-card hover:bg-muted border py-3.5 rounded-lg text-sm font-semibold transition"
                  }
                >
                  {btn}
                </button>
              ))}
              {["log(", "ln(", "sqrt(", "^"].map((btn) => (
                <button
                  key={btn}
                  onClick={() => handleCalcClick(btn)}
                  className="bg-secondary/30 hover:bg-secondary/60 py-2.5 rounded-lg text-xs font-mono transition"
                >
                  {btn}
                </button>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* ── Quadratic Solver Tab ── */}
        <TabsContent value="quadratic" className="pt-4 space-y-4">
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-1">
              <label htmlFor="quad-a" className="text-xs font-semibold text-muted-foreground uppercase">Coefficient a</label>
              <input
                id="quad-a"
                type="text"
                value={quadA}
                onChange={(e) => setQuadA(e.target.value)}
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-xs shadow-sm focus:outline-none"
              />
            </div>
            <div className="space-y-1">
              <label htmlFor="quad-b" className="text-xs font-semibold text-muted-foreground uppercase">Coefficient b</label>
              <input
                id="quad-b"
                type="text"
                value={quadB}
                onChange={(e) => setQuadB(e.target.value)}
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-xs shadow-sm focus:outline-none"
              />
            </div>
            <div className="space-y-1">
              <label htmlFor="quad-c" className="text-xs font-semibold text-muted-foreground uppercase">Coefficient c</label>
              <input
                id="quad-c"
                type="text"
                value={quadC}
                onChange={(e) => setQuadC(e.target.value)}
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-xs shadow-sm focus:outline-none"
              />
            </div>
          </div>

          <button
            onClick={handleSolveQuadratic}
            className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-ring"
          >
            Solve Equation
          </button>

          {quadError && <p className="text-xs text-destructive">{quadError}</p>}

          {quadResult && (
            <div className="border border-border/60 bg-muted/20 p-5 rounded-2xl space-y-3 text-xs leading-relaxed">
              <h3 className="font-semibold text-sm">Solutions:</h3>
              <div className="font-mono space-y-1">
                <p>Discriminant (D): {quadResult.discriminant}</p>
                <p>Root 1 (x₁): <span className="font-bold text-primary">{quadResult.root1}</span></p>
                <p>Root 2 (x₂): <span className="font-bold text-primary">{quadResult.root2}</span></p>
              </div>
              <div className="pt-2 border-t border-border/40 space-y-1">
                <h4 className="font-semibold">Calculation Steps:</h4>
                <ol className="list-decimal pl-4 space-y-0.5 text-muted-foreground font-mono text-[11px]">
                  {quadResult.steps.map((step: string, idx: number) => (
                    <li key={idx}>{step}</li>
                  ))}
                </ol>
              </div>
            </div>
          )}
        </TabsContent>

        {/* ── Statistics Calculator Tab ── */}
        <TabsContent value="statistics" className="pt-4 space-y-4">
          <div className="space-y-2">
            <label htmlFor="stats-inp" className="text-xs font-semibold text-muted-foreground uppercase">Enter numbers (comma-separated)</label>
            <input
              id="stats-inp"
              type="text"
              value={statsInput}
              onChange={(e) => setStatsInput(e.target.value)}
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-xs shadow-sm focus:outline-none"
              placeholder="e.g. 10, 20, 30, 40"
            />
          </div>

          <button
            onClick={handleStatsCalc}
            className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-ring"
          >
            Analyze Dataset
          </button>

          {statsResult && (
            <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 text-xs font-mono">
              <div className="border bg-card p-3.5 rounded-xl text-center">
                <span className="text-muted-foreground block text-[10px] uppercase font-semibold">Mean</span>
                <span className="text-base font-bold text-primary block mt-1">{statsResult.mean.toFixed(4)}</span>
              </div>
              <div className="border bg-card p-3.5 rounded-xl text-center">
                <span className="text-muted-foreground block text-[10px] uppercase font-semibold">Median</span>
                <span className="text-base font-bold text-primary block mt-1">{statsResult.median}</span>
              </div>
              <div className="border bg-card p-3.5 rounded-xl text-center">
                <span className="text-muted-foreground block text-[10px] uppercase font-semibold">Mode</span>
                <span className="text-base font-bold text-primary block mt-1">
                  {statsResult.mode.length > 0 ? statsResult.mode.join(", ") : "None"}
                </span>
              </div>
              <div className="border bg-card p-3.5 rounded-xl text-center">
                <span className="text-muted-foreground block text-[10px] uppercase font-semibold">Variance</span>
                <span className="text-base font-bold text-primary block mt-1">{statsResult.variance.toFixed(4)}</span>
              </div>
              <div className="border bg-card p-3.5 rounded-xl text-center">
                <span className="text-muted-foreground block text-[10px] uppercase font-semibold">Std Dev</span>
                <span className="text-base font-bold text-primary block mt-1">{statsResult.stdDev.toFixed(4)}</span>
              </div>
              <div className="border bg-card p-3.5 rounded-xl text-center">
                <span className="text-muted-foreground block text-[10px] uppercase font-semibold">Count</span>
                <span className="text-base font-bold text-primary block mt-1">{statsResult.count}</span>
              </div>
            </div>
          )}
        </TabsContent>

        {/* ── Matrix Tab ── */}
        <TabsContent value="matrix" className="pt-4 space-y-4">
          <div className="max-w-xs mx-auto border border-border/60 p-5 rounded-2xl bg-muted/20 space-y-4">
            <div className="grid grid-cols-2 gap-3 text-center">
              <input
                type="text"
                value={matA}
                onChange={(e) => setMatA(e.target.value)}
                className="h-10 text-center rounded border bg-transparent text-sm font-mono focus:outline-none"
              />
              <input
                type="text"
                value={matB}
                onChange={(e) => setMatB(e.target.value)}
                className="h-10 text-center rounded border bg-transparent text-sm font-mono focus:outline-none"
              />
              <input
                type="text"
                value={matC}
                onChange={(e) => setMatC(e.target.value)}
                className="h-10 text-center rounded border bg-transparent text-sm font-mono focus:outline-none"
              />
              <input
                type="text"
                value={matD}
                onChange={(e) => setMatD(e.target.value)}
                className="h-10 text-center rounded border bg-transparent text-sm font-mono focus:outline-none"
              />
            </div>

            <button
              onClick={handleMatrixSolve}
              className="w-full inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-ring"
            >
              Calculate Matrix properties
            </button>
          </div>

          {matrixResult && (
            <div className="border border-border/60 bg-muted/20 p-5 rounded-2xl text-xs space-y-3 leading-relaxed max-w-sm mx-auto">
              <div className="font-mono">
                <span className="font-semibold block text-muted-foreground mb-1">Determinant:</span>
                <span className="text-sm font-bold text-primary">{matrixResult.determinant}</span>
              </div>
              <div className="font-mono">
                <span className="font-semibold block text-muted-foreground mb-1">Transpose:</span>
                <div className="grid grid-cols-2 gap-1.5 text-center max-w-[100px] border border-border/40 p-2 rounded">
                  <span>{matrixResult.transpose[0][0]}</span>
                  <span>{matrixResult.transpose[0][1]}</span>
                  <span>{matrixResult.transpose[1][0]}</span>
                  <span>{matrixResult.transpose[1][1]}</span>
                </div>
              </div>
              <div className="font-mono">
                <span className="font-semibold block text-muted-foreground mb-1">Inverse Matrix:</span>
                {matrixResult.inverse ? (
                  <div className="grid grid-cols-2 gap-1.5 text-center max-w-[150px] border border-border/40 p-2 rounded">
                    <span>{matrixResult.inverse[0][0].toFixed(2)}</span>
                    <span>{matrixResult.inverse[0][1].toFixed(2)}</span>
                    <span>{matrixResult.inverse[1][0].toFixed(2)}</span>
                    <span>{matrixResult.inverse[1][1].toFixed(2)}</span>
                  </div>
                ) : (
                  <span className="text-destructive font-semibold">Not invertible (det = 0)</span>
                )}
              </div>
            </div>
          )}
        </TabsContent>

        {/* ── Geometry Tab ── */}
        <TabsContent value="geometry" className="pt-4 space-y-4">
          <div className="space-y-2">
            <label htmlFor="geo-shape-select" className="text-xs font-semibold text-muted-foreground uppercase">Select Shape</label>
            <select
              id="geo-shape-select"
              value={geoShape}
              onChange={(e) => {
                setGeoShape(e.target.value);
                setGeoResult(null);
              }}
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-xs shadow-sm focus:outline-none"
            >
              <option value="circle">Circle</option>
              <option value="triangle">Triangle</option>
              <option value="rectangle">Rectangle</option>
            </select>
          </div>

          <div className="space-y-3 pt-2">
            {geoShape === "circle" && (
              <div className="space-y-1">
                <label htmlFor="c-rad" className="text-xs font-semibold text-muted-foreground uppercase">Radius</label>
                <input
                  id="c-rad"
                  type="text"
                  value={circleRadius}
                  onChange={(e) => setCircleRadius(e.target.value)}
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-xs shadow-sm focus:outline-none"
                />
              </div>
            )}
            {geoShape === "triangle" && (
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-1">
                  <label htmlFor="t-base" className="text-xs font-semibold text-muted-foreground uppercase">Base</label>
                  <input
                    id="t-base"
                    type="text"
                    value={triangleBase}
                    onChange={(e) => setTriangleBase(e.target.value)}
                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-xs shadow-sm focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label htmlFor="t-height" className="text-xs font-semibold text-muted-foreground uppercase">Height</label>
                  <input
                    id="t-height"
                    type="text"
                    value={triangleHeight}
                    onChange={(e) => setTriangleHeight(e.target.value)}
                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-xs shadow-sm focus:outline-none"
                  />
                </div>
              </div>
            )}
            {geoShape === "rectangle" && (
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-1">
                  <label htmlFor="r-width" className="text-xs font-semibold text-muted-foreground uppercase">Width</label>
                  <input
                    id="r-width"
                    type="text"
                    value={rectWidth}
                    onChange={(e) => setRectWidth(e.target.value)}
                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-xs shadow-sm focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label htmlFor="r-height" className="text-xs font-semibold text-muted-foreground uppercase">Height</label>
                  <input
                    id="r-height"
                    type="text"
                    value={rectHeight}
                    onChange={(e) => setRectHeight(e.target.value)}
                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-xs shadow-sm focus:outline-none"
                  />
                </div>
              </div>
            )}
          </div>

          <button
            onClick={handleGeoCalc}
            className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-ring"
          >
            Compute Metrics
          </button>

          {geoResult && (
            <div className="border border-border/60 bg-muted/20 p-5 rounded-2xl text-xs space-y-3 leading-relaxed font-mono">
              <div>
                <span className="font-semibold block text-muted-foreground mb-0.5">Area:</span>
                <span className="text-sm font-bold text-primary">{geoResult.area}</span>
              </div>
              <div>
                <span className="font-semibold block text-muted-foreground mb-0.5">{geoResult.perimeterLabel}:</span>
                <span className="text-sm font-bold text-primary">{geoResult.perimeter}</span>
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
