'use client'

import React from 'react'
import { CheckCircle2, Circle, Clock, MoreVertical, Trash2, Paperclip } from 'lucide-react'
import { cn } from './ui/Button'
import { Task } from '@/types'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

interface TaskItemProps {
  task: Task
  onToggle: (id: string, completed: boolean) => void
  onDelete: (id: string) => void
}

export function TaskItem({ task, onToggle, onDelete }: TaskItemProps) {
  return (
    <div className={cn(
      "group flex items-center gap-4 p-4 rounded-xl border bg-card transition-all hover:shadow-md",
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
              {format(new Date(task.due_date), "HH:mm '·' d 'de' MMM", { locale: es })}
            </div>
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

      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button 
          onClick={() => onDelete(task.id)}
          className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
        >
          <Trash2 size={16} />
        </button>
        <button className="p-2 text-muted-foreground hover:bg-accent rounded-lg transition-colors">
          <MoreVertical size={16} />
        </button>
      </div>
    </div>
  )
}
