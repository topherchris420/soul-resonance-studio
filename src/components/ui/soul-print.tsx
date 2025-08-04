import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";

interface SoulPrintProps {
  className?: string;
  isActive?: boolean;
  intensity?: number;
  harmonics?: number[];
}

export const SoulPrint = ({ className, isActive = false, intensity = 0.5, harmonics = [0.3, 0.7, 0.5, 0.9, 0.6] }: SoulPrintProps) => {
  const [pulsePhase, setPulsePhase] = useState(0);

  useEffect(() => {
    if (!isActive) return;
    
    const interval = setInterval(() => {
      setPulsePhase(prev => (prev + 1) % 360);
    }, 50);

    return () => clearInterval(interval);
  }, [isActive]);

  const generatePath = (index: number) => {
    const baseRadius = 60 + index * 15;
    const variance = harmonics[index % harmonics.length] * intensity * 20;
    const points = [];
    
    for (let angle = 0; angle < 360; angle += 18) {
      const rad = (angle * Math.PI) / 180;
      const radius = baseRadius + Math.sin((angle + pulsePhase * 2) * Math.PI / 180) * variance;
      const x = 100 + radius * Math.cos(rad);
      const y = 100 + radius * Math.sin(rad);
      points.push(`${x},${y}`);
    }
    
    return `M ${points[0]} Q ${points.slice(1).join(' ')} Z`;
  };

  return (
    <div className={cn("relative w-32 h-32 sm:w-48 sm:h-48 flex items-center justify-center", className)}>
      <svg 
        width="100%" 
        height="100%" 
        viewBox="0 0 200 200" 
        className="absolute inset-0"
        style={{ maxWidth: '200px', maxHeight: '200px' }}
      >
        <defs>
          <radialGradient id="soulGradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.8" />
            <stop offset="40%" stopColor="hsl(var(--secondary))" stopOpacity="0.6" />
            <stop offset="80%" stopColor="hsl(var(--accent))" stopOpacity="0.4" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
          
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge> 
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* Background pulse */}
        <circle
          cx="100"
          cy="100"
          r={60 + intensity * 30}
          fill="url(#soulGradient)"
          opacity={intensity}
          className={isActive ? "animate-soul-pulse" : ""}
        />

        {/* Harmonic layers */}
        {harmonics.map((harmonic, index) => (
          <path
            key={index}
            d={generatePath(index)}
            fill="none"
            stroke={index % 3 === 0 ? "hsl(var(--primary))" : index % 3 === 1 ? "hsl(var(--secondary))" : "hsl(var(--accent))"}
            strokeWidth="2"
            opacity={harmonic * intensity}
            filter="url(#glow)"
            className={isActive ? "animate-cosmic-drift" : ""}
            style={{
              animationDelay: `${index * 0.5}s`,
              animationDuration: `${4 + index}s`
            }}
          />
        ))}

        {/* Central resonance core */}
        <circle
          cx="100"
          cy="100"
          r={8 + intensity * 12}
          fill="hsl(var(--primary))"
          className={isActive ? "animate-soul-pulse" : ""}
          filter="url(#glow)"
        />
      </svg>
    </div>
  );
};