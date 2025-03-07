import { useState, useCallback, RefObject, MouseEvent as ReactMouseEvent } from "react"

const TIME_SNAP_MINUTES = 15 

export function useDayDrag(columnRef: RefObject<HTMLDivElement | null>, date: Date) {
  const [isDragging, setIsDragging] = useState(false)
  const [wasDragging, setWasDragging] = useState(false)
  const [dayOffset, setDayOffset] = useState(0)
  
  const getTimeFromY = useCallback((y: number) => {
    if (!columnRef.current) return new Date(date)
    const { top, height } = columnRef.current.getBoundingClientRect()
    const hoursFromMidnight = 24 * Math.max(0, Math.min(1, (y - top) / height))

    const newTime = new Date(date)
    newTime.setHours(Math.floor(hoursFromMidnight))
    newTime.setMinutes(Math.round((hoursFromMidnight % 1) * 60 / TIME_SNAP_MINUTES) * TIME_SNAP_MINUTES)
    return newTime
  }, [date, columnRef])
  
  const getDayOffsetFromX = useCallback((currentX: number) => {
    if (!columnRef.current) return 0
    
    const { left, width } = columnRef.current.getBoundingClientRect()
    if (width === 0) return 0
    
    const columnCenter = left + (width / 2) 
    const centerOffset = Math.round((currentX - columnCenter) / width)

    const targetWeekday = Math.max(0, Math.min(6, date.getDay() + centerOffset))

    return targetWeekday - date.getDay()
  }, [columnRef, date])
  
  const startDrag = useCallback((
    event: ReactMouseEvent, 
    options?: {
      onDragMove?: (data: { startTime: Date, currentTime: Date }) => void
      onDragEnd?: (data: { startTime: Date, endTime: Date, dayOffset: number }) => void
    }
  ) => {
    event.preventDefault()
    event.stopPropagation()
    
    setIsDragging(true)
    
    const startTime = getTimeFromY(event.clientY)
    
    const onMouseMove = (e: MouseEvent) => {
      e.preventDefault()
      
      options?.onDragMove?.({ 
        startTime, 
        currentTime: getTimeFromY(e.clientY),
      })

      setDayOffset(getDayOffsetFromX(e.clientX))
      setWasDragging(true)
    }
    
    const onMouseUp = (e: MouseEvent) => {
      options?.onDragEnd?.({ 
        startTime, 
        endTime: getTimeFromY(e.clientY),
        dayOffset: getDayOffsetFromX(e.clientX)
      })
      
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', onMouseUp)
      document.body.style.userSelect = ''
      document.body.style.cursor = ''
      
      setDayOffset(0)
      setIsDragging(false)
      setTimeout(() => setWasDragging(false), 100)
    }
    
    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)
    document.body.style.userSelect = 'none'
    document.body.style.cursor = 'move'
    
    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', onMouseUp)
      document.body.style.userSelect = ''
      document.body.style.cursor = ''
    }
  }, [getTimeFromY, getDayOffsetFromX])
  
  return { startDrag, dayOffset, isDragging, wasDragging }
}