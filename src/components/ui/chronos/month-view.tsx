"use client"

import { useChronos, ChronosEvent, ChronosCategory } from "./chronos"
import { DateHeader, useDayEvents, isSameDay } from "./chronos-view"
import { Popover, PopoverTrigger } from "@/components/ui/popover"
import { cn, formatTime } from "@/lib/utils"
import { EventForm } from "./event-form"
import { PlusIcon } from "lucide-react"
import { useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

function useMonthDates() {
  const { selectedDate } = useChronos()
  
  return useMemo(() => {
    const firstOfMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1)
    const lastOfMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0)
    
    const prevMonthCount = firstOfMonth.getDay()
    const nextMonthCount = (6 - lastOfMonth.getDay())
    
    const totalDays = prevMonthCount + lastOfMonth.getDate() + nextMonthCount
    
    return Array.from({ length: totalDays }, (_, i) => {
      const date = new Date(firstOfMonth)
      date.setDate(1 - prevMonthCount + i)
      return date
    })
  }, [selectedDate])
}

export function MonthView() {
  const dates = useMonthDates()

  return (
    <Card className="flex-1 grid grid-cols-7 p-0 gap-0">
      {dates.map((date, idx) => (
        <DayCell key={idx} date={date} index={idx} dayCount={dates.length} />
      ))}
    </Card>
  )
}

function DayCell({ date, index, dayCount }: { date: Date, index: number, dayCount: number }) {
  const { categories, selectedDate, setSelectedDate, setViewType } = useChronos()

  const isSelected = isSameDay(date, selectedDate)
  const currentMonth = date.getMonth() === selectedDate.getMonth()
  const [firstRow, lastRow] = [index < 7, index >= dayCount - 7]
  const [firstCol, lastCol] = [index % 7 === 0, index % 7 === 6]
  
  const dayEvents = useDayEvents(date)
  
  return (
    <div
      onClick={() => isSelected ? setViewType("day") : setSelectedDate(date)}
      className={cn(
        "group flex flex-col h-full p-1 cursor-pointer hover:not-[&:has(>*:hover)]:bg-muted/70 transition-colors",
        currentMonth && "bg-muted/40 ",
        !firstRow && "border-t",
        !firstCol && "border-l",
        firstRow && firstCol && "rounded-tl-md",
        firstRow && lastCol && "rounded-tr-md",
        lastRow && firstCol && "rounded-bl-md",
        lastRow && lastCol && "rounded-br-md",
      )}
    >
      <DateHeader date={date} hideWeekday={!firstRow} className="py-1 pointer-events-none" />
      <div className="flex flex-col gap-0.5">
        {dayEvents.map(event => (
          <EventLine 
            key={event.id} 
            event={event} 
            category={categories.find(c => c.id === event.categoryId) ?? categories[0]} 
          />
        ))}
        
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" className="h-6 w-full flex items-center justify-center rounded-sm bg-primary/5 hover:bg-primary/10 hover:shadow-sm opacity-0 group-hover:opacity-100 aria-expanded:opacity-100 transition-all">
              <PlusIcon />
            </Button>
          </PopoverTrigger>
          <EventForm onCreateEvent={console.log} align="center" sideOffset={8} />
        </Popover>
      </div>
    </div>
  )
}

function EventLine({ event, category }: { event: ChronosEvent, category: ChronosCategory }) {
  return (
    <div className="flex flex-row items-center justify-center sm:justify-start gap-1.5 px-1.5 py-0.5 rounded hover:bg-primary/10 transition-colors text-xs font-medium [&>*]:pointer-events-none">
      <div className="size-2 rounded-full shrink-0" style={{ backgroundColor: category.color }} />
      <p className="text-muted-foreground hidden md:inline-block">{formatTime(event.start)}</p>
      <p className="truncate hidden sm:inline-block">{event.title}</p>
    </div>
  )
}