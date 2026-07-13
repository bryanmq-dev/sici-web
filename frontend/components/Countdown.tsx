'use client';

import React, { useState, useEffect } from 'react';

interface CountdownProps {
  targetDate: string;
}

export default function Countdown({ targetDate }: CountdownProps) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = new Date(targetDate).getTime() - now;

      if (distance < 0) {
        clearInterval(timer);
        return;
      }

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000)
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  return (
    <div className="flex gap-4 md:gap-8 justify-center">
      {[
        { label: 'DÍAS', value: timeLeft.days },
        { label: 'HORAS', value: timeLeft.hours },
        { label: 'MINUTOS', value: timeLeft.minutes },
        { label: 'SEGUNDOS', value: timeLeft.seconds },
      ].map((unit, i) => (
        <div key={i} className="flex flex-col items-center">
          <div className="text-4xl md:text-6xl font-display font-bold text-primary tracking-tighter">
            {unit.value.toString().padStart(2, '0')}
          </div>
          <div className="text-[8px] md:text-[10px] font-mono text-text-secondary/40 uppercase tracking-[0.3em] mt-2">
            {unit.label}
          </div>
        </div>
      ))}
    </div>
  );
}
