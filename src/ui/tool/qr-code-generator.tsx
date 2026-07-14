"use client";

import { useState, useEffect } from "react";
import QRCode from "qrcode";
import { generateBarcode39 } from "@/src/logic/qr-barcode";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/src/ui/shared/tabs";
import { Button } from "@/src/ui/shared/button";
import { Input } from "@/src/ui/shared/input";
import { Label } from "@/src/ui/shared/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/ui/shared/select";
import { Download, Copy, Sparkles, Settings, Palette, QrCode, Check, RefreshCw, Eye } from "lucide-react";

// Predefined premium color presets for QR code styling
const DARK_COLOR_PRESETS = [
  { name: "Classic Black", value: "#000000" },
  { name: "Midnight Navy", value: "#0f172a" },
  { name: "Crimson Red", value: "#991b1b" },
  { name: "Forest Green", value: "#065f46" },
  { name: "Sunset Purple", value: "#581c87" },
  { name: "Deep Charcoal", value: "#1e293b" },
];

const LIGHT_COLOR_PRESETS = [
  { name: "Classic White", value: "#ffffff" },
  { name: "Soft Cream", value: "#fef3c7" },
  { name: "Cool Gray", value: "#f1f5f9" },
  { name: "Light Mint", value: "#ecfdf5" },
];

