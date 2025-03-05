import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarInset, SidebarMenu, SidebarMenuItem, SidebarProvider, SidebarRail } from '@/components/ui/sidebar'
import { Link, Outlet, createRootRoute } from '@tanstack/react-router'
import { ThemeProvider } from '@/components/theme-provider'
import { ThemeToggle } from '@/components/theme-toggle'

export const Route = createRootRoute({
  component: RootComponent,
})

function RootComponent() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <SidebarProvider defaultOpen={false}>
        <Sidebar>
          <SidebarHeader>
          </SidebarHeader>
          <SidebarContent className="p-3">
            <SidebarMenu>
              <SidebarMenuItem><Link to="/">Home</Link></SidebarMenuItem>
              <SidebarMenuItem><Link to="/about">About</Link></SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter>
            <ThemeToggle />
          </SidebarFooter>
          <SidebarRail />
        </Sidebar>
        <SidebarInset><Outlet /></SidebarInset>
      </SidebarProvider>
    </ThemeProvider>
  )
}
