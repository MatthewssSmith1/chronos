import { useChronos } from "./chronos"
import { Calendar } from "@/components/ui/calendar"
import { Card } from "@/components/ui/card"


export function YearView() {
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