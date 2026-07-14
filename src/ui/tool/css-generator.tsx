"use client";

import { useState } from "react";
import { calculateClamp, generateNeumorphicStyles } from "@/src/logic/css-generator";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/src/ui/shared/tabs";

export function CssGeneratorTool() {
  const [activeTab, setActiveTab] = useState("shadow");

  // Copy helper
  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  // 1. Box Shadow States
  const [shadowX, setShadowX] = useState(10);
  const [shadowY, setShadowY] = useState(10);
  const [shadowBlur, setShadowBlur] = useState(20);
  const [shadowSpread, setShadowSpread] = useState(0);
  const [shadowColor, setShadowColor] = useState("rgba(0,0,0,0.2)");
  const [shadowInset, setShadowInset] = useState(false);

  const shadowCss = `box-shadow: ${shadowInset ? "inset " : ""}${shadowX}px ${shadowY}px ${shadowBlur}px ${shadowSpread}px ${shadowColor};`;

  // 2. Border Radius States
  const [radAll, setRadAll] = useState(16);
  const [radTopLeft, setRadTopLeft] = useState(16);
  const [radTopRight, setRadTopRight] = useState(16);
  const [radBottomRight, setRadBottomRight] = useState(16);
  const [radBottomLeft, setRadBottomLeft] = useState(16);
  const [splitCorners, setSplitCorners] = useState(false);

  const borderRadiusCss = splitCorners 
    ? `border-radius: ${radTopLeft}px ${radTopRight}px ${radBottomRight}px ${radBottomLeft}px;`
    : `border-radius: ${radAll}px;`;

  // 3. Glassmorphism States
  const [glassBgOpacity, setGlassBgOpacity] = useState(0.15);
  const [glassBlur, setGlassBlur] = useState(12);
  const [glassBorderOpacity, setGlassBorderOpacity] = useState(0.2);

  const glassCss = `background: rgba(255, 255, 255, ${glassBgOpacity});\nbackdrop-filter: blur(${glassBlur}px);\n-webkit-backdrop-filter: blur(${glassBlur}px);\nborder: 1px solid rgba(255, 255, 255, ${glassBorderOpacity});`;

  // 4. Neumorphism States
  const [neuColor, setNeuColor] = useState("#e0e0e0");
  const [neuDistance, setNeuDistance] = useState(20);
  const [neuIntensity, setNeuIntensity] = useState(0.15);
  const [neuBlur, setNeuBlur] = useState(40);
  const [neuShape, setNeuShape] = useState<'flat' | 'concave' | 'convex' | 'pressed'>('flat');

  const neuResult = generateNeumorphicStyles(neuColor, neuDistance, neuIntensity, neuBlur, neuShape);
  const neuCss = `background: ${neuResult.background};\nbox-shadow: ${neuResult.boxShadow};`;

  // 5. Gradient States
  const [gradColor1, setGradColor1] = useState("#6366f1");
  const [gradColor2, setGradColor2] = useState("#a855f7");
  const [gradAngle, setGradAngle] = useState(135);
  const [gradType, setGradType] = useState<"linear" | "radial">("linear");

  const gradientCss = gradType === "linear"
    ? `background: linear-gradient(${gradAngle}deg, ${gradColor1}, ${gradColor2});`
    : `background: radial-gradient(circle, ${gradColor1}, ${gradColor2});`;

  // 6. Clamp Calculator States
  const [clampMinSize, setClampMinSize] = useState(16);
  const [clampMaxSize, setClampMaxSize] = useState(32);
  const [clampMinWidth, setClampMinWidth] = useState(320);
  const [clampMaxWidth, setClampMaxWidth] = useState(1200);

  const clampResult = calculateClamp(clampMinSize, clampMaxSize, clampMinWidth, clampMaxWidth);

  // 7. CSS Filters States
  const [filterBlur, setFilterBlur] = useState(0);
  const [filterBrightness, setFilterBrightness] = useState(100);
  const [filterContrast, setFilterContrast] = useState(100);
  const [filterGrayscale, setFilterGrayscale] = useState(0);
  const [filterHue, setFilterHue] = useState(0);
  const [filterInvert, setFilterInvert] = useState(0);
  const [filterSaturate, setFilterSaturate] = useState(100);
  const [filterSepia, setFilterSepia] = useState(0);

  const filterCss = `filter: blur(${filterBlur}px) brightness(${filterBrightness}%) contrast(${filterContrast}%) grayscale(${filterGrayscale}%) hue-rotate(${filterHue}deg) invert(${filterInvert}%) saturate(${filterSaturate}%) sepia(${filterSepia}%);`;

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={(val) => setActiveTab(val)}>
        <TabsList className="flex flex-wrap gap-1 h-auto bg-transparent border-b p-0 rounded-none w-full">
          {["shadow", "radius", "glass", "neumorphism", "gradient", "clamp", "filters"].map((tab) => (
            <TabsTrigger
              key={tab}
              value={tab}
              className="text-xs px-4 py-2 border-b-2 border-transparent rounded-none data-[state=active]:border-primary data-[state=active]:bg-transparent shadow-none"
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </TabsTrigger>
          ))}
        </TabsList>

        {/* ── Box Shadow ── */}
        <TabsContent value="shadow" className="pt-4 space-y-6">
          <div className="grid gap-6 md:grid-cols-2 items-center">
            <div className="space-y-4">
              <div className="space-y-1.5">
                <span className="text-xs font-semibold text-muted-foreground uppercase block">Horizontal Offset ({shadowX}px)</span>
                <input type="range" min={-50} max={50} value={shadowX} onChange={(e) => setShadowX(Number(e.target.value))} className="w-full" />
              </div>
              <div className="space-y-1.5">
                <span className="text-xs font-semibold text-muted-foreground uppercase block">Vertical Offset ({shadowY}px)</span>
                <input type="range" min={-50} max={50} value={shadowY} onChange={(e) => setShadowY(Number(e.target.value))} className="w-full" />
              </div>
              <div className="space-y-1.5">
                <span className="text-xs font-semibold text-muted-foreground uppercase block">Blur Radius ({shadowBlur}px)</span>
                <input type="range" min={0} max={100} value={shadowBlur} onChange={(e) => setShadowBlur(Number(e.target.value))} className="w-full" />
              </div>
              <div className="space-y-1.5">
                <span className="text-xs font-semibold text-muted-foreground uppercase block">Spread Radius ({shadowSpread}px)</span>
                <input type="range" min={-30} max={30} value={shadowSpread} onChange={(e) => setShadowSpread(Number(e.target.value))} className="w-full" />
              </div>
              <div className="flex gap-4 items-center pt-2">
                <label className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase cursor-pointer">
                  <input type="checkbox" checked={shadowInset} onChange={(e) => setShadowInset(e.target.checked)} className="rounded border-border bg-transparent" />
                  Inset Shadow
                </label>
              </div>
            </div>

            {/* Preview Box */}
            <div className="flex flex-col items-center justify-center p-8 bg-muted/20 border border-border/40 rounded-2xl min-h-[220px]">
              <div
                className="w-32 h-32 bg-card rounded-2xl border transition-all"
                style={{ boxShadow: `${shadowInset ? "inset " : ""}${shadowX}px ${shadowY}px ${shadowBlur}px ${shadowSpread}px ${shadowColor}` }}
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">CSS Output</span>
              <button onClick={() => handleCopy(shadowCss)} className="text-xs bg-secondary/80 hover:bg-secondary px-3 py-1 rounded transition-colors">Copy CSS</button>
            </div>
            <pre className="p-4 border border-border/60 rounded-xl bg-muted/30 text-xs font-mono select-all">
              {shadowCss}
            </pre>
          </div>
        </TabsContent>

        {/* ── Border Radius ── */}
        <TabsContent value="radius" className="pt-4 space-y-6">
          <div className="grid gap-6 md:grid-cols-2 items-center">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase cursor-pointer pb-2">
                <input type="checkbox" checked={splitCorners} onChange={(e) => setSplitCorners(e.target.checked)} className="rounded border-border bg-transparent" />
                Control Corners Individually
              </div>

              {!splitCorners ? (
                <div className="space-y-1.5">
                  <span className="text-xs font-semibold text-muted-foreground uppercase block">All Corners ({radAll}px)</span>
                  <input type="range" min={0} max={100} value={radAll} onChange={(e) => setRadAll(Number(e.target.value))} className="w-full" />
                </div>
              ) : (
                <div className="grid gap-4 grid-cols-2">
                  <div className="space-y-1.5">
                    <span className="text-xs font-semibold text-muted-foreground uppercase block">Top Left ({radTopLeft}px)</span>
                    <input type="range" min={0} max={100} value={radTopLeft} onChange={(e) => setRadTopLeft(Number(e.target.value))} className="w-full" />
                  </div>
                  <div className="space-y-1.5">
                    <span className="text-xs font-semibold text-muted-foreground uppercase block">Top Right ({radTopRight}px)</span>
                    <input type="range" min={0} max={100} value={radTopRight} onChange={(e) => setRadTopRight(Number(e.target.value))} className="w-full" />
                  </div>
                  <div className="space-y-1.5">
                    <span className="text-xs font-semibold text-muted-foreground uppercase block">Bottom Right ({radBottomRight}px)</span>
                    <input type="range" min={0} max={100} value={radBottomRight} onChange={(e) => setRadBottomRight(Number(e.target.value))} className="w-full" />
                  </div>
                  <div className="space-y-1.5">
                    <span className="text-xs font-semibold text-muted-foreground uppercase block">Bottom Left ({radBottomLeft}px)</span>
                    <input type="range" min={0} max={100} value={radBottomLeft} onChange={(e) => setRadBottomLeft(Number(e.target.value))} className="w-full" />
                  </div>
                </div>
              )}
            </div>

            {/* Preview Box */}
            <div className="flex flex-col items-center justify-center p-8 bg-muted/20 border border-border/40 rounded-2xl min-h-[220px]">
              <div
                className="w-32 h-32 bg-primary border transition-all"
                style={{ borderRadius: splitCorners ? `${radTopLeft}px ${radTopRight}px ${radBottomRight}px ${radBottomLeft}px` : `${radAll}px` }}
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">CSS Output</span>
              <button onClick={() => handleCopy(borderRadiusCss)} className="text-xs bg-secondary/80 hover:bg-secondary px-3 py-1 rounded transition-colors">Copy CSS</button>
            </div>
            <pre className="p-4 border border-border/60 rounded-xl bg-muted/30 text-xs font-mono select-all">
              {borderRadiusCss}
            </pre>
          </div>
        </TabsContent>

        {/* ── Glassmorphism ── */}
        <TabsContent value="glass" className="pt-4 space-y-6">
          <div className="grid gap-6 md:grid-cols-2 items-center">
            <div className="space-y-4">
              <div className="space-y-1.5">
                <span className="text-xs font-semibold text-muted-foreground uppercase block">Background Opacity ({glassBgOpacity})</span>
                <input type="range" min={0} max={1} step={0.05} value={glassBgOpacity} onChange={(e) => setGlassBgOpacity(Number(e.target.value))} className="w-full" />
              </div>
              <div className="space-y-1.5">
                <span className="text-xs font-semibold text-muted-foreground uppercase block">Backdrop Blur ({glassBlur}px)</span>
                <input type="range" min={0} max={40} value={glassBlur} onChange={(e) => setGlassBlur(Number(e.target.value))} className="w-full" />
              </div>
              <div className="space-y-1.5">
                <span className="text-xs font-semibold text-muted-foreground uppercase block">Border Opacity ({glassBorderOpacity})</span>
                <input type="range" min={0} max={1} step={0.05} value={glassBorderOpacity} onChange={(e) => setGlassBorderOpacity(Number(e.target.value))} className="w-full" />
              </div>
            </div>

            {/* Preview Box */}
            <div className="flex flex-col items-center justify-center p-8 bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 border border-border/40 rounded-2xl min-h-[220px] relative overflow-hidden">
              {/* Background floating nodes inside glass box to show blur */}
              <div className="absolute top-8 left-12 w-12 h-12 rounded-full bg-yellow-400 animate-pulse" />
              <div className="absolute bottom-8 right-12 w-16 h-16 rounded-full bg-cyan-400" />
              <div
                className="w-40 h-28 rounded-2xl relative z-10 flex items-center justify-center text-xs font-bold text-white shadow-xl"
                style={{
                  background: `rgba(255, 255, 255, ${glassBgOpacity})`,
                  backdropFilter: `blur(${glassBlur}px)`,
                  WebkitBackdropFilter: `blur(${glassBlur}px)`,
                  border: `1px solid rgba(255, 255, 255, ${glassBorderOpacity})`
                }}
              >
                Glass Container
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">CSS Output</span>
              <button onClick={() => handleCopy(glassCss)} className="text-xs bg-secondary/80 hover:bg-secondary px-3 py-1 rounded transition-colors">Copy CSS</button>
            </div>
            <pre className="p-4 border border-border/60 rounded-xl bg-muted/30 text-xs font-mono select-all">
              {glassCss}
            </pre>
          </div>
        </TabsContent>

        {/* ── Neumorphism ── */}
        <TabsContent value="neumorphism" className="pt-4 space-y-6">
          <div className="grid gap-6 md:grid-cols-2 items-center">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label htmlFor="neu-color-input" className="text-xs font-semibold text-muted-foreground uppercase block">Base Hex Color</label>
                  <input id="neu-color-input" type="color" value={neuColor} onChange={(e) => setNeuColor(e.target.value)} className="w-full h-9 rounded border bg-transparent cursor-pointer" />
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="neu-shape-select" className="text-xs font-semibold text-muted-foreground uppercase block">Shaping Mode</label>
                  <select id="neu-shape-select" value={neuShape} onChange={(e) => setNeuShape(e.target.value as any)} className="w-full h-9 rounded border bg-transparent text-xs p-1">
                    <option value="flat">Flat</option>
                    <option value="concave">Concave</option>
                    <option value="convex">Convex</option>
                    <option value="pressed">Pressed (Inset)</option>
                  </select>
                </div>
              </div>
              <div className="space-y-1.5">
                <span className="text-xs font-semibold text-muted-foreground uppercase block">Shadow Offset ({neuDistance}px)</span>
                <input type="range" min={5} max={50} value={neuDistance} onChange={(e) => setNeuDistance(Number(e.target.value))} className="w-full" />
              </div>
              <div className="space-y-1.5">
                <span className="text-xs font-semibold text-muted-foreground uppercase block">Shadow Blur ({neuBlur}px)</span>
                <input type="range" min={10} max={100} value={neuBlur} onChange={(e) => setNeuBlur(Number(e.target.value))} className="w-full" />
              </div>
            </div>

            {/* Preview Box */}
            <div className="flex flex-col items-center justify-center p-8 border border-border/40 rounded-2xl min-h-[220px]" style={{ backgroundColor: neuColor }}>
              <div
                className="w-32 h-32 transition-all rounded-3xl"
                style={{
                  background: neuResult.background,
                  boxShadow: neuResult.boxShadow
                }}
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">CSS Output</span>
              <button onClick={() => handleCopy(neuCss)} className="text-xs bg-secondary/80 hover:bg-secondary px-3 py-1 rounded transition-colors">Copy CSS</button>
            </div>
            <pre className="p-4 border border-border/60 rounded-xl bg-muted/30 text-xs font-mono select-all">
              {neuCss}
            </pre>
          </div>
        </TabsContent>

        {/* ── Gradient ── */}
        <TabsContent value="gradient" className="pt-4 space-y-6">
          <div className="grid gap-6 md:grid-cols-2 items-center">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label htmlFor="grad-color1" className="text-xs font-semibold text-muted-foreground uppercase block">Start Color</label>
                  <input id="grad-color1" type="color" value={gradColor1} onChange={(e) => setGradColor1(e.target.value)} className="w-full h-9 rounded border bg-transparent cursor-pointer" />
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="grad-color2" className="text-xs font-semibold text-muted-foreground uppercase block">End Color</label>
                  <input id="grad-color2" type="color" value={gradColor2} onChange={(e) => setGradColor2(e.target.value)} className="w-full h-9 rounded border bg-transparent cursor-pointer" />
                </div>
              </div>
              <div className="space-y-1.5">
                <span className="text-xs font-semibold text-muted-foreground uppercase block">Angle ({gradAngle}deg)</span>
                <input type="range" min={0} max={360} value={gradAngle} onChange={(e) => setGradAngle(Number(e.target.value))} className="w-full" disabled={gradType === "radial"} />
              </div>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase cursor-pointer">
                  <input type="radio" name="gradtype" checked={gradType === "linear"} onChange={() => setGradType("linear")} className="border-border bg-transparent" />
                  Linear
                </label>
                <label className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase cursor-pointer">
                  <input type="radio" name="gradtype" checked={gradType === "radial"} onChange={() => setGradType("radial")} className="border-border bg-transparent" />
                  Radial
                </label>
              </div>
            </div>

            {/* Preview Box */}
            <div className="flex flex-col items-center justify-center p-8 bg-muted/20 border border-border/40 rounded-2xl min-h-[220px]">
              <div
                className="w-48 h-32 rounded-2xl border transition-all shadow-md"
                style={{
                  background: gradType === "linear"
                    ? `linear-gradient(${gradAngle}deg, ${gradColor1}, ${gradColor2})`
                    : `radial-gradient(circle, ${gradColor1}, ${gradColor2})`
                }}
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">CSS Output</span>
              <button onClick={() => handleCopy(gradientCss)} className="text-xs bg-secondary/80 hover:bg-secondary px-3 py-1 rounded transition-colors">Copy CSS</button>
            </div>
            <pre className="p-4 border border-border/60 rounded-xl bg-muted/30 text-xs font-mono select-all">
              {gradientCss}
            </pre>
          </div>
        </TabsContent>

        {/* ── Clamp Calculator ── */}
        <TabsContent value="clamp" className="pt-4 space-y-6">
          <div className="grid gap-4 sm:grid-cols-4 items-end">
            <div className="space-y-1.5">
              <label htmlFor="clamp-min-size" className="text-xs font-semibold text-muted-foreground uppercase block">Min Size (px)</label>
              <input id="clamp-min-size" type="number" value={clampMinSize} onChange={(e) => setClampMinSize(Number(e.target.value))} className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-xs shadow-sm focus:outline-none" />
            </div>
            <div className="space-y-1.5">
              <label htmlFor="clamp-max-size" className="text-xs font-semibold text-muted-foreground uppercase block">Max Size (px)</label>
              <input id="clamp-max-size" type="number" value={clampMaxSize} onChange={(e) => setClampMaxSize(Number(e.target.value))} className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-xs shadow-sm focus:outline-none" />
            </div>
            <div className="space-y-1.5">
              <label htmlFor="clamp-min-width" className="text-xs font-semibold text-muted-foreground uppercase block">Min Viewport (px)</label>
              <input id="clamp-min-width" type="number" value={clampMinWidth} onChange={(e) => setClampMinWidth(Number(e.target.value))} className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-xs shadow-sm focus:outline-none" />
            </div>
            <div className="space-y-1.5">
              <label htmlFor="clamp-max-width" className="text-xs font-semibold text-muted-foreground uppercase block">Max Viewport (px)</label>
              <input id="clamp-max-width" type="number" value={clampMaxWidth} onChange={(e) => setClampMaxWidth(Number(e.target.value))} className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-xs shadow-sm focus:outline-none" />
            </div>
          </div>

          <div className="p-4 rounded-xl border border-border/40 bg-muted/20 text-xs leading-relaxed text-muted-foreground">
            {clampResult.explanation}
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">CSS Clamp Output</span>
              <button onClick={() => handleCopy(clampResult.clampExpression)} className="text-xs bg-secondary/80 hover:bg-secondary px-3 py-1 rounded transition-colors">Copy CSS</button>
            </div>
            <pre className="p-4 border border-border/60 rounded-xl bg-muted/30 text-xs font-mono select-all">
              font-size: {clampResult.clampExpression};
            </pre>
          </div>
        </TabsContent>

        {/* ── CSS Filters ── */}
        <TabsContent value="filters" className="pt-4 space-y-6">
          <div className="grid gap-6 md:grid-cols-2 items-center">
            <div className="space-y-3">
              <div className="space-y-1">
                <span className="text-xs font-semibold text-muted-foreground uppercase block">Blur ({filterBlur}px)</span>
                <input type="range" min={0} max={10} value={filterBlur} onChange={(e) => setFilterBlur(Number(e.target.value))} className="w-full" />
              </div>
              <div className="space-y-1">
                <span className="text-xs font-semibold text-muted-foreground uppercase block">Brightness ({filterBrightness}%)</span>
                <input type="range" min={50} max={150} value={filterBrightness} onChange={(e) => setFilterBrightness(Number(e.target.value))} className="w-full" />
              </div>
              <div className="space-y-1">
                <span className="text-xs font-semibold text-muted-foreground uppercase block">Contrast ({filterContrast}%)</span>
                <input type="range" min={50} max={150} value={filterContrast} onChange={(e) => setFilterContrast(Number(e.target.value))} className="w-full" />
              </div>
              <div className="space-y-1">
                <span className="text-xs font-semibold text-muted-foreground uppercase block">Grayscale ({filterGrayscale}%)</span>
                <input type="range" min={0} max={100} value={filterGrayscale} onChange={(e) => setFilterGrayscale(Number(e.target.value))} className="w-full" />
              </div>
              <div className="space-y-1">
                <span className="text-xs font-semibold text-muted-foreground uppercase block">Hue Rotate ({filterHue}deg)</span>
                <input type="range" min={0} max={360} value={filterHue} onChange={(e) => setFilterHue(Number(e.target.value))} className="w-full" />
              </div>
              <div className="space-y-1">
                <span className="text-xs font-semibold text-muted-foreground uppercase block">Sepia ({filterSepia}%)</span>
                <input type="range" min={0} max={100} value={filterSepia} onChange={(e) => setFilterSepia(Number(e.target.value))} className="w-full" />
              </div>
            </div>

            {/* Preview Box */}
            <div className="flex flex-col items-center justify-center p-6 bg-muted/20 border border-border/40 rounded-2xl min-h-[220px]">
              <div className="w-40 h-28 border rounded-xl overflow-hidden shadow relative">
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{
                    backgroundImage: "url('https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=300')",
                    filter: `blur(${filterBlur}px) brightness(${filterBrightness}%) contrast(${filterContrast}%) grayscale(${filterGrayscale}%) hue-rotate(${filterHue}deg) invert(${filterInvert}%) saturate(${filterSaturate}%) sepia(${filterSepia}%)`
                  }}
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">CSS Output</span>
              <button onClick={() => handleCopy(filterCss)} className="text-xs bg-secondary/80 hover:bg-secondary px-3 py-1 rounded transition-colors">Copy CSS</button>
            </div>
            <pre className="p-4 border border-border/60 rounded-xl bg-muted/30 text-xs font-mono select-all">
              {filterCss}
            </pre>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
