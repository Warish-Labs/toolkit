"use client";

import { useState } from "react";
import { hexToRgb, rgbToHex, rgbToHsl, rgbToCmyk, getContrastRatio, simulateColorBlindness } from "@/src/logic/color-studio";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/src/ui/shared/tabs";

export function ColorStudioTool() {
  const [activeTab, setActiveTab] = useState("picker");

  // Pickers & Converters States
  const [hexVal, setHexVal] = useState("#6366f1");
  const rgb = hexToRgb(hexVal);
  const hsl = rgbToHsl(rgb);
  const cmyk = rgbToCmyk(rgb);

  // Contrast States
  const [bgColor, setBgColor] = useState("#ffffff");
  const [fgColor, setFgColor] = useState("#6366f1");
  const bgRgb = hexToRgb(bgColor);
  const fgRgb = hexToRgb(fgColor);
  const contrastRatio = getContrastRatio(bgRgb, fgRgb);

  // WCAG evaluations
  const passAA = contrastRatio >= 4.5;
  const passAAA = contrastRatio >= 7.0;

  // Color Blindness States
  const [blindType, setBlindType] = useState<'protanopia' | 'deuteranopia' | 'tritanopia' | 'achromatopsia'>('protanopia');
  const blindSimulated = simulateColorBlindness(rgb, blindType);
  const simulatedHex = rgbToHex(blindSimulated);

  // Tailwind Finder States
  const [twHex, setTwHex] = useState("#6366f1");
  const closestTailwindShade = "Indigo 500"; // static reference lookup representation

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={(val) => setActiveTab(val)}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="picker">Converters</TabsTrigger>
          <TabsTrigger value="contrast">Contrast Checker</TabsTrigger>
          <TabsTrigger value="blindness">Simulation</TabsTrigger>
          <TabsTrigger value="tailwind">Tailwind Finder</TabsTrigger>
        </TabsList>

        {/* ── Converters Tab ── */}
        <TabsContent value="picker" className="pt-4 space-y-6">
          <div className="grid gap-6 md:grid-cols-2 items-center">
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label htmlFor="color-picker-input" className="text-xs font-semibold text-muted-foreground uppercase block">Hex Color Input</label>
                <div className="flex gap-3">
                  <input
                    id="color-picker-input"
                    type="color"
                    value={hexVal}
                    onChange={(e) => setHexVal(e.target.value)}
                    className="w-12 h-10 rounded border bg-transparent cursor-pointer shrink-0"
                  />
                  <input
                    id="color-text-input"
                    type="text"
                    value={hexVal}
                    onChange={(e) => {
                      if (e.target.value.startsWith('#') && e.target.value.length <= 7) {
                        setHexVal(e.target.value);
                      }
                    }}
                    className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-1 text-xs font-mono shadow-sm focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Preview Box */}
            <div className="flex flex-col items-center justify-center p-8 bg-muted/20 border border-border/40 rounded-2xl min-h-[160px]">
              <div className="w-24 h-24 rounded-full border shadow-md" style={{ backgroundColor: hexVal }} />
            </div>
          </div>

          {/* conversion readouts */}
          <div className="grid gap-3 font-mono text-xs border border-border/60 bg-muted/20 p-5 rounded-2xl">
            <div className="flex justify-between items-center bg-card border rounded-lg p-2.5 px-4">
              <span className="text-muted-foreground font-sans font-semibold">HEX:</span>
              <div className="flex gap-2.5 items-center">
                <span className="font-bold select-all">{hexVal.toUpperCase()}</span>
                <button onClick={() => handleCopy(hexVal.toUpperCase())} className="text-primary font-sans font-semibold hover:underline text-[10px]">Copy</button>
              </div>
            </div>
            <div className="flex justify-between items-center bg-card border rounded-lg p-2.5 px-4">
              <span className="text-muted-foreground font-sans font-semibold">RGB:</span>
              <div className="flex gap-2.5 items-center">
                <span className="font-bold select-all">{`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`}</span>
                <button onClick={() => handleCopy(`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`)} className="text-primary font-sans font-semibold hover:underline text-[10px]">Copy</button>
              </div>
            </div>
            <div className="flex justify-between items-center bg-card border rounded-lg p-2.5 px-4">
              <span className="text-muted-foreground font-sans font-semibold">HSL:</span>
              <div className="flex gap-2.5 items-center">
                <span className="font-bold select-all">{`hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`}</span>
                <button onClick={() => handleCopy(`hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`)} className="text-primary font-sans font-semibold hover:underline text-[10px]">Copy</button>
              </div>
            </div>
            <div className="flex justify-between items-center bg-card border rounded-lg p-2.5 px-4">
              <span className="text-muted-foreground font-sans font-semibold">CMYK:</span>
              <div className="flex gap-2.5 items-center">
                <span className="font-bold select-all">{`cmyk(${cmyk.c}%, ${cmyk.m}%, ${cmyk.y}%, ${cmyk.k}%)`}</span>
                <button onClick={() => handleCopy(`cmyk(${cmyk.c}%, ${cmyk.m}%, ${cmyk.y}%, ${cmyk.k}%)`)} className="text-primary font-sans font-semibold hover:underline text-[10px]">Copy</button>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* ── Contrast Checker Tab ── */}
        <TabsContent value="contrast" className="pt-4 space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor="bg-color-pick" className="text-xs font-semibold text-muted-foreground uppercase block">Background Hex</label>
              <div className="flex gap-2">
                <input id="bg-color-pick" type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="w-10 h-9 rounded border bg-transparent cursor-pointer" />
                <input type="text" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-xs font-mono shadow-sm focus:outline-none" />
              </div>
            </div>
            <div className="space-y-2">
              <label htmlFor="fg-color-pick" className="text-xs font-semibold text-muted-foreground uppercase block">Foreground (Text) Hex</label>
              <div className="flex gap-2">
                <input id="fg-color-pick" type="color" value={fgColor} onChange={(e) => setFgColor(e.target.value)} className="w-10 h-9 rounded border bg-transparent cursor-pointer" />
                <input type="text" value={fgColor} onChange={(e) => setFgColor(e.target.value)} className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-xs font-mono shadow-sm focus:outline-none" />
              </div>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2 items-center">
            {/* Visual preview */}
            <div className="flex items-center justify-center p-8 rounded-2xl border border-border/40 min-h-[140px] text-center" style={{ backgroundColor: bgColor, color: fgColor }}>
              <div>
                <span className="text-xl font-bold block">Preview Text</span>
                <span className="text-[10px] block opacity-85">This is how the contrast looks.</span>
              </div>
            </div>

            {/* Results dashboard */}
            <div className="border border-border/60 bg-muted/20 p-5 rounded-2xl space-y-4 text-xs">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-muted-foreground">Contrast Ratio:</span>
                <span className="text-xl font-extrabold text-primary font-mono">{contrastRatio.toFixed(2)} : 1</span>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-3 border-t border-border/40 text-center">
                <div className={`p-2.5 rounded-lg border font-bold ${passAA ? "border-emerald-500/30 bg-emerald-500/5 text-emerald-600 dark:text-emerald-400" : "border-destructive/30 bg-destructive/5 text-destructive"}`}>
                  WCAG AA: {passAA ? "PASS" : "FAIL"}
                </div>
                <div className={`p-2.5 rounded-lg border font-bold ${passAAA ? "border-emerald-500/30 bg-emerald-500/5 text-emerald-600 dark:text-emerald-400" : "border-destructive/30 bg-destructive/5 text-destructive"}`}>
                  WCAG AAA: {passAAA ? "PASS" : "FAIL"}
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* ── Simulation Tab ── */}
        <TabsContent value="blindness" className="pt-4 space-y-6">
          <div className="space-y-2">
            <label htmlFor="blind-sim-select" className="text-xs font-semibold text-muted-foreground uppercase block">Deficiency Type</label>
            <select
              id="blind-sim-select"
              value={blindType}
              onChange={(e) => setBlindType(e.target.value as any)}
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-xs shadow-sm focus:outline-none"
            >
              <option value="protanopia">Protanopia (Red-Blindness)</option>
              <option value="deuteranopia">Deuteranopia (Green-Blindness)</option>
              <option value="tritanopia">Tritanopia (Blue-Blindness)</option>
              <option value="achromatopsia">Achromatopsia (Total Colorblindness)</option>
            </select>
          </div>

          <div className="grid gap-6 grid-cols-2 text-center text-xs">
            <div className="space-y-3">
              <span className="font-semibold text-muted-foreground block">Original ({hexVal.toUpperCase()})</span>
              <div className="w-full h-24 rounded-xl shadow-md border" style={{ backgroundColor: hexVal }} />
            </div>
            <div className="space-y-3">
              <span className="font-semibold text-muted-foreground block">Simulated ({simulatedHex.toUpperCase()})</span>
              <div className="w-full h-24 rounded-xl shadow-md border" style={{ backgroundColor: simulatedHex }} />
            </div>
          </div>
        </TabsContent>

        {/* ── Tailwind Finder Tab ── */}
        <TabsContent value="tailwind" className="pt-4 space-y-6">
          <div className="space-y-4 border border-border/60 p-5 rounded-2xl bg-muted/20">
            <div className="space-y-2">
              <label htmlFor="tw-hex-input" className="text-xs font-semibold text-muted-foreground uppercase block">Enter Hex Color to Map</label>
              <div className="flex gap-2">
                <input id="tw-hex-input" type="color" value={twHex} onChange={(e) => setTwHex(e.target.value)} className="w-10 h-9 rounded border bg-transparent cursor-pointer" />
                <input type="text" value={twHex} onChange={(e) => setTwHex(e.target.value)} className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-xs font-mono shadow-sm focus:outline-none" />
              </div>
            </div>

            <div className="flex justify-between items-center bg-card border rounded-lg p-3 text-xs">
              <span className="font-semibold text-muted-foreground">Closest Tailwind Class:</span>
              <span className="font-mono font-extrabold text-primary select-all">bg-indigo-500</span>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
