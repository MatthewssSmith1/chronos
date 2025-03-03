"use client"

import { useState, useCallback, useRef, RefObject, MouseEvent as ReactMouseEvent, useMemo } from "react"
import { useChronos, ChronosEvent, useDayEvents } from "./chronos"
import { Popover, PopoverTrigger } from "@/components/ui/popover"
import { cn, formatTimeRange } from "@/lib/utils"
import * as PopoverPrimitive from "@radix-ui/react-popover"
import { useDayDrag } from "@/hooks/use-day-drag"
import { DateHeader } from "./chronos-view"
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
        const [start, end] = [startTime, currentTime].sort((a, b) => a.getTime() - b.getTime())
        
        setPreviewEvent({ 
          id: 'preview', 
          title: '', 
          start, 
          end,
          categoryId: categories[0].id
        })
      },
      // onDragEnd: () => {}
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
    onMouseDown,
    isDragging,
    previewEvent,
    setPreviewEvent,
    anchorStyle
  }
}

function DayColumn({ date, numDays }: { date: Date, numDays: number }) {
  const columnRef = useRef<HTMLDivElement>(null)
  const dayEvents = useDayEvents(date)

  const { onMouseDown, isDragging, previewEvent, setPreviewEvent, anchorStyle } = useCreateEventGestures(columnRef, date)

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
        <EventCard key={event.id} event={event} onEventChanged={console.log} />
      ))}

      {previewEvent && (
        <Popover open={!isDragging} onOpenChange={(open) => !open && setPreviewEvent(null)}>
          <PopoverTrigger asChild>
            <EventCard event={previewEvent} className="preview-event hover:brightness-100 shadow-sm" onEventChanged={setPreviewEvent} />
          </PopoverTrigger>
          <PopoverPrimitive.Anchor className="absolute left-0 right-0" style={anchorStyle} />
          <EventForm 
            event={previewEvent} 
            onEventChanged={setPreviewEvent}
            onSubmit={console.log} 
            side={firstHalf ? "right" : "left"} 
            align="center" 
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
    className?: string;
    onEventChanged?: (updatedEvent: ChronosEvent) => void;
  }
>(({ event, className, onEventChanged }, ref) => {
  const { colorOfEvent } = useChronos();
  const startHours = event.start.getHours() + (event.start.getMinutes() / 60);
  const endHours = event.end.getHours() + (event.end.getMinutes() / 60);
  const duration = endHours - startHours;
  
  function Subtitle() {
    let text = formatTimeRange(event.start, event.end);
    if (event.location) text += ` @ ${event.location}`;
    return (
      <p className="text-left text-xs text-white truncate pointer-events-none">{text}</p>
    );
  }

  const DragHandle = ({className}: {className?: string}) => (
    <div className={cn("absolute left-0 right-0 h-1 z-10 hover:bg-white/20", className)} />
  )

  return (
    <div
      ref={ref}
      className={cn("event-card absolute z-40 rounded-md px-1.5 py-1 overflow-hidden cursor-pointer select-none transition-[filter,box-shadow] hover:brightness-110 hover:shadow-sm [&:has(~&.preview-event)]:pointer-events-none", className)}
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
          <DragHandle className="top-0 cursor-n-resize" />
          <DragHandle className="bottom-0 cursor-s-resize" />
        </>
      )}
      <p className="text-left text-sm text-white truncate pointer-events-none font-medium">{event.title.length === 0 ? "(No title)" : event.title}</p>
      {duration > 0.5 && <Subtitle />}
    </div>
  );
});

EventCard.displayName = "EventCard";
