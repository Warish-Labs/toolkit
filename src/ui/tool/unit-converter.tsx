"use client";

import { useState } from "react";
import { UNIT_CATEGORIES, convertUnits, type UnitCategory } from "@/src/logic/unit-converter";

export function UnitConverterTool() {
  const [category, setCategory] = useState<UnitCategory>("length");
  
  const categoryInfo = UNIT_CATEGORIES[category];
  const units = categoryInfo.units;

  const [fromUnit, setFromUnit] = useState(units[0].value);
  const [toUnit, setToUnit] = useState(units[1]?.value || units[0].value);
  const [inputValue, setInputValue] = useState("1");

  // Keep unit selectors consistent when category shifts
  const handleCategoryChange = (cat: UnitCategory) => {
    setCategory(cat);
    const nextUnits = UNIT_CATEGORIES[cat].units;
    setFromUnit(nextUnits[0].value);
    setToUnit(nextUnits[1]?.value || nextUnits[0].value);
  };

  const amount = parseFloat(inputValue);
  const result = !isNaN(amount) ? convertUnits(amount, category, fromUnit, toUnit) : 0;

  // Handle swap
  const handleSwap = () => {
    const temp = fromUnit;
    setFromUnit(toUnit);
    setToUnit(temp);
  };

  return (
    <div className="space-y-6">
      {/* Category selector row */}
      <div className="space-y-1.5">
        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">Conversion Category</span>
        <div className="flex flex-wrap gap-2">
          {Object.entries(UNIT_CATEGORIES).map(([key, info]) => (
            <button
              key={key}
              onClick={() => handleCategoryChange(key as UnitCategory)}
              className={`text-xs px-3.5 py-1.5 rounded-lg border font-medium transition-all ${
                category === key
                  ? "bg-primary text-primary-foreground border-primary shadow"
                  : "bg-secondary/40 border-border hover:bg-secondary text-muted-foreground"
              }`}
            >
              {info.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 bg-muted/20 border border-border/40 p-6 rounded-2xl items-center">
        {/* Left Side: From */}
        <div className="space-y-3">
          <div className="space-y-1.5">
            <label htmlFor="unit-from-select" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">From Unit</label>
            <select
              id="unit-from-select"
              value={fromUnit}
              onChange={(e) => setFromUnit(e.target.value)}
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-xs shadow-sm focus:outline-none"
            >
              {units.map((u) => (
                <option key={u.value} value={u.value}>
                  {u.label}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-1.5">
            <label htmlFor="unit-input-val" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">Amount</label>
            <input
              id="unit-input-val"
              type="number"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm font-bold shadow-sm focus:outline-none"
            />
          </div>
        </div>

        {/* Right Side: To */}
        <div className="space-y-3">
          <div className="space-y-1.5">
            <label htmlFor="unit-to-select" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">To Unit</label>
            <select
              id="unit-to-select"
              value={toUnit}
              onChange={(e) => setToUnit(e.target.value)}
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-xs shadow-sm focus:outline-none"
            >
              {units.map((u) => (
                <option key={u.value} value={u.value}>
                  {u.label}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-1.5 relative">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">Converted Value</span>
            <div className="flex items-center h-10 w-full rounded-md border border-border/60 bg-muted/30 px-3 text-sm font-mono font-bold select-all truncate">
              {result.toLocaleString(undefined, { maximumFractionDigits: 6 })}
            </div>
            {/* Swap button placed at absolute right */}
            <button
              onClick={handleSwap}
              className="absolute right-2 -bottom-9 text-xs text-primary font-semibold hover:underline"
            >
              Swap Units ⇄
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
