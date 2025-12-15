"use client";

import { generateHaptic } from "@/lib/utils";
import { useEffect, useRef } from "react";

const COLORS = ["#ff6b6b", "#ffd93d", "#6bcB77", "#4d96ff", "#ff8fab"];

export const ConfettiCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    generateHaptic();

    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d", {
      desynchronized: true,
    })!;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles: {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      color: string;
      active: boolean;
    }[] = [];

    const createParticles = () => {
      for (let i = 0; i < 80; i++) {
        particles.push({
          x: canvas.width / 2,
          y: canvas.height / 2,
          vx: (Math.random() - 0.5) * 6,
          vy: (Math.random() - 1.5) * 6,
          size: Math.random() * 6 + 4, // 픽셀 느낌 크기
          color: COLORS[Math.floor(Math.random() * COLORS.length)],
          active: true,
        });
      }
    };

    createParticles();

    let animationId: number;
    const update = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      let activeCount = 0;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        if (!p.active) continue;

        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.15;

        ctx.fillStyle = p.color;
        ctx.fillRect(p.x, p.y, p.size, p.size);

        if (p.y > canvas.height || p.x < 0 || p.x > canvas.width) {
          p.active = false;
        } else {
          activeCount++;
        }
      }

      if (activeCount === 0) return;

      animationId = requestAnimationFrame(update);
    };

    update();

    return () => {
      if (animationId) cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-50"
    />
  );
};
