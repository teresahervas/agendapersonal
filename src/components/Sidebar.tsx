'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  Calendar, 
  LayoutDashboard, 
  StickyNote, 
  Settings, 
  Search,
  CheckSquare,
  LogOut
} from 'lucide-react'
import { cn } from './ui/Button'

const navItems = [
  { name: 'Agenda', href: '/', icon: LayoutDashboard },
  { name: 'Calendario', href: '/calendar', icon: Calendar },
  { name: 'Notas', href: '/notes', icon: StickyNote },
  { name: 'Búsqueda', href: '/search', icon: Search },
  { name: 'Ajustes', href: '/settings', icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 h-screen border-r bg-card flex flex-col fixed left-0 top-0 transition-all duration-300">
      <div className="p-6 flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground">
          <CheckSquare size={20} />
        </div>
        <h1 className="text-xl font-bold tracking-tight">Agenda</h1>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all",
                isActive 
                  ? "bg-primary text-primary-foreground shadow-md" 
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              <item.icon size={18} />
              {item.name}
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t">
        <button 
          className="flex items-center gap-3 px-3 py-2 w-full rounded-lg text-sm font-medium text-destructive hover:bg-destructive/10 transition-all"
          onClick={() => {/* TODO: Sign out */}}
        >
          <LogOut size={18} />
          Cerrar sesión
        </button>
      </div>
    </aside>
  )
}
