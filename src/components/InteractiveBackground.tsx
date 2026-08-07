"use client";

import { useEffect, useRef } from "react";

/**
 * Interactive, EV-themed background for the Tesla wrap shop. It evokes a car in
 * motion: aerodynamic "speed streaks" race across several parallax depth layers,
 * while glowing electric-charge particles (brand red + an EV/eco green) dart past
 * with light trails. Soft ambient glows warm the otherwise white page.
 *
 * Depth comes from parallax: layers drift at different rates in response to both
 * scroll position and pointer movement, so nearer layers move faster than far
 * ones. The canvas is fixed, sits behind all content (negative z-index in
 * globals.css) and never intercepts clicks (pointer-events: none) — pointer and
 * scroll are read from window listeners. Honours prefers-reduced-motion and
 * pauses when the tab is hidden.
 */

const RED = "204, 0, 0"; // #cc0000
const RED_BRIGHT = "224, 0, 0"; // #e00000
const CHARCOAL = "24, 24, 27";
const ECO = "22, 200, 120"; // electric EV/eco green accent

const MARGIN = 90;

type Streak = {
  x: number;
  baseY: number;
  len: number;
  w: number;
  speed: number;
  alpha: number;
  color: string;
};

type LayerDef = {
  density: number; // streaks per 1000px of width
  speed: [number, number];
  len: [number, number];
  w: [number, number];
  alpha: number;
  mouseAmp: number;
  scrollAmp: number;
  colors: string[];
};

const LAYERS: LayerDef[] = [
  // Far — big, faint, slow.
  {
    density: 5,
    speed: [0.15, 0.4],
    len: [160, 320],
    w: [1, 2],
    alpha: 0.05,
    mouseAmp: 10,
    scrollAmp: -0.05,
    colors: [CHARCOAL, RED],
  },
  // Mid.
  {
    density: 7,
    speed: [0.5, 1.0],
    len: [120, 240],
    w: [1, 2],
    alpha: 0.07,
    mouseAmp: 24,
    scrollAmp: -0.11,
    colors: [RED, CHARCOAL],
  },
  // Near — shorter, brighter, fast.
  {
    density: 8,
    speed: [1.1, 2.1],
    len: [80, 170],
    w: [1.5, 3],
    alpha: 0.09,
    mouseAmp: 40,
    scrollAmp: -0.19,
    colors: [RED_BRIGHT, RED],
  },
];

type Particle = {
  x: number;
  baseY: number;
  speed: number;
  size: number;
  trail: number;
  color: string;
};

type Orb = {
  x: number;
  y: number;
  r: number;
  color: string;
  alpha: number;
  dx: number;
  dy: number;
  mouseAmp: number;
};

const ORBS: Orb[] = [
  { x: 0.16, y: 0.18, r: 0.5, color: RED, alpha: 0.06, dx: 0.00003, dy: 0.00002, mouseAmp: 22 },
  { x: 0.85, y: 0.7, r: 0.45, color: ECO, alpha: 0.04, dx: -0.000025, dy: 0.00003, mouseAmp: 30 },
  { x: 0.55, y: 0.4, r: 0.55, color: CHARCOAL, alpha: 0.04, dx: 0.00002, dy: -0.000028, mouseAmp: 16 },
];

