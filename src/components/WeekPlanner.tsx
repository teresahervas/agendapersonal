'use client'

import React from 'react'
import { format, startOfWeek, addDays, isSameDay } from 'date-fns'
import { es } from 'date-fns/locale'
import { cn } from './ui/Button'
import { Task } from '@/types'
import { TaskItem } from './TaskItem'

interface WeekPlannerProps {
  selectedDate: Date
  tasks: Task[]
  onToggle: (id: string, completed: boolean) => void
  onDelete: (id: string) => void
}

export function WeekPlanner({ selectedDate, tasks, onToggle, onDelete }: WeekPlannerProps) {
  const start = startOfWeek(selectedDate, { weekStartsOn: 1 })
  
  // Split into left and right pages (3 days left, 4 days right)
  const leftDays = [0, 1, 2].map(i => addDays(start, i))
  const rightDays = [3, 4, 5, 6].map(i => addDays(start, i))

  const renderPage = (days: Date[]) => (
    <div className="flex-1 min-h-[600px] bg-card border rounded-3xl p-6 shadow-sm relative overflow-hidden">
      {/* Holes or Ring effect */}
      <div className="absolute top-0 bottom-0 left-0 w-8 flex flex-col justify-around items-center py-8 opacity-20 pointer-events-none">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="w-3 h-3 rounded-full bg-foreground border" />
        ))}
      </div>

      <div className="pl-6 space-y-8">
        {days.map((day) => {
          const dayTasks = tasks.filter(t => t.due_date && isSameDay(new Date(t.due_date), day))
          const isToday = isSameDay(day, new Date())
          
          return (
            <div key={day.toISOString()} className="space-y-3">
              <div className={cn(
                "pb-2 border-b-2 flex items-end justify-between",
                isToday ? "border-primary text-primary" : "border-muted text-muted-foreground"
              )}>
                <span className="text-sm font-bold uppercase tracking-widest">
                  {format(day, 'EEEE', { locale: es })}
                </span>
                <span className="text-2xl font-black">
                  {format(day, 'd')}
                </span>
              </div>
              
              <div className="space-y-2 min-h-[60px]">
                {dayTasks.map(task => (
                  <TaskItem 
                    key={task.id} 
                    task={task} 
                    onToggle={onToggle} 
                    onDelete={onDelete} 
                  />
                ))}
                {dayTasks.length === 0 && (
                  <div className="h-full flex items-center text-xs text-muted-foreground/50 italic py-2">
                    Sin tareas...
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )

  return (
    <div className="flex flex-col lg:flex-row gap-4 lg:gap-0 bg-muted/20 p-4 rounded-[40px] border shadow-inner">
      {renderPage(leftDays)}
      {/* Spine */}
      <div className="hidden lg:flex w-12 flex-col justify-around items-center py-12 z-10 -mx-6">
        <div className="w-full h-full border-x-2 border-dashed border-muted-foreground/20 rounded-full bg-muted/50 shadow-inner" />
      </div>
      {renderPage(rightDays)}
    </div>
  )
}
