"use client"

import { ChevronLeftIcon, ChevronRightIcon, CalendarPlusIcon, CheckIcon, CalendarFoldIcon, Columns2, Columns4, CalendarIcon, LayoutGrid } from "lucide-react"
import { Select, SelectContent, SelectTrigger, SelectValue } from "@/components/ui/select"
import { format, startOfWeek, endOfWeek, isSameMonth } from "date-fns"
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip"
import { useMemo, useState, ReactNode } from "react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SegmentGroup, ButtonSegment } from "./segmented-button"
import { useChronos, ViewType, VIEWS } from "./chronos"
import { Popover, PopoverTrigger } from "@/components/ui/popover"
import * as SelectPrimitive from "@radix-ui/react-select"
import { Separator } from "@/components/ui/separator"
import { EventForm } from "./event-form"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function ChronosControls() {
  return (
    <div className="relative flex items-center justify-between sm:px-2 gap-2 sm:gap-4">
      <TimePeriodText />
      <DateNavigator />
      <div className="flex-1 inline-block -mx-1" />
      <ViewSelect />
      <ViewTabs />
      <NewEventButton />
    </div>
  )
}

function TimePeriodText() {
  const { viewType, selectedDate } = useChronos()

  const text = useMemo(() => {
    switch (viewType) {
      case 'week': {
        const start = startOfWeek(selectedDate)
        const end = endOfWeek(selectedDate)

        if (isSameMonth(start, end))
          return format(start, 'MMMM yyyy')

        return `${format(start, 'MMM')} - ${format(end, 'MMM')} ${format(start, 'yyyy')}`
      }
      case 'month':
        return format(selectedDate, 'MMMM yyyy')
      case 'year':
        return format(selectedDate, 'yyyy')
      case 'day':
      default:
        return format(selectedDate, 'MMMM d, yyyy')
    }
  }, [viewType, selectedDate])

  return <h1 className="text-2xl font-semibold truncate">{text}</h1>
}

function DateNavigator() {
  const { offsetPeriod, goToToday, viewType } = useChronos()

  return (
    <SegmentGroup>
      <ButtonSegment onClick={() => offsetPeriod(-1)} tooltip={`Previous ${viewType}`}>
        <ChevronLeftIcon className="size-4 pointer-events-none shrink-0" />
      </ButtonSegment>
      <ButtonSegment onClick={goToToday} className="hidden sm:inline-block" tooltip="Go to today">Today</ButtonSegment>
      <ButtonSegment onClick={() => offsetPeriod(1)} tooltip={`Next ${viewType}`}>
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
    return <Button onClick={handleClick} variant="ghost" size="sm" className="px-1 font-normal text-left">{children}</Button>
  }

  const openEventForm = () =>
    setTimeout(() => document.getElementById("new-event-button")?.click(), 10)

  return (
    <Select value={viewType} onValueChange={setViewType} open={open} onOpenChange={setOpen} >
      <SelectTrigger className="w-28 lg:hidden">
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

function ViewTabs() {
  const { viewType, setViewType } = useChronos()

  const icons = {
    day: Columns2,
    week: Columns4,
    month: CalendarIcon,
    year: LayoutGrid
  }

  return (
    <Tabs defaultValue={viewType} onValueChange={view => setViewType(view as ViewType)} className="hidden lg:inline-block">
      <TabsList className="h-11 gap-2">
        {VIEWS.map((view, idx) => {
          const Icon = icons[view]
          return (
            <Tooltip key={idx}>
              <TooltipTrigger asChild>
                <TabsTrigger value={view} className={cn(
                  "h-9 pl-2.5 pr-3 flex items-center gap-0 capitalize",
                  viewType === view ? "bg-background text-accent-foreground" : "hover:bg-background/70"
                )}>
                  <span className={cn(
                    "relative overflow-hidden transition-all ease-in-out flex items-center justify-center",
                    viewType === view ? "w-5 mr-2 opacity-100" : "w-0 mr-0 opacity-0"
                  )}>
                    <Icon className="min-w-5" />
                  </span>
                  {view}
                </TabsTrigger>
              </TooltipTrigger>
              <TooltipContent>
                {view.charAt(0).toUpperCase() + view.slice(1)} view <span className="ml-1 text-muted-foreground font-bold">{view.charAt(0)}</span>
              </TooltipContent>
            </Tooltip>
          )
        })}
      </TabsList>
    </Tabs>
  )
}

function NewEventButton() {
  const { createEvent } = useChronos()
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <Tooltip>
        <PopoverTrigger asChild>
          <TooltipTrigger asChild>
            <Button id="new-event-button" className="absolute sm:static right-0 sm:flex gap-2 opacity-0 sm:opacity-100 pointer-events-none sm:pointer-events-auto">
              <CalendarPlusIcon />
              <span className="hidden sm:inline">New event</span>
            </Button>
          </TooltipTrigger>
        </PopoverTrigger>
        <TooltipContent>
          Create new event
        </TooltipContent>
      </Tooltip>
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
