'use client'

import React, { useState } from 'react'
import { Plus, ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react'
import { Button, cn } from '@/components/ui/Button'
import { TaskItem } from '@/components/TaskItem'
import { format, addDays, subDays, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay } from 'date-fns'
import { es } from 'date-fns/locale'
import { useAppStore } from '@/store/useAppStore'
import { motion, AnimatePresence } from 'framer-motion'
import { useTasks } from '@/hooks/useTasks'
import { TaskModal } from '@/components/TaskModal'
import { WeekPlanner } from '@/components/WeekPlanner'
import { Task } from '@/types'

export default function AgendaPage() {
  const { selectedDate: storeDate, setSelectedDate, viewMode, setViewMode } = useAppStore()
  const selectedDate = storeDate instanceof Date ? storeDate : new Date(storeDate)
  const { tasks, loading, addTask, toggleTask, deleteTask, updateTask } = useTasks()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)

  const handleSaveTask = async (taskData: any) => {
    if (editingTask) {
      await updateTask(editingTask.id, taskData)
    } else {
      await addTask(taskData)
    }
    setEditingTask(null)
  }

  const handleEditTask = (task: Task) => {
    setEditingTask(task)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingTask(null)
  }

  const navigateDate = (direction: 'prev' | 'next') => {
    const amount = viewMode === 'day' ? 1 : 7
    setSelectedDate(direction === 'next' ? addDays(selectedDate, amount) : subDays(selectedDate, amount))
  }

  const days = viewMode === 'week' 
    ? eachDayOfInterval({ start: startOfWeek(selectedDate, { weekStartsOn: 1 }), end: endOfWeek(selectedDate, { weekStartsOn: 1 }) })
    : [selectedDate]

  const isTaskVisibleOnDay = (task: Task, day: Date) => {
    if (!task.due_date) return false
    const taskDate = new Date(task.due_date)
    if (isSameDay(taskDate, day)) return true
    
    if (!task.is_recurring) return false
    if (taskDate > day) return false 
    if (task.recurrence_end_date && new Date(task.recurrence_end_date) < day) return false 
    
    if (task.recurrence_pattern === 'daily') return true
    if (task.recurrence_pattern === 'weekly') return taskDate.getDay() === day.getDay()
    if (task.recurrence_pattern === 'monthly') return taskDate.getDate() === day.getDate()
    
    return false
  }

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
        <Button 
          onClick={() => setIsModalOpen(true)}
          className="gap-2 shadow-lg hover:scale-105 transition-transform"
        >
          <Plus size={20} />
          Nueva Tarea
        </Button>
      </div>

      {/* Content */}
      <div className="grid gap-6">
        {loading ? (
          <div className="text-center py-20">Cargando tareas...</div>
        ) : viewMode === 'week' ? (
          <WeekPlanner 
            selectedDate={selectedDate}
            tasks={tasks}
            onToggle={toggleTask}
            onDelete={deleteTask}
            onEdit={handleEditTask}
          />
        ) : (
          days.map((day) => (
            <div key={day.toISOString()} className="space-y-4">
              <div className="space-y-3">
                <AnimatePresence mode="popLayout">
                  {tasks
                    .filter(t => isTaskVisibleOnDay(t, day))
                    .map((task) => (
                      <motion.div
                        key={`${task.id}-${day.toISOString()}`}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                      >
                        <TaskItem 
                          task={task} 
                          onToggle={toggleTask} 
                          onDelete={deleteTask} 
                          onEdit={handleEditTask}
                        />
                      </motion.div>
                  ))}
                </AnimatePresence>

                {tasks.filter(t => isTaskVisibleOnDay(t, day)).length === 0 && (
                  <div className="text-center py-12 border-2 border-dashed rounded-2xl text-muted-foreground">
                    <p>No hay tareas para este día</p>
                    <Button variant="link" onClick={() => setIsModalOpen(true)} className="mt-2 text-primary">
                      Crear una ahora
                    </Button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      <TaskModal 
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveTask}
        task={editingTask}
      />
    </div>
  )
}
