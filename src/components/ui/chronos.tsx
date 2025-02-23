"use client"

import { ChevronLeftIcon, ChevronRightIcon, CalendarPlusIcon, CheckIcon } from "lucide-react"
import { Select, SelectContent, SelectTrigger, SelectValue } from "./select"
import * as SelectPrimitive from "@radix-ui/react-select"
import { ChronosView } from "./chronos-view"
import { Button } from "./button"
import * as React from "react"
import { cn } from "@/lib/utils"

type ChronosCategory = {
  id: string | number
  name: string
  color: string
}

type ChronosEvent = {
  id: string | number
  title: string
  start: Date
  end: Date
  location?: string
  description?: string
  category_id?: string | number
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

const ChronosContext = React.createContext<ChronosContextType | undefined>(undefined)

function ChronosProvider({ 
  children, 
  events,
  categories 
}: { 
  children: React.ReactNode
  events: ChronosEvent[]
  categories: ChronosCategory[]
}) {
  const [selectedDate, setSelectedDate] = React.useState<Date>(new Date())
  const [viewType, setViewType] = React.useState<ViewType>("week")

  const offsetPeriod = React.useCallback((direction: number) => {
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

  const goToToday = React.useCallback(() => setSelectedDate(new Date()), [setSelectedDate])

  React.useEffect(() => {
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

  const value = React.useMemo(
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

  return <ChronosContext.Provider value={value}>{children}</ChronosContext.Provider>
}

function useChronos() {
  const context = React.useContext(ChronosContext)
  if (context === undefined) throw new Error("useChronos must be used within a ChronosProvider")
  return context
}

function Chronos({ className }: { className?: string }) {
  return (
    <div className={cn("w-full h-full flex flex-col gap-4 p-4", className)}>
      <div className="flex items-center justify-between px-2 gap-2 sm:gap-4">
        <TimePeriodText />
        <DateNavigator />
        <div className="flex-1 hidden sm:inline-block" />
        <ViewSelect />
        <Button className="gap-2">
          <CalendarPlusIcon className="h-4 w-4" />
          <span className="hidden sm:inline">New event</span>
        </Button>
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

  function Segment({ onClick, className, children }: { onClick?: () => void, className?: string, children?: React.ReactNode }) {
    return (
      <button onClick={onClick} className={cn(
        "cursor-pointer bg-background shadow-xs hover:bg-accent hover:text-accent-foreground px-3 py-2 transition-colors",
        "outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] focus-visible:z-50",
        className
      )}>
        {children}
      </button>
    )
  }

  return (
    <div className={cn(
      "inline-flex items-stretch justify-center whitespace-nowrap text-sm font-medium min-h-9",
      "border border-input shadow-xs isolate rounded-md [&>*]:first:rounded-l-md [&>*]:last:rounded-r-md",
    )}>
      <Segment onClick={() => offsetPeriod(-1)}>
        <ChevronLeftIcon className="size-4 pointer-events-none shrink-0" />
      </Segment>
      <Segment onClick={goToToday} className="hidden sm:inline-block">Today</Segment>
      <Segment onClick={() => offsetPeriod(1)}>
        <ChevronRightIcon className="size-4 pointer-events-none shrink-0" />
      </Segment>
    </div>
  )
}

function ViewSelect() {
  const { viewType, setViewType } = useChronos()

  const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)

  function Item({ value }: { value: ViewType }) {
    return (
      <SelectPrimitive.Item
        value={value}
        data-slot="select-item"
        className={cn(
          "focus:bg-accent focus:text-accent-foreground relative flex w-full cursor-default items-center cursor-pointer",
          "gap-2 rounded-sm py-1.5 pr-8 pl-2 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
          // "*:[span]:last:flex *:[span]:last:items-center *:[span]:last:gap-2",
        )}
      >
        <span className="absolute right-2 flex size-3.5 items-center justify-center">
          <SelectPrimitive.ItemIndicator>
            <CheckIcon className="size-4 shrink-0 text-muted-foreground pointer-events-none" />
          </SelectPrimitive.ItemIndicator>
        </span>
        <SelectPrimitive.ItemText className="">
          {capitalize(value)}
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

export { ChronosProvider, Chronos, useChronos, ViewType, ChronosEvent, ChronosCategory }