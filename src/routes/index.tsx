import { Chronos, ChronosEvent, ChronosProvider } from '@/components/ui/chronos/chronos'
import { EVENTS, CATEGORIES } from '@/lib/exampleData'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: HomeComponent,
})

function HomeComponent() {
    // placeholder for API calls
  const handleCreateEvent = async (event: ChronosEvent): Promise<ChronosEvent> => {
    console.log("Create event:", event);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Simulate returning an event with a server-generated ID
    return { ...event, id: `server-${Date.now()}` };
  };

  const handleEditEvent = async (event: ChronosEvent): Promise<ChronosEvent> => {
    console.log("Edit event:", event);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Simulate returning the updated event with a modified title
    return { ...event, title: `${event.title} (updated)` };
  };

  const handleDeleteEvent = async (eventId: string): Promise<void> => {
    console.log("Delete event:", eventId);
    
    // Simulate API call delay
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
