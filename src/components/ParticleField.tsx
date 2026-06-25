import { useRef, useEffect } from 'react';

interface Particle {
  x: number;
  y: number;
  size: number;
  speed: number;
  opacity: number;
  color: string;
}

const PARTICLE_CONFIG = {
  baseSpeed: 0.5,
  windStrength: 0.2,
  colors: [
    'rgba(6, 182, 212, 0.8)',
    'rgba(6, 182, 212, 0.4)',
    'rgba(226, 232, 240, 0.3)',
  ],
};

export default function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    const particles: Particle[] = [];

    const isMobile = window.innerWidth < 768;
    const maxParticles = isMobile ? 40 : 80;
    const spawnRate = isMobile ? 0.6 : 0.8;

    function resize() {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }

    resize();
    window.addEventListener('resize', resize);

    function spawnParticle() {
      if (!canvas) return;
      const w = canvas.width;
      const h = canvas.height;

      // 从左下角或右下角生成
      const x = Math.random() * w * 0.2 + (Math.random() > 0.5 ? w * 0.8 : 0);

      particles.push({
        x,
        y: h + 10,
        size: Math.random() * 2.5 + 0.5,
        speed: Math.random() * 0.8 + 0.3,
        opacity: Math.random() * 0.6 + 0.4,
        color: PARTICLE_CONFIG.colors[Math.floor(Math.random() * PARTICLE_CONFIG.colors.length)],
      });
    }

    function draw() {
      if (!ctx || !canvas) return;

      const w = canvas.width;
      const h = canvas.height;

      ctx.clearRect(0, 0, w, h);

      // 生成新粒子
      if (particles.length < maxParticles && Math.random() < spawnRate) {
        spawnParticle();
      }

      // 更新和绘制粒子
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];

        // 运动规则
        p.y -= p.speed + Math.random() * 0.5;
        p.x += Math.sin(Date.now() * 0.001 + p.y * 0.01) * PARTICLE_CONFIG.windStrength;
        p.size *= 0.995;
        p.opacity -= 0.002;

        // 移除死亡粒子
        if (p.opacity <= 0 || p.size <= 0.1 || p.y < -10) {
          particles.splice(i, 1);
          continue;
        }

        // 绘制粒子
        ctx.save();
        ctx.globalAlpha = p.opacity;

        const isMainColor = p.color === PARTICLE_CONFIG.colors[0];
        if (isMainColor) {
          ctx.shadowBlur = 10;
          ctx.shadowColor = '#06B6D4';
        }

        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
      }

      // 重置 shadowBlur
      ctx.shadowBlur = 0;

      animationId = requestAnimationFrame(draw);
    }

    draw();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 1 }}
    />
  );
}
