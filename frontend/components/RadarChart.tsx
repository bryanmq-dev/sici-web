'use client';

import React, { useMemo } from 'react';
import { motion } from 'motion/react';

interface RadarData {
  name: string;
  value: number;
}

interface RadarChartProps {
  data: RadarData[];
  size?: number;
  maxValue?: number;
  color?: string;
}

export default function RadarChart({ 
  data, 
  size = 300, 
  maxValue = 100,
  color = '#00f2ff' 
}: RadarChartProps) {
  const center = size / 2;
  const radius = (size / 2) * 0.7;
  const angleStep = (Math.PI * 2) / data.length;

  const points = useMemo(() => {
    return data.map((d, i) => {
      const angle = i * angleStep - Math.PI / 2;
      const r = (d.value / maxValue) * radius;
      return {
        x: center + r * Math.cos(angle),
        y: center + r * Math.sin(angle),
        labelX: center + (radius + 20) * Math.cos(angle),
        labelY: center + (radius + 20) * Math.sin(angle),
        name: d.name
      };
    });
  }, [data, center, radius, angleStep, maxValue]);

  const polygonPath = points.map(p => `${p.x},${p.y}`).join(' ');

  // Grid circles
  const gridCircles = [0.2, 0.4, 0.6, 0.8, 1].map(factor => radius * factor);

  return (
    <div className="relative w-full aspect-square flex items-center justify-center max-w-[400px] mx-auto">
      <svg 
        viewBox={`0 0 ${size} ${size}`}
        className="w-full h-full overflow-visible"
      >
        {/* Grid Circles */}
        {gridCircles.map((r, i) => (
          <circle
            key={i}
            cx={center}
            cy={center}
            r={r}
            fill="none"
            stroke="rgba(255,255,255,0.05)"
            strokeWidth="1"
          />
        ))}

        {/* Axis Lines */}
        {points.map((p, i) => {
          const angle = i * angleStep - Math.PI / 2;
          return (
            <line
              key={i}
              x1={center}
              y1={center}
              x2={center + radius * Math.cos(angle)}
              y2={center + radius * Math.sin(angle)}
              stroke="rgba(255,255,255,0.05)"
              strokeWidth="1"
            />
          );
        })}

        {/* Data Polygon */}
        <motion.polygon
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 0.3, scale: 1 }}
          points={polygonPath}
          fill={color}
          stroke={color}
          strokeWidth="2"
          className="drop-shadow-[0_0_8px_rgba(0,242,255,0.5)]"
        />

        {/* Data Points */}
        {points.map((p, i) => (
          <circle
            key={i}
            cx={p.x}
            cy={p.y}
            r="3"
            fill={color}
            className="drop-shadow-[0_0_4px_rgba(0,242,255,0.8)]"
          />
        ))}

        {/* Labels */}
        {points.map((p, i) => (
          <text
            key={i}
            x={p.labelX}
            y={p.labelY}
            textAnchor="middle"
            dominantBaseline="middle"
            className="text-[8px] font-mono fill-secondary/60 uppercase tracking-widest"
          >
            {p.name}
          </text>
        ))}
      </svg>
    </div>
  );
}
