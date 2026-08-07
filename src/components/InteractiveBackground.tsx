"use client";

import { useEffect, useRef } from "react";

/**
 * Scroll-driven squeegee background for the Tesla wrap shop. A squeegee — the
 * hard spreader card used to lay vinyl — travels across the page as you scroll,
 * reorienting to face its direction of travel (so it visibly changes angle like
 * a real hand pressing it down) and laying a smooth, blade-width swath of red
 * "paint" that fades out behind it like a brush stroke.
 *
 * The paint is a continuous filled ribbon (quads offset perpendicular to the
 * motion), not dabs, so there are no circles. The canvas is fixed, sits behind
 * all content (negative z-index in globals.css) and never intercepts clicks
 * (pointer-events: none). Honours prefers-reduced-motion and pauses when hidden.
 */

const RED = "204, 0, 0"; // #cc0000
const BLADE = 104; // px — squeegee blade length / paint swath width
const HW = BLADE / 2;
const TRAIL_LIFE = 78; // frames a paint segment survives (~1.3s at 60fps)
const MAX_POINTS = 320;

type Pt = { x: number; y: number; nx: number; ny: number; life: number };

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
    const dir = { x: 1, y: 0 }; // smoothed unit travel direction
    let speed = 0;
    let seeded = false;
    const trail: Pt[] = [];

    function scrollProgress() {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (max <= 0) return 0;
      return Math.min(1, Math.max(0, scrollY / max));
    }

    // Target squeegee position for the current scroll progress: sweeps side to
    // side a couple of times while descending, with a faint idle drift.
    function target() {
      const p = scrollProgress();
      const sweeps = 2.1;
      const idle = reduceMotion ? 0 : t;
      const x =
        width * (0.5 + 0.4 * Math.sin(p * Math.PI * 2 * sweeps + 0.4)) +
        Math.sin(idle * 0.0009) * 22;
      const y = height * (0.16 + 0.68 * p) + Math.cos(idle * 0.0011) * 16;
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
      // Continuous filled ribbon: one quad between each pair of points, sharing
      // edges so the swath is smooth. Alpha fades with age for the brush look.
      for (let i = 1; i < trail.length; i++) {
        const a = trail[i - 1];
        const b = trail[i];
        const life = (a.life + b.life) / 2 / TRAIL_LIFE;
        if (life <= 0) continue;

        const aL = { x: a.x + a.nx * HW, y: a.y + a.ny * HW };
        const aR = { x: a.x - a.nx * HW, y: a.y - a.ny * HW };
        const bL = { x: b.x + b.nx * HW, y: b.y + b.ny * HW };
        const bR = { x: b.x - b.nx * HW, y: b.y - b.ny * HW };

        // Outer soft swath.
        ctx!.fillStyle = `rgba(${RED}, ${0.13 * life})`;
        ctx!.beginPath();
        ctx!.moveTo(aL.x, aL.y);
        ctx!.lineTo(bL.x, bL.y);
        ctx!.lineTo(bR.x, bR.y);
        ctx!.lineTo(aR.x, aR.y);
        ctx!.closePath();
        ctx!.fill();

        // Brighter inner core (half width).
        const aLi = { x: a.x + a.nx * HW * 0.5, y: a.y + a.ny * HW * 0.5 };
        const aRi = { x: a.x - a.nx * HW * 0.5, y: a.y - a.ny * HW * 0.5 };
        const bLi = { x: b.x + b.nx * HW * 0.5, y: b.y + b.ny * HW * 0.5 };
        const bRi = { x: b.x - b.nx * HW * 0.5, y: b.y - b.ny * HW * 0.5 };
        ctx!.fillStyle = `rgba(${RED}, ${0.12 * life})`;
        ctx!.beginPath();
        ctx!.moveTo(aLi.x, aLi.y);
        ctx!.lineTo(bLi.x, bLi.y);
        ctx!.lineTo(bRi.x, bRi.y);
        ctx!.lineTo(aRi.x, aRi.y);
        ctx!.closePath();
        ctx!.fill();
      }
    }

    function drawSqueegee() {
      const angle = Math.atan2(dir.y, dir.x);
      // Press harder (more forward lean) with speed, for a 3D feel.
      const lean = Math.min(1, speed / 6);
      const depth = 26 + lean * 12;
      const persp = 0.8 - lean * 0.12; // far edge narrows with lean

      ctx!.save();
      ctx!.translate(pos.x, pos.y);

      // Grounding shadow (before rotation so it reads as cast on the surface).
      ctx!.save();
      ctx!.rotate(angle);
      ctx!.fillStyle = "rgba(0, 0, 0, 0.09)";
      ctx!.beginPath();
      // Narrow ellipse hugging the blade (not a round halo).
      ctx!.ellipse(depth * 0.45, 5, depth * 0.55, HW * 0.92, 0, 0, Math.PI * 2);
      ctx!.fill();
      ctx!.restore();

      ctx!.rotate(angle); // local +X = travel direction

      // Card face — a trapezoid receding forward (+X) for a 3D card look.
      const faceGrad = ctx!.createLinearGradient(0, 0, depth, 0);
      faceGrad.addColorStop(0, "rgba(230, 0, 0, 0.95)");
      faceGrad.addColorStop(1, "rgba(150, 0, 0, 0.95)");
      ctx!.fillStyle = faceGrad;
      ctx!.beginPath();
      ctx!.moveTo(0, -HW);
      ctx!.lineTo(depth, -HW * persp);
      ctx!.lineTo(depth, HW * persp);
      ctx!.lineTo(0, HW);
      ctx!.closePath();
      ctx!.fill();

      // Glossy highlight strip near the top of the face.
      ctx!.fillStyle = "rgba(255, 255, 255, 0.16)";
      ctx!.beginPath();
      ctx!.moveTo(0, -HW);
      ctx!.lineTo(depth, -HW * persp);
      ctx!.lineTo(depth, -HW * persp + 6);
      ctx!.lineTo(0, -HW + 8);
      ctx!.closePath();
      ctx!.fill();

      // Rubber contact edge (dark), at the trailing side where paint is laid.
      ctx!.fillStyle = "rgba(17, 17, 19, 0.95)";
      roundRect(ctx!, -9, -HW, 9, BLADE, 4);
      ctx!.fill();
      // Thin steel line above the rubber.
      ctx!.fillStyle = "rgba(150, 150, 156, 0.9)";
      roundRect(ctx!, -2, -HW + 2, 3, BLADE - 4, 1.5);
      ctx!.fill();

      ctx!.restore();
    }

    function frame(advance: boolean) {
      const tg = target();
      const prevX = pos.x;
      const prevY = pos.y;
      pos.x += (tg.x - pos.x) * 0.12;
      pos.y += (tg.y - pos.y) * 0.12;

      const dx = pos.x - prevX;
      const dy = pos.y - prevY;
      speed = Math.hypot(dx, dy);
      if (speed > 0.05) {
        // Smoothly steer the travel direction toward the velocity vector.
        const tX = dx / speed;
        const tY = dy / speed;
        dir.x += (tX - dir.x) * 0.2;
        dir.y += (tY - dir.y) * 0.2;
        const dl = Math.hypot(dir.x, dir.y) || 1;
        dir.x /= dl;
        dir.y /= dl;
      }

      if (advance && speed > 0.12) {
        // Perpendicular (normal) to the travel direction defines the swath edges.
        trail.push({
          x: pos.x,
          y: pos.y,
          nx: -dir.y,
          ny: dir.x,
          life: TRAIL_LIFE,
        });
        if (trail.length > MAX_POINTS) trail.shift();
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
