"use client"

import { useState, useCallback, useRef, RefObject, useMemo, MouseEvent as ReactMouseEvent, useEffect } from "react"
import { DateHeader, useDayEvents, timeAscending } from "./chronos-view"
import { useChronos, ChronosEvent } from "./chronos"
import { Popover, PopoverTrigger } from "@/components/ui/popover"
import { cn, formatTimeRange } from "@/lib/utils"
import * as PopoverPrimitive from "@radix-ui/react-popover"
import { useDayDrag } from "@/hooks/use-day-drag"
import { EventForm } from "./event-form"
import { Card } from "@/components/ui/card"
import React from "react"

export const PX_PER_HOUR = 75
const EVENT_PADDING = 3

export function DaysView({ dates, className }: { dates: Date[], className?: string }) {
  return (
    <Card className={cn("flex-1 p-0 grid grid-rows-[auto_1fr] gap-0 isolate overflow-y-auto overflow-x-hidden", className)}>
      <div className="row-start-1 col-start-1" />
      {dates.map((date, idx) => (
        <DateHeader key={idx} date={date} className="sticky top-0 z-50 py-2 bg-background/80 border-b" />
      ))}
      <TimeColumn />
      {dates.map((date, idx) => (
        <DayColumn date={date} key={idx} numDays={dates.length} />
      ))}
    </Card>
  )
}

function TimeColumn() {
  const times = Array.from({ length: 24 }, (_, i) => `${(i % 12) + 1} ${i < 11 ? "AM" : "PM"}`)

  return (
    <div className="w-[70px] relative [&>*]:relative [&>*:last-child>*]:hidden">
      {times.map((time, i) => (
        <div key={i} style={{ height: `${PX_PER_HOUR}px` }}>
          <div className="absolute right-1/2 bottom-0 translate-x-1/2 translate-y-[9px]">
            <p className="text-sm text-muted-foreground whitespace-nowrap">{time}</p>
          </div>
          <div className="absolute bottom-0 left-full w-screen h-[1px] bg-border z-10" />
        </div>
      ))}
    </div>
  )
}

function useCreateEventGestures(columnRef: RefObject<HTMLDivElement | null>, date: Date) {
  const { categories } = useChronos()
  const [previewEvent, setPreviewEvent] = useState<ChronosEvent | null>(null)
  
  const { isDragging, startDrag } = useDayDrag(columnRef, date)
  
  const onMouseDown = useCallback((e: ReactMouseEvent<HTMLDivElement>) => {
    const clickedCard = (e.target as HTMLElement).closest('.event-card')
    if (clickedCard || e.button !== 0) return
    
    startDrag(e, {
      onDragMove: ({ startTime, currentTime }) => {
        const [start, end] = [startTime, currentTime].sort(timeAscending)
        
        setPreviewEvent({ 
          id: 'preview', 
          start, 
          end,
          allDay: false,
          categoryId: categories[0].id
        } as ChronosEvent)
      },
    })
  }, [startDrag])
  
  const anchorStyle = useMemo(() => {
    if (!previewEvent) return {}
    
    const startHours = previewEvent.start.getHours() + (previewEvent.start.getMinutes() / 60)
    const endHours = previewEvent.end.getHours() + (previewEvent.end.getMinutes() / 60)
    const eventCenter = startHours + ((endHours - startHours) / 2)
    
    return {
      top: `${PX_PER_HOUR * eventCenter}px`
    }
  }, [previewEvent])
  
  return {
    isDragging,
    onMouseDown,
    anchorStyle,
    previewEvent,
    setPreviewEvent,
  }
}

function DayColumn({ date, numDays }: { date: Date, numDays: number }) {
  const columnRef = useRef<HTMLDivElement>(null)
  const dayEvents = useDayEvents(date)

  const { createEvent, updateEvent } = useChronos()
  const { isDragging, onMouseDown, anchorStyle, previewEvent, setPreviewEvent } = useCreateEventGestures(columnRef, date)

  const index = date.getDay()
  const isLast = index === 6
  const firstHalf = index < numDays / 2

  return (
    <div
      ref={columnRef}
      onMouseDown={onMouseDown}
      className={cn("flex-1 flex flex-col h-full relative select-none", isLast ? "rounded-br-md" : "border-r")}
    >
      {dayEvents.map(event => (
        <EventCard key={event.id} event={event} columnRef={columnRef} onEventChanged={updateEvent} />
      ))}

      {previewEvent && (
        <Popover open={!isDragging} onOpenChange={(open) => !open && setPreviewEvent(null)}>
          <PopoverTrigger>
            <EventCard 
              isPreview 
              event={previewEvent} 
              columnRef={columnRef}
              isDragging={isDragging}
              onEventChanged={setPreviewEvent} 
            />
          </PopoverTrigger>
          <PopoverPrimitive.Anchor className="absolute left-0 right-0" style={anchorStyle} />
          <EventForm 
            align="center" 
            side={firstHalf ? "right" : "left"} 
            event={previewEvent} 
            onEventChanged={setPreviewEvent}
            onCreateEvent={event => {
              setPreviewEvent(null)
              createEvent(event)
            }} 
          />
        </Popover>
      )}
    </div>
  )
}

const EventCard = React.forwardRef<
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
