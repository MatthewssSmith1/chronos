"use client"

import { useChronos, useFullDayEvents, PositionedChronosEvent } from "./chronos"
import { isSameDay } from "date-fns"
import { cn } from "@/lib/utils"

const EVENT_HEIGHT = 25
const EVENT_PADDING = 3

export function EventBanner({dates}: {dates: Date[]}) {
  const [firstDate, lastDate] = [dates[0], dates[dates.length - 1]]
  const events = useFullDayEvents(firstDate, lastDate)

  return (
    <div 
      style={{ height: `${Math.max(...events.map(e => e.numChannels)) * (EVENT_HEIGHT + EVENT_PADDING * 2)}px` }} 
      className="sticky top-16 min-h-2 z-50 col-start-2 -col-end-1 h-min bg-background/80 box-content border-b" 
    >
      {events.map(event => <FullDayEvent key={event.id} event={event} firstDate={firstDate} lastDate={lastDate} />)}
    </div>
  )
}

function FullDayEvent({event, firstDate, lastDate}: {event: PositionedChronosEvent, firstDate: Date, lastDate: Date}) {
  const { colorOfEvent } = useChronos()
  const startIdx = (event.start < firstDate) ? 0 : event.start.getDay();
  const endIdx = (event.end > lastDate) ? 6 : event.end.getDay();
  
  const colWidth = 100 / 7; 
  
  const isStartCutOff = event.start.getTime() < firstDate.getTime() && !isSameDay(event.start, firstDate);
  const isEndCutOff = event.end.getTime() > lastDate.getTime() && !isSameDay(event.end, lastDate);
  
  const style = {
    ...colorOfEvent(event), 
    height: `${EVENT_HEIGHT}px`,
    width: `calc(${(endIdx - startIdx + 1) * colWidth}% - ${EVENT_PADDING * 2}px)`,
    top: `${EVENT_PADDING + (EVENT_HEIGHT + EVENT_PADDING) * event.channelIndex}px`, 
    left: `calc(${startIdx * colWidth}% + ${EVENT_PADDING}px)`,
  }

  return (
    <div 
      style={style} 
      className={cn(
        "absolute content-[''] flex items-center px-2 transition-[box-shadow,brightness] cursor-pointer hover:shadow-md hover:brightness-110",
        !isStartCutOff && "rounded-l-md",
        !isEndCutOff && "rounded-r-md"
      )}
    >
      <p className="text-white text-sm truncate pointer-events-none select-none">{event.title}</p>
    </div>
  )
}