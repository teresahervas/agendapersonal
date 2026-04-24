'use client'

import React, { useState } from 'react'
import { Search as SearchIcon, CheckSquare, StickyNote, ArrowRight, X } from 'lucide-react'
import { Button, cn } from '@/components/ui/Button'
import { useRouter } from 'next/navigation'

export default function SearchPage() {
  const [query, setQuery] = useState('')
  const router = useRouter()

  const mockResults = [
    { id: '1', type: 'task', title: 'Reunión de equipo', date: 'Hoy', href: '/' },
    { id: '2', type: 'note', title: 'Ideas de proyecto', date: 'Ayer', href: '/notes' },
    { id: '3', type: 'task', title: 'Enviar reporte', date: 'Mañana', href: '/' },
  ].filter(r => r.title.toLowerCase().includes(query.toLowerCase()))

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Búsqueda Global</h1>
        <p className="text-muted-foreground mt-1">Encuentra cualquier tarea o nota al instante</p>
      </div>

      {/* Search Bar */}
      <div className="relative group">
        <SearchIcon className={cn(
          "absolute left-6 top-1/2 -translate-y-1/2 transition-colors",
          query ? "text-primary" : "text-muted-foreground"
        )} size={24} />
        <input 
          autoFocus
          className="w-full bg-card border-2 rounded-3xl py-6 pl-16 pr-16 text-xl focus:outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all shadow-lg"
          placeholder="¿Qué estás buscando?"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        {query && (
          <button 
            onClick={() => setQuery('')}
            className="absolute right-6 top-1/2 -translate-y-1/2 p-2 hover:bg-muted rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        )}
      </div>

      {/* Results */}
      <div className="space-y-4">
        {query ? (
          <>
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider px-2">
              Resultados ({mockResults.length})
            </h2>
            <div className="grid gap-3">
              {mockResults.map((result) => (
                <button
                  key={`${result.type}-${result.id}`}
                  onClick={() => router.push(result.href)}
                  className="w-full bg-card border rounded-2xl p-4 flex items-center justify-between hover:border-primary/50 hover:shadow-md transition-all group"
                >
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      "p-3 rounded-xl",
                      result.type === 'task' ? "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400" : "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400"
                    )}>
                      {result.type === 'task' ? <CheckSquare size={20} /> : <StickyNote size={20} />}
                    </div>
                    <div className="text-left">
                      <p className="font-semibold">{result.title}</p>
                      <p className="text-xs text-muted-foreground uppercase">{result.type} · {result.date}</p>
                    </div>
                  </div>
                  <ArrowRight size={20} className="text-muted-foreground opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                </button>
              ))}
              {mockResults.length === 0 && (
                <div className="text-center py-20 bg-muted/20 border-2 border-dashed rounded-3xl">
                  <p className="text-muted-foreground">No se encontraron resultados para "{query}"</p>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-muted-foreground gap-4">
            <SearchIcon size={64} className="opacity-10" />
            <p>Escribe algo para empezar a buscar...</p>
          </div>
        )}
      </div>

      {/* Shortcuts or suggestions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-8">
        <div className="p-6 bg-primary/5 border border-primary/10 rounded-2xl">
          <h3 className="font-semibold mb-2">Búsqueda Rápida</h3>
          <p className="text-sm text-muted-foreground">Utiliza palabras clave para filtrar mejor tus resultados en tareas y notas.</p>
        </div>
        <div className="p-6 bg-accent/50 border rounded-2xl">
          <h3 className="font-semibold mb-2">Sincronización</h3>
          <p className="text-sm text-muted-foreground">Toda tu información está indexada y disponible en tiempo real.</p>
        </div>
      </div>
    </div>
  )
}
