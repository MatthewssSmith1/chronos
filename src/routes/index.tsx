import { Chronos, ChronosEvent, ChronosProvider } from '@/components/ui/chronos/chronos'
import { CATEGORIES } from '@/lib/exampleData'
import { createFileRoute } from '@tanstack/react-router'
import { useShiftedEvents } from '@/hooks/use-shifted-events'

export const Route = createFileRoute('/')({
  component: HomeComponent,
})

function HomeComponent() {
  const shiftedEvents = useShiftedEvents();
  
  // placeholder for API calls, simulating a delay
  const handleCreateEvent = async (event: ChronosEvent): Promise<ChronosEvent> => {
    console.log("Create event:", event);

    await new Promise(resolve => setTimeout(resolve, 500));
    
    return { ...event, id: `server-${Date.now()}` };
  };

  const handleEditEvent = async (event: ChronosEvent): Promise<ChronosEvent> => {
    console.log("Edit event:", event);

    await new Promise(resolve => setTimeout(resolve, 500));
    
    return event;
  };

  const handleDeleteEvent = async (eventId: string): Promise<void> => {
    console.log("Delete event:", eventId);

    await new Promise(resolve => setTimeout(resolve, 500));
  };

  return (
    <div className="h-screen">
      <ChronosProvider 
        initialEvents={shiftedEvents} 
        categories={CATEGORIES} 
        onCreateEvent={handleCreateEvent} 
        onEditEvent={handleEditEvent} 
        onDeleteEvent={handleDeleteEvent}
      >
        <Chronos />
      </ChronosProvider>
    </div>
  )
}
