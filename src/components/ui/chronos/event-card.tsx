"use client"

import { useState, useCallback, RefObject, useEffect, MouseEvent as ReactMouseEvent } from "react"
import { useChronos, ChronosEvent } from "./chronos"
import { cn, formatTimeRange } from "@/lib/utils"
import { timeAscending } from "./chronos-view"
import { PX_PER_HOUR } from "./days-view"
import { useDayDrag } from "@/hooks/use-day-drag"
import React from "react"

const EVENT_PADDING = 3

export const EventCard = React.forwardRef<
  HTMLDivElement,
  {
    event: ChronosEvent;
    columnRef: RefObject<HTMLDivElement | null>;
    isPreview?: boolean;
    isDragging?: boolean;
    onEventChanged?: (updatedEvent: ChronosEvent) => void;
  }
>(({ event, columnRef, isPreview = false, isDragging = false, onEventChanged }, ref) => {
  const { colorOfEvent } = useChronos();

  const [start, setStart] = useState(event.start)
  const [end, setEnd] = useState(event.end)

  useEffect(() => {
    setStart(event.start)
    setEnd(event.end)
  }, [event])

  const { startDrag } = useDayDrag(columnRef, start);

  const startHours = start.getHours() + (start.getMinutes() / 60);
  const endHours = end.getHours() + (end.getMinutes() / 60);
  const duration = endHours - startHours;

  function Subtitle() {
    let text = formatTimeRange(start, end);
    if (event.location) text += ` @ ${event.location}`;

    return <p className="text-left text-xs text-white truncate pointer-events-none">{text}</p>
  }

  function DragHandle({ isTop }: {isTop: boolean}) {
    const onMouseDown = useCallback((e: ReactMouseEvent) => {
      if (!onEventChanged) return;

      const otherTime = isTop ? end : start

      startDrag(e, {
        onDragMove: ({ currentTime }) => {
          const [newStart, newEnd] = [otherTime, currentTime].sort(timeAscending)

          if (isPreview) 
            return onEventChanged({ ...event, start: newStart, end: newEnd })
        
          setStart(newStart);
          setEnd(newEnd);
        },
        onDragEnd: ({ endTime }) => {
          const [newStart, newEnd] = [otherTime, endTime].sort(timeAscending)

          onEventChanged({ 
            ...event,
            start: newStart,
            end: newEnd
          });
        }
      });
    }, [startDrag, isTop]);

    return (
      <div 
        onMouseDown={onMouseDown} 
        className={cn(
          "absolute left-0 right-0 h-1 z-10 hover:bg-white/20 cursor-ns-resize",
          isTop ? "top-0" : "bottom-0"
        )} 
      />
    )
  }

  // TODO: annoted onMouseDown listener, but for dragging on the div itself to drag the whole card up/down rather than the handles (start/end)

  return (
    <div
      ref={ref}
      className={cn(
        "event-card absolute z-40 rounded-md px-1.5 py-1 overflow-hidden cursor-pointer select-none transition-[filter,box-shadow] hover:brightness-110 hover:shadow-sm ", 
        isPreview ? "preview-event hover:brightness-100 shadow-sm" : "[&:has(~.preview-event)]:pointer-events-none",
        isDragging && "pointer-events-none"
      )}
      style={{
        backgroundColor: colorOfEvent(event),
        top: `${startHours * PX_PER_HOUR + EVENT_PADDING}px`,
        height: `${duration * PX_PER_HOUR - EVENT_PADDING * 2}px`,
        left: `${EVENT_PADDING}px`,
        right: `${EVENT_PADDING}px`,
      }}
    >
      {onEventChanged && (
        <>
          <DragHandle isTop={true} />
          <DragHandle isTop={false} />
        </>
      )}
      <p className="text-left text-sm text-white truncate pointer-events-none font-medium">{event.title?.length ? event.title : "(No title)"}</p>
      {duration > 0.5 && <Subtitle />}
    </div>
  );
});
