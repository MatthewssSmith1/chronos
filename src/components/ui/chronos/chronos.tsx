"use client"

import { useState, useEffect, useMemo, useContext, useCallback, createContext, ReactNode, CSSProperties } from "react"
import { DayView, WeekView } from "./days-view"
import { TooltipProvider } from "@/components/ui/tooltip"
import { ChronosControls } from "./chronos-controls"
import { cn, isSameDay } from "@/lib/utils"
import { MonthView } from "./month-view"
import { YearView } from "./year-view"

export type ChronosCategory = {
  id: string
  name: string
  color: string
}

export type ChronosEvent = {
  id: string
  start: Date
  end: Date
  allDay?: boolean
  title?: string
  location?: string
  description?: string
  categoryId?: string
}

export type PositionedChronosEvent = ChronosEvent & { channelIndex: number, numChannels: number }

export const VIEWS = ["day", "week", "month", "year"] as const
export type ViewType = typeof VIEWS[number]

type ChronosContextType = {
  events: ChronosEvent[]
  categories: ChronosCategory[]
  viewType: ViewType
  selectedDate: Date
  setViewType: (type: ViewType) => void
  setSelectedDate: (date: Date) => void
  offsetPeriod: (direction: number) => void
  goToToday: () => void
  createEvent: (event: Omit<ChronosEvent, "id">) => Promise<void>
  updateEvent: (event: ChronosEvent) => Promise<void>
  deleteEvent: (eventId: string) => Promise<void>
  colorOfEvent: (event: ChronosEvent) => CSSProperties
}

const ChronosContext = createContext<ChronosContextType | undefined>(undefined)

export function ChronosProvider({
  children,
  initialEvents,
  categories,
  onCreateEvent,
  onEditEvent,
  onDeleteEvent
}: {
  children: ReactNode
  initialEvents: ChronosEvent[]
  categories: ChronosCategory[]
  onCreateEvent?: (event: ChronosEvent) => void | Promise<void | ChronosEvent>
  onEditEvent?: (event: ChronosEvent) => void | Promise<void | ChronosEvent>
  onDeleteEvent?: (eventId: string) => void | Promise<void>
}) {
  const [events, setEvents] = useState<ChronosEvent[]>(initialEvents)
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [viewType, setViewType] = useState<ViewType>("week")

  useEffect(() => {
    setEvents(initialEvents)
  }, [initialEvents])

  const colorOfEvent = useCallback((event: ChronosEvent) => ({
    backgroundColor: categories.find(c => c.id === event.categoryId)?.color ?? "#a1a1a1"
  }), [categories])

  const createEvent = useCallback(async (eventData: Omit<ChronosEvent, "id">) => {
    const tempId = `temp-${Date.now()}`
    const newEvent = { ...eventData, id: tempId } as ChronosEvent
    
    setEvents(prev => [...prev, newEvent])
    
    try {
      if (onCreateEvent) {
        const result = await Promise.resolve(onCreateEvent(newEvent));
        if (result && typeof result === 'object' && 'id' in result) {
          setEvents(prev => prev.map(e => e.id === tempId ? result : e))
        }
      }
    } catch (error) {
      setEvents(prev => prev.filter(e => e.id !== tempId))
      console.error("Error creating event:", error)
    }
  }, [onCreateEvent])

  const updateEvent = useCallback(async (updatedEvent: ChronosEvent) => {
    const originalEvent = events.find(e => e.id === updatedEvent.id)
    
    setEvents(prev => prev.map(e => e.id === updatedEvent.id ? updatedEvent : e))
    
    try {
      if (onEditEvent) {
        const result = await Promise.resolve(onEditEvent(updatedEvent));
        if (result && typeof result === 'object' && 'id' in result) {
          setEvents(prev => prev.map(e => e.id === updatedEvent.id ? result : e))
        }
      }
    } catch (error) {
      if (originalEvent) {
        setEvents(prev => prev.map(e => e.id === updatedEvent.id ? originalEvent : e))
      }
      console.error("Error updating event:", error)
    }
  }, [events, onEditEvent])

  const deleteEvent = useCallback(async (eventId: string) => {
    const originalEvent = events.find(e => e.id === eventId)
    
    setEvents(prev => prev.filter(e => e.id !== eventId))
    
    try {
      if (onDeleteEvent) {
        await onDeleteEvent(eventId)
      }
    } catch (error) {
      if (originalEvent) {
        setEvents(prev => [...prev, originalEvent])
      }
      console.error("Error deleting event:", error)
    }
  }, [events, onDeleteEvent])

  const offsetPeriod = useCallback((direction: number) => {
    setSelectedDate((currentDate) => {
      const newDate = new Date(currentDate)

      switch (viewType) {
        case "day":
          newDate.setDate(currentDate.getDate() + direction)
          break
        case "week":
          newDate.setDate(currentDate.getDate() + (7 * direction))
          break
        case "month":
          newDate.setMonth(currentDate.getMonth() + direction, 1)
          break
        case "year":
          newDate.setFullYear(currentDate.getFullYear() + direction, 0, 1)
          break
      }
      return newDate
    })
  }, [viewType, setSelectedDate])

  const goToToday = useCallback(() => setSelectedDate(new Date()), [setSelectedDate])

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key.length !== 1) return

      const key = event.key.toLowerCase()

      if ("t" === key) return goToToday()
      if ("bp".includes(key)) return offsetPeriod(-1) // back/previous
      if ("fn".includes(key)) return offsetPeriod(1) // forward/next

      const viewType = VIEWS.find(view => view.startsWith(key))
      if (viewType) setViewType(viewType)
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [setViewType, offsetPeriod, goToToday])

  const value = useMemo(
    () => ({
      events,
      categories,
      viewType,
      selectedDate,
      setViewType,
      setSelectedDate,
      offsetPeriod,
      goToToday,
      createEvent,
      updateEvent,
      deleteEvent,
      colorOfEvent
    }),
    [
      events, 
      categories, 
      viewType, 
      selectedDate, 
      offsetPeriod, 
      goToToday, 
      createEvent,
      updateEvent,
      deleteEvent,
      colorOfEvent
    ]
  )

  return (
    <TooltipProvider>
      <ChronosContext.Provider value={value}>{children}</ChronosContext.Provider>
    </TooltipProvider>
  )
}

