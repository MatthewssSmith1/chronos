"use client"

import { useState, useEffect, useMemo, useContext, useCallback, createContext, ReactNode } from "react"
import { ChevronLeftIcon, ChevronRightIcon, CalendarPlusIcon, CheckIcon } from "lucide-react"
import { Select, SelectContent, SelectTrigger, SelectValue } from "@/components/ui/select"
import { SegmentGroup, ButtonSegment } from "./segmented-button"
import { Popover, PopoverTrigger } from "@/components/ui/popover"
import * as SelectPrimitive from "@radix-ui/react-select"
import { TooltipProvider } from "@/components/ui/tooltip"
import { ChronosView } from "./chronos-view"
import { EventForm } from "./event-form"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export type ChronosCategory = {
  id: string | number
  name: string
  color: string
}

export type ChronosEvent = {
  id: string | number
  title: string
  start: Date
  end: Date
  allDay?: boolean
  location?: string
  description?: string
  categoryId?: string | number
}

const VIEWS = ["day", "week", "month", "year", "list"] as const
type ViewType = typeof VIEWS[number]

type ChronosContextType = {
  events: ChronosEvent[]
  categories: ChronosCategory[]
  viewType: ViewType
  selectedDate: Date
  setViewType: (type: ViewType) => void
  setSelectedDate: (date: Date) => void
  offsetPeriod: (direction: number) => void
  goToToday: () => void
}

const ChronosContext = createContext<ChronosContextType | undefined>(undefined)

export function ChronosProvider({
  children,
  events,
  categories
}: {
  children: ReactNode
  events: ChronosEvent[]
  categories: ChronosCategory[]
}) {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [viewType, setViewType] = useState<ViewType>("week")

  const offsetPeriod = useCallback((direction: number) => {
    setSelectedDate((currentDate) => {
      const newDate = new Date(currentDate)

      switch (viewType) {
        case "day":
        case "list":
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
    }),
    [events, categories, viewType, selectedDate, offsetPeriod, goToToday]
  )

  return (
    <TooltipProvider>
      <ChronosContext.Provider value={value}>{children}</ChronosContext.Provider>
    </TooltipProvider>
  )
}

export function useChronos() {
  const context = useContext(ChronosContext)
  if (context === undefined) throw new Error("useChronos must be used within a ChronosProvider")
  return context
}

export function useDayEvents(date: Date) {
  const { events } = useChronos()

  return useMemo(
    () => events
      .filter(event => event.start.toDateString() === date.toDateString())
      .sort((a, b) => a.start.getTime() - b.start.getTime()),
    [events, date]
  )
}

export function Chronos({ className }: { className?: string }) {
  return (
    <div className={cn("w-full h-full flex flex-col gap-4 p-4", className)}>
      <div className="flex items-center justify-between px-2 gap-2 sm:gap-4">
        <TimePeriodText />
        <DateNavigator />
        <div className="flex-1 hidden sm:inline-block" />
        <ViewSelect />
        <NewEventButton /> 
      </div>
      <ChronosView />
    </div>
  )
}

function TimePeriodText() {
  const { viewType, selectedDate } = useChronos()

  const getText = () => {
    const fmtDate = (date: Date, opts: Intl.DateTimeFormatOptions) => date.toLocaleDateString('en-US', opts)

    switch (viewType) {
      case 'week': {
        const start = new Date(selectedDate)
        start.setDate(selectedDate.getDate() - selectedDate.getDay())
        const end = new Date(start)
        end.setDate(start.getDate() + 6)

        if (start.getMonth() === end.getMonth())
          return fmtDate(start, { month: 'long', year: 'numeric' })

        const startMonth = fmtDate(start, { month: 'short' })
        const endMonth = fmtDate(end, { month: 'short' })
        return `${startMonth} - ${endMonth} ${start.getFullYear()}`
      }
      case 'month':
        return fmtDate(selectedDate, { month: 'long', year: 'numeric' })
      case 'year':
        return fmtDate(selectedDate, { year: 'numeric' })
      case 'day':
      case 'list':
      default:
        return fmtDate(selectedDate, { month: 'long', day: 'numeric', year: 'numeric' })
    }
  }

  return <h1 className="text-2xl font-semibold truncate">{getText()}</h1>
}

function DateNavigator() {
  const { offsetPeriod, goToToday } = useChronos()

  return (
    <SegmentGroup>
      <ButtonSegment onClick={() => offsetPeriod(-1)}>
        <ChevronLeftIcon className="size-4 pointer-events-none shrink-0" />
      </ButtonSegment>
      <ButtonSegment onClick={goToToday} className="hidden sm:inline-block">Today</ButtonSegment>
      <ButtonSegment onClick={() => offsetPeriod(1)}>
        <ChevronRightIcon className="size-4 pointer-events-none shrink-0" />
      </ButtonSegment>
    </SegmentGroup>
  )
}

function ViewSelect() {
  const { viewType, setViewType } = useChronos()

  function Item({ value }: { value: ViewType }) {
    return (
      <SelectPrimitive.Item
        value={value}
        data-slot="select-item"
        className={cn(
          "focus:bg-accent focus:text-accent-foreground relative flex w-full cursor-default items-center cursor-pointer",
          "gap-2 rounded-sm py-1.5 pr-8 pl-2 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        )}
      >
        <span className="absolute right-2 flex size-3.5 items-center justify-center">
          <SelectPrimitive.ItemIndicator>
            <CheckIcon className="size-4 shrink-0 text-muted-foreground pointer-events-none" />
          </SelectPrimitive.ItemIndicator>
        </span>
        <SelectPrimitive.ItemText className="">
          <span className="capitalize">{value}</span>
        </SelectPrimitive.ItemText>
        <span className="ml-auto text-muted-foreground/70 w-3 text-center">{value.charAt(0)}</span>
      </SelectPrimitive.Item>
    )
  }

  return (
    <Select value={viewType} onValueChange={setViewType}>
      <SelectTrigger className="w-28">
        <SelectValue placeholder="Select a view" />
      </SelectTrigger>
      <SelectContent>
        {VIEWS.map((view, idx) => (
          <Item key={idx} value={view} />
        ))}
      </SelectContent>
    </Select>
  )
}

function NewEventButton() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button className="gap-2">
          <CalendarPlusIcon />
          <span className="hidden sm:inline">New event</span>
        </Button>
      </PopoverTrigger>
      <EventForm onSubmit={console.log} align="end" alignOffset={-8} />
    </Popover>
  )
}