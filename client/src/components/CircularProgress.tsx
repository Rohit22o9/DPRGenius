import { useEffect, useRef } from 'react';

interface CircularProgressProps {
  percentage: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  label?: string;
  sublabel?: string;
}

export function CircularProgress({ 
  percentage, 
  size = 128, 
  strokeWidth = 8, 
  color = "#1976d2",
  label,
  sublabel 
}: CircularProgressProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const centerX = size / 2;
    const centerY = size / 2;
    const radius = (size - strokeWidth) / 2;

    // Clear canvas
    ctx.clearRect(0, 0, size, size);

    // Draw background circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.lineWidth = strokeWidth;
    ctx.strokeStyle = '#e5e7eb';
    ctx.stroke();

    // Draw progress circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, -Math.PI / 2, (2 * Math.PI * percentage / 100) - Math.PI / 2);
    ctx.lineWidth = strokeWidth;
    ctx.strokeStyle = color;
    ctx.lineCap = 'round';
    ctx.stroke();
  }, [percentage, size, strokeWidth, color]);

  return (
    <div className="relative inline-block">
      <canvas
        ref={canvasRef}
        width={size}
        height={size}
        className="transform"
      />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl font-bold text-foreground">{Math.round(percentage)}</div>
          {sublabel && <div className="text-xs text-muted-foreground">{sublabel}</div>}
        </div>
      </div>
    </div>
  );
}
