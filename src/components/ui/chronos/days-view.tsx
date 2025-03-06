"use client"

import { useState, useCallback, useRef, RefObject, MouseEvent as ReactMouseEvent } from "react"
import { DateHeader, useDayEvents, timeAscending } from "./chronos-view"
import { useChronos, ChronosEvent } from "./chronos"
import { useDayDrag } from "@/hooks/use-day-drag"
import { EventCard } from "./event-card"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

export const PX_PER_HOUR = 75

export function DaysView({ dates, className }: { dates: Date[], className?: string }) {
  return (
    <Card className={cn("flex-1 p-0 grid grid-rows-[auto_1fr] gap-0 isolate overflow-y-auto overflow-x-hidden transition-colors", className)}>
      <div className="row-start-1 col-start-1" />
      {dates.map((date, idx) => (
        <DateHeader key={idx} date={date} className="sticky top-0 z-50 py-2 bg-background/80 border-b" />
      ))}
      <TimeColumn />
      {dates.map((date, idx) => <DayColumn date={date} key={idx} />)}
    </Card>
  )
}

function TimeColumn() {
  const times = Array.from({ length: 24 }, (_, i) => `${(i % 12) + 1} ${i < 11 ? "AM" : "PM"}`)

  return (
    <div className="w-12 sm:w-20 relative [&>*]:relative [&>*:last-child>*]:hidden">
      {times.map((time, i) => (
        <div key={i} style={{ height: `${PX_PER_HOUR}px` }}>
          <div className="absolute right-1/2 bottom-px translate-x-1/2 translate-y-1/2">
            <p className="text-xs sm:text-sm text-muted-foreground whitespace-nowrap">{time}</p>
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
  
  return {
    isDragging,
    onMouseDown,
    previewEvent,
    setPreviewEvent,
  }
}

function DayColumn({ date }: { date: Date }) {
  const columnRef = useRef<HTMLDivElement>(null)
  const dayEvents = useDayEvents(date)

  const { updateEvent } = useChronos()
  const { isDragging, onMouseDown, previewEvent, setPreviewEvent } = useCreateEventGestures(columnRef, date)

  return (
    <div
      ref={columnRef}
      onMouseDown={onMouseDown}
      className={cn(
        "flex-1 flex flex-col h-full relative select-none", 
        date.getDay() === 6 ? "rounded-br-md" : "border-r"
      )}
    >
      {dayEvents.map(event => (
        <EventCard key={event.id} event={event} columnRef={columnRef} onEventChanged={updateEvent} />
      ))}

      {previewEvent && (
        <EventCard 
          event={previewEvent} 
          columnRef={columnRef}
          onEventChanged={setPreviewEvent}
          isNew
          isDragging={isDragging}
          onStopCreating={() => setPreviewEvent(null)} 
        />
      )}
    </div>
  )
}