import { useMemo } from 'react';
import { ChronosEvent } from '@/components/ui/chronos/chronos';
import { EVENTS as ORIGINAL_EVENTS } from '@/lib/exampleData';

// The center date that the original events are based on
const CENTER_DATE = new Date("2025-03-01T12:00:00");

export function useShiftedEvents(): ChronosEvent[] {
  return useMemo(() => {
    const now = new Date();
    // Calculate the difference in days between now and the center date
    const dayDiff = Math.floor((now.getTime() - CENTER_DATE.getTime()) / (1000 * 60 * 60 * 24));
    
    return ORIGINAL_EVENTS.map(event => {
      const start = new Date(event.start);
      const end = new Date(event.end);
      
      // Shift both start and end dates by the same amount
      start.setDate(start.getDate() + dayDiff);
      end.setDate(end.getDate() + dayDiff);
      
      return {
        ...event,
        start,
        end
      };
    });
  }, []);
}
