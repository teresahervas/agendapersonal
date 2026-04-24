'use client'

import React, { useState } from 'react'
import { Plus, ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { TaskItem } from '@/components/TaskItem'
import { format, addDays, subDays, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay } from 'date-fns'
import { es } from 'date-fns/locale'
import { useAppStore } from '@/store/useAppStore'
import { motion, AnimatePresence } from 'framer-motion'

export default function AgendaPage() {
  const { selectedDate, setSelectedDate, viewMode, setViewMode } = useAppStore()
  const [tasks, setTasks] = useState([
    { id: '1', title: 'Reunión de equipo', due_date: new Date().toISOString(), is_completed: false, user_id: '1', description: '', created_at: '' },
    { id: '2', title: 'Enviar reporte semanal', due_date: new Date().toISOString(), is_completed: true, user_id: '1', description: '', created_at: '' },
    { id: '3', title: 'Comprar café', due_date: null, is_completed: false, user_id: '1', description: '', created_at: '' },
  ])

  const handleToggleTask = (id: string, completed: boolean) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, is_completed: completed } : t))
  }

  const handleDeleteTask = (id: string) => {
    setTasks(tasks.filter(t => t.id !== id))
  }

  const navigateDate = (direction: 'prev' | 'next') => {
    const amount = viewMode === 'day' ? 1 : 7
    setSelectedDate(direction === 'next' ? addDays(selectedDate, amount) : subDays(selectedDate, amount))
  }

  const days = viewMode === 'week' 
    ? eachDayOfInterval({ start: startOfWeek(selectedDate, { weekStartsOn: 1 }), end: endOfWeek(selectedDate, { weekStartsOn: 1 }) })
    : [selectedDate]

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Mi Agenda</h1>
          <p className="text-muted-foreground mt-1">
            {format(selectedDate, "EEEE, d 'de' MMMM 'de' yyyy", { locale: es })}
          </p>
        </div>
        <div className="flex items-center gap-2 bg-muted p-1 rounded-xl w-fit">
          <Button 
            variant={viewMode === 'day' ? 'default' : 'ghost'} 
            size="sm" 
            onClick={() => setViewMode('day')}
            className="rounded-lg px-6"
          >
            Día
          </Button>
          <Button 
            variant={viewMode === 'week' ? 'default' : 'ghost'} 
            size="sm" 
            onClick={() => setViewMode('week')}
            className="rounded-lg px-6"
          >
            Semana
          </Button>
        </div>
      </div>

      {/* Navigation & Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={() => navigateDate('prev')}>
            <ChevronLeft size={20} />
          </Button>
          <Button variant="outline" className="min-w-[140px]" onClick={() => setSelectedDate(new Date())}>
            Hoy
          </Button>
          <Button variant="outline" size="icon" onClick={() => navigateDate('next')}>
            <ChevronRight size={20} />
          </Button>
        </div>
        <Button className="gap-2 shadow-lg hover:scale-105 transition-transform">
          <Plus size={20} />
          Nueva Tarea
        </Button>
      </div>

      {/* Content */}
      <div className="grid gap-6">
        {days.map((day) => (
          <div key={day.toISOString()} className="space-y-4">
            {viewMode === 'week' && (
              <div className={cn(
                "flex items-center gap-2 text-sm font-semibold sticky top-0 bg-background/80 backdrop-blur-md py-2 z-10",
                isSameDay(day, new Date()) ? "text-primary" : "text-muted-foreground"
              )}>
                <CalendarIcon size={16} />
                {format(day, "EEEE, d 'de' MMM", { locale: es }).toUpperCase()}
              </div>
            )}
            
            <div className="space-y-3">
              <AnimatePresence mode="popLayout">
                {tasks.map((task) => (
                  <motion.div
                    key={task.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                  >
                    <TaskItem 
                      task={task as any} 
                      onToggle={handleToggleTask} 
                      onDelete={handleDeleteTask} 
                    />
                  </motion.div>
                ))}
              </AnimatePresence>

              {tasks.length === 0 && (
                <div className="text-center py-12 border-2 border-dashed rounded-2xl text-muted-foreground">
                  <p>No hay tareas para este día</p>
                  <Button variant="link" className="mt-2 text-primary">
                    Crear una ahora
                  </Button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
