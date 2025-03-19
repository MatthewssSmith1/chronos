"use client"

import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip"
import { Popover, PopoverAnchor, PopoverContent } from "@/components/ui/popover"
import { CaptionProps, DayPicker, DayProps } from "react-day-picker"
import { useChronos, useDateColors } from "./chronos"
import * as PopoverPrimitive from "@radix-ui/react-popover"
import { useDayEvents } from "@/hooks/use-events"
import { EventLine } from "./event-line"
import { isSameDay } from "date-fns"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { XIcon } from "lucide-react"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

export function YearView() {
  const { selectedDate, setSelectedDate } = useChronos()
  const [popoverAnchor, setPopoverAnchor] = useState<HTMLElement | null>(null)

  const months = Array.from({ length: 12 }, (_, i) => {
    const month = new Date(selectedDate)
    month.setMonth(i, 1)
    return month
  })

  const handleDayClick = (day: Date, element: HTMLElement) => {
    setSelectedDate(day)
    setPopoverAnchor(element)
  }

  return (
    <>
      <Card className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 sm:gap-[3vw] py-8 lg:py-[4vh] sm:px-[2vw] overflow-y-auto">
        {months.map((month, idx) => (
          <Calendar key={idx} month={month} onDayClick={handleDayClick} />
        ))}
      </Card>
      {popoverAnchor && (
        <Popover open={popoverAnchor !== null} onOpenChange={open => !open && setPopoverAnchor(null)}>
          <DayPopoverContent />
          <PopoverAnchor className="fixed"
            style={{
              top: `${popoverAnchor.getBoundingClientRect().bottom + window.scrollY + 4}px`,
              left: `${popoverAnchor.getBoundingClientRect().left + window.scrollX}px`,
            }} />
        </Popover>
      )}
    </>
  )
}

function Calendar({ month, onDayClick }: { month: Date, onDayClick: (day: Date, element: HTMLElement) => void }) {
  const { selectedDate } = useChronos()

  const formatWeekdayName = (date: Date) => date.toLocaleDateString("en-US", { weekday: "short" }).charAt(0)

  const cellWidth = "w-[calc(1rem+6vw)] sm:w-[calc(1rem+1.5vw)] min-w-8"
  const cellHeight = "h-[calc(1rem+6vw)] sm:h-[calc(1rem+1.45vw)] min-h-8"

  return (
    <DayPicker
      month={month}
      selected={selectedDate}
      formatters={{ formatWeekdayName }}
      classNames={{
        month: "flex flex-col gap-4",
        table: "mx-auto border-collapse space-x-1",
        head_row: "flex",
        head_cell: cn("text-muted-foreground rounded-md font-normal text-[0.8rem] pointer-events-none", cellWidth),
        row: "flex w-full mt-1 sm:mt-2",
        cell: cn("relative p-0 text-sm focus-within:z-20 transition-colors", cellWidth, cellHeight),
      }}
      components={{
        Day: (props) => <Day {...props} onDayClick={onDayClick} />,
        Caption: MonthTitle
      }}
    />
  )
}

function MonthTitle({ displayMonth }: CaptionProps) {
  const { setViewType, setSelectedDate } = useChronos()

  const onClick = () => {
    setViewType("month")
    setSelectedDate(displayMonth)
  }

  return (
    <div className="w-full flex flex-row justify-center items-center">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" className="p-0 px-4 transition-all hover:shadow-sm text-lg font-semibold" onClick={onClick}>
            {displayMonth.toLocaleDateString("en-US", { month: "long" })}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          Open {displayMonth.toLocaleDateString("en-US", { month: "long" })}
        </TooltipContent>
      </Tooltip>
    </div>
  )
}

function Day({ date, displayMonth, onDayClick }: DayProps & { onDayClick: (day: Date, element: HTMLElement) => void }) {
  const { selectedDate, colorOfEvent, setViewType } = useChronos()
  const colors = useDateColors(date)
  const events = useDayEvents(date)

  if (date.getMonth() !== displayMonth.getMonth()) return null

  return (
    <Button
      variant="ghost"
      onClick={e => isSameDay(date, selectedDate) ? setViewType("week") : onDayClick(date, e.currentTarget)}
      className={cn(
        "w-full h-full p-0 rounded-md font-normal cursor-pointer transition-all hover:shadow-sm active:opacity-90",
        colors
      )}
    >
      <span className={cn(
        "absolute top-1/2 left-1/2 -translate-x-1/2",
        events.length > 0 ? "-translate-y-[65%]" : "-translate-y-1/2"
      )}>
        {date.getDate()}
      </span>
      <div className="absolute bottom-1/6 flex flex-row gap-0.5 xl:gap-1 pointer-events-none">
        {events.filter((_, i) => i < 3).map((event) => (
          <div key={event.id} className="size-[5px] xl:size-[6px] bg-primary rounded-full" style={colorOfEvent(event)} />
        ))}
      </div>
    </Button>
  )
}

function DayPopoverContent() {
  const { selectedDate, setSelectedDate, setViewType } = useChronos()
  const events = useDayEvents(selectedDate)

  return (
    <PopoverContent className="w-auto p-0">
      <div className="relative p-4 pt-3 max-w-[300px]">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-medium truncate mr-8">
            {selectedDate.toLocaleDateString("en-US", { weekday: 'short', month: 'short', day: 'numeric' })}
          </h3>
          <PopoverPrimitive.Close asChild>
            <Button variant="ghost" size="sm" className="absolute top-2 right-2 size-8">
              <XIcon className="h-4 w-4" />
            </Button>
          </PopoverPrimitive.Close>
        </div>

        {events.length === 0 ? (
          <p className="text-sm text-muted-foreground">No events</p>
        ) : (
          <div className="space-y-3 max-h-[300px]">
            {events.map((event) => (
              <EventLine
                key={event.id}
                event={event}
                onClick={() => { setViewType("day"); setSelectedDate(event.start) }}
              />
            ))}
          </div>
        )}
      </div>
    </PopoverContent>
  )
}