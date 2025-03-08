"use client"

import { useState, useCallback, useRef, RefObject, useMemo, MouseEvent as ReactMouseEvent } from "react"
import { startOfWeek, addDays, eachDayOfInterval, compareAsc, isSameDay } from "date-fns"
import { useChronos, ChronosEvent } from "./chronos"
import { useDayEvents } from "@/hooks/use-events"
import { EventBanner } from "./event-banner"
import { useDayDrag } from "@/hooks/use-day-drag"
import { DateHeader } from "./month-view"
import { EventCard } from "./event-card"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

export const PX_PER_HOUR = 65

export function DayView() {
  const { selectedDate } = useChronos()

  return <DaysView dates={[selectedDate]} className="grid-cols-[auto_1fr]" />
}

export function WeekView() {
  const { selectedDate } = useChronos()

  const weekDates = useMemo(() => {
    const start = startOfWeek(selectedDate)
    const end = addDays(start, 6)
    return eachDayOfInterval({ start, end })
  }, [selectedDate])

  return <DaysView dates={weekDates} className="grid-cols-[auto_repeat(7,_1fr)]" />
}

function DaysView({ dates, className }: { dates: Date[], className?: string }) {
  return (
    <Card className={cn(
      "relative flex-1 p-0 grid grid-rows-[auto_auto_1fr] gap-0 isolate overflow-y-auto overflow-x-hidden transition-colors", 
      "[&:has(.new-event,.dragging)_.event-card:not(.new-event)]:pointer-events-none",
      className
    )}>
      <div className="row-start-1 row-end-2 col-start-1" />
      {dates.map((date, idx) => (
        <DateHeader key={idx} date={date} className="sticky top-0 z-50 h-16 pt-2 bg-background/80 scale-x-[1.01]" /> // scale-x removes gridline artifact under headers
      ))}
      <EventBanner dates={dates} />
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
        const [start, end] = [startTime, currentTime].sort(compareAsc)
        
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

  const { isDragging, onMouseDown, previewEvent, setPreviewEvent } = useCreateEventGestures(columnRef, date)
  const { updateEvent, selectedDate } = useChronos()
  const dayEvents = useDayEvents(date, previewEvent)
  const isSelected = isSameDay(date, selectedDate)

  return (
    <div
      ref={columnRef}
      onMouseDown={onMouseDown}
      className={cn(
        isSelected ? "flex col-start-2 sm:col-start-auto -col-end-1 sm:col-end-auto" : "hidden sm:flex",
        "flex-1 flex-col h-full relative select-none", 
        date.getDay() === 6 ? "rounded-br-md" : "border-r"
      )}
    >
      {dayEvents.map(event => (event.id === 'preview' 
        ? <EventCard key={event.id} event={event} columnRef={columnRef} onEventChanged={setPreviewEvent} isNew isDragging={isDragging} onStopCreating={() => setPreviewEvent(null)} />
        : <EventCard key={event.id} event={event} columnRef={columnRef} onEventChanged={updateEvent} />
      ))}
    </div>
  )
}