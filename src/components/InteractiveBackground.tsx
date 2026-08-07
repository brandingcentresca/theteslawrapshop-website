"use client";

import { useEffect, useRef } from "react";

/**
 * Interactive, brand-tinted background that fills the dead white space behind
 * the page. Renders a slowly drifting "constellation" of particles connected by
 * thin lines, warmed by a couple of soft red ambient glows. The network reacts
 * to the pointer: nearby particles link to the cursor and are gently pushed
 * away from it.
 *
 * The canvas is fixed, sits behind all content (negative z-index in globals.css)
 * and never intercepts clicks (pointer-events: none) — pointer position is read
 * from a window listener instead, so interactivity works while staying inert to
 * the rest of the UI. Honours prefers-reduced-motion and pauses when hidden.
 */

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  red: boolean;
};

const BRAND = "204, 0, 0"; // #cc0000
const INK = "28, 28, 28"; // --color-fg

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
    let particles: Particle[] = [];
    let raf = 0;
    let running = true;
    let t = 0;

    // Pointer, in CSS pixels. Starts off-screen so nothing reacts until moved.
    const pointer = { x: -9999, y: -9999, active: false };

    const LINK_DIST = 140; // px — max distance to draw a link between particles
    const POINTER_DIST = 180; // px — pointer influence radius

    function seed() {
      // Density scales with viewport area, capped for performance.
      const target = Math.min(
        90,
        Math.max(28, Math.round((width * height) / 22000))
      );
      particles = Array.from({ length: target }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.28,
        vy: (Math.random() - 0.5) * 0.28,
        size: Math.random() * 1.6 + 1,
        red: Math.random() < 0.28,
      }));
    }

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas!.width = Math.floor(width * dpr);
      canvas!.height = Math.floor(height * dpr);
      canvas!.style.width = `${width}px`;
      canvas!.style.height = `${height}px`;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed();
    }

    function drawAmbientGlow() {
      // Two soft red glows that slowly drift, adding warmth to the white.
      const glows = [
        {
          x: width * (0.2 + 0.08 * Math.sin(t * 0.00035)),
          y: height * (0.15 + 0.06 * Math.cos(t * 0.0003)),
          r: Math.max(width, height) * 0.55,
          a: 0.05,
        },
        {
          x: width * (0.82 + 0.07 * Math.cos(t * 0.00028)),
          y: height * (0.7 + 0.08 * Math.sin(t * 0.00032)),
          r: Math.max(width, height) * 0.5,
          a: 0.04,
        },
      ];
      for (const g of glows) {
        const grad = ctx!.createRadialGradient(g.x, g.y, 0, g.x, g.y, g.r);
        grad.addColorStop(0, `rgba(${BRAND}, ${g.a})`);
        grad.addColorStop(1, `rgba(${BRAND}, 0)`);
        ctx!.fillStyle = grad;
        ctx!.fillRect(0, 0, width, height);
      }
    }

    function step() {
      ctx!.clearRect(0, 0, width, height);
      drawAmbientGlow();

      for (const p of particles) {
        // Pointer repulsion — a gentle nudge away from the cursor.
        if (pointer.active) {
          const dx = p.x - pointer.x;
          const dy = p.y - pointer.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < POINTER_DIST * POINTER_DIST && d2 > 0.01) {
            const d = Math.sqrt(d2);
            const force = ((POINTER_DIST - d) / POINTER_DIST) * 0.9;
            p.vx += (dx / d) * force * 0.12;
            p.vy += (dy / d) * force * 0.12;
          }
        }

        p.x += p.vx;
        p.y += p.vy;

        // Damping so pointer nudges settle back to a calm drift.
        p.vx *= 0.99;
        p.vy *= 0.99;

        // Wrap around edges for a seamless field.
        if (p.x < -20) p.x = width + 20;
        else if (p.x > width + 20) p.x = -20;
        if (p.y < -20) p.y = height + 20;
        else if (p.y > height + 20) p.y = -20;
      }

      // Particle-to-particle links.
      for (let i = 0; i < particles.length; i++) {
        const a = particles[i];
        for (let j = i + 1; j < particles.length; j++) {
          const b = particles[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < LINK_DIST * LINK_DIST) {
            const alpha = (1 - Math.sqrt(d2) / LINK_DIST) * 0.14;
            const tinted = a.red || b.red;
            ctx!.strokeStyle = `rgba(${tinted ? BRAND : INK}, ${alpha})`;
            ctx!.lineWidth = 1;
            ctx!.beginPath();
            ctx!.moveTo(a.x, a.y);
            ctx!.lineTo(b.x, b.y);
            ctx!.stroke();
          }
        }
      }

      // Cursor links — brighter red threads toward nearby particles.
      if (pointer.active) {
        for (const p of particles) {
          const dx = p.x - pointer.x;
          const dy = p.y - pointer.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < POINTER_DIST * POINTER_DIST) {
            const alpha = (1 - Math.sqrt(d2) / POINTER_DIST) * 0.35;
            ctx!.strokeStyle = `rgba(${BRAND}, ${alpha})`;
            ctx!.lineWidth = 1;
            ctx!.beginPath();
            ctx!.moveTo(pointer.x, pointer.y);
            ctx!.lineTo(p.x, p.y);
            ctx!.stroke();
          }
        }
      }

      // Nodes on top of the links.
      for (const p of particles) {
        ctx!.fillStyle = p.red
          ? `rgba(${BRAND}, 0.55)`
          : `rgba(${INK}, 0.32)`;
        ctx!.beginPath();
        ctx!.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx!.fill();
      }
    }

    function loop() {
      if (!running) return;
      t += 16;
      step();
      raf = window.requestAnimationFrame(loop);
    }

    function drawStatic() {
      // Reduced-motion: paint one calm frame, no animation.
      step();
    }

    // --- Event handlers -----------------------------------------------------
    const onPointerMove = (e: PointerEvent) => {
      pointer.x = e.clientX;
      pointer.y = e.clientY;
      pointer.active = true;
    };
    const onPointerLeave = () => {
      pointer.active = false;
      pointer.x = -9999;
      pointer.y = -9999;
    };
    const onResize = () => {
      resize();
      if (reduceMotion) drawStatic();
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
      drawStatic();
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

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="tws-bg-canvas"
    />
  );
}
