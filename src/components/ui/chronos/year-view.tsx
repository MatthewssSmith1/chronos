import { CaptionProps, DayPicker, DayProps } from "react-day-picker"
import { useDayEvents } from "./chronos-view"
import { useChronos } from "./chronos"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

export function YearView() {
  const { selectedDate } = useChronos()

  const months = Array.from({ length: 12 }, (_, i) => {
    const month = new Date(selectedDate)
    month.setMonth(i, 1)
    return month
  })

  return (
    <Card className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-[3vw] py-4 lg:py-[4vh] sm:px-[2vw] overflow-y-auto">
      {months.map((month, idx) => <Calendar key={idx} month={month} />)}
    </Card>
  )
}

function Calendar({ month }: { month: Date }) {
  const { selectedDate } = useChronos()

  return (
    <DayPicker
      month={month}
      selected={selectedDate}
      showOutsideDays
      formatters={{
        formatCaption: (date: Date) => date.toLocaleDateString("en-US", { month: "long" }),
        formatWeekdayName: (date) => date.toLocaleDateString("en-US", { weekday: "short" }).charAt(0)
      }}
      classNames={{
        months: "flex flex-col gap-2",
        month: "flex flex-col gap-4",
        caption: "flex justify-center pt-1 relative items-center w-full",
        caption_label: "text-base font-semibold",
        table: "mx-auto border-collapse space-x-1",
        head_row: "flex",
        head_cell: "text-muted-foreground rounded-md w-[calc(1rem+1.5vw)] min-w-8 font-normal text-[0.8rem] pointer-events-none",
        row: "flex w-full mt-2",
        cell: "relative p-0 text-sm focus-within:z-20 transition-colors w-[calc(1rem+1.5vw)] min-w-8 h-[calc(1rem+1.45vw)] min-h-8",
      }}
      components={{ Day, Caption }}
    />
  )
}

function Caption({ displayMonth }: CaptionProps) {
  const { setViewType, setSelectedDate } = useChronos()

  const onClick = () => {
    setViewType("month")
    setSelectedDate(displayMonth)
  }

  return (
    <div className="w-full flex flex-row justify-center items-center">
      <Button variant="ghost" className="p-0 font-semibold px-4 transition-all hover:shadow-sm" onClick={onClick}>
        {displayMonth.toLocaleDateString("en-US", { month: "long" })}
      </Button>
    </div>
  )
}

function Day({ date, displayMonth }: DayProps) {
  const { selectedDate, setSelectedDate, colorOfEvent, setViewType } = useChronos()
  const events = useDayEvents(date)

  const isSelected = date.toDateString() === selectedDate.toDateString()
  const isToday = date.toDateString() === new Date().toDateString()
  const isOutside = date.getMonth() !== displayMonth.getMonth()

  const onClick = () => (isSelected) ? setViewType("week") : setSelectedDate(date)

  if (isOutside) return null

  let colors = ""
  if (isSelected) colors = "bg-primary/80 hover:bg-primary/90 !text-primary-foreground"
  else if (isToday) colors = "bg-primary/20 hover:bg-primary/30"

  return (
    <Button
      variant="ghost"
      onClick={onClick}
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
      <div className="absolute bottom-1/6 flex flex-row gap-0.5 pointer-events-none">
        {events.filter((_, i) => i < 3).map((event) => (
          <div key={event.id} className="size-[5px] bg-primary rounded-full" style={{ backgroundColor: colorOfEvent(event) }} />
        ))}
      </div>
    </Button>
  )
}