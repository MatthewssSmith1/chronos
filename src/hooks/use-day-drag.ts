import { useState, useCallback, RefObject, MouseEvent as ReactMouseEvent } from "react"

const TIME_SNAP_MINUTES = 15 

/**
 * A generic hook for handling drag operations in day view components.
 * This hook is agnostic to how the drag data is used - it simply tracks coordinates
 * and provides time conversion helpers.
 */
export function useDayDrag(columnRef: RefObject<HTMLDivElement | null>, date: Date) {
  const [isDragging, setIsDragging] = useState(false)
  const [dragStartY, setDragStartY] = useState<number | null>(null)
  const [currentY, setCurrentY] = useState<number | null>(null)
  
  const getTimeFromY = useCallback((y: number) => {
    if (!columnRef.current) return new Date(date)
    const { top, height } = columnRef.current.getBoundingClientRect()
    const hoursFromMidnight = 24 * Math.max(0, Math.min(1, (y - top) / height))

    const newTime = new Date(date)
    newTime.setHours(Math.floor(hoursFromMidnight))
    newTime.setMinutes(Math.round((hoursFromMidnight % 1) * 60 / TIME_SNAP_MINUTES) * TIME_SNAP_MINUTES)
    return newTime
  }, [date, columnRef])
  
  const startDrag = useCallback((
    e: ReactMouseEvent, 
    options?: {
      onDragMove?: (data: { startTime: Date, currentTime: Date, startY: number, currentY: number }) => void
      onDragEnd?: (data: { startTime: Date, endTime: Date, startY: number, endY: number }) => void
    }
  ) => {
    e.preventDefault()
    e.stopPropagation()
    
    const startY = e.clientY
    setDragStartY(startY)
    setCurrentY(startY)
    setIsDragging(true)
    
    const startTime = getTimeFromY(startY)
    
    const onMouseMove = (moveEvent: MouseEvent) => {
      moveEvent.preventDefault()
      
      const newY = moveEvent.clientY
      setCurrentY(newY)
      
      const currentTime = getTimeFromY(newY)
      
      options?.onDragMove?.({
        startTime,
        currentTime,
        startY,
        currentY: newY
      })
    }
    
    const onMouseUp = (upEvent: MouseEvent) => {
      const endY = upEvent.clientY
      const endTime = getTimeFromY(endY)
      
      options?.onDragEnd?.({
        startTime,
        endTime,
        startY,
        endY
      })
      
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', onMouseUp)
      document.body.style.userSelect = ''
      document.body.style.cursor = ''
      
      setIsDragging(false)
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
  }, [getTimeFromY])
  
  const dragTimes = useCallback(() => {
    if (dragStartY === null || currentY === null) return null
    
    return {
      startTime: getTimeFromY(dragStartY),
      currentTime: getTimeFromY(currentY)
    }
  }, [dragStartY, currentY, getTimeFromY])
  
  return {
    isDragging,
    dragStartY,
    currentY,
    
    startDrag,
    dragTimes,
    
    dragStartTime: dragStartY !== null ? getTimeFromY(dragStartY) : null,
    currentTime: currentY !== null ? getTimeFromY(currentY) : null
  }
}