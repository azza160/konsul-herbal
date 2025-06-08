import { createContext, useContext } from 'react'

const SidebarContext = createContext()

export function SidebarProvider({ children, sidebarOpen, isMobile }) {
  return (
    <SidebarContext.Provider value={{ sidebarOpen, isMobile }}>
      {children}
    </SidebarContext.Provider>
  )
}

export function useSidebar() {
  const context = useContext(SidebarContext)
  if (context === undefined) {
    throw new Error('useSidebar must be used within a SidebarProvider')
  }
  return context
} 