"use client";

import { useState } from "react";
import { generateQrMatrix, generateBarcode39 } from "@/src/logic/qr-barcode";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/src/ui/shared/tabs";

export function QrCodeGeneratorTool() {
  const [activeTab, setActiveTab] = useState("qr");

  // QR States
  const [qrText, setQrText] = useState("");
  const [qrSize, setQrSize] = useState(250);
  
  // Barcode States
  const [barcodeText, setBarcodeText] = useState("TOOLKIT");
  const [barcodeHeight, setBarcodeHeight] = useState(80);

  const qrMatrix = qrText ? generateQrMatrix(qrText) : [];
  const barcode = generateBarcode39(barcodeText);

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={(val) => setActiveTab(val)}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="qr">QR Code Generator</TabsTrigger>
          <TabsTrigger value="barcode">Barcode Generator (Code 39)</TabsTrigger>
        </TabsList>

        <TabsContent value="qr" className="space-y-4 pt-4">
          <div className="space-y-2">
            <label htmlFor="qr-input" className="text-sm font-medium">Text or URL Payload</label>
            <input
              id="qr-input"
              type="text"
              placeholder="e.g. https://tools.warishlabs.in"
              value={qrText}
              onChange={(e) => setQrText(e.target.value)}
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-xs shadow-sm focus:outline-none"
            />
          </div>

          {qrText && qrMatrix.length > 0 && (
            <div className="flex flex-col items-center justify-center p-6 border border-border/60 bg-muted/20 rounded-2xl gap-4">
              {/* Render QR code as pixel grid */}
              <div 
                className="bg-white p-4 rounded-xl border shadow-sm flex flex-col items-center justify-center"
                style={{ width: qrSize, height: qrSize }}
              >
                <div 
                  className="grid bg-white"
                  style={{ 
                    gridTemplateColumns: `repeat(${qrMatrix.length}, 1fr)`,
                    width: '100%',
                    height: '100%'
                  }}
                >
                  {qrMatrix.map((row, rIdx) => 
                    row.map((active, cIdx) => (
                      <div 
                        key={`${rIdx}-${cIdx}`}
                        className={active ? 'bg-black' : 'bg-white'}
                        style={{ aspectRatio: '1/1' }}
                      />
                    ))
                  )}
                </div>
              </div>
              <span className="text-[10px] text-muted-foreground">Self-contained browser vector grid. Fully offline.</span>
            </div>
          )}
        </TabsContent>

        <TabsContent value="barcode" className="space-y-4 pt-4">
          <div className="space-y-2">
            <label htmlFor="barcode-input" className="text-sm font-medium">Barcode Data (A-Z, 0-9 only)</label>
            <input
              id="barcode-input"
              type="text"
              placeholder="e.g. CODE39"
              value={barcodeText}
              onChange={(e) => setBarcodeText(e.target.value)}
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-xs font-mono uppercase shadow-sm focus:outline-none"
            />
          </div>

          {!barcode.valid && barcode.error && (
            <p className="text-xs text-destructive">{barcode.error}</p>
          )}

          {barcode.valid && barcode.pattern && (
            <div className="flex flex-col items-center justify-center p-6 border border-border/60 bg-muted/20 rounded-2xl gap-4">
              {/* Render Barcode as SVG */}
              <div className="bg-white p-6 rounded-xl border shadow-sm flex flex-col items-center">
                <svg
                  width="100%"
                  height={barcodeHeight}
                  viewBox={`0 0 ${barcode.pattern.length} ${barcodeHeight}`}
                  className="max-w-[400px] w-full"
                  preserveAspectRatio="none"
                >
                  {barcode.pattern.split('').map((char, index) => {
                    if (char === '1') {
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
                <span className="mt-3 text-xs font-mono font-bold tracking-widest text-black">{barcodeText.toUpperCase()}</span>
              </div>
              <span className="text-[10px] text-muted-foreground">Standard Code 39 formatting. Generates inline browser SVGs.</span>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
