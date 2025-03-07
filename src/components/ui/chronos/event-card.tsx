"use client"

import { useState, useCallback, RefObject, useEffect, CSSProperties, useMemo, MouseEvent as ReactMouseEvent } from "react"
import { useChronos, ChronosEvent, PositionedChronosEvent } from "./chronos"
import { Popover, PopoverTrigger } from "@/components/ui/popover"
import { cn, formatTimeRange } from "@/lib/utils"
import * as PopoverPrimitive from "@radix-ui/react-popover"
import { timeAscending } from "@/lib/utils"
import { PX_PER_HOUR } from "./days-view"
import { useDayDrag } from "@/hooks/use-day-drag"
import { EventForm } from "./event-form"

const EVENT_PADDING = 3

type EventCardProps = {
  event: PositionedChronosEvent
  columnRef: RefObject<HTMLDivElement | null>
  onEventChanged: (updatedEvent: ChronosEvent) => void
  isNew?: boolean
  isDragging?: boolean
  onStopCreating?: () => void
}

export function EventCard({ event: initialEvent, columnRef, onEventChanged, isNew = false, isDragging = false, onStopCreating }: EventCardProps) {
  const [event, setEvent] = useState(initialEvent)
  const [isEditing, setIsEditing] = useState(false)

  const { viewType, colorOfEvent, updateEvent, createEvent, deleteEvent } = useChronos()

  useEffect(() => setEvent(initialEvent), [initialEvent])

  // TODO: better name disambiguation that `isDraggingSelf`
  const { startDrag, dayOffset, isDragging: isDraggingSelf, wasDragging: wasDraggingSelf } = useDayDrag(columnRef, event.start)

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
      onDragEnd: ({ startTime, endTime, dayOffset }) => {
        const timeDiff = clamp(endTime.getTime() - startTime.getTime())

        if (timeDiff === 0 && dayOffset === 0) return
        
        const newStart = new Date(event.start.getTime() + timeDiff)
        const newEnd = new Date(event.end.getTime() + timeDiff)
        
        if (dayOffset !== 0 && viewType === 'week') {
          newStart.setDate(newStart.getDate() + dayOffset)
          newEnd.setDate(newEnd.getDate() + dayOffset)
        }
        
        onEventChanged({ 
          ...event, 
          start: newStart,
          end: newEnd
        })
      }
    })
  }, [startDrag, event, onEventChanged, viewType])

  const positionStyle: CSSProperties = useMemo(() => {
    const top = `${startHours * PX_PER_HOUR + EVENT_PADDING}px`;
    const height = `${duration * PX_PER_HOUR - EVENT_PADDING * 2}px`;

    let left = `${EVENT_PADDING}px`;
    let right = `${EVENT_PADDING}px`;

    if (event.numColumns > 1) {
      const idx = event.columnIndex
      const columnWidth = 1 / event.numColumns;
      const [isFirstCol, isLastCol] = [idx === 0, idx === event.numColumns - 1]

      const leftPercent = idx * columnWidth * 100;
      left = `calc(${leftPercent}% + ${EVENT_PADDING / (isFirstCol ? 1 : 2)}px)`;
      
      const rightPercent = (1 - (idx + 1) * columnWidth) * 100;
      right = `calc(${rightPercent}% + ${EVENT_PADDING / (isLastCol ? 1 : 2)}px)`;
    }

    const colWidth = columnRef.current?.getBoundingClientRect().width || 0
    const transform = viewType === 'week' ? `translateX(${dayOffset * colWidth}px)` : ''
    
    return { top, height, left, right, transform };
  }, [startHours, duration, event, dayOffset, viewType, columnRef]);

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
          onClick={(e) => wasDraggingSelf && e.preventDefault()}
          style={{ ...colorOfEvent(event), ...positionStyle }}
          className={cn(
            "event-card absolute rounded-md px-1.5 py-1 overflow-hidden cursor-pointer select-none transition-[filter,box-shadow,opacity] hover:brightness-110 hover:shadow-sm ", 
            isNew && "new-event hover:brightness-100 shadow-sm",
            (isDragging || isDraggingSelf) ? "dragging pointer-events-none z-50 opacity-90 shadow-lg" : "z-40"
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
        onEventChanged={evt => isNew ? onEventChanged(evt) : setEvent({ ...event, ...evt})}
        onSubmitEvent={isNew 
          ? () => {createEvent(event); onStopCreating?.()}
          : () => {updateEvent(event); setIsEditing(false)}}
        onDeleteEvent={deleteEvent}
      />
    </Popover>
  )
}
