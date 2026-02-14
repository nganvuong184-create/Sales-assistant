
import React, { useEffect, useRef } from 'react';

interface AudioVisualizerProps {
  isActive: boolean;
  color?: string;
}

const AudioVisualizer: React.FC<AudioVisualizerProps> = ({ isActive, color = 'bg-emerald-500' }) => {
  const bars = Array.from({ length: 12 }, (_, i) => i);
  
  return (
    <div className="flex items-center justify-center gap-1 h-8">
      {bars.map((bar) => (
        <div
          key={bar}
          className={`${color} w-1.5 rounded-full transition-all duration-300 ${
            isActive ? 'animate-pulse' : 'h-1'
          }`}
          style={{
            height: isActive ? `${Math.random() * 100}%` : '4px',
            animationDelay: `${bar * 0.1}s`,
            opacity: isActive ? 0.4 + Math.random() * 0.6 : 0.3
          }}
        />
      ))}
    </div>
  );
};

export default AudioVisualizer;
