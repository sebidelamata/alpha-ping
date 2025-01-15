import { SidebarProvider, SidebarTrigger } from "@/components/components/ui/sidebar"
import { DocsSidebar } from "./components/DocsSidebar"
 
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <DocsSidebar />
      <main>
        <SidebarTrigger />
        {children}
      </main>
    </SidebarProvider>
  )
}
