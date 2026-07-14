"use client";

import { useState } from "react";
import { parseHex, parseRgb, parseHsl, generatePalette, type ColorFormats } from "@/src/logic/color-utils";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/src/ui/shared/tabs";

export function ColorPickerTool() {
  const [activeTab, setActiveTab] = useState("picker");

  // Base state
  const [colorState, setColorState] = useState<ColorFormats>({
    hex: "#4f46e5",
    rgb: "rgb(79, 70, 229)",
    hsl: "hsl(243, 75%, 59%)"
  });

  const [hexInput, setHexInput] = useState("#4f46e5");
  const [rgbInput, setRgbInput] = useState("rgb(79, 70, 229)");
  const [hslInput, setHslInput] = useState("hsl(243, 75%, 59%)");
  const [paletteMode, setPaletteMode] = useState<'analogous' | 'monochromatic' | 'triad' | 'complementary'>("complementary");
  const [error, setError] = useState("");

  const updateColor = (newFormats: ColorFormats) => {
    setError("");
    setColorState(newFormats);
    setHexInput(newFormats.hex);
    setRgbInput(newFormats.rgb);
    setHslInput(newFormats.hsl);
  };

  const handleHexChange = (val: string) => {
    setHexInput(val);
    try {
      if (val.length >= 4) {
        const parsed = parseHex(val);
        updateColor(parsed);
      }
    } catch (e) {
      // typing in progress
    }
  };

  const handleRgbChange = (val: string) => {
    setRgbInput(val);
    try {
      const parsed = parseRgb(val);
      updateColor(parsed);
    } catch (e) {
      // typing
    }
  };

  const handleHslChange = (val: string) => {
    setHslInput(val);
    try {
      const parsed = parseHsl(val);
      updateColor(parsed);
    } catch (e) {
      // typing
    }
  };

  const handlePickerChange = (val: string) => {
    try {
      const parsed = parseHex(val);
      updateColor(parsed);
    } catch (e) {
      // ignore
    }
  };

  const palette = generatePalette(colorState.hex, paletteMode);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={(val) => { setActiveTab(val); setError(""); }}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="picker">Color Picker & Converter</TabsTrigger>
          <TabsTrigger value="palette">Palette Generator</TabsTrigger>
        </TabsList>

        <TabsContent value="picker" className="space-y-6 pt-4">
          <div className="flex flex-col sm:flex-row gap-6 items-center bg-muted/20 border border-border/40 p-6 rounded-2xl">
            {/* Color block */}
            <div className="relative w-28 h-28 rounded-2xl shadow border border-border/60 shrink-0 overflow-hidden">
              <input
                type="color"
                value={colorState.hex}
                onChange={(e) => handlePickerChange(e.target.value)}
                className="absolute inset-0 w-full h-full cursor-pointer opacity-0"
              />
              <div
                className="w-full h-full"
                style={{ backgroundColor: colorState.hex }}
              />
            </div>

            <div className="grid gap-3 w-full text-xs font-mono">
              <div className="flex justify-between items-center bg-card border rounded-lg p-2 px-3">
                <span className="text-muted-foreground font-sans">HEX:</span>
                <div className="flex gap-2 items-center">
                  <input
                    type="text"
                    value={hexInput}
                    onChange={(e) => handleHexChange(e.target.value)}
                    className="w-20 bg-transparent text-right outline-none font-bold"
                  />
                  <button onClick={() => handleCopy(colorState.hex)} className="text-primary hover:underline text-[10px]">Copy</button>
                </div>
              </div>
              <div className="flex justify-between items-center bg-card border rounded-lg p-2 px-3">
                <span className="text-muted-foreground font-sans">RGB:</span>
                <div className="flex gap-2 items-center">
                  <input
                    type="text"
                    value={rgbInput}
                    onChange={(e) => handleRgbChange(e.target.value)}
                    className="w-40 bg-transparent text-right outline-none font-bold"
                  />
                  <button onClick={() => handleCopy(colorState.rgb)} className="text-primary hover:underline text-[10px]">Copy</button>
                </div>
              </div>
              <div className="flex justify-between items-center bg-card border rounded-lg p-2 px-3">
                <span className="text-muted-foreground font-sans">HSL:</span>
                <div className="flex gap-2 items-center">
                  <input
                    type="text"
                    value={hslInput}
                    onChange={(e) => handleHslChange(e.target.value)}
                    className="w-40 bg-transparent text-right outline-none font-bold"
                  />
                  <button onClick={() => handleCopy(colorState.hsl)} className="text-primary hover:underline text-[10px]">Copy</button>
                </div>
              </div>
            </div>
          </div>
          
          <p className="text-[10px] text-muted-foreground text-center">Click the color box to open standard system color palette pickers.</p>
        </TabsContent>

        <TabsContent value="palette" className="space-y-6 pt-4">
          <div className="flex flex-wrap gap-4 items-center justify-between border-b border-border/40 pb-4">
            <div className="flex items-center gap-3">
              {/* small indicator */}
              <div className="w-8 h-8 rounded-lg border" style={{ backgroundColor: colorState.hex }} />
              <div>
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Base Color</span>
                <span className="text-xs font-mono font-bold text-foreground">{colorState.hex}</span>
              </div>
            </div>

            <div className="space-y-1">
              <select
                value={paletteMode}
                onChange={(e) => setPaletteMode(e.target.value as any)}
                className="flex h-9 rounded-md border border-input bg-transparent px-3 py-1 text-xs shadow-sm focus:outline-none"
              >
                <option value="complementary">Complementary Colors</option>
                <option value="analogous">Analogous Harmony</option>
                <option value="triad">Triad Palette</option>
                <option value="monochromatic">Monochromatic Tints</option>
              </select>
            </div>
          </div>

          {/* Palette Blocks grid */}
          <div className="grid gap-4 grid-cols-2 sm:grid-cols-5">
            {palette.map((color, idx) => (
              <div key={idx} className="border border-border/60 bg-card rounded-xl overflow-hidden shadow-sm flex flex-col">
                <div className="h-20 w-full" style={{ backgroundColor: color }} />
                <div className="p-3 text-center space-y-1">
                  <span className="text-[10px] font-mono font-bold block">{color}</span>
                  <button
                    onClick={() => handleCopy(color)}
                    className="text-[10px] text-primary font-semibold hover:underline"
                  >
                    Copy
                  </button>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
