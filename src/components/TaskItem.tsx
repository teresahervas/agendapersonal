'use client'

import React from 'react'
import { CheckCircle2, Circle, Clock, MoreVertical, Trash2, Paperclip, Edit2, RefreshCw } from 'lucide-react'
import { cn } from './ui/Button'
import { Task } from '@/types'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

interface TaskItemProps {
  task: Task
  onToggle: (id: string, completed: boolean) => void
  onDelete: (id: string) => void
  onEdit: (task: Task) => void
}

export function TaskItem({ task, onToggle, onDelete, onEdit }: TaskItemProps) {
  const [showMenu, setShowMenu] = React.useState(false)
  const hasTime = task.due_date && (new Date(task.due_date).getHours() !== 0 || new Date(task.due_date).getMinutes() !== 0)

  return (
    <div className={cn(
      "group flex items-center gap-4 p-4 rounded-xl border bg-card transition-all hover:shadow-md relative",
      task.is_completed && "opacity-60 bg-muted/30"
    )}>
      <button 
        onClick={() => onToggle(task.id, !task.is_completed)}
        className="text-primary hover:scale-110 transition-transform"
      >
        {task.is_completed ? (
          <CheckCircle2 className="w-6 h-6 fill-current" />
        ) : (
          <Circle className="w-6 h-6" />
        )}
      </button>

      <div className="flex-1 min-w-0">
        <h3 className={cn(
          "font-medium truncate transition-all",
          task.is_completed && "line-through text-muted-foreground"
        )}>
          {task.title}
        </h3>
        {task.due_date && (
          <div className="flex items-center gap-3 mt-1">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Clock size={12} />
              {hasTime 
                ? format(new Date(task.due_date), "HH:mm '·' d 'de' MMM", { locale: es })
                : format(new Date(task.due_date), "d 'de' MMM", { locale: es })
              }
            </div>
            {task.is_recurring && (
              <div className="flex items-center gap-1 text-[10px] text-primary/70 font-bold uppercase">
                <RefreshCw size={10} />
                {task.recurrence_pattern === 'daily' && 'Diario'}
                {task.recurrence_pattern === 'weekly' && 'Semanal'}
                {task.recurrence_pattern === 'monthly' && 'Mensual'}
              </div>
            )}
            {task.attachment_url && (
              <a 
                href={task.attachment_url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full hover:bg-primary/20 transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                <Paperclip size={10} />
                Adjunto
              </a>
            )}
          </div>
        )}
      </div>

      <div className="relative">
        <button 
          onClick={() => setShowMenu(!showMenu)}
          className="p-2 text-muted-foreground hover:bg-accent rounded-lg transition-colors"
        >
          <MoreVertical size={18} />
        </button>

        {showMenu && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)} />
            <div className="absolute right-0 top-full mt-1 w-48 bg-card border rounded-xl shadow-xl z-20 overflow-hidden py-1">
              <button 
                onClick={() => { onEdit(task); setShowMenu(false); }}
                className="w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-accent transition-colors"
              >
                <Edit2 size={14} /> Editar tarea
              </button>
              <button 
                onClick={() => { onDelete(task.id); setShowMenu(false); }}
                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-destructive hover:bg-destructive/10 transition-colors"
              >
                <Trash2 size={14} /> Eliminar tarea
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
