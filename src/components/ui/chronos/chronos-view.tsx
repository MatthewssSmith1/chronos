"use client"

import { useChronos } from "./chronos"
import { MonthView } from "./month-view"
import { DaysView } from "./days-view"
import { YearView } from "./year-view"
import { useMemo } from "react"
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
  const textStyle = "mx-auto text-xs sm:text-sm font-medium text-muted-foreground"

  function WeekdayText() {
    const text = date.toLocaleDateString('en-US', { weekday: 'short' })
    const firstLetter = text.charAt(0)
    const rest = text.slice(1)

    return <p className={textStyle}>{firstLetter}<span className="hidden sm:inline">{rest}</span></p>
  }

  function DateText() {
    const isToday = date.toDateString() === new Date().toDateString()

    return (
      <div className={cn("size-6 sm:size-7 mx-auto flex items-center justify-center rounded-full", isToday && "bg-primary")}>
        <p className={cn(textStyle, isToday && "text-primary-foreground")}>{date.getDate()}</p>
      </div>
    )
  }

  return (
    <div className={cn("flex flex-col", className)}>
      {!hideWeekday && <WeekdayText />}
      <DateText />
    </div>
  )
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
