'use client';

import { useEffect, useMemo, useState } from 'react';

type CountdownProps = {
  targetDate: string;
};

type TimeLeft = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

function getTimeLeft(targetDate: string): TimeLeft {
  const target = new Date(targetDate).getTime();
  const now = Date.now();
  const diff = Math.max(0, target - now);

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  return { days, hours, minutes, seconds };
}

function formatUnit(value: number) {
  return String(value).padStart(2, '0');
}

export default function Countdown({ targetDate }: CountdownProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(() => getTimeLeft(targetDate));

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(getTimeLeft(targetDate));
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  const units = useMemo(
    () => [
      { label: 'dias', value: timeLeft.days },
      { label: 'horas', value: timeLeft.hours },
      { label: 'min', value: timeLeft.minutes },
      { label: 'seg', value: timeLeft.seconds }
    ],
    [timeLeft]
  );

  return (
    <div aria-live="polite" className="mx-auto flex max-w-xl items-center justify-center gap-2 rounded-2xl border border-roseDeep/20 bg-white/70 px-3 py-3 sm:gap-3">
      {units.map((unit, index) => (
        <div key={unit.label} className="flex items-center gap-2 sm:gap-3">
          <div className="text-center">
            <div className="font-serifRomance text-2xl text-gold sm:text-3xl">{formatUnit(unit.value)}</div>
            <div className="text-[10px] uppercase tracking-[0.16em] text-roseDeep/80 sm:text-xs">{unit.label}</div>
          </div>
          {index < units.length - 1 ? <span className="text-lg text-gold/65">·</span> : null}
        </div>
      ))}
    </div>
  );
}
