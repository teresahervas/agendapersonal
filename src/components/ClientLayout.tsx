'use client'

import React from 'react'
import { usePathname } from 'next/navigation'
import { Sidebar } from "@/components/Sidebar"
import { ThemeProvider } from "@/components/ThemeProvider"

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isLoginPage = pathname === '/login'

  if (isLoginPage) return <ThemeProvider>{children}</ThemeProvider>

  return (
    <ThemeProvider>
      <div className="flex">
        <Sidebar />
        <main className="flex-1 ml-64 min-h-screen p-8 transition-all duration-300">
          {children}
        </main>
      </div>
    </ThemeProvider>
  )
}
