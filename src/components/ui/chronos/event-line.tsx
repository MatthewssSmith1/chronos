"use client"

import { useChronos, ChronosEvent } from "./chronos"
import { cva, type VariantProps } from "class-variance-authority"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

const lineVariants = cva(
  "flex flex-row items-center gap-1.5 rounded-md transition-all [&>*]:pointer-events-none",
  {
    variants: {
      variant: {
        default: "relative isolate py-2 px-3 text-sm cursor-pointer overflow-visible hover:shadow-md",
        compact: "justify-center sm:justify-start px-1.5 py-0.5 text-xs font-medium hover:bg-primary/10"
      }
    },
    defaultVariants: {
      variant: "compact"
    }
  }
)

export function EventLine({ 
  event, 
  variant = "default", 
  onClick
}: VariantProps<typeof lineVariants> & { event: ChronosEvent, onClick?: () => void }) {
  const { colorOfEvent } = useChronos()

  return (
    <div className={lineVariants({ variant })} onClick={onClick}>
      {variant === "default" && (
        <div className="absolute inset-0 -z-10 opacity-10 rounded-md" style={colorOfEvent(event)} />
      )}
      <div className="rounded-md shrink-0 size-2" style={colorOfEvent(event)} />
      <p className="text-muted-foreground hidden lg:inline-block whitespace-nowrap">
        {format(event.start, 'h:mma').toLowerCase().replaceAll(':00', '')}
      </p>
      <p className={cn("truncate", variant === "compact" && "hidden sm:inline-block")}>
        {event.title}
        {event.location && <>{' @ '}{event.location}</>}
      </p>
    </div>
  )
}