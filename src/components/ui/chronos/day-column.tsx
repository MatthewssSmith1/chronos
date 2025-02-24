"use client"

import { useChronos, ChronosEvent, ChronosCategory, useDayEvents } from "./chronos"
import { useState, useCallback, useRef, useEffect } from "react"
import { Popover, PopoverTrigger } from "@/components/ui/popover"
import { cn, formatTimeRange } from "@/lib/utils"
import * as PopoverPrimitive from "@radix-ui/react-popover"
import { EventForm } from "./event-form"
import * as React from "react"

function useCreateEventDrag(columnRef: React.RefObject<HTMLDivElement | null>, date: Date) {
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState<Date | null>(null)
  const [dragEnd, setDragEnd] = useState<Date | null>(null)
  const [previewEvent, setPreviewEvent] = useState<ChronosEvent | null>(null)

  const getTimeFromY = useCallback((y: number) => {
    if (!columnRef.current) return new Date(date)
    const rect = columnRef.current.getBoundingClientRect()
    const relativeY = y - rect.top
    const percentageOfDay = Math.max(0, Math.min(1, relativeY / rect.height))
    const hoursFromMidnight = 24 * percentageOfDay
    
    const newTime = new Date(date)
    newTime.setHours(Math.floor(hoursFromMidnight))
    newTime.setMinutes(Math.round((hoursFromMidnight % 1) * 60 / 15) * 15)
    return newTime
  }, [date])

  const onMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault()
    const time = getTimeFromY(e.clientY)
    setDragStart(time)
    setDragEnd(time)
    setIsDragging(true)
  }, [getTimeFromY])


  const onGlobalMouseMove = useCallback((e: MouseEvent) => {
    e.preventDefault()
    const time = getTimeFromY(e.clientY)
    setDragEnd(time)

    if (!dragStart || !dragEnd) return

    setPreviewEvent({
      id: 'preview',
      title: 'New event',
      start: new Date(Math.min(dragStart.getTime(), dragEnd.getTime())),
      end: new Date(Math.max(dragStart.getTime(), dragEnd.getTime())),
    })
  }, [dragStart, dragEnd, getTimeFromY])

  useEffect(() => {
    if (!isDragging) return

    const onGlobalMouseUp = (e: MouseEvent) => {
      e.preventDefault()
      setIsDragging(false)
    }

    window.addEventListener('mousemove', onGlobalMouseMove)
    window.addEventListener('mouseup', onGlobalMouseUp)
    document.body.style.userSelect = 'none'

    return () => {
      window.removeEventListener('mousemove', onGlobalMouseMove)
      window.removeEventListener('mouseup', onGlobalMouseUp)
      document.body.style.userSelect = ''
    }
  }, [isDragging, getTimeFromY, onGlobalMouseMove])

  return { onMouseDown, previewEvent, setPreviewEvent }
}

export function DayColumn({ date, isLast }: { date: Date, isLast?: boolean }) {
  const columnRef = useRef<HTMLDivElement>(null)
  const { categories } = useChronos()
  const dayEvents = useDayEvents(date)
  
  const { onMouseDown, previewEvent, setPreviewEvent } = useCreateEventDrag(columnRef, date)

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
          className={cn(previewEvent && "hover:brightness-100 hover:shadow-none")}
          category={categories.find(cat => cat.id === event.categoryId)!} 
        />
      ))}
      
      {previewEvent && (
        <Popover defaultOpen onOpenChange={(open) => !open && setPreviewEvent(null)}>
          <PopoverTrigger asChild>
              <EventCard event={previewEvent} className="bg-neutral-400 hover:brightness-100 shadow-sm" />
          </PopoverTrigger>
          <PopoverPrimitive.Anchor className="absolute" style={{ top: `${75 * (previewEvent.start.getHours() + (previewEvent.start.getMinutes() / 60)) + 3}px` }} />
          <EventForm onSubmit={console.log} side="left" align="start" />
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
      className={cn("absolute z-40 rounded-md px-1.5 py-1 overflow-hidden cursor-pointer transition-[filter,box-shadow] hover:brightness-110 hover:shadow-sm", className)}
      style={{
        backgroundColor: category?.color,
        top: `${startHours * 75 + PADDING}px`,
        height: `${duration * 75 - PADDING * 2}px`,
        left: `${PADDING}px`,
        right: `${PADDING}px`,
      }}
    >
      <p className="text-left text-sm text-white truncate pointer-events-none font-medium">{event.title}</p>
      {duration > 0.5 && <Subtitle /> }
    </div>
  )
}
