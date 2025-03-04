import { ChevronLeftIcon, ChevronRightIcon, CalendarPlusIcon, CheckIcon } from "lucide-react"
import { Select, SelectContent, SelectTrigger, SelectValue } from "@/components/ui/select"
import { SegmentGroup, ButtonSegment } from "./segmented-button"
import { useChronos, ViewType, VIEWS } from "./chronos"
import { Popover, PopoverTrigger } from "@/components/ui/popover"
import * as SelectPrimitive from "@radix-ui/react-select"
import { EventForm } from "./event-form"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export default function ChronosControls() {
  return (
    <div className="flex items-center justify-between px-2 gap-2 sm:gap-4">
      <TimePeriodText />
      <DateNavigator />
      <div className="flex-1 hidden sm:inline-block" />
      <ViewSelect />
      <NewEventButton /> 
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
  const [isOpen, setIsOpen] = useState(false)
  const { createEvent } = useChronos()

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button className="gap-2">
          <CalendarPlusIcon />
          <span className="hidden sm:inline">New event</span>
        </Button>
      </PopoverTrigger>
      <EventForm 
        align="end" 
        alignOffset={-8} 
        onCreateEvent={event => {
          createEvent(event)
          setIsOpen(false)
        }}
      />
    </Popover>
  )
}