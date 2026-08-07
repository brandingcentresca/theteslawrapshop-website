"use client";

import { useEffect, useRef } from "react";

/**
 * Modern, premium interactive background that fills the dead white space behind
 * the page. Renders layered "silk" ribbons — smooth, slowly undulating gradient
 * bands, reminiscent of vinyl flowing over a panel — floating above a soft mesh
 * of drifting red/charcoal glows.
 *
 * It reacts to the pointer: a warm spotlight follows the cursor and the ribbons
 * swell gently toward it. The canvas is fixed, sits behind all content (negative
 * z-index in globals.css) and never intercepts clicks (pointer-events: none);
 * pointer position is read from a window listener instead. Honours
 * prefers-reduced-motion and pauses when the tab is hidden.
 */

const BRAND = "204, 0, 0"; // #cc0000
const BRAND_BRIGHT = "224, 0, 0"; // #e00000
const CHARCOAL = "22, 23, 25"; // near --color-dark-2

type Ribbon = {
  baseY: number; // 0..1 fraction of height
  amp: number; // px
  len: number; // wavelength px
  speed: number;
  phase: number;
  thickness: number; // px
  color: string; // "r, g, b"
  alpha: number;
};

type Orb = {
  x: number; // 0..1
  y: number; // 0..1
  r: number; // fraction of max(w,h)
  color: string;
  alpha: number;
  dx: number;
  dy: number;
};

const RIBBONS: Ribbon[] = [
  { baseY: 0.18, amp: 34, len: 520, speed: 0.00022, phase: 0.0, thickness: 150, color: BRAND, alpha: 0.05 },
  { baseY: 0.34, amp: 46, len: 640, speed: -0.00018, phase: 1.4, thickness: 190, color: CHARCOAL, alpha: 0.045 },
  { baseY: 0.54, amp: 40, len: 560, speed: 0.00026, phase: 2.7, thickness: 170, color: BRAND_BRIGHT, alpha: 0.05 },
  { baseY: 0.72, amp: 52, len: 700, speed: -0.00021, phase: 4.1, thickness: 210, color: CHARCOAL, alpha: 0.04 },
  { baseY: 0.88, amp: 38, len: 600, speed: 0.0002, phase: 5.5, thickness: 160, color: BRAND, alpha: 0.05 },
];

const ORBS: Orb[] = [
  { x: 0.18, y: 0.2, r: 0.55, color: BRAND, alpha: 0.06, dx: 0.00003, dy: 0.00002 },
  { x: 0.82, y: 0.32, r: 0.45, color: BRAND_BRIGHT, alpha: 0.05, dx: -0.000025, dy: 0.00003 },
  { x: 0.5, y: 0.85, r: 0.6, color: CHARCOAL, alpha: 0.045, dx: 0.00002, dy: -0.000028 },
];