function rand(min: number, max: number) {
  return min + Math.random() * (max - min);
}

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

    let layerStreaks: Streak[][] = [];
    let particles: Particle[] = [];

    let scrollY = window.scrollY;
    // Pointer offset from centre, normalised to -1..1, plus a smoothed copy.
    const mouse = { x: 0, y: 0 };
    const smooth = { x: 0, y: 0 };

    function seed() {
      const fh = height + MARGIN * 2;
      layerStreaks = LAYERS.map((layer) => {
        const count = Math.max(
          4,
          Math.round((width / 1000) * layer.density)
        );
        return Array.from({ length: count }, () => ({
          x: rand(0, width + MARGIN * 2),
          baseY: rand(0, fh),
          len: rand(layer.len[0], layer.len[1]),
          w: rand(layer.w[0], layer.w[1]),
          speed: rand(layer.speed[0], layer.speed[1]),
          alpha: layer.alpha * rand(0.7, 1.2),
          color: layer.colors[Math.floor(Math.random() * layer.colors.length)],
        }));
      });

      const pCount = Math.max(6, Math.round((width / 1000) * 6));
      particles = Array.from({ length: pCount }, () => ({
        x: rand(0, width),
        baseY: rand(0, height + MARGIN * 2),
        speed: rand(2.4, 5.2),
        size: rand(1.4, 2.6),
        trail: rand(40, 90),
        color: Math.random() < 0.45 ? ECO : RED_BRIGHT,
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

    function wrap(v: number, span: number) {
      return ((v % span) + span) % span;
    }

    function drawOrbs() {
      for (const o of ORBS) {
        const ox =
          (o.x + Math.sin(scrollY * 0.0004 * (o.dx > 0 ? 1 : -1)) * 0.03) *
            width +
          smooth.x * o.mouseAmp;
        const oy =
          o.y * height -
          scrollY * 0.04 +
          smooth.y * o.mouseAmp +
          Math.cos(scrollY * 0.0004) * 8;
        const r = o.r * Math.max(width, height);
        const grad = ctx!.createRadialGradient(ox, oy, 0, ox, oy, r);
        grad.addColorStop(0, `rgba(${o.color}, ${o.alpha})`);
        grad.addColorStop(1, `rgba(${o.color}, 0)`);
        ctx!.fillStyle = grad;
        ctx!.fillRect(0, 0, width, height);
      }
    }

    function drawStreaks(advance: boolean) {
      const fh = height + MARGIN * 2;
      for (let li = 0; li < LAYERS.length; li++) {
        const layer = LAYERS[li];
        const streaks = layerStreaks[li];
        const fw = width + MARGIN * 2;
        for (const s of streaks) {
          if (advance) {
            s.x += s.speed;
            if (s.x > fw + s.len) s.x -= fw + s.len * 2;
          }
          const x =
            wrap(s.x + smooth.x * layer.mouseAmp, fw + s.len) - s.len - MARGIN / 2;
          const y =
            wrap(s.baseY + scrollY * layer.scrollAmp, fh) -
            MARGIN +
            smooth.y * layer.mouseAmp;

          const grad = ctx!.createLinearGradient(x, y, x + s.len, y);
          grad.addColorStop(0, `rgba(${s.color}, 0)`);
          grad.addColorStop(0.5, `rgba(${s.color}, ${s.alpha})`);
          grad.addColorStop(1, `rgba(${s.color}, 0)`);
          ctx!.strokeStyle = grad;
          ctx!.lineWidth = s.w;
          ctx!.beginPath();
          ctx!.moveTo(x, y);
          ctx!.lineTo(x + s.len, y);
          ctx!.stroke();
        }
      }
    }

    function drawParticles(advance: boolean) {
      const fh = height + MARGIN * 2;
      const mouseAmp = 52;
      const scrollAmp = -0.24;
      for (const p of particles) {
        if (advance) {
          p.x += p.speed;
          if (p.x > width + p.trail + MARGIN) p.x = -p.trail - MARGIN;
        }
        const x = p.x + smooth.x * mouseAmp;
        const y =
          wrap(p.baseY + scrollY * scrollAmp, fh) - MARGIN + smooth.y * mouseAmp;

        // Trailing light behind the charge.
        const tg = ctx!.createLinearGradient(x - p.trail, y, x, y);
        tg.addColorStop(0, `rgba(${p.color}, 0)`);
        tg.addColorStop(1, `rgba(${p.color}, 0.5)`);
        ctx!.strokeStyle = tg;
        ctx!.lineWidth = p.size;
        ctx!.beginPath();
        ctx!.moveTo(x - p.trail, y);
        ctx!.lineTo(x, y);
        ctx!.stroke();

        // Glowing head.
        const g = ctx!.createRadialGradient(x, y, 0, x, y, p.size * 5);
        g.addColorStop(0, `rgba(${p.color}, 0.9)`);
        g.addColorStop(0.4, `rgba(${p.color}, 0.4)`);
        g.addColorStop(1, `rgba(${p.color}, 0)`);
        ctx!.fillStyle = g;
        ctx!.beginPath();
        ctx!.arc(x, y, p.size * 5, 0, Math.PI * 2);
        ctx!.fill();
      }
    }

    function frame(advance: boolean) {
      smooth.x += (mouse.x - smooth.x) * 0.06;
      smooth.y += (mouse.y - smooth.y) * 0.06;
      ctx!.clearRect(0, 0, width, height);
      drawOrbs();
      drawStreaks(advance);
      drawParticles(advance);
    }

    function loop() {
      if (!running) return;
      frame(true);
      raf = window.requestAnimationFrame(loop);
    }

    // --- Event handlers -----------------------------------------------------
    const onPointerMove = (e: PointerEvent) => {
      mouse.x = (e.clientX / width - 0.5) * 2;
      mouse.y = (e.clientY / height - 0.5) * 2;
    };
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
    window.addEventListener("pointermove", onPointerMove, { passive: true });
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
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return <canvas ref={canvasRef} aria-hidden="true" className="tws-bg-canvas" />;
}
