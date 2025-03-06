"use client"

import { useState, useCallback, RefObject, useEffect, CSSProperties, useMemo, MouseEvent as ReactMouseEvent } from "react"
import { useChronos, ChronosEvent } from "./chronos"
import { Popover, PopoverTrigger } from "@/components/ui/popover"
import { cn, formatTimeRange } from "@/lib/utils"
import * as PopoverPrimitive from "@radix-ui/react-popover"
import { timeAscending } from "./chronos-view"
import { PX_PER_HOUR } from "./days-view"
import { useDayDrag } from "@/hooks/use-day-drag"
import { EventForm } from "./event-form"

const EVENT_PADDING = 3

type EventCardProps = {
  event: ChronosEvent
  columnRef: RefObject<HTMLDivElement | null>
  onEventChanged: (updatedEvent: ChronosEvent) => void
  isNew?: boolean
  isDragging?: boolean
  onStopCreating?: () => void
}

export function EventCard({ event: initialEvent, columnRef, onEventChanged, isNew = false, isDragging = false, onStopCreating }: EventCardProps) {
  const [event, setEvent] = useState(initialEvent)
  const [isEditing, setIsEditing] = useState(false)

  const { colorOfEvent, updateEvent, createEvent, deleteEvent } = useChronos()

  useEffect(() => setEvent(initialEvent), [initialEvent])

  // TODO: better name disambiguation that `isDraggingSelf`
  const { startDrag, isDragging: isDraggingSelf } = useDayDrag(columnRef, event.start)

  const startHours = event.start.getHours() + (event.start.getMinutes() / 60)
  const endHours = event.end.getHours() + (event.end.getMinutes() / 60)
  const duration = endHours - startHours

  // TODO: figure out why subtitle doesn't show when event is at end of day
  function Subtitle() {
    let text = formatTimeRange(event.start, event.end)
    if (event.location) text += ` @ ${event.location}`

    return <p className="text-left text-xs text-white truncate pointer-events-none">{text}</p>
  }

  function DragHandle({ isTop }: {isTop: boolean}) {
    const onMouseDown = useCallback((e: ReactMouseEvent) => {
      if (!onEventChanged) return

      const otherTime = isTop ? event.end : event.start

      startDrag(e, {
        onDragMove: ({ currentTime }) => {
          const [newStart, newEnd] = [otherTime, currentTime].sort(timeAscending)

          if (isNew) 
            return onEventChanged({ ...event, start: newStart, end: newEnd })
        
          setEvent({ ...event, start: newStart, end: newEnd })
        },
        onDragEnd: ({ endTime }) => {
          const [newStart, newEnd] = [otherTime, endTime].sort(timeAscending)

          onEventChanged({ 
            ...event,
            start: newStart,
            end: newEnd
          })
        }
      })
    }, [startDrag, isTop])

    return (
      <div 
        onMouseDown={onMouseDown} 
        className={cn(
          "absolute left-0 right-0 h-1 z-10 hover:bg-white/20 transition-colors cursor-ns-resize",
          isTop ? "top-0" : "bottom-0"
        )} 
      />
    )
  }

  const onCardMouseDown = useCallback((e: ReactMouseEvent) => {
    if (!onEventChanged) return

    const maxMoveUp = -(event.start.getHours() * 60 + event.start.getMinutes()) * 60 * 1000
    const maxMoveDown = ((24 * 60) - (event.end.getHours() * 60) - (event.end.getMinutes())) * 60 * 1000
    
    const clamp = (value: number) => Math.min(Math.max(value, maxMoveUp), maxMoveDown)

    startDrag(e, {
      onDragMove: ({ startTime, currentTime }) => {
        const timeDiff = clamp(currentTime.getTime() - startTime.getTime())
        
        const newStart = new Date(event.start.getTime() + timeDiff)
        const newEnd = new Date(event.end.getTime() + timeDiff)

        if (isNew) return onEventChanged({ ...event, start: newStart, end: newEnd })

        setEvent({ ...event, start: newStart, end: newEnd })
      },
      onDragEnd: ({ startTime, endTime }) => {
        const timeDiff = clamp(endTime.getTime() - startTime.getTime())

        if (timeDiff === 0) return
        
        onEventChanged({ 
          ...event, 
          start: new Date(event.start.getTime() + timeDiff),
          end: new Date(event.end.getTime() + timeDiff)
        })
      }
    })
  }, [startDrag, event, onEventChanged])

  const positionStyle: CSSProperties = useMemo(() => ({
    top: `${startHours * PX_PER_HOUR + EVENT_PADDING}px`,
    height: `${duration * PX_PER_HOUR - EVENT_PADDING * 2}px`,
    left: `${EVENT_PADDING}px`,
    right: `${EVENT_PADDING}px`,
  }), [startHours, duration])

  return (
    <Popover 
      open={isEditing || (isNew && !isDragging)} 
      onOpenChange={open => {
        if (isNew) return onStopCreating?.()

        if (open && isDraggingSelf) return

        setIsEditing(open)
        if(!open) setEvent(initialEvent)
      }}>
      <PopoverTrigger asChild>
        <div
          onMouseDown={onCardMouseDown}
          onClick={(e) => {e.stopPropagation(); setIsEditing(true)}}
          style={{ ...colorOfEvent(event), ...positionStyle }}
          className={cn(
            "event-card absolute z-40 rounded-md px-1.5 py-1 overflow-hidden cursor-pointer select-none transition-[filter,box-shadow] hover:brightness-110 hover:shadow-sm ", 
            isNew ? "new-event hover:brightness-100 shadow-sm" : "[&:has(~:is(.new-event,.dragging))]:pointer-events-none [.dragging~&]:pointer-events-none",
            isDragging && "dragging pointer-events-none"
          )}
        >
          <p className="text-left text-sm text-white truncate pointer-events-none font-medium">{event.title?.length ? event.title : "(No title)"}</p>
          {duration > 0.5 && <Subtitle />}
          <DragHandle isTop={true} />
          <DragHandle isTop={false} />
        </div>
      </PopoverTrigger>
      <PopoverPrimitive.Anchor className="absolute" style={positionStyle} />
      <EventForm 
        align="center" 
        side="left"
        event={event} 
        editMode={!isNew}
        onEventChanged={isNew ? onEventChanged : setEvent}
        onSubmitEvent={isNew 
          ? () => {createEvent(event); onStopCreating?.()}
          : () => {updateEvent(event); setIsEditing(false)}}
      />
    </Popover>
  )
}
