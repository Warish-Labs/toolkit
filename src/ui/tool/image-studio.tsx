"use client";

import { useState, useRef, useEffect } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/src/ui/shared/tabs";

export function ImageStudioTool() {
  const [activeTab, setActiveTab] = useState("resize");

  // File states
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [fileName, setFileName] = useState("image.jpg");
  const [imgWidth, setImgWidth] = useState(800);
  const [imgHeight, setImgHeight] = useState(600);
  const [aspectRatio, setAspectRatio] = useState(1.33);
  const [lockRatio, setLockRatio] = useState(true);

  // Resize settings
  const [scaleWidth, setScaleWidth] = useState(800);
  const [scaleHeight, setScaleHeight] = useState(600);
  const [compressQuality, setCompressQuality] = useState(80);
  const [targetFormat, setTargetFormat] = useState("image/jpeg");

  // Base64 state
  const [base64Output, setBase64Output] = useState("");

  // Color Swatch states
  const [palette, setPalette] = useState<string[]>([]);

  const imageRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          const src = event.target.result as string;
          setImageSrc(src);
          setBase64Output(src);

          // Get dimensions
          const img = new Image();
          img.onload = () => {
            setImgWidth(img.width);
            setImgHeight(img.height);
            setScaleWidth(img.width);
            setScaleHeight(img.height);
            setAspectRatio(img.width / img.height);
          };
          img.src = src;
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Adjust width with locked aspect ratio
  const handleWidthChange = (w: number) => {
    setScaleWidth(w);
    if (lockRatio) {
      setScaleHeight(Math.round(w / aspectRatio));
    }
  };

  // Adjust height with locked aspect ratio
  const handleHeightChange = (h: number) => {
    setScaleHeight(h);
    if (lockRatio) {
      setScaleWidth(Math.round(h * aspectRatio));
    }
  };

  // Trigger download of resized image
  const handleDownload = () => {
    if (!imageRef.current || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = scaleWidth;
    canvas.height = scaleHeight;
    ctx.drawImage(imageRef.current, 0, 0, scaleWidth, scaleHeight);

    const dataUrl = canvas.toDataURL(targetFormat, compressQuality / 100);
    const link = document.createElement("a");
    link.download = `resized-${fileName.split('.')[0]}.${targetFormat.split('/')[1]}`;
    link.href = dataUrl;
    link.click();
  };

  // Extract swatches when image mounts or changes
  useEffect(() => {
    if (!imageSrc || activeTab !== "palette") return;
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      canvas.width = 50;
      canvas.height = 50;
      ctx.drawImage(img, 0, 0, 50, 50);

      const imgData = ctx.getImageData(0, 0, 50, 50).data;
      const swatches = new Set<string>();

      // Sample a few pixels to extract distinct swatches
      for (let i = 0; i < imgData.length; i += 120) {
        const r = imgData[i];
        const g = imgData[i + 1];
        const b = imgData[i + 2];
        const hex = "#" + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('');
        swatches.add(hex);
        if (swatches.size >= 6) break;
      }
      setPalette(Array.from(swatches));
    };
    img.src = imageSrc;
  }, [imageSrc, activeTab]);

  const handleCopyBase64 = () => {
    navigator.clipboard.writeText(base64Output);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-border/60 rounded-2xl bg-muted/10">
        <label htmlFor="img-file-pick" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block cursor-pointer hover:text-primary">
          Upload Image File
        </label>
        <input
          id="img-file-pick"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
        {imageSrc && <span className="text-[10px] text-muted-foreground pt-1.5 font-mono">{fileName}</span>}
      </div>

      {imageSrc && (
        <Tabs value={activeTab} onValueChange={(val) => setActiveTab(val)}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="resize">Resize & Format</TabsTrigger>
            <TabsTrigger value="base64">Image to Base64</TabsTrigger>
            <TabsTrigger value="palette">Color Swatches</TabsTrigger>
          </TabsList>

          {/* ── Resize & Format ── */}
          <TabsContent value="resize" className="pt-4 space-y-4">
            <div className="grid gap-4 sm:grid-cols-3 items-end">
              <div className="space-y-1.5">
                <label htmlFor="img-scale-w" className="text-xs font-semibold text-muted-foreground uppercase block">Width (px)</label>
                <input
                  id="img-scale-w"
                  type="number"
                  value={scaleWidth}
                  onChange={(e) => handleWidthChange(Number(e.target.value))}
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-xs shadow-sm focus:outline-none"
                />
              </div>
              <div className="space-y-1.5">
                <label htmlFor="img-scale-h" className="text-xs font-semibold text-muted-foreground uppercase block">Height (px)</label>
                <input
                  id="img-scale-h"
                  type="number"
                  value={scaleHeight}
                  onChange={(e) => handleHeightChange(Number(e.target.value))}
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-xs shadow-sm focus:outline-none"
                />
              </div>
              <div className="space-y-1.5">
                <label htmlFor="img-scale-format" className="text-xs font-semibold text-muted-foreground uppercase block">Target Format</label>
                <select
                  id="img-scale-format"
                  value={targetFormat}
                  onChange={(e) => setTargetFormat(e.target.value)}
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-xs shadow-sm focus:outline-none"
                >
                  <option value="image/jpeg">JPEG (.jpg)</option>
                  <option value="image/png">PNG (.png)</option>
                  <option value="image/webp">WebP (.webp)</option>
                </select>
              </div>
            </div>

            <div className="flex gap-4 items-center">
              <label className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase cursor-pointer">
                <input
                  type="checkbox"
                  checked={lockRatio}
                  onChange={(e) => setLockRatio(e.target.checked)}
                  className="rounded border-border bg-transparent"
                />
                Lock Aspect Ratio
              </label>
            </div>

            <div className="space-y-1.5">
              <span className="text-xs font-semibold text-muted-foreground uppercase block">Quality Compression ({compressQuality}%)</span>
              <input
                type="range"
                min={10}
                max={100}
                value={compressQuality}
                onChange={(e) => setCompressQuality(Number(e.target.value))}
                className="w-full"
                disabled={targetFormat === "image/png"}
              />
            </div>

            <button
              onClick={handleDownload}
              className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-ring"
            >
              Apply & Download Image
            </button>

            {/* Hidden canvas for resizing render */}
            <canvas ref={canvasRef} className="hidden" />
            <img ref={imageRef} src={imageSrc} alt="Preview Upload" className="hidden" />
          </TabsContent>

          {/* ── Image to Base64 ── */}
          <TabsContent value="base64" className="pt-4 space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Base64 Data URI Payload</span>
                <button
                  onClick={handleCopyBase64}
                  className="text-xs bg-secondary/80 hover:bg-secondary px-3 py-1 rounded transition-colors"
                >
                  Copy Base64
                </button>
              </div>
              <textarea
                readOnly
                className="flex min-h-[140px] w-full rounded-xl border border-border/60 bg-muted/30 px-3.5 py-3 text-xs font-mono shadow-sm focus-visible:outline-none select-all break-all"
                value={base64Output}
              />
            </div>
          </TabsContent>

          {/* ── Color Swatches ── */}
          <TabsContent value="palette" className="pt-4 space-y-4">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">Extracted Swatches</span>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
              {palette.map((color, idx) => (
                <div key={idx} className="border border-border/60 rounded-xl p-3 text-center space-y-2 shadow-sm bg-card flex flex-col justify-between items-center">
                  <div className="w-10 h-10 rounded-full border shadow" style={{ backgroundColor: color }} />
                  <span className="text-[10px] font-mono select-all uppercase block">{color}</span>
                  <button
                    onClick={() => navigator.clipboard.writeText(color)}
                    className="text-[9px] text-primary font-semibold hover:underline"
                  >
                    Copy
                  </button>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
