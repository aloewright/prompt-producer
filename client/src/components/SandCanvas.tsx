import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
}

export default function SandCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationRef = useRef<number>();
  const mouse = useRef({ x: -9999, y: -9999, px: -9999, py: -9999 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Size canvas
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Init particles
    const count = Math.min(8000, Math.floor(window.innerWidth * window.innerHeight / 150));
    const particles: Particle[] = [];
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        size: Math.random() * 1.2 + 0.3,
      });
    }
    particlesRef.current = particles;

    // Track mouse
    const onMove = (e: MouseEvent) => {
      mouse.current.px = mouse.current.x;
      mouse.current.py = mouse.current.y;
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;
    };
    window.addEventListener('mousemove', onMove);

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#d6c295'; // sand color
      ctx.beginPath();

      const mx = mouse.current.x;
      const my = mouse.current.y;
      const mvx = mouse.current.x - mouse.current.px;
      const mvy = mouse.current.y - mouse.current.py;

      for (const p of particlesRef.current) {
        // Interaction with cursor
        const dx = mx - p.x;
        const dy = my - p.y;
        const distSq = dx * dx + dy * dy;
        const influenceRadius = 120;
        if (distSq < influenceRadius * influenceRadius) {
          // Apply small acceleration in cursor movement direction
          p.vx += (mvx) * 0.002;
          p.vy += (mvy) * 0.002;
        }

        // Update velocity with gentle damping
        p.vx *= 0.98;
        p.vy *= 0.98;

        // Random drift
        p.vx += (Math.random() - 0.5) * 0.02;
        p.vy += (Math.random() - 0.5) * 0.02;

        // Update position
        p.x += p.vx;
        p.y += p.vy;

        // Wrap around
        if (p.x < 0) p.x += canvas.width;
        if (p.x > canvas.width) p.x -= canvas.width;
        if (p.y < 0) p.y += canvas.height;
        if (p.y > canvas.height) p.y -= canvas.height;

        // Draw
        ctx.moveTo(p.x, p.y);
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      }
      ctx.fill();

      animationRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMove);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-10"
      style={{ opacity: 0.9 }}
    />
  );
} 