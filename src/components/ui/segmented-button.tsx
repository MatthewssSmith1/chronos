"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

function SegmentGroup({ children }: { children: React.ReactNode }) {
  return (
    <div className={cn(
      "inline-flex items-stretch justify-center whitespace-nowrap text-sm font-medium min-h-9",
      "border border-input shadow-xs isolate rounded-md [&>*]:first:rounded-l-md [&>*]:last:rounded-r-md",
    )}>
      {children}
    </div>
  )
}

function ButtonSegment({ onClick, className, children }: { onClick?: () => void, className?: string, children?: React.ReactNode }) {
  return (
    <button onClick={onClick} className={cn(
      "cursor-pointer bg-background shadow-xs hover:bg-accent hover:text-accent-foreground px-3 py-2 transition-colors",
      "outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] focus-visible:z-50",
      className
    )}>
      {children}
    </button>
  )
}

export { SegmentGroup, ButtonSegment }