"use client";

import { useEffect, useRef } from "react";

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
}

const MAX_CONNECT_DISTANCE = 140;
const NODE_SPEED = 0.28;

function createNodes(width: number, height: number): Node[] {
  const area = width * height;
  const rawCount = Math.round(area / 10000);
  const count = Math.max(18, Math.min(55, rawCount));

  return Array.from({ length: count }, () => {
    const angle = Math.random() * Math.PI * 2;
    const speed = NODE_SPEED * (0.5 + Math.random() * 0.5);
    return {
      x: Math.random() * width,
      y: Math.random() * height,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      radius: 1 + Math.random() * 1.5,
    };
  });
}

export function HeroNetworkBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let rafId = 0;
    let nodes: Node[] = [];

    // Helper to resolve CSS variable to standard browser-computed RGB colors
    function resolveColor(cssValue: string): string {
      if (typeof document === "undefined") return "rgb(120, 120, 120)";
      const temp = document.createElement("div");
      temp.style.color = cssValue;
      temp.style.position = "absolute";
      temp.style.visibility = "hidden";
      document.body.appendChild(temp);
      const computed = getComputedStyle(temp).color;
      document.body.removeChild(temp);
      return computed || "rgb(120, 120, 120)";
    }

    // ── Color reading ────────────────────────────────────────────────
    let nodeColor = "rgb(120, 120, 120)";
    let lineColor = "rgb(200, 200, 200)";

    function readColors() {
      // Resolve the theme variables to standard RGB colors
      nodeColor = resolveColor("var(--muted-foreground)");
      lineColor = resolveColor("var(--border)");
    }

    // ── Sizing ───────────────────────────────────────────────────────
    function resize() {
      const dpr = window.devicePixelRatio || 1;
      const w = canvas!.offsetWidth || 800;
      const h = canvas!.offsetHeight || 400;
      canvas!.width = w * dpr;
      canvas!.height = h * dpr;
      ctx!.scale(dpr, dpr);
      nodes = createNodes(w, h);
    }

    // ── Animation ────────────────────────────────────────────────────
    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    function drawFrame() {
      if (!canvas || !ctx) return;
      const W = canvas.offsetWidth || 800;
      const H = canvas.offsetHeight || 400;

      ctx.clearRect(0, 0, W, H);

      if (!prefersReduced) {
        // Move nodes
        for (const n of nodes) {
          n.x += n.vx;
          n.y += n.vy;
          if (n.x < 0 || n.x > W) n.vx = -n.vx;
          if (n.y < 0 || n.y > H) n.vy = -n.vy;
        }
      }

      // Draw connecting lines
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < MAX_CONNECT_DISTANCE) {
            const alpha = 1 - dist / MAX_CONNECT_DISTANCE;
            ctx.save();
            ctx.globalAlpha = alpha * 0.25; // Line opacity (raised slightly from 0.18 for dark backgrounds)
            ctx.strokeStyle = lineColor;
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();
            ctx.restore();
          }
        }
      }

      // Draw nodes
      ctx.fillStyle = nodeColor;
      for (const n of nodes) {
        ctx.globalAlpha = 0.38; // Node opacity (raised slightly from 0.28)
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.radius, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      if (!prefersReduced) {
        rafId = requestAnimationFrame(drawFrame);
      }
    }

    // ── Pause on hidden tab ──────────────────────────────────────────
    function handleVisibility() {
      if (document.hidden) {
        cancelAnimationFrame(rafId);
      } else {
        if (!prefersReduced) {
          rafId = requestAnimationFrame(drawFrame);
        }
      }
    }

    // ── Theme change via MutationObserver ────────────────────────────
    const observer = new MutationObserver(() => {
      readColors();
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    // ── Init ─────────────────────────────────────────────────────────
    readColors();
    resize();

    if (prefersReduced) {
      drawFrame();
    } else {
      rafId = requestAnimationFrame(drawFrame);
    }

    const resizeObs = new ResizeObserver(() => {
      resize();
    });
    resizeObs.observe(canvas);

    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      cancelAnimationFrame(rafId);
      observer.disconnect();
      resizeObs.disconnect();
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="absolute inset-0 h-full w-full pointer-events-none -z-10"
    />
  );
}
