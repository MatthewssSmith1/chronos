"use client"

import { useState, useCallback, useRef, useEffect, RefObject, MouseEvent as ReactMouseEvent } from "react"
import { useChronos, ChronosEvent, ChronosCategory, useDayEvents } from "./chronos"
import { Popover, PopoverTrigger } from "@/components/ui/popover"
import { cn, formatTimeRange } from "@/lib/utils"
import * as PopoverPrimitive from "@radix-ui/react-popover"
import { DateHeader } from "./chronos-view"
import { EventForm } from "./event-form"
import { Card } from "@/components/ui/card"

export const PX_PER_HOUR = 75
export const TIME_SNAP_MINUTES = 15 

export function DaysView({ dates, className }: { dates: Date[], className?: string }) {
  return (
    <Card className={cn("flex-1 flex p-0 grid grid-rows-[auto_1fr] gap-0 isolate overflow-y-auto overflow-x-hidden", className)}>
      <div className="row-start-1 col-start-1" />
      {dates.map((date, idx) => (
        <DateHeader key={idx} date={date} className="sticky top-0 z-50 py-2 bg-background/80 border-b" />
      ))}
      <TimeColumn />
      {dates.map((date, idx) => (
        <DayColumn date={date} key={idx} isLast={idx === dates.length - 1} />
      ))}
    </Card>
  )
}

function TimeColumn() {
  const times = Array.from({ length: 24 }, (_, i) => `${(i % 12) + 1} ${i < 11 ? "AM" : "PM"}`)

  return (
    <div className="w-18 relative [&>*]:relative [&>*:last-child>*]:hidden">
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

interface DragState {
  isDragging: boolean;
  dragStart: Date | null;
  dragEnd: Date | null;
  previewEvent: ChronosEvent | null;
}

function useCreateEventGestures(columnRef: RefObject<HTMLDivElement | null>, date: Date) {
  const [dragState, setDragState] = useState<DragState>({
    isDragging: false,
    dragStart: null,
    dragEnd: null,
    previewEvent: null
  });

  // const hasDragged = useRef(false);

  const getTimeFromY = useCallback((y: number) => {
    if (!columnRef.current) return new Date(date)
    const { top, height } = columnRef.current.getBoundingClientRect()
    const hoursFromMidnight = 24 * Math.max(0, Math.min(1, (y - top) / height))

    const newTime = new Date(date)
    newTime.setHours(Math.floor(hoursFromMidnight))
    newTime.setMinutes(Math.round((hoursFromMidnight % 1) * 60 / TIME_SNAP_MINUTES) * TIME_SNAP_MINUTES)
    return newTime
  }, [date])

  const onMouseDown = useCallback((e: ReactMouseEvent<HTMLDivElement>) => {
    if (e.button !== 0) return
    // Ignore if we clicked on an event card
    // if ((e.target as HTMLElement).closest('.event-card')) return;

    e.preventDefault()
    const time = getTimeFromY(e.clientY)
    // hasDragged.current = false;
    setDragState({
      isDragging: true,
      dragStart: time,
      dragEnd: time,
      previewEvent: null
    });
  }, [getTimeFromY])

  // const onMouseUp = useCallback((e: ReactMouseEvent<HTMLDivElement>) => {
  //   if (hasDragged.current || e.button !== 0) return

  //   const clickTime = getTimeFromY(e.clientY)
  //   const endTime = new Date(clickTime)
  //   endTime.setHours(clickTime.getHours() + 1)

  //   setDragState(prev => ({
  //     ...prev,
  //     previewEvent: {
  //       id: 'preview',
  //       title: 'New event',
  //       start: clickTime,
  //       end: endTime
  //     }
  //   }));
  // }, [getTimeFromY, hasDragged]);

  useEffect(() => {
    if (!dragState.isDragging) return

    const onMouseMove = (e: MouseEvent) => {
      e.preventDefault()
      // hasDragged.current = true;
      const dragEnd = getTimeFromY(e.clientY)

      setDragState(prev => {
        if (!prev.dragStart) return prev;

        const [start, end] = [prev.dragStart, dragEnd].sort((a, b) => a.getTime() - b.getTime())
        return {
          ...prev,
          dragEnd,
          previewEvent: { id: 'preview', title: 'New event', start, end }
        }
      });
    }

    const onMouseUp = (e: MouseEvent) => {
      e.preventDefault()
      setDragState(prev => ({ ...prev, isDragging: false }));
    }

    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)
    document.body.style.userSelect = 'none'

    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', onMouseUp)
      document.body.style.userSelect = ''
    }
  }, [dragState.isDragging, getTimeFromY])

  return {
    onMouseDown,
    previewEvent: dragState.previewEvent,
    hidePreview: () => setDragState(prev => ({ ...prev, previewEvent: null }))
  }
}

function DayColumn({ date, isLast }: { date: Date, isLast?: boolean }) {
  const columnRef = useRef<HTMLDivElement>(null)
  const { categories } = useChronos()
  const dayEvents = useDayEvents(date)

  const { onMouseDown, previewEvent, hidePreview } = useCreateEventGestures(columnRef, date)

  return (
    <div
      ref={columnRef}
      onMouseDown={onMouseDown}
      className={cn(
        "flex-1 flex flex-col h-full relative",
        !isLast && "border-r",
        isLast && "rounded-br-md"
      )}
    >
      {dayEvents.map(event => (
        <EventCard
          key={event.id}
          event={event}
          className={cn("event-card", previewEvent && "hover:brightness-100 hover:shadow-none")}
          category={categories.find(cat => cat.id === event.categoryId)!}
        />
      ))}

      {previewEvent && (
        <Popover defaultOpen onOpenChange={(open) => !open && hidePreview()}>
          <PopoverTrigger asChild>
            <EventCard event={previewEvent} className="event-card bg-neutral-400 hover:brightness-100 shadow-sm" />
          </PopoverTrigger>
          <PopoverPrimitive.Anchor className="absolute" style={{ top: `${PX_PER_HOUR * (previewEvent.start.getHours() + (previewEvent.start.getMinutes() / 60)) + 3}px` }} />
          <EventForm onSubmit={console.log} side="left" align="center" />
        </Popover>
      )}
    </div>
  )
}

function EventCard({ event, category, className }: { event: ChronosEvent, category?: ChronosCategory, className?: string }) {
  const startHours = event.start.getHours() + (event.start.getMinutes() / 60)
  const endHours = event.end.getHours() + (event.end.getMinutes() / 60)
  const duration = endHours - startHours
  const PADDING = 3

  function Subtitle() {
    let text = formatTimeRange(event.start, event.end)
    if (event.location) text += ` @ ${event.location}`
    return (
      <p className="text-left text-xs text-white truncate pointer-events-none">{text}</p>
    )
  }

  return (
    <div
      onMouseUp={(e) => e.stopPropagation()}
      className={cn("absolute z-40 rounded-md px-1.5 py-1 overflow-hidden cursor-pointer transition-[filter,box-shadow] hover:brightness-110 hover:shadow-sm", className)}
      style={{
        backgroundColor: category?.color,
        top: `${startHours * PX_PER_HOUR + PADDING}px`,
        height: `${duration * PX_PER_HOUR - PADDING * 2}px`,
        left: `${PADDING}px`,
        right: `${PADDING}px`,
      }}
    >
      <p className="text-left text-sm text-white truncate pointer-events-none font-medium">{event.title}</p>
      {duration > 0.5 && <Subtitle />}
    </div>
  )
}
