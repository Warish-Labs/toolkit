"use client";

import { useState, useEffect } from "react";
import { getBrowserInspectorDetails, type BrowserDetails } from "@/src/logic/browser-inspector";

export function BrowserInfoTool() {
  const [details, setDetails] = useState<BrowserDetails | null>(null);

  useEffect(() => {
    // Only run on client mount
    setDetails(getBrowserInspectorDetails());

    // Listen to resize to update viewport size dynamically
    const handleResize = () => {
      setDetails(prev => {
        if (!prev) return null;
        return {
          ...prev,
          viewportSize: `${window.innerWidth} × ${window.innerHeight}`
        };
      });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  if (!details) {
    return <p className="text-xs text-muted-foreground">Retrieving browser diagnostic information...</p>;
  }

  const specs = [
    { label: "Browser", value: details.browserName },
    { label: "Operating System", value: details.osName },
    { label: "Screen Resolution", value: details.screenResolution },
    { label: "Viewport Size (Resizing)", value: details.viewportSize },
    { label: "Touch Support", value: details.touchSupport ? "Yes (Touchscreen)" : "No (Mouse/Trackpad)" },
    { label: "Connection Speed", value: details.networkType },
    { label: "Online Status", value: details.onlineStatus ? "Online" : "Offline" }
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {specs.map((spec, idx) => (
          <div key={idx} className="border border-border/60 bg-card rounded-xl p-4 space-y-1 shadow-sm flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">{spec.label}</span>
              <span className="text-sm font-semibold text-foreground block pt-0.5">{spec.value}</span>
            </div>
            <button
              onClick={() => handleCopy(spec.value.toString())}
              className="text-[10px] text-primary font-semibold hover:underline self-end pt-1.5"
            >
              Copy
            </button>
          </div>
        ))}
      </div>

      <div className="space-y-2 border border-border/60 bg-muted/20 p-5 rounded-2xl">
        <div className="flex justify-between items-center pb-2 border-b border-border/40 text-xs">
          <span className="font-bold text-muted-foreground uppercase tracking-wider block">Full User Agent String</span>
          <button
            onClick={() => handleCopy(details.userAgent)}
            className="text-[10px] text-primary font-semibold hover:underline"
          >
            Copy UA
          </button>
        </div>
        <div className="font-mono text-xs text-foreground select-all leading-relaxed pt-2 break-all">
          {details.userAgent}
        </div>
      </div>
    </div>
  );
}
