'use client';

import { useEffect, useState } from 'react';
import { CircleCheck, CircleX } from 'lucide-react';
import { cn } from '@/lib/utils';

const OFFICE_TIME_ZONE = 'Asia/Dhaka';
const STATUS_CHECK_INTERVAL_MS = 60_000;

type TOfficeHoursStatusProps = {
  days: string;
  time: string;
  openHour: number;
  closeHour: number;
};

function getDhakaMinutes(now: Date): number | null {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: OFFICE_TIME_ZONE,
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(now);

  const hourPart = parts.find((part) => part.type === 'hour')?.value;
  const minutePart = parts.find((part) => part.type === 'minute')?.value;
  const hour = Number(hourPart);
  const minute = Number(minutePart);

  if (
    hourPart === undefined ||
    minutePart === undefined ||
    Number.isNaN(hour) ||
    Number.isNaN(minute)
  ) {
    return null;
  }

  const normalizedHour = hour === 24 ? 0 : hour;

  return normalizedHour * 60 + minute;
}

function isOfficeOpen(openHour: number, closeHour: number, now: Date): boolean {
  const minutes = getDhakaMinutes(now);

  if (minutes === null) {
    return false;
  }

  return minutes >= openHour * 60 && minutes < closeHour * 60;
}

export function OfficeHoursStatus({
  days,
  time,
  openHour,
  closeHour,
}: Readonly<TOfficeHoursStatusProps>) {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    function updateNow() {
      setNow(new Date());
    }

    updateNow();

    const intervalId = window.setInterval(updateNow, STATUS_CHECK_INTERVAL_MS);

    return () => {
      window.clearInterval(intervalId);
    };
  }, []);

  const isOpen = now === null ? null : isOfficeOpen(openHour, closeHour, now);
  const StatusIcon = isOpen ? CircleCheck : CircleX;

  return (
    <div className="flex items-start gap-2">
      {isOpen === null ? (
        <span className="mt-0.5 size-5 shrink-0" aria-hidden="true" />
      ) : (
        <StatusIcon
          className={cn(
            'mt-0.5 size-5 shrink-0',
            isOpen ? 'text-primary' : 'text-muted-foreground'
          )}
          aria-hidden="true"
        />
      )}
      <p>
        <span
          className={cn(
            'block text-sm font-semibold tracking-wide',
            isOpen ? 'text-primary' : 'text-muted-foreground'
          )}
          role="status"
        >
          {isOpen === null ? '\u00a0' : isOpen ? 'OPEN' : 'CLOSED'}
        </span>
        <span className="mt-0.5 block text-base text-muted-foreground">
          {days}, {time}
        </span>
      </p>
    </div>
  );
}
