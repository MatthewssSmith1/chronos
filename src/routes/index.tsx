import { Chronos, ChronosProvider } from '@/components/ui/chronos/chronos'
import { EVENTS, CATEGORIES } from '@/lib/exampleData'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: HomeComponent,
})

function HomeComponent() {
  return (
    <div className="h-screen">
      <ChronosProvider events={EVENTS} categories={CATEGORIES}>
        <Chronos />
      </ChronosProvider>
    </div>
  )
}
