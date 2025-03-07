import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatTime(date: Date, showPeriod = true) {
  const [hours, minutes] = [date.getHours(), date.getMinutes()]
  let time = `${hours % 12 || 12}`

  if (minutes !== 0) time += `:${minutes.toString().padStart(2, '0')}`
  
  if (showPeriod) time += `${hours >= 12 ? 'pm' : 'am'}`

  return time
}

export function formatTimeRange(start: Date, end: Date) {
  const showStartPeriod = start.getHours() >= 12 !== end.getHours() >= 12

  return `${formatTime(start, showStartPeriod)} - ${formatTime(end)}`;
}

export const isSameDay = (a: Date, b: Date) => a.toDateString() === b.toDateString()

export const timeAscending = (a: Date, b: Date) => a.getTime() - b.getTime()