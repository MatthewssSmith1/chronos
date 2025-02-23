"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./select"
import { ChevronLeftIcon, ChevronRightIcon, CalendarPlusIcon } from "lucide-react"
import { Calendar } from "./calendar"
import { Button } from "./button"
import * as React from "react"
import { Card } from "./card"
import { cn } from "@/lib/utils"
import { CaptionProps, DayPicker } from "react-day-picker"

type Event = {
  id: string;
  title: string;
  start: Date;
  end: Date;
  description?: string;
  location?: string;
  calendar?: string;
}

const VIEWS = ["day", "week", "month", "year", "list"] as const
type ViewType = typeof VIEWS[number]

type ChronosContextType = {
  viewType: ViewType
  selectedDate: Date
  setViewType: (type: ViewType) => void
  setSelectedDate: (date: Date) => void
  offsetPeriod: (direction: number) => void
  goToToday: () => void
}

const ChronosContext = React.createContext<ChronosContextType | undefined>(undefined)

function ChronosProvider({ children }: { children: React.ReactNode }) {
  const [selectedDate, setSelectedDate] = React.useState<Date>(new Date())
  const [viewType, setViewType] = React.useState<ViewType>("week")

  const offsetPeriod = React.useCallback((direction: number) => {
    setSelectedDate((currentDate) => {
      const newDate = new Date(currentDate)
      
      switch (viewType) {
        case "day":
        case "list":
          newDate.setDate(currentDate.getDate() + direction)
          break
        case "week":
          newDate.setDate(currentDate.getDate() + (7 * direction))
          break
        case "month":
          newDate.setMonth(currentDate.getMonth() + direction, 1)
          break
        case "year":
          newDate.setFullYear(currentDate.getFullYear() + direction, 0, 1)
          break
      }
      return newDate
    })
  }, [viewType])

  const goToToday = React.useCallback(() => setSelectedDate(new Date()), [])

  React.useEffect(() => {
    const onWheel = (event: WheelEvent) => {
      const direction = event.deltaY > 0 ? 1 : -1;
      offsetPeriod(direction);
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key.length !== 1) return
      const key = event.key.toLowerCase();
      const viewType = VIEWS.find(view => view.startsWith(key));
      if (viewType) setViewType(viewType);
    }

    window.addEventListener('wheel', onWheel);
    window.addEventListener('keydown', onKeyDown);

    return () => {
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('keydown', onKeyDown);
    }
  }, [offsetPeriod, setViewType])

  const value = React.useMemo(
    () => ({
      viewType,
      selectedDate,
      setViewType,
      setSelectedDate,
      offsetPeriod,
      goToToday,
    }),
    [viewType, selectedDate, offsetPeriod, goToToday]
  )

  return <ChronosContext.Provider value={value}>{children}</ChronosContext.Provider>
}

function useChronos() {
  const context = React.useContext(ChronosContext)
  if (context === undefined) {
    throw new Error("useChronos must be used within a ChronosProvider")
  }
  return context
}

type ChronosProps = {
  className?: string
}

function Chronos({ 
  className
}: ChronosProps) {
  return (
    <div className={cn("w-full h-full flex flex-col gap-4 p-4", className)}>
      <TopBar />
      <ViewComponent />
    </div>
  )
}

function TopBar() {
  return (
    <div className="flex items-center justify-between px-2 gap-4">
      <TimePeriodText />
      <DateNavigator />
      <div className="flex-1 hidden sm:inline-block" />
      <ViewSelect />
      <Button>
        <CalendarPlusIcon className="h-4 w-4 mr-2" />
        New event
      </Button>
    </div>
  )
}

