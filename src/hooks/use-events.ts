"use client"

import { useChronos, ChronosEvent, PositionedChronosEvent } from "@/components/ui/chronos/chronos"
import { areIntervalsOverlapping, isSameDay } from "date-fns"
import { useMemo } from "react"

export function useFullDayEvents(start: Date, end: Date) {
  const { events: allEvents } = useChronos()

  return useMemo(() => calculateEventLayout(allEvents.filter(
    e => e.allDay && e.end >= start && e.start <= end
  )), [allEvents, start, end])
}

// TODO: don't calculateEventLayout on year and month views
export function useDayEvents(date: Date, previewEvent: ChronosEvent | null = null) {
  const { events: allEvents } = useChronos()

  return useMemo(() => {
    let events = [...allEvents]
    if (previewEvent) events.push(previewEvent)

    return calculateEventLayout(events.filter(event => !event.allDay && isSameDay(event.start, date)))
  }, [allEvents, date, previewEvent])
}

function calculateEventLayout(events: ChronosEvent[]): PositionedChronosEvent[] {
  if (events.length === 0) return [];

  const positionedEvents: PositionedChronosEvent[] = events.map(event => ({
    ...event,
    channelIndex: 0,
    numChannels: 1
  }));

  // Find all events that overlap with each event
  const eventOverlaps = new Map<PositionedChronosEvent, Set<PositionedChronosEvent>>();
  
  positionedEvents.forEach(event => {
    const overlaps = new Set<PositionedChronosEvent>();
    
    positionedEvents.forEach(otherEvent => {
      if (otherEvent !== event && areIntervalsOverlapping(event, otherEvent)) {
        overlaps.add(otherEvent);
      }
    });
    
    eventOverlaps.set(event, overlaps);
  });
  
  // Find connected components (groups of events that overlap directly or indirectly)
  const visited = new Set<PositionedChronosEvent>();
  const eventGroups: PositionedChronosEvent[][] = [];
  
  function dfs(event: PositionedChronosEvent, currentGroup: PositionedChronosEvent[]) {
    if (visited.has(event)) return;
    
    visited.add(event);
    currentGroup.push(event);
    
    const overlaps = eventOverlaps.get(event) || new Set<PositionedChronosEvent>();
    overlaps.forEach(overlap => {
      dfs(overlap, currentGroup);
    });
  }
  
  positionedEvents.forEach(event => {
    if (visited.has(event)) return
    
    const currentGroup: PositionedChronosEvent[] = [];
    dfs(event, currentGroup);
    eventGroups.push(currentGroup);
  });
  
  // Assign columns for each group
  eventGroups.forEach(group => {
    group.sort((a, b) => a.start.getTime() - b.start.getTime());
    
    const columns: PositionedChronosEvent[][] = [];
    
    group.forEach(event => {
      // Find first column where the event doesn't overlap with any existing event
      let channelIndex = 0;
      let placed = false;
      
      while (!placed) {
        if (!columns[channelIndex]) {
          columns[channelIndex] = [event];
          event.channelIndex = channelIndex;
          placed = true;
        } else {
          const overlapsWithColumn = columns[channelIndex].some(
            columnEvent => areIntervalsOverlapping(event, columnEvent)
          );
          
          if (!overlapsWithColumn) {
            columns[channelIndex].push(event);
            event.channelIndex = channelIndex;
            placed = true;
          } else {
            channelIndex++;
          }
        }
      }
    });
    
    const maxColumn = Math.max(...group.map(event => event.channelIndex));
    const totalColumns = maxColumn + 1;
    
    group.forEach(event => {
      event.numChannels = totalColumns;
    });
  });
  
  return positionedEvents;
}