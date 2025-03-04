"use client"

import { ReactNode, useMemo } from "react"
import { useChronos } from "./chronos"
import { MonthView } from "./month-view"
import { DaysView } from "./days-view"
import { YearView } from "./year-view"
import { cn } from "@/lib/utils"

export function ChronosView() {
  const { viewType } = useChronos()

  const View = {
    day: DayView,
    week: WeekView,
    month: MonthView,
    year: YearView,
    list: ScheduleView,
  }[viewType]

  return <View />
}

function DayView() {
  const { selectedDate } = useChronos()

  return <DaysView dates={[selectedDate]} className="grid-cols-[auto_1fr]" />
}

function WeekView() {
  const { selectedDate } = useChronos()

  const weekDates = useMemo(() => {
    const dates = []
    const firstDayOfWeek = new Date(selectedDate)
    firstDayOfWeek.setDate(selectedDate.getDate() - selectedDate.getDay())

    for (let i = 0; i < 7; i++) {
      const date = new Date(firstDayOfWeek)
      date.setDate(firstDayOfWeek.getDate() + i)
      dates.push(date)
    }
    return dates
  }, [selectedDate])

  return <DaysView dates={weekDates} className="grid-cols-[auto_repeat(7,_1fr)]" />
}

function ScheduleView() {
  return <div>TODO: List View</div>
}

export function DateHeader({ date, hideWeekday = false, className }: { date: Date, hideWeekday?: boolean, className?: string }) {
  const { setViewType, setSelectedDate } = useChronos()

  function onClick() {
    setSelectedDate(date)
    setViewType("day")
  }

  const Text = ({ className, children }: { className?: string, children?: ReactNode | ReactNode[] }) =>
    <p className={cn("mx-auto text-xs sm:text-sm font-medium transition-colors pointer-events-none", className)}>{children}</p>

  function WeekdayText() {
    const text = date.toLocaleDateString('en-US', { weekday: 'short' })
    const firstLetter = text.charAt(0)
    const rest = text.slice(1)

    return <Text className="text-muted-foreground">{firstLetter}<span className="hidden sm:inline">{rest}</span></Text>
  }

  function DateText() {
    const colors = useDateColors(date)

    return (
      <div className={cn(
        "size-6 sm:size-7 mx-auto flex items-center justify-center rounded-full transition-colors pointer-events-none", 
        colors
      )}>
        <Text className={cn(
          "text-inherit"
        )}>
          {date.getDate()}
        </Text>
      </div>
    )
  }

  return (
    <button onClick={onClick} className={cn("flex flex-col cursor-pointer hover:bg-muted/80 active:bg-muted transition-colors", className)}>
      {!hideWeekday && <WeekdayText />}
      <DateText />
    </button>
  )
}

export function useDayEvents(date: Date) {
  const { events } = useChronos()

  return useMemo(
    () => events
      .filter(event => isSameDay(event.start, date))
      .sort((a, b) => a.start.getTime() - b.start.getTime()),
    [events, date]
  )
}

export function useDateColors(date: Date) {
  const { selectedDate } = useChronos()

  if (isSameDay(date, selectedDate)) return "bg-primary/80 hover:bg-primary/90 !text-primary-foreground"
  else if (isSameDay(date, new Date())) return "bg-primary/20 hover:bg-primary/30"

  return ""
}

export const isSameDay = (a: Date, b: Date) => a.toDateString() === b.toDateString()

export const timeAscending = (a: Date, b: Date) => a.getTime() - b.getTime()
