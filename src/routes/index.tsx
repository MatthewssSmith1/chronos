import { Chronos, ChronosEvent, ChronosProvider } from '@/components/ui/chronos/chronos'
import { EVENTS, CATEGORIES } from '@/lib/exampleData'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: HomeComponent,
})

function HomeComponent() {
    // placeholder for API calls, simulating a delay
  const handleCreateEvent = async (event: ChronosEvent): Promise<ChronosEvent> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return { ...event, id: `server-${Date.now()}` };
  };

  const handleEditEvent = async (event: ChronosEvent): Promise<ChronosEvent> => {
    console.log("Editing event:", event);

    await new Promise(resolve => setTimeout(resolve, 500));
    
    return event;
  };

  const handleDeleteEvent = async (eventId: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 500));
  };

  return (
    <div className="h-screen">
      <ChronosProvider 
        initialEvents={EVENTS} 
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
