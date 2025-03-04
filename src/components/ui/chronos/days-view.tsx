"use client"

import { useState, useCallback, useRef, RefObject, useMemo, MouseEvent as ReactMouseEvent, useEffect } from "react"
import { DateHeader, useDayEvents, timeAscending } from "./chronos-view"
import { useChronos, ChronosEvent } from "./chronos"
import { Popover, PopoverTrigger } from "@/components/ui/popover"
import * as PopoverPrimitive from "@radix-ui/react-popover"
import { useDayDrag } from "@/hooks/use-day-drag"
import { EventCard } from "./event-card"
import { EventForm } from "./event-form"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

export const PX_PER_HOUR = 75

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