export function QrCodeGeneratorTool() {
  const [activeTab, setActiveTab] = useState("qr");

  // QR Code States
  const [qrText, setQrText] = useState("https://tools.warishlabs.in");
  const [qrSize, setQrSize] = useState(300);
  const [qrMargin, setQrMargin] = useState(4);
  const [qrEcc, setQrEcc] = useState<"L" | "M" | "Q" | "H">("M");
  const [qrColorDark, setQrColorDark] = useState("#000000");
  const [qrColorLight, setQrColorLight] = useState("#ffffff");

  // Output generated data
  const [qrDataUrl, setQrDataUrl] = useState("");
  const [qrSvgString, setQrSvgString] = useState("");
  const [error, setError] = useState("");
  
  // Status feedback states
  const [copied, setCopied] = useState(false);
  const [copiedSvg, setCopiedSvg] = useState(false);

  // Barcode States
  const [barcodeText, setBarcodeText] = useState("TOOLKIT");
  const [barcodeHeight, setBarcodeHeight] = useState(80);
  const [barcodeCopied, setBarcodeCopied] = useState(false);

  const barcode = generateBarcode39(barcodeText);

  // Generate QR Code dynamically
  useEffect(() => {
    let active = true;

    const timer = setTimeout(() => {
      if (!active) return;

      if (!qrText.trim()) {
        setQrDataUrl("");
        setQrSvgString("");
        setError("Please enter a valid text or URL payload.");
        return;
      }

      setError("");

      const options = {
        width: qrSize,
        margin: qrMargin,
        errorCorrectionLevel: qrEcc,
        color: {
          dark: qrColorDark,
          light: qrColorLight,
        },
      };

      // Generate PNG Data URL
      QRCode.toDataURL(qrText, options)
        .then((url) => {
          if (active) setQrDataUrl(url);
        })
        .catch((err) => {
          if (active) setError(err.message || "Failed to generate QR Code image.");
        });

      // Generate SVG string for download/clipboard
      QRCode.toString(qrText, { ...options, type: "svg" })
        .then((svgStr) => {
          if (active) setQrSvgString(svgStr);
        })
        .catch((err) => {
          console.error("Failed to generate SVG representation:", err);
        });
    }, 0);

    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [qrText, qrSize, qrMargin, qrEcc, qrColorDark, qrColorLight]);

  // Download QR Code as PNG
  const downloadPng = () => {
    if (!qrDataUrl) return;
    const link = document.createElement("a");
    link.href = qrDataUrl;
    link.download = `qrcode-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Download QR Code as SVG
  const downloadSvg = () => {
    if (!qrSvgString) return;
    const blob = new Blob([qrSvgString], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `qrcode-${Date.now()}.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Copy QR Image (Data URL) to Clipboard as Text URL or copy code
  const copyQrDataUrl = () => {
    if (!qrDataUrl) return;
    navigator.clipboard.writeText(qrDataUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  // Copy raw SVG markup to clipboard
  const copyQrSvgMarkup = () => {
    if (!qrSvgString) return;
    navigator.clipboard.writeText(qrSvgString).then(() => {
      setCopiedSvg(true);
      setTimeout(() => setCopiedSvg(false), 2000);
    });
  };

  // Download Barcode as SVG
  const downloadBarcodeSvg = () => {
    const svgEl = document.getElementById("barcode-svg");
    if (!svgEl) return;
    const svgString = new XMLSerializer().serializeToString(svgEl);
    const blob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `barcode-${barcodeText.toLowerCase()}-${Date.now()}.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Reset all options to classic styling
  const resetQrOptions = () => {
    setQrSize(300);
    setQrMargin(4);
    setQrEcc("M");
    setQrColorDark("#000000");
    setQrColorLight("#ffffff");
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={(val) => setActiveTab(val)}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="qr" className="gap-2">
            <QrCode className="h-4 w-4" /> QR Code Generator
          </TabsTrigger>
          <TabsTrigger value="barcode" className="gap-2">
            <Eye className="h-4 w-4" /> Barcode Generator (Code 39)
          </TabsTrigger>
        </TabsList>

        {/* ── QR CODE GENERATOR TAB ────────────────────────────────────────── */}
        <TabsContent value="qr" className="space-y-6 pt-4">
          <div className="grid gap-6 lg:grid-cols-12">
            
            {/* Inputs & Customization panel */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Content Input */}
              <div className="space-y-2 p-5 border border-border/50 bg-card/60 backdrop-blur-sm rounded-2xl">
                <Label htmlFor="qr-input" className="text-sm font-semibold flex items-center gap-1.5">
                  <Sparkles className="h-4 w-4 text-primary" /> Text or URL Payload
                </Label>
                <textarea
                  id="qr-input"
                  rows={3}
                  placeholder="e.g. https://tools.warishlabs.in or scan data string..."
                  value={qrText}
                  onChange={(e) => setQrText(e.target.value)}
                  className="flex w-full rounded-xl border border-input bg-transparent px-3 py-2 text-xs shadow-sm focus:outline-none focus:ring-1 focus:ring-primary/40 resize-none font-mono"
                />
                <span className="text-[10px] text-muted-foreground block text-right">
                  Payload size: <span className="font-semibold text-foreground">{qrText.length}</span> characters
                </span>
              </div>

              {/* Design Controls */}
              <div className="p-5 border border-border/50 bg-card/60 backdrop-blur-sm rounded-2xl space-y-5">
                <div className="flex items-center justify-between border-b border-border/40 pb-3">
                  <h3 className="text-sm font-semibold flex items-center gap-1.5">
                    <Settings className="h-4 w-4 text-muted-foreground" /> Customize QR Settings
                  </h3>
                  <Button variant="ghost" size="xs" onClick={resetQrOptions} className="text-[10px] gap-1">
                    <RefreshCw className="h-3 w-3" /> Reset Defaults
                  </Button>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  
                  {/* Size Select */}
                  <div className="space-y-1.5">
                    <Label htmlFor="qr-size-select" className="text-xs font-medium">Output Size</Label>
                    <Select value={String(qrSize)} onValueChange={(val) => setQrSize(Number(val))}>
                      <SelectTrigger id="qr-size-select" className="h-8 text-xs">
                        <SelectValue placeholder="Select size" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="150">Small (150x150)</SelectItem>
                        <SelectItem value="300">Standard (300x300)</SelectItem>
                        <SelectItem value="500">Medium (500x500)</SelectItem>
                        <SelectItem value="800">High-Res (800x800)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* ECC level Select */}
                  <div className="space-y-1.5">
                    <Label htmlFor="qr-ecc-select" className="text-xs font-medium">Error Correction</Label>
                    <Select value={qrEcc} onValueChange={(val) => setQrEcc(val as "L" | "M" | "Q" | "H")}>
                      <SelectTrigger id="qr-ecc-select" className="h-8 text-xs">
                        <SelectValue placeholder="Select ECC" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="L">Low (7% recovery)</SelectItem>
                        <SelectItem value="M">Medium (15% recovery)</SelectItem>
                        <SelectItem value="Q">Quartile (25% recovery)</SelectItem>
                        <SelectItem value="H">High (30% recovery)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Margin slider */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-medium">
                    <Label htmlFor="qr-margin-range">Margin (Border Padding)</Label>
                    <span className="text-muted-foreground">{qrMargin} modules</span>
                  </div>
                  <input
                    id="qr-margin-range"
                    type="range"
                    min="0"
                    max="10"
                    step="1"
                    value={qrMargin}
                    onChange={(e) => setQrMargin(Number(e.target.value))}
                    className="w-full h-1 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                  />
                </div>

                {/* Color pickers */}
                <div className="space-y-4 pt-2 border-t border-border/40">
                  <h4 className="text-xs font-semibold flex items-center gap-1">
                    <Palette className="h-3.5 w-3.5 text-muted-foreground" /> Color Palette
                  </h4>
                  
                  <div className="grid gap-4 sm:grid-cols-2">
                    {/* Foreground Dark */}
                    <div className="space-y-2">
                      <Label htmlFor="qr-dark-color" className="text-xs font-medium">QR Blocks (Dark)</Label>
                      <div className="flex gap-2 items-center">
                        <input
                          id="qr-dark-color"
                          type="color"
                          value={qrColorDark}
                          onChange={(e) => setQrColorDark(e.target.value)}
                          className="h-8 w-10 p-0 border border-border rounded cursor-pointer"
                        />
                        <input
                          type="text"
                          value={qrColorDark}
                          onChange={(e) => setQrColorDark(e.target.value)}
                          className="h-8 flex-1 text-xs border border-border rounded px-2 font-mono uppercase bg-transparent"
                        />
                      </div>
                      
                      {/* Presets */}
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {DARK_COLOR_PRESETS.map((p) => (
                          <button
                            key={p.value}
                            type="button"
                            onClick={() => setQrColorDark(p.value)}
                            className="w-4 h-4 rounded-full border border-border/40 focus:outline-none"
                            style={{ backgroundColor: p.value }}
                            title={p.name}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Background Light */}
                    <div className="space-y-2">
                      <Label htmlFor="qr-light-color" className="text-xs font-medium">Background (Light)</Label>
                      <div className="flex gap-2 items-center">
                        <input
                          id="qr-light-color"
                          type="color"
                          value={qrColorLight}
                          onChange={(e) => setQrColorLight(e.target.value)}
                          className="h-8 w-10 p-0 border border-border rounded cursor-pointer"
                        />
                        <input
                          type="text"
                          value={qrColorLight}
                          onChange={(e) => setQrColorLight(e.target.value)}
                          className="h-8 flex-1 text-xs border border-border rounded px-2 font-mono uppercase bg-transparent"
                        />
                      </div>
                      
                      {/* Presets */}
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {LIGHT_COLOR_PRESETS.map((p) => (
                          <button
                            key={p.value}
                            type="button"
                            onClick={() => setQrColorLight(p.value)}
                            className="w-4 h-4 rounded-full border border-border/40 focus:outline-none"
                            style={{ backgroundColor: p.value }}
                            title={p.name}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

              </div>

            </div>

            {/* Live Preview & Action pane */}
            <div className="lg:col-span-5 flex flex-col gap-4">
              <div className="p-6 border border-border/60 bg-card backdrop-blur-md rounded-3xl flex flex-col items-center justify-center gap-6 shadow-xl relative overflow-hidden">
                {/* Visual Glassmorphic gradient backing */}
                <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 via-transparent to-primary/5 pointer-events-none" />
                
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest relative z-10">Scan Preview</h3>

                {error && (
                  <div className="h-64 flex items-center justify-center text-center p-4 border border-dashed border-destructive/30 rounded-2xl bg-destructive/5 relative z-10">
                    <p className="text-xs text-destructive font-medium">{error}</p>
                  </div>
                )}

                {!error && qrDataUrl && (
                  <div className="relative group/preview z-10">
                    <div className="bg-white p-4 rounded-2xl border shadow-lg flex flex-col items-center justify-center transition-all duration-300 hover:shadow-2xl hover:scale-[1.01]">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={qrDataUrl}
                        alt="Generated Scan QR Code"
                        width={220}
                        height={220}
                        className="max-w-full block"
                      />
                    </div>
                  </div>
                )}

                {!qrDataUrl && !error && (
                  <div className="h-64 w-full flex items-center justify-center border border-dashed border-border rounded-2xl bg-muted/15 z-10">
                    <p className="text-xs text-muted-foreground">Waiting for payload...</p>
                  </div>
                )}

                {/* Actions group */}
                <div className="w-full space-y-2.5 z-10 pt-2">
                  <div className="grid grid-cols-2 gap-2">
                    <Button 
                      variant="default" 
                      onClick={downloadPng} 
                      disabled={!qrDataUrl}
                      className="w-full text-xs font-semibold shadow-sm gap-1.5"
                    >
                      <Download className="h-3.5 w-3.5" /> Download PNG
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      onClick={downloadSvg} 
                      disabled={!qrSvgString}
                      className="w-full text-xs font-semibold gap-1.5"
                    >
                      <Download className="h-3.5 w-3.5" /> Download SVG
                    </Button>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <Button 
                      variant="secondary" 
                      onClick={copyQrDataUrl} 
                      disabled={!qrDataUrl}
                      className="w-full text-[11px] gap-1"
                    >
                      {copied ? <Check className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3" />}
                      {copied ? "Copied URL" : "Copy DataURI"}
                    </Button>
                    
                    <Button 
                      variant="secondary" 
                      onClick={copyQrSvgMarkup} 
                      disabled={!qrSvgString}
                      className="w-full text-[11px] gap-1"
                    >
                      {copiedSvg ? <Check className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3" />}
                      {copiedSvg ? "Copied SVG" : "Copy SVG"}
                    </Button>
                  </div>
                </div>

                <div className="text-center space-y-1 relative z-10">
                  <p className="text-[10px] text-muted-foreground">Standard Vector QR Engine</p>
                  <p className="text-[9px] text-muted-foreground/60">Fully compatible with all mobile cameras and QR scanners.</p>
                </div>
              </div>
            </div>

          </div>
        </TabsContent>

        {/* ── BARCODE GENERATOR TAB ────────────────────────────────────────── */}
        <TabsContent value="barcode" className="space-y-4 pt-4">
          <div className="grid gap-6 lg:grid-cols-12">
            
            <div className="lg:col-span-7 space-y-4">
              <div className="space-y-2 p-5 border border-border/50 bg-card/60 backdrop-blur-sm rounded-2xl">
                <Label htmlFor="barcode-input" className="text-sm font-semibold">Barcode Data (A-Z, 0-9 and space/symbols only)</Label>
                <Input
                  id="barcode-input"
                  type="text"
                  placeholder="e.g. CODE39"
                  value={barcodeText}
                  onChange={(e) => setBarcodeText(e.target.value)}
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-xs font-mono uppercase shadow-sm focus:outline-none focus:ring-1 focus:ring-primary/40"
                />
                <span className="text-[10px] text-muted-foreground block">
                  Supports alphanumeric uppercase characters & basic symbols: - . $ / + % [space]
                </span>
              </div>

              {barcode.valid && (
                <div className="space-y-2 p-5 border border-border/50 bg-card/60 backdrop-blur-sm rounded-2xl">
                  <div className="flex items-center justify-between text-xs font-medium">
                    <Label htmlFor="barcode-height-range">Barcode Height</Label>
                    <span className="text-muted-foreground">{barcodeHeight}px</span>
                  </div>
                  <input
                    id="barcode-height-range"
                    type="range"
                    min="40"
                    max="150"
                    step="10"
                    value={barcodeHeight}
                    onChange={(e) => setBarcodeHeight(Number(e.target.value))}
                    className="w-full h-1 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                  />
                </div>
              )}
            </div>

            <div className="lg:col-span-5">
              {!barcode.valid && barcode.error && (
                <div className="p-6 border border-destructive/20 bg-destructive/5 rounded-3xl text-center space-y-2">
                  <p className="text-xs text-destructive font-semibold">Unsupported Data Format</p>
                  <p className="text-xs text-muted-foreground">{barcode.error}</p>
                </div>
              )}

              {barcode.valid && barcode.pattern && (
                <div className="p-6 border border-border/60 bg-card backdrop-blur-md rounded-3xl flex flex-col items-center justify-center gap-6 shadow-xl">
                  <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Barcode Preview</h3>

                  <div className="bg-white p-6 rounded-2xl border shadow-md flex flex-col items-center w-full max-w-[320px]">
                    <svg
                      id="barcode-svg"
                      width="100%"
                      height={barcodeHeight}
                      viewBox={`0 0 ${barcode.pattern.length} ${barcodeHeight}`}
                      className="w-full"
                      preserveAspectRatio="none"
                    >
                      {barcode.pattern.split("").map((char, index) => {
                        if (char === "1") {
                          return (
                            <rect
                              key={index}
                              x={index}
                              y={0}
                              width={1}
                              height={barcodeHeight}
                              fill="black"
                            />
                          );
                        }
                        return null;
                      })}
                    </svg>
                    <span className="mt-3 text-xs font-mono font-bold tracking-widest text-black">
                      {barcodeText.toUpperCase()}
                    </span>
                  </div>

                  <div className="w-full grid grid-cols-2 gap-2">
                    <Button 
                      variant="default" 
                      onClick={downloadBarcodeSvg}
                      className="w-full text-xs font-semibold gap-1.5"
                    >
                      <Download className="h-3.5 w-3.5" /> Download SVG
                    </Button>
                    
                    <Button 
                      variant="secondary" 
                      onClick={() => {
                        const svgEl = document.getElementById("barcode-svg");
                        if (svgEl) {
                          const svgStr = new XMLSerializer().serializeToString(svgEl);
                          navigator.clipboard.writeText(svgStr).then(() => {
                            setBarcodeCopied(true);
                            setTimeout(() => setBarcodeCopied(false), 2000);
                          });
                        }
                      }}
                      className="w-full text-xs font-semibold gap-1.5"
                    >
                      {barcodeCopied ? <Check className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5" />}
                      {barcodeCopied ? "Copied SVG" : "Copy SVG"}
                    </Button>
                  </div>

                  <p className="text-[10px] text-muted-foreground text-center">
                    Standard Code 39 Formatting. Generates clean scalable vector graphics.
                  </p>
                </div>
              )}
            </div>

          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