export function Chronos({ className }: { className?: string }) {
  const { viewType } = useChronos()

  const View = {
    day: DayView,
    week: WeekView,
    month: MonthView,
    year: YearView,
  }[viewType]

  return (
    <div className={cn("w-full h-full flex flex-col gap-4 p-4", className)}>
      <ChronosControls />
      <View />
    </div>
  )
}

export function useChronos() {
  const context = useContext(ChronosContext)
  if (context === undefined) throw new Error("useChronos must be used within a ChronosProvider")
  return context
}

export function useDateColors(date: Date) {
  const { selectedDate } = useChronos()

  if (isSameDay(date, selectedDate)) return "bg-primary/80 hover:bg-primary/90 group-hover/header:bg-primary/90 active:bg-primary/85 !text-primary-foreground"
  else if (isSameDay(date, new Date())) return "bg-primary/20 hover:bg-primary/30 group-hover/header:bg-primary/30"

  return "group-hover/header:bg-primary/10 group-focus/header:bg-primary/10 group-active/header:bg-primary/20"
}

export function useFullDayEvents(start: Date, end: Date) {
  const { events: allEvents } = useChronos()

  return useMemo(() => calculateEventLayout(allEvents.filter(
    e => e.allDay && e.end >= start && e.start <= end
  )), [allEvents, start, end])
}

// TODO: don't calculateEventLayout on year and month views
export function useDayEvents(date: Date, previewEvent: ChronosEvent | null = null) {
  const { events: allEvents } = useChronos()

  return useMemo(() => {
    let events = [...allEvents]
    if (previewEvent) events.push(previewEvent)

    return calculateEventLayout(events.filter(event => !event.allDay && isSameDay(event.start, date)))
  }, [allEvents, date, previewEvent])
}

const eventsOverlap = (a: ChronosEvent, b: ChronosEvent) => a.start < b.end && b.start < a.end

function calculateEventLayout(events: ChronosEvent[]): PositionedChronosEvent[] {
  if (events.length === 0) return [];

  const positionedEvents: PositionedChronosEvent[] = events.map(event => ({
    ...event,
    channelIndex: 0,
    numChannels: 1
  }));

  // Find all events that overlap with each event
  const eventOverlaps = new Map<PositionedChronosEvent, Set<PositionedChronosEvent>>();
  
  positionedEvents.forEach(event => {
    const overlaps = new Set<PositionedChronosEvent>();
    
    positionedEvents.forEach(otherEvent => {
      if (otherEvent !== event && eventsOverlap(event, otherEvent)) {
        overlaps.add(otherEvent);
      }
    });
    
    eventOverlaps.set(event, overlaps);
  });
  
  // Find connected components (groups of events that overlap directly or indirectly)
  const visited = new Set<PositionedChronosEvent>();
  const eventGroups: PositionedChronosEvent[][] = [];
  
  function dfs(event: PositionedChronosEvent, currentGroup: PositionedChronosEvent[]) {
    if (visited.has(event)) return;
    
    visited.add(event);
    currentGroup.push(event);
    
    const overlaps = eventOverlaps.get(event) || new Set<PositionedChronosEvent>();
    overlaps.forEach(overlap => {
      dfs(overlap, currentGroup);
    });
  }
  
  positionedEvents.forEach(event => {
    if (visited.has(event)) return
    
    const currentGroup: PositionedChronosEvent[] = [];
    dfs(event, currentGroup);
    eventGroups.push(currentGroup);
  });
  
  // Assign columns for each group
  eventGroups.forEach(group => {
    group.sort((a, b) => a.start.getTime() - b.start.getTime());
    
    const columns: PositionedChronosEvent[][] = [];
    
    group.forEach(event => {
      // Find first column where the event doesn't overlap with any existing event
      let channelIndex = 0;
      let placed = false;
      
      while (!placed) {
        if (!columns[channelIndex]) {
          columns[channelIndex] = [event];
          event.channelIndex = channelIndex;
          placed = true;
        } else {
          const overlapsWithColumn = columns[channelIndex].some(
            columnEvent => eventsOverlap(event, columnEvent)
          );
          
          if (!overlapsWithColumn) {
            columns[channelIndex].push(event);
            event.channelIndex = channelIndex;
            placed = true;
          } else {
            channelIndex++;
          }
        }
      }
    });
    
    const maxColumn = Math.max(...group.map(event => event.channelIndex));
    const totalColumns = maxColumn + 1;
    
    group.forEach(event => {
      event.numChannels = totalColumns;
    });
  });
  
  return positionedEvents;
}