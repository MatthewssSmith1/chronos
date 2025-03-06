"use client"

import { DateHeader, useDayEvents, isSameDay } from "./chronos-view"
import { useChronos, ChronosEvent } from "./chronos"
import { Popover, PopoverTrigger } from "@/components/ui/popover"
import { useMemo, useState } from "react"
import { EventForm } from "./event-form"
import { EventLine } from "./event-line"
import { PlusIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

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
    <Card className="flex-1 grid grid-cols-7 p-0 gap-0" style={{ gridTemplateRows: `repeat(${dates.length / 7}, minmax(0, 1fr))` }}>
      {dates.map((date, idx) => (
        <DayCell key={idx} date={date} index={idx} dayCount={dates.length} />
      ))}
    </Card>
  )
}

function DayCell({ date, index, dayCount }: { date: Date, index: number, dayCount: number }) {
  const { categories, selectedDate, setSelectedDate, setViewType, createEvent } = useChronos()
  const [previewEvent, setPreviewEvent] = useState<ChronosEvent | null>(null)
  const dayEvents = useDayEvents(date, previewEvent)

  const currentMonth = date.getMonth() === selectedDate.getMonth()
  const [firstRow, lastRow] = [index < 7, index >= dayCount - 7]
  const [firstCol, lastCol] = [index % 7 === 0, index % 7 === 6]
  
  return (
    <div
      onClick={() => isSameDay(date, selectedDate) ? setViewType("day") : setSelectedDate(date)}
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
      <div className="flex flex-col gap-0.5" onClick={(e) => e.stopPropagation()}>
        <div className="flex flex-col gap-0.5 overflow-hidden">
          {dayEvents.map(event => <EventLine key={event.id} event={event} variant="compact" />)}
        </div>

        <Popover open={previewEvent !== null} onOpenChange={(open) => {
          if (!open) return setPreviewEvent(null)

          if (previewEvent) return

          setPreviewEvent({
            id: 'preview',
            allDay: false,
            start: new Date(date),
            end: new Date(date),
            categoryId: categories[0].id
          })
        }}>
          <PopoverTrigger asChild>
            <Button variant="ghost" className="h-6 w-full flex items-center justify-center rounded-sm bg-primary/5 hover:bg-primary/10 hover:shadow-sm opacity-0 group-hover:opacity-100 aria-expanded:opacity-100 transition-all">
              <PlusIcon />
            </Button>
          </PopoverTrigger>
          <EventForm 
            onSubmitEvent={(data) => {
              createEvent(data)
              setPreviewEvent(null)
            }} 
            event={previewEvent ?? undefined}
            onEventChanged={setPreviewEvent}
            align="center" 
            sideOffset={8} 
          />
        </Popover>
      </div>
    </div>
  )
}