function DateNavigator() {
  const { offsetPeriod, goToToday } = useChronos()

  const buttonStyle = cn(
    "cursor-pointer bg-background shadow-xs hover:bg-accent hover:text-accent-foreground px-3 py-2 transition-colors",
    "outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] focus-visible:z-50",
  )
  const iconStyle = "size-4 pointer-events-none shrink-0"

  return (
    <div
      className={cn(
        "inline-flex items-stretch justify-center whitespace-nowrap text-sm font-medium",
        "border border-input shadow-xs isolate rounded-md [&>*]:first:rounded-l-md [&>*]:last:rounded-r-md",
      )}
    >
      <button className={cn(buttonStyle, "rounded-l-md")} onClick={() => offsetPeriod(-1)}>
        <ChevronLeftIcon className={iconStyle} />
      </button>
      <button className={cn(buttonStyle, "hidden sm:inline-block")} onClick={goToToday}>Today</button>
      <button className={cn(buttonStyle, "rounded-r-md")} onClick={() => offsetPeriod(1)}>
        <ChevronRightIcon className={iconStyle} />
      </button>
    </div>
  )
}

function TimePeriodText() {
  const { viewType, selectedDate } = useChronos()

  const getDisplayText = () => {
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

  return <h1 className="text-2xl font-semibold whitespace-nowrap overflow-hidden text-ellipsis">{getDisplayText()}</h1>
}

function ViewSelect() {
  const { viewType, setViewType } = useChronos()

  const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)

  return (
    <Select value={viewType} onValueChange={setViewType}>
      <SelectTrigger className="w-28">
        <SelectValue placeholder="Select a view" />
      </SelectTrigger>
      <SelectContent>
        {VIEWS.map((view, idx) => (
          <SelectItem value={view} key={idx}>
            {capitalize(view)}<span className="ml-auto text-muted-foreground">{view.charAt(0)}</span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

function ViewComponent() {
  const { viewType } = useChronos()
  const View = ViewMap[viewType]

  return <View />
}

const ViewMap: Record<ViewType, React.ComponentType> = {
  day: DayView,
  week: WeekView,
  month: MonthView,
  year: YearView,
  list: ScheduleView,
}

function DayColumn({ date, isFirst, isLast }: { date: Date, isFirst?: boolean, isLast?: boolean }) {
  const { selectedDate } = useChronos();
  const isToday = date.toDateString() === new Date().toDateString();
  const textStyle = "mx-auto text-xs sm:text-sm font-medium text-muted-foreground";

  function WeekdayText() {
    const weekDay = date.toLocaleDateString('en-US', { weekday: 'short' });
    const firstLetter = weekDay.charAt(0);
    const rest = weekDay.slice(1);

    return <p className={textStyle}>{firstLetter}<span className="hidden sm:inline">{rest}</span></p>;
  }

  function DateText() {
    return (
      <div className={cn("size-7 mx-auto flex items-center justify-center rounded-full", isToday && "bg-primary")}>
        <p className={cn(textStyle, isToday && "text-primary-foreground")}>{date.getDate()}</p>
      </div>
    );
  }

  return (
    <div className={cn(
      "flex-1 flex flex-col h-full",
      !isFirst && "border-l",
      isFirst && "rounded-l-md",
      isLast && "rounded-r-md"
    )}>
      <div className="p-1 flex flex-col items-center border-b bg-muted/40">
        <WeekdayText />
        <DateText />
      </div>
      <div className="flex-1" />
    </div>
  );
}

function TimeColumn() {
  return (
    <div>
      {/* TODO: render a time for every hour from 12am to 11pm */}
    </div>
  )
}

function DayView() {
  const { selectedDate } = useChronos();
  
  return (
    <Card className="flex-1 flex p-0 isolate grid grid-cols-[auto_1fr]">
      <TimeColumn />
      <DayColumn date={selectedDate} isFirst isLast />
    </Card>
  );
}

function WeekView() {
  const { selectedDate } = useChronos();
  const weekDates = React.useMemo(() => {
    const dates = [];
    const firstDayOfWeek = new Date(selectedDate);
    firstDayOfWeek.setDate(selectedDate.getDate() - selectedDate.getDay());

    for (let i = 0; i < 7; i++) {
      const date = new Date(firstDayOfWeek);
      date.setDate(firstDayOfWeek.getDate() + i);
      dates.push(date);
    }
    return dates;
  }, [selectedDate]);

  return (
    <Card className="flex-1 flex p-0 grid grid-cols-[auto_repeat(7,_1fr)] gap-0 isolate">
      <TimeColumn />
      {weekDates.map((date, index) => (
        <DayColumn 
          key={index} 
          date={date}
          isFirst={index === 0}
          isLast={index === 6}
        />
      ))}
    </Card>
  );
}

function useMonthDates() {
  const { selectedDate } = useChronos();
  
  return React.useMemo(() => {
    const firstDay = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1);
    const lastDay = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0);
    
    const startDate = new Date(firstDay);
    while (startDate.getDay() !== 0) {
      startDate.setDate(startDate.getDate() - 1);
    }
    
    const endDate = new Date(lastDay);
    while (endDate.getDay() !== 6) {
      endDate.setDate(endDate.getDate() + 1);
    }
    
    const dates: Date[] = [];
    const currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      dates.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }
  
    return dates;
  }, [selectedDate]);
}

function MonthView() {
  const dates = useMonthDates();

  return (
    <Card className="flex-1 grid grid-cols-7 p-0 gap-0">
      {dates.map((date, index) => (
        <DayCell key={index} date={date} index={index} dayCount={dates.length} />
      ))}
    </Card>
  );
}

function DayCell({ date, index, dayCount }: { date: Date, index: number, dayCount: number }) {
  const { selectedDate } = useChronos();

  const currentMonth = date.getMonth() === selectedDate.getMonth()
  const [firstRow, lastRow] = [index < 7, index >= dayCount - 7]
  const [firstCol, lastCol] = [index % 7 === 0, index % 7 === 6]

  const textStyle = "mx-auto text-xs sm:text-sm font-medium text-muted-foreground"

  function WeekdayText() {
    const weekDay = date.toLocaleDateString('en-US', { weekday: 'short' });
    const firstLetter = weekDay.charAt(0)
    const rest = weekDay.slice(1)

    return <p className={textStyle}>{firstLetter}<span className="hidden sm:inline">{rest}</span></p>
  }

  function DateText() {
    const isToday =  date.toDateString() === new Date().toDateString()

    return (
      <div className={cn("size-7 mx-auto flex items-center justify-center rounded-full", isToday && "bg-primary")}>
        <p className={cn(textStyle, isToday && "text-primary-foreground")}>{date.getDate()}</p>
      </div>
    )
  }
  
  return (
    <div
      className={cn(
        "flex flex-col h-full p-1 cursor-pointer",
        currentMonth ? "bg-muted/40 hover:bg-muted/70" : "hover:bg-muted/60",
        !firstRow && "border-t",
        !firstCol && "border-l",
        firstRow && firstCol && "rounded-tl-md",
        firstRow && lastCol && "rounded-tr-md",
        lastRow && firstCol && "rounded-bl-md",
        lastRow && lastCol && "rounded-br-md",
      )}
    >
      {firstRow && <WeekdayText />}
      <DateText />
    </div>
  );
}

function YearView() {
  const { selectedDate, setSelectedDate } = useChronos()
  
  const months = Array.from({ length: 12 }, (_, i) => {
    const month = new Date(selectedDate)
    month.setDate(1)
    month.setMonth(i)
    return month
  })

  const formatCaption = (date: Date) => date.toLocaleDateString("en-US", { month: "long" })

  return (
    <Card className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-[5vw] py-4 overflow-y-auto">
      {months.map((month, index) => (
       <Calendar key={index} month={month} selected={selectedDate} onDayClick={(date) => setSelectedDate(date)} formatters={{ formatCaption }} classNames={{
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
  return <div>List View</div>
}

export { ChronosProvider, Chronos }