export function InteractiveBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    let width = 0;
    let height = 0;
    let dpr = 1;
    let raf = 0;
    let running = true;
    let t = 0;

    // Raw + smoothed pointer, in CSS pixels. Off-screen until first move.
    const pointer = { x: -9999, y: -9999, active: false };
    const smooth = { x: -9999, y: -9999, glow: 0 };

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas!.width = Math.floor(width * dpr);
      canvas!.height = Math.floor(height * dpr);
      canvas!.style.width = `${width}px`;
      canvas!.style.height = `${height}px`;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function drawOrbs() {
      for (const o of ORBS) {
        const drift = reduceMotion ? 0 : t;
        const ox = (o.x + Math.sin(drift * o.dx) * 0.05) * width;
        const oy = (o.y + Math.cos(drift * o.dy) * 0.05) * height;
        const r = o.r * Math.max(width, height);
        const grad = ctx!.createRadialGradient(ox, oy, 0, ox, oy, r);
        grad.addColorStop(0, `rgba(${o.color}, ${o.alpha})`);
        grad.addColorStop(1, `rgba(${o.color}, 0)`);
        ctx!.fillStyle = grad;
        ctx!.fillRect(0, 0, width, height);
      }
    }

    // Extra lift applied to a ribbon at horizontal position x, so ribbons swell
    // toward the cursor for a soft interactive ripple.
    function pointerLift(x: number, baseY: number) {
      if (smooth.glow <= 0.01) return 0;
      const sigma = 190;
      const dx = x - smooth.x;
      const falloffX = Math.exp(-(dx * dx) / (2 * sigma * sigma));
      const dy = baseY - smooth.y;
      const falloffY = Math.exp(-(dy * dy) / (2 * 240 * 240));
      return -70 * falloffX * falloffY * smooth.glow;
    }

    function drawRibbon(rb: Ribbon) {
      const yBase = rb.baseY * height;
      const step = 12;
      ctx!.beginPath();
      ctx!.moveTo(-60, yBase);
      for (let x = -60; x <= width + 60; x += step) {
        const wave =
          Math.sin(x / rb.len + t * rb.speed + rb.phase) * rb.amp +
          Math.sin(x / (rb.len * 0.5) + t * rb.speed * 1.7 + rb.phase) *
            (rb.amp * 0.35);
        const y = yBase + wave + pointerLift(x, yBase);
        ctx!.lineTo(x, y);
      }
      // Close the band downward to form a filled ribbon.
      ctx!.lineTo(width + 60, yBase + rb.thickness);
      ctx!.lineTo(-60, yBase + rb.thickness);
      ctx!.closePath();

      const grad = ctx!.createLinearGradient(0, yBase - rb.amp, 0, yBase + rb.thickness);
      grad.addColorStop(0, `rgba(${rb.color}, 0)`);
      grad.addColorStop(0.4, `rgba(${rb.color}, ${rb.alpha})`);
      grad.addColorStop(1, `rgba(${rb.color}, 0)`);
      ctx!.fillStyle = grad;
      ctx!.fill();
    }

    function drawCursorGlow() {
      if (smooth.glow <= 0.01) return;
      const r = 260;
      const grad = ctx!.createRadialGradient(
        smooth.x,
        smooth.y,
        0,
        smooth.x,
        smooth.y,
        r
      );
      grad.addColorStop(0, `rgba(${BRAND_BRIGHT}, ${0.08 * smooth.glow})`);
      grad.addColorStop(1, `rgba(${BRAND_BRIGHT}, 0)`);
      ctx!.fillStyle = grad;
      ctx!.fillRect(smooth.x - r, smooth.y - r, r * 2, r * 2);
    }

    function step() {
      // Ease the smoothed pointer toward the raw one for fluid motion.
      if (pointer.active) {
        if (smooth.x < -9000) {
          smooth.x = pointer.x;
          smooth.y = pointer.y;
        }
        smooth.x += (pointer.x - smooth.x) * 0.08;
        smooth.y += (pointer.y - smooth.y) * 0.08;
        smooth.glow += (1 - smooth.glow) * 0.06;
      } else {
        smooth.glow += (0 - smooth.glow) * 0.05;
      }

      ctx!.clearRect(0, 0, width, height);
      drawOrbs();
      for (const rb of RIBBONS) drawRibbon(rb);
      drawCursorGlow();
    }

    function loop() {
      if (!running) return;
      t += 16;
      step();
      raf = window.requestAnimationFrame(loop);
    }

    // --- Event handlers -----------------------------------------------------
    const onPointerMove = (e: PointerEvent) => {
      pointer.x = e.clientX;
      pointer.y = e.clientY;
      pointer.active = true;
    };
    const onPointerLeave = () => {
      pointer.active = false;
    };
    const onResize = () => {
      resize();
      if (reduceMotion) step();
    };
    const onVisibility = () => {
      if (document.hidden) {
        running = false;
        window.cancelAnimationFrame(raf);
      } else if (!reduceMotion && !running) {
        running = true;
        loop();
      }
    };

    resize();
    window.addEventListener("resize", onResize);
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerleave", onPointerLeave);
    document.addEventListener("visibilitychange", onVisibility);

    if (reduceMotion) {
      step();
    } else {
      loop();
    }

    return () => {
      running = false;
      window.cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerleave", onPointerLeave);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return <canvas ref={canvasRef} aria-hidden="true" className="tws-bg-canvas" />;
}
