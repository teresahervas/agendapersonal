'use client'

import React from 'react'
import { Moon, Sun, Palette, User, Bell, Shield, ChevronRight } from 'lucide-react'
import { Button, cn } from '@/components/ui/Button'
import { useAppStore } from '@/store/useAppStore'
import { createClient } from '@/utils/supabase/client'

const colors = [
  { name: 'Azul', value: '#3b82f6' },
  { name: 'Violeta', value: '#8b5cf6' },
  { name: 'Rosa', value: '#ec4899' },
  { name: 'Rojo', value: '#ef4444' },
  { name: 'Naranja', value: '#f97316' },
  { name: 'Esmeralda', value: '#10b981' },
]

export default function SettingsPage() {
  const { theme, setTheme, primaryColor, setPrimaryColor } = useAppStore()
  const supabase = createClient()

  const updateProfile = async (updates: any) => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    await supabase
      .from('profiles')
      .update(updates)
      .eq('id', user.id)
  }

  const handleSetTheme = (newTheme: 'light' | 'dark') => {
    setTheme(newTheme)
    updateProfile({ theme: newTheme })
  }

  const handleSetColor = (color: string) => {
    setPrimaryColor(color)
    updateProfile({ primary_color: color })
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8 pb-12">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Ajustes</h1>
        <p className="text-muted-foreground mt-1">Personaliza tu experiencia de agenda</p>
      </div>

      {/* Profile Section */}
      <section className="bg-card border rounded-3xl p-6 shadow-sm">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary text-2xl font-bold">
            T
          </div>
          <div>
            <h2 className="text-xl font-bold">Tere</h2>
            <p className="text-sm text-muted-foreground">teresa.hervas@gmail.com</p>
          </div>
          <Button variant="outline" size="sm" className="ml-auto">Editar Perfil</Button>
        </div>
      </section>

      {/* Appearance */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 text-lg font-semibold">
          <Palette size={20} className="text-primary" />
          <h2>Apariencia</h2>
        </div>
        
        <div className="bg-card border rounded-3xl divide-y shadow-sm">
          {/* Theme */}
          <div className="p-6 flex items-center justify-between">
            <div className="space-y-0.5">
              <p className="font-medium">Modo Oscuro</p>
              <p className="text-sm text-muted-foreground">Cambia entre tema claro y oscuro</p>
            </div>
            <div className="flex items-center gap-1 bg-muted p-1 rounded-xl">
              <button 
                onClick={() => handleSetTheme('light')}
                className={cn(
                  "p-2 rounded-lg transition-all",
                  theme === 'light' ? "bg-background shadow-sm text-primary" : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Sun size={20} />
              </button>
              <button 
                onClick={() => handleSetTheme('dark')}
                className={cn(
                  "p-2 rounded-lg transition-all",
                  theme === 'dark' ? "bg-background shadow-sm text-primary" : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Moon size={20} />
              </button>
            </div>
          </div>

          {/* Primary Color */}
          <div className="p-6">
            <div className="space-y-0.5 mb-4">
              <p className="font-medium">Color Principal</p>
              <p className="text-sm text-muted-foreground">Elige el color de acento de la aplicación</p>
            </div>
            <div className="flex flex-wrap gap-3">
              {colors.map((color) => (
                <button
                  key={color.value}
                  onClick={() => handleSetColor(color.value)}
                  className={cn(
                    "w-10 h-10 rounded-full border-4 transition-all hover:scale-110",
                    primaryColor === color.value ? "border-primary-foreground ring-2 ring-primary" : "border-transparent"
                  )}
                  style={{ backgroundColor: color.value }}
                  title={color.name}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Other Settings */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 text-lg font-semibold">
          <Bell size={20} className="text-primary" />
          <h2>Notificaciones</h2>
        </div>
        <div className="bg-card border rounded-3xl shadow-sm overflow-hidden">
          <button className="w-full p-6 flex items-center justify-between hover:bg-muted/30 transition-colors">
            <div className="flex items-center gap-4 text-left">
              <div className="p-2 bg-muted rounded-lg text-muted-foreground">
                <Shield size={20} />
              </div>
              <div>
                <p className="font-medium">Privacidad y Seguridad</p>
                <p className="text-sm text-muted-foreground">Gestiona tus datos y sesiones</p>
              </div>
            </div>
            <ChevronRight size={20} className="text-muted-foreground" />
          </button>
        </div>
      </section>

      <div className="pt-4 text-center">
        <p className="text-xs text-muted-foreground">Versión 1.0.0 · © 2026 Agenda Personal</p>
      </div>
    </div>
  )
}
