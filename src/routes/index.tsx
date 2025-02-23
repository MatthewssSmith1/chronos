import { createFileRoute } from '@tanstack/react-router'
import { Chronos, ChronosProvider } from '@/components/ui/chronos'

export const Route = createFileRoute('/')({
  component: HomeComponent,
})

function HomeComponent() {
  return (
    <div className="h-screen">
      <ChronosProvider>
        <Chronos />
      </ChronosProvider>
    </div>
  )
}
