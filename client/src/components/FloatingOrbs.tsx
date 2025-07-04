import { useEffect, useRef } from 'react';

interface Shape {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  rotation: number;
  rotationSpeed: number;
  opacity: number;
  type: 'circle' | 'hexagon' | 'triangle' | 'square' | 'diamond';
  layer: number;
  pulsePhase: number;
}

export default function FloatingOrbs() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const shapesRef = useRef<Shape[]>([]);
  const animationRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Create shapes with multiple layers and geometric variety
    const createShape = (layer: number): Shape => {
      const types: Shape['type'][] = ['circle', 'hexagon', 'triangle', 'square', 'diamond'];
      const baseSpeed = 1.5 + (4 - layer) * 0.8; // Faster movement for back layers
      
      return {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 350 + 150 - layer * 30,
        speedX: (Math.random() - 0.5) * baseSpeed,
        speedY: (Math.random() - 0.5) * baseSpeed,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.02,
        opacity: 0.01 + (4 - layer) * 0.01 + Math.random() * 0.02,
        type: types[Math.floor(Math.random() * types.length)],
        layer,
        pulsePhase: Math.random() * Math.PI * 2,
      };
    };

    // Create multiple layers of shapes
    shapesRef.current = [];
    for (let layer = 0; layer < 5; layer++) {
      for (let i = 0; i < 8; i++) {
        shapesRef.current.push(createShape(layer));
      }
    }

    const drawShape = (ctx: CanvasRenderingContext2D, shape: Shape, time: number) => {
      ctx.save();
      ctx.translate(shape.x, shape.y);
      ctx.rotate(shape.rotation);
      
      // Pulsing effect
      const pulseFactor = 1 + Math.sin(time * 0.001 + shape.pulsePhase) * 0.1;
      const size = shape.size * pulseFactor;
      
      // Apply layer-based blur effect
      ctx.filter = `blur(${35 - shape.layer * 6}px)`;
      
      // Set multi-layer gradient fill
      const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, size);
      const lightness = 95 - shape.layer * 3;
      
      // Multiple transparency levels
      gradient.addColorStop(0, `hsla(0, 0%, ${lightness}%, ${shape.opacity * 3})`);
      gradient.addColorStop(0.3, `hsla(0, 0%, ${lightness}%, ${shape.opacity * 2})`);
      gradient.addColorStop(0.6, `hsla(0, 0%, ${lightness}%, ${shape.opacity})`);
      gradient.addColorStop(0.8, `hsla(0, 0%, ${lightness}%, ${shape.opacity * 0.5})`);
      gradient.addColorStop(1, `hsla(0, 0%, ${lightness}%, 0)`);
      
      ctx.fillStyle = gradient;
      
      switch (shape.type) {
        case 'circle':
          ctx.beginPath();
          ctx.arc(0, 0, size, 0, Math.PI * 2);
          ctx.fill();
          break;
          
        case 'hexagon':
          ctx.beginPath();
          for (let i = 0; i < 6; i++) {
            const angle = (Math.PI / 3) * i;
            const x = size * Math.cos(angle);
            const y = size * Math.sin(angle);
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          ctx.closePath();
          ctx.fill();
          break;
          
        case 'triangle':
          ctx.beginPath();
          ctx.moveTo(0, -size);
          ctx.lineTo(size * 0.866, size * 0.5);
          ctx.lineTo(-size * 0.866, size * 0.5);
          ctx.closePath();
          ctx.fill();
          break;
          
        case 'square':
          const squareSize = size * 0.85;
          ctx.fillRect(-squareSize, -squareSize, squareSize * 2, squareSize * 2);
          break;
          
        case 'diamond':
          ctx.beginPath();
          ctx.moveTo(0, -size);
          ctx.lineTo(size * 0.7, 0);
          ctx.lineTo(0, size);
          ctx.lineTo(-size * 0.7, 0);
          ctx.closePath();
          ctx.fill();
          break;
      }
      
      ctx.restore();
    };

    // Animation loop
    const animate = (time: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Sort shapes by layer for proper rendering order (back to front)
      shapesRef.current.sort((a, b) => b.layer - a.layer);

      shapesRef.current.forEach((shape) => {
        // Update position with faster movement
        shape.x += shape.speedX;
        shape.y += shape.speedY;
        shape.rotation += shape.rotationSpeed;

        // Wrap around edges for continuous motion
        if (shape.x - shape.size > canvas.width) shape.x = -shape.size;
        if (shape.x + shape.size < 0) shape.x = canvas.width + shape.size;
        if (shape.y - shape.size > canvas.height) shape.y = -shape.size;
        if (shape.y + shape.size < 0) shape.y = canvas.height + shape.size;

        // Draw shape with time-based effects
        drawShape(ctx, shape, time);
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate(0);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity: 0.6 }}
    />
  );
}