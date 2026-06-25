import { useRef, useEffect } from 'react';

const GRID_CONFIG = {
  lineColor: 'rgba(30, 41, 59, 0.4)',
  bgColor: '#0B0E14',
  waveSpeed: 1.0,
  lineCount: 40,
  perspective: 0.8,
  highlightColor: 'rgba(6, 182, 212, 0.6)',
};

export default function WaveGridCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;

    function resize() {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }

    resize();
    window.addEventListener('resize', resize);

    function getWaveOffset(x: number, y: number, width: number, height: number, time: number): number {
      const cx = width / 2;
      const cy = height / 2;

      // 主流动波
      const mainWave = (
        Math.sin(x * 0.01 + time) * 15.0 +
        Math.cos(y * 0.008 - time) * 15.0
      ) * 1.2;

      // 快速细节波
      const fastWave = (
        Math.sin(x * 0.03 + time * 2) * 5.0 +
        Math.cos(y * 0.025 - time * 1.5) * 5.0
      );

      // 对角交叉波
      const diagWave = Math.sin((x + y) * 0.02 + time * 0.5) * 8.0;

      // 中心辐射波
      const dist = Math.sqrt((x - cx) ** 2 + (y - cy) ** 2);
      const radialWave = (
        Math.sin(dist * 0.015 - time) * 10.0 +
        Math.cos(dist * 0.01 + time * 0.8) * 5.0
      );

      const wave = mainWave + fastWave + diagWave + radialWave;
      return Math.max(wave, 0) * 0.6;
    }

    function draw() {
      if (!ctx || !canvas) return;

      const w = canvas.width;
      const h = canvas.height;
      const time = Date.now() * 0.001 * GRID_CONFIG.waveSpeed;
      const lineCount = window.innerWidth < 768 ? 20 : GRID_CONFIG.lineCount;

      // 1. 填充背景
      ctx.fillStyle = GRID_CONFIG.bgColor;
      ctx.fillRect(0, 0, w, h);

      const stepX = w / lineCount;
      const stepY = h / lineCount;

      // 2. 绘制垂直线
      ctx.strokeStyle = GRID_CONFIG.lineColor;
      ctx.lineWidth = 0.5;

      for (let i = 0; i <= lineCount; i++) {
        const currentX = i * stepX;
        ctx.beginPath();

        for (let y = 0; y <= h; y += 5) {
          const offset = getWaveOffset(currentX, y, w, h, time);
          const perspectiveX = (currentX - w / 2) * offset * 0.003;
          ctx.lineTo(currentX + perspectiveX, y + offset);

          // 高光追踪
          if (Math.abs(offset) < 2) {
            ctx.save();
            ctx.fillStyle = 'rgba(6, 182, 212, 0.3)';
            ctx.beginPath();
            ctx.arc(currentX + perspectiveX, y + offset, 1.5, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
          }
        }
        ctx.stroke();
      }

      // 3. 绘制水平线
      for (let i = 0; i <= lineCount; i++) {
        const currentY = i * stepY;
        ctx.beginPath();

        for (let x = 0; x <= w; x += 5) {
          const offset = getWaveOffset(x, currentY, w, h, time);
          const perspectiveX = (x - w / 2) * offset * 0.003;
          ctx.lineTo(x + perspectiveX, currentY + offset);

          // 高光追踪
          if (Math.abs(offset) < 2) {
            ctx.save();
            ctx.fillStyle = 'rgba(6, 182, 212, 0.3)';
            ctx.beginPath();
            ctx.arc(x + perspectiveX, currentY + offset, 1.5, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
          }
        }
        ctx.stroke();
      }

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
      className="absolute inset-0 w-full h-full"
      style={{ zIndex: 0 }}
    />
  );
}
