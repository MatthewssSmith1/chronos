"use client"

import { useChronos } from "./chronos"
import { Calendar } from "./calendar"
import * as React from "react"
import { Card } from "./card"
import { cn } from "@/lib/utils"

function ChronosView() {
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

  const weekDates = React.useMemo(() => {
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

function DaysView({ dates, className }: { dates: Date[], className?: string }) {
  function TimeColumn() {
    const times = Array.from({ length: 24 }, (_, i) => `${(i % 12) + 1} ${i < 11 ? "AM" : "PM"}`)
    
    return (
      <div className="w-18 relative [&>*]:h-[75px] [&>*]:relative [&>*:last-child>*:last-child]:hidden">
        {times.map((time, i) => (
          <div key={i}>
            <div className="absolute right-1/2 bottom-0 translate-x-1/2 translate-y-[9px]">
              <p className="text-sm text-muted-foreground whitespace-nowrap">{time}</p>
            </div>
            <div className="absolute bottom-0 left-full w-screen h-[1px] bg-border z-10" />
          </div>
        ))}
      </div>
    )
  }

  function DayColumn({ date, isLast }: { date: Date, isLast?: boolean }) {
    return (
      <div className={cn(
        "flex-1 flex flex-col h-full",
        !isLast && "border-r",
        isLast && "rounded-br-md"
      )}>
      </div>
    )
  }

  return (
    <Card className={cn("flex-1 flex p-0 grid grid-rows-[auto_1fr] gap-0 isolate overflow-y-auto overflow-x-hidden", className)}>
      <div className="row-start-1 col-start-1" />
      {dates.map((date, idx) => (
        <DateHeader key={idx} date={date} className="sticky top-0 z-20 py-2 bg-background/60 border-b" />
      ))}
      <TimeColumn />
      {dates.map((date, idx) => (
        <DayColumn date={date} key={idx} isLast={idx === dates.length - 1} />
      ))}
    </Card>
  )
}

function useMonthDates() {
  const { selectedDate } = useChronos()
  
  return React.useMemo(() => {
    const firstOfMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1)
    const lastOfMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0)
    
    const countFromPrevMonth = firstOfMonth.getDay()
    const countFromNextMonth = (6 - lastOfMonth.getDay())
    
    const totalDays = countFromPrevMonth + lastOfMonth.getDate() + countFromNextMonth
    
    return Array.from({ length: totalDays }, (_, i) => {
      const date = new Date(firstOfMonth)
      date.setDate(1 - countFromPrevMonth + i)
      return date
    })
  }, [selectedDate])
}

function MonthView() {
  const dates = useMonthDates()

  return (
    <Card className="flex-1 grid grid-cols-7 p-0 gap-0">
      {dates.map((date, index) => (
        <DayCell key={index} date={date} index={index} dayCount={dates.length} />
      ))}
    </Card>
  )
}

function DayCell({ date, index, dayCount }: { date: Date, index: number, dayCount: number }) {
  const { selectedDate } = useChronos()

  const currentMonth = date.getMonth() === selectedDate.getMonth()
  const [firstRow, lastRow] = [index < 7, index >= dayCount - 7]
  const [firstCol, lastCol] = [index % 7 === 0, index % 7 === 6]
  
  return (
    <div
      className={cn(
        "flex flex-col h-full p-2 cursor-pointer",
        currentMonth ? "bg-muted/40 hover:bg-muted/70" : "hover:bg-muted/60",
        !firstRow && "border-t",
        !firstCol && "border-l",
        firstRow && firstCol && "rounded-tl-md",
        firstRow && lastCol && "rounded-tr-md",
        lastRow && firstCol && "rounded-bl-md",
        lastRow && lastCol && "rounded-br-md",
      )}
    >
      <DateHeader date={date} hideWeekday={!firstRow} />
    </div>
  )
}

function YearView() {
  const { selectedDate, setSelectedDate } = useChronos()
  
  const months = Array.from({ length: 12 }, (_, i) => {
    const month = new Date(selectedDate)
    month.setMonth(i, 1)
    return month
  })

  const formatCaption = (date: Date) => date.toLocaleDateString("en-US", { month: "long" })

  return (
    <Card className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-[5vw] py-4 overflow-y-auto">
      {months.map((month, index) => (
       <Calendar key={index} month={month} selected={selectedDate} onDayClick={setSelectedDate} formatters={{ formatCaption }} classNames={{
        months: "flex flex-col gap-2",
        caption_label: "text-base font-semibold",
        nav_button: "opacity-0 pointer-events-none",
        table: "mx-auto border-collapse space-x-1",
        cell: "relative p-0 text-center text-sm focus-within:relative focus-within:z-20 hover:bg-muted rounded-md transition-colors",
        head_cell: "text-muted-foreground rounded-md w-8 font-normal text-[0.8rem] pointer-events-none",
        day_selected: "bg-primary text-primary-foreground hover:bg-primary/80 hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
        day_today: "bg-primary/20 hover:bg-primary/30",
        day_outside: "text-muted-foreground aria-selected:text-muted-foreground aria-selected:bg-transparent",
       }} />
      ))}
    </Card>
  )
}

function ScheduleView() {
  return <div>TODO: List View</div>
}

function DateHeader({ date, hideWeekday = false, className }: { date: Date, hideWeekday?: boolean, className?: string }) {
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
      <div className={cn("size-7 mx-auto flex items-center justify-center rounded-full", isToday && "bg-primary")}>
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

export { ChronosView }