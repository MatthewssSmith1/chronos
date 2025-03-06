import { ChevronLeftIcon, ChevronRightIcon, CalendarPlusIcon, CheckIcon, CalendarFoldIcon } from "lucide-react"
import { Select, SelectContent, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useMemo, useState, ReactNode } from "react"
import { SegmentGroup, ButtonSegment } from "./segmented-button"
import { useChronos, ViewType, VIEWS } from "./chronos"
import { Popover, PopoverTrigger } from "@/components/ui/popover"
import * as SelectPrimitive from "@radix-ui/react-select"
import { Separator } from "@/components/ui/separator"
import { EventForm } from "./event-form"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export default function ChronosControls() {
  return (
    <div className="relative flex items-center justify-between sm:px-2 gap-2 sm:gap-4">
      <TimePeriodText />
      <DateNavigator />
      <div className="flex-1 inline-block -mx-1" />
      <ViewSelect />
      <NewEventButton />
    </div>
  )
}

function TimePeriodText() {
  const { viewType, selectedDate } = useChronos()

  const text = useMemo(() => {
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
  }, [viewType, selectedDate])

  return <h1 className="text-2xl font-semibold truncate">{text}</h1>
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
  const { viewType, setViewType, goToToday } = useChronos()
  const [open, setOpen] = useState(false)

  function MobileButton({ onClick, children }: { onClick: () => void, children?: ReactNode | ReactNode[] }) {
    const handleClick = () => {
      setOpen(false)
      onClick()
    }
    return <Button onClick={handleClick} variant="ghost" size="sm" className="px-1 text-left">{children}</Button>
  }

  const openEventForm = () => 
    setTimeout(() => document.getElementById("new-event-button")?.click(), 10)

  return (
    <Select value={viewType} onValueChange={setViewType} open={open} onOpenChange={setOpen}>
      <SelectTrigger className="w-28">
        <SelectValue placeholder="Select a view" />
      </SelectTrigger>
      <SelectContent>
        <div className="sm:hidden w-full flex flex-col">
          <MobileButton onClick={openEventForm}>
            Create event
            <CalendarPlusIcon />
          </MobileButton>
          <MobileButton onClick={goToToday}>
            Go to today
            <CalendarFoldIcon className="ml-auto" />
          </MobileButton>
          <Separator className="my-1" />
        </div>
        {VIEWS.map((view, idx) => <ViewOption key={idx} view={view} />)}
      </SelectContent>
    </Select>
  )
}

function ViewOption({ view }: { view: ViewType }) {
  return (
    <SelectPrimitive.Item
      value={view}
      data-slot="select-item"
      className={cn(
        "relative flex w-full items-center cursor-pointer gap-2 rounded-sm py-1.5 pr-8 pl-2 text-sm",
        "focus:bg-accent focus:text-accent-foreground outline-hidden select-none",
        "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      )}
    >
      <span className="absolute right-2 flex size-3.5 items-center justify-center">
        <SelectPrimitive.ItemIndicator>
          <CheckIcon className="size-4 shrink-0 text-muted-foreground pointer-events-none" />
        </SelectPrimitive.ItemIndicator>
      </span>
      <SelectPrimitive.ItemText className="">
        <span className="capitalize">{view}</span>
      </SelectPrimitive.ItemText>
      <span className="ml-auto text-muted-foreground/70 w-3 text-center">{view.charAt(0)}</span>
    </SelectPrimitive.Item>
  )
}

function NewEventButton() {
  const { createEvent } = useChronos()
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button id="new-event-button" className="absolute sm:static right-0 sm:flex gap-2 opacity-0 sm:opacity-100 pointer-events-none sm:pointer-events-auto">
          <CalendarPlusIcon />
          <span className="hidden sm:inline">New event</span>
        </Button>
      </PopoverTrigger>
      <EventForm 
        align="end" 
        alignOffset={-8} 
        onSubmitEvent={event => {
          createEvent(event)
          setIsOpen(false)
        }}
      />
    </Popover>
  )
}
