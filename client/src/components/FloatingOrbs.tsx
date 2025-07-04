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

    // Create gradient spheres like in the reference
    const createShape = (layer: number): Shape => {
      const baseSpeed = 0.3 + (4 - layer) * 0.1; // Much slower, subtle movement
      
      return {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 300 + 200 - layer * 40,
        speedX: (Math.random() - 0.5) * baseSpeed,
        speedY: (Math.random() - 0.5) * baseSpeed,
        rotation: 0,
        rotationSpeed: 0,
        opacity: 0.6 - layer * 0.1, // More visible spheres
        type: 'circle', // Only circles for gradient spheres
        layer,
        pulsePhase: Math.random() * Math.PI * 2,
      };
    };

    // Create fewer, larger gradient spheres
    shapesRef.current = [];
    for (let layer = 0; layer < 3; layer++) {
      for (let i = 0; i < 3; i++) {
        shapesRef.current.push(createShape(layer));
      }
    }

    const drawShape = (ctx: CanvasRenderingContext2D, shape: Shape, time: number) => {
      ctx.save();
      ctx.translate(shape.x, shape.y);
      
      // Subtle pulsing effect
      const pulseFactor = 1 + Math.sin(time * 0.0005 + shape.pulsePhase) * 0.02;
      const size = shape.size * pulseFactor;
      
      // Soft blur for dreamy effect
      ctx.filter = `blur(${60}px)`;
      
      // Create blue-grey gradient sphere like in reference
      const gradient = ctx.createRadialGradient(
        -size * 0.3, -size * 0.3, 0,
        0, 0, size
      );
      
      // Blue to grey gradient colors
      if (shape.layer === 0) {
        gradient.addColorStop(0, `rgba(120, 150, 190, ${shape.opacity})`);
        gradient.addColorStop(0.4, `rgba(140, 160, 185, ${shape.opacity * 0.8})`);
        gradient.addColorStop(0.7, `rgba(160, 170, 180, ${shape.opacity * 0.5})`);
        gradient.addColorStop(1, `rgba(180, 180, 185, 0)`);
      } else if (shape.layer === 1) {
        gradient.addColorStop(0, `rgba(130, 140, 170, ${shape.opacity})`);
        gradient.addColorStop(0.4, `rgba(150, 155, 175, ${shape.opacity * 0.8})`);
        gradient.addColorStop(0.7, `rgba(170, 170, 180, ${shape.opacity * 0.5})`);
        gradient.addColorStop(1, `rgba(185, 185, 190, 0)`);
      } else {
        gradient.addColorStop(0, `rgba(140, 145, 160, ${shape.opacity})`);
        gradient.addColorStop(0.4, `rgba(160, 160, 170, ${shape.opacity * 0.8})`);
        gradient.addColorStop(0.7, `rgba(175, 175, 180, ${shape.opacity * 0.5})`);
        gradient.addColorStop(1, `rgba(190, 190, 195, 0)`);
      }
      
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(0, 0, size, 0, Math.PI * 2);
      ctx.fill();
      
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