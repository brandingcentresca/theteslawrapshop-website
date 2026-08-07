"use client";

import { useEffect, useRef } from "react";

/**
 * Scroll-driven squeegee background for the Tesla wrap shop. A squeegee — the
 * tool used to lay vinyl — glides across the page as you scroll, sweeping side
 * to side while descending (like smoothing a wrap down a panel) and leaving a
 * soft red "paint" swath the width of its blade that slowly fades away.
 *
 * Position is driven by scroll progress; a gentle idle drift keeps a faint bit
 * of life when the page is still. The canvas is fixed, sits behind all content
 * (negative z-index in globals.css) and never intercepts clicks
 * (pointer-events: none). Honours prefers-reduced-motion and pauses when hidden.
 */

const RED = "204, 0, 0"; // #cc0000
const RED_BRIGHT = "224, 0, 0"; // #e00000
const BLADE = 96; // px — squeegee blade width, also the paint swath width
const TRAIL_LIFE = 90; // frames a paint dab survives (~1.5s at 60fps)

type Dab = { x: number; y: number; life: number };

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

    let scrollY = window.scrollY;
    const pos = { x: 0, y: 0 };
    let angle = Math.PI / 2;
    let seeded = false;
    const trail: Dab[] = [];

    function scrollProgress() {
      const max =
        document.documentElement.scrollHeight - window.innerHeight;
      if (max <= 0) return 0;
      return Math.min(1, Math.max(0, scrollY / max));
    }

    // Target squeegee position for the current scroll progress. It sweeps
    // horizontally a couple of times while descending across the viewport, with
    // a small idle oscillation so it never feels fully static.
    function target() {
      const p = scrollProgress();
      const sweeps = 2.1;
      const idle = reduceMotion ? 0 : t;
      const x =
        width * (0.5 + 0.4 * Math.sin(p * Math.PI * 2 * sweeps + 0.4)) +
        Math.sin(idle * 0.0009) * 26;
      const y =
        height * (0.16 + 0.68 * p) + Math.cos(idle * 0.0011) * 20;
      return { x, y };
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
      if (!seeded) {
        const tg = target();
        pos.x = tg.x;
        pos.y = tg.y;
        seeded = true;
      }
    }

    function drawTrail() {
      // Wide, soft paint swath — draw oldest first so fresh paint sits on top.
      ctx!.lineCap = "round";
      ctx!.lineJoin = "round";
      for (let i = 1; i < trail.length; i++) {
        const a = trail[i - 1];
        const b = trail[i];
        const life = (a.life + b.life) / 2 / TRAIL_LIFE;
        if (life <= 0) continue;
        // Soft outer swath.
        ctx!.strokeStyle = `rgba(${RED}, ${life * 0.16})`;
        ctx!.lineWidth = BLADE * (0.7 + 0.3 * life);
        ctx!.beginPath();
        ctx!.moveTo(a.x, a.y);
        ctx!.lineTo(b.x, b.y);
        ctx!.stroke();
        // Brighter core.
        ctx!.strokeStyle = `rgba(${RED_BRIGHT}, ${life * 0.14})`;
        ctx!.lineWidth = BLADE * 0.42 * life;
        ctx!.beginPath();
        ctx!.moveTo(a.x, a.y);
        ctx!.lineTo(b.x, b.y);
        ctx!.stroke();
      }
    }

    function drawSqueegee() {
      ctx!.save();
      ctx!.translate(pos.x, pos.y);
      ctx!.rotate(angle + Math.PI / 2); // blade perpendicular to motion
      ctx!.shadowColor = "rgba(0, 0, 0, 0.18)";
      ctx!.shadowBlur = 12;
      ctx!.shadowOffsetY = 4;

      const w = BLADE;
      // Rubber blade edge (dark).
      roundRect(ctx!, -w / 2, 6, w, 9, 4);
      ctx!.fillStyle = "rgba(17, 17, 19, 0.9)";
      ctx!.fill();

      ctx!.shadowBlur = 0;
      ctx!.shadowOffsetY = 0;

      // Metal clamp strip.
      roundRect(ctx!, -w / 2 + 4, 1, w - 8, 6, 2);
      ctx!.fillStyle = "rgba(140, 140, 146, 0.9)";
      ctx!.fill();

      // Handle body (brand red).
      roundRect(ctx!, -w * 0.4, -15, w * 0.8, 15, 4);
      ctx!.fillStyle = `rgba(${RED}, 0.92)`;
      ctx!.fill();
      // Handle highlight.
      roundRect(ctx!, -w * 0.4, -15, w * 0.8, 5, 4);
      ctx!.fillStyle = "rgba(255, 255, 255, 0.18)";
      ctx!.fill();

      ctx!.restore();
    }

    function frame(advance: boolean) {
      const tg = target();
      const prevX = pos.x;
      const prevY = pos.y;
      // Ease toward target so the squeegee drags smoothly and the paint lags.
      pos.x += (tg.x - pos.x) * 0.12;
      pos.y += (tg.y - pos.y) * 0.12;

      const dx = pos.x - prevX;
      const dy = pos.y - prevY;
      const speed = Math.hypot(dx, dy);
      if (speed > 0.05) angle = Math.atan2(dy, dx);

      if (advance && speed > 0.12) {
        trail.push({ x: pos.x, y: pos.y, life: TRAIL_LIFE });
      }
      for (let i = trail.length - 1; i >= 0; i--) {
        if (advance) trail[i].life -= 1;
        if (trail[i].life <= 0) trail.splice(i, 1);
      }

      ctx!.clearRect(0, 0, width, height);
      drawTrail();
      drawSqueegee();
    }

    function loop() {
      if (!running) return;
      t += 16;
      frame(true);
      raf = window.requestAnimationFrame(loop);
    }

    // --- Event handlers -----------------------------------------------------
    const onScroll = () => {
      scrollY = window.scrollY;
    };
    const onResize = () => {
      resize();
      if (reduceMotion) frame(false);
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
    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);

    if (reduceMotion) {
      frame(false);
    } else {
      loop();
    }

    return () => {
      running = false;
      window.cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return <canvas ref={canvasRef} aria-hidden="true" className="tws-bg-canvas" />;
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  const rr = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + rr, y);
  ctx.arcTo(x + w, y, x + w, y + h, rr);
  ctx.arcTo(x + w, y + h, x, y + h, rr);
  ctx.arcTo(x, y + h, x, y, rr);
  ctx.arcTo(x, y, x + w, y, rr);
  ctx.closePath();
}
