'use client'

import React, { useState, useEffect } from 'react'
import { X, Calendar as CalendarIcon, Clock, Type, AlignLeft, Upload, RefreshCw } from 'lucide-react'
import { Button, cn } from './ui/Button'
import { motion, AnimatePresence } from 'framer-motion'
import { Task } from '@/types'

import { FileUploader } from './FileUploader'

interface TaskModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (task: { title: string, due_date: string | null, description: string, attachment_url?: string }) => void
  task?: Task | null
}

export function TaskModal({ isOpen, onClose, onSave, task }: TaskModalProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [time, setTime] = useState('12:00')
  const [includeTime, setIncludeTime] = useState(false)
  const [attachmentUrl, setAttachmentUrl] = useState<string | undefined>()
  const [isRecurring, setIsRecurring] = useState(false)
  const [recurrencePattern, setRecurrencePattern] = useState<'daily' | 'weekly' | 'monthly'>('daily')
  const [recurrenceEndDate, setRecurrenceEndDate] = useState<string>('')

  useEffect(() => {
    if (task) {
      setTitle(task.title || '')
      setDescription(task.description || '')
      if (task.due_date) {
        const d = new Date(task.due_date)
        setDate(d.toISOString().split('T')[0])
        const hours = d.getHours().toString().padStart(2, '0')
        const mins = d.getMinutes().toString().padStart(2, '0')
        setTime(`${hours}:${mins}`)
        setIncludeTime(hours !== '00' || mins !== '00')
      }
      setAttachmentUrl(task.attachment_url || undefined)
      setIsRecurring(task.is_recurring || false)
      setRecurrencePattern(task.recurrence_pattern || 'daily')
      setRecurrenceEndDate(task.recurrence_end_date || '')
    } else {
      setTitle('')
      setDescription('')
      setDate(new Date().toISOString().split('T')[0])
      setTime('12:00')
      setIncludeTime(false)
      setAttachmentUrl(undefined)
      setIsRecurring(false)
      setRecurrencePattern('daily')
      setRecurrenceEndDate('')
    }
  }, [task, isOpen])

  const handleSave = () => {
    if (!title) return
    const due_date = date 
      ? (includeTime ? new Date(`${date}T${time}`).toISOString() : new Date(`${date}T00:00:00`).toISOString()) 
      : null
    onSave({ 
      title, 
      due_date, 
      description, 
      attachment_url: attachmentUrl,
      is_recurring: isRecurring,
      recurrence_pattern: isRecurring ? recurrencePattern : null,
      recurrence_end_date: isRecurring && recurrenceEndDate ? recurrenceEndDate : null
    })
    setTitle('')
    setDescription('')
    setAttachmentUrl(undefined)
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-card w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden border"
            >
              {/* Header */}
              <div className="px-6 py-4 border-b flex items-center justify-between bg-muted/30">
                <h2 className="text-xl font-bold">Nueva Tarea</h2>
                <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
                  <X size={20} />
                </Button>
              </div>

              {/* Form */}
              <div className="p-6 space-y-6">
                {/* Title */}
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                    <Type size={14} /> Título
                  </label>
                  <input 
                    autoFocus
                    className="w-full bg-muted/50 border rounded-2xl p-4 text-lg focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                    placeholder="¿Qué hay que hacer?"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>

                {/* Date & Time */}
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                        <CalendarIcon size={14} /> Fecha
                      </label>
                      <input 
                        type="date"
                        className="w-full bg-muted/50 border rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                      />
                    </div>
                    <div className={cn("space-y-2 transition-opacity", !includeTime && "opacity-50")}>
                      <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                        <Clock size={14} /> Hora
                      </label>
                      <input 
                        type="time"
                        disabled={!includeTime}
                        className="w-full bg-muted/50 border rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 cursor-pointer" onClick={() => setIncludeTime(!includeTime)}>
                    <div className={cn(
                      "w-10 h-5 rounded-full relative transition-colors",
                      includeTime ? "bg-primary" : "bg-muted"
                    )}>
                      <div className={cn(
                        "absolute top-1 left-1 w-3 h-3 rounded-full bg-white transition-transform",
                        includeTime && "translate-x-5"
                      )} />
                    </div>
                    <span className="text-sm font-medium">Incluir hora específica</span>
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                    <AlignLeft size={14} /> Notas adicionales
                  </label>
                  <textarea 
                    className="w-full bg-muted/50 border rounded-xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all h-24 resize-none"
                    placeholder="Detalles de la tarea..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>

                {/* Attachments */}
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                    <Upload size={14} /> Adjuntos
                  </label>
                  <FileUploader onUpload={setAttachmentUrl} />
                </div>

                {/* Recurrence */}
                <div className="space-y-4 pt-4 border-t">
                  <div className="flex items-center gap-2 cursor-pointer" onClick={() => setIsRecurring(!isRecurring)}>
                    <div className={cn(
                      "w-10 h-5 rounded-full relative transition-colors",
                      isRecurring ? "bg-primary" : "bg-muted"
                    )}>
                      <div className={cn(
                        "absolute top-1 left-1 w-3 h-3 rounded-full bg-white transition-transform",
                        isRecurring && "translate-x-5"
                      )} />
                    </div>
                    <span className="text-sm font-medium flex items-center gap-2">
                      <RefreshCw size={14} /> Repetir tarea
                    </span>
                  </div>

                  {isRecurring && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      className="space-y-4 overflow-hidden"
                    >
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Frecuencia</label>
                          <select 
                            className="w-full bg-muted/50 border rounded-xl p-2 text-sm focus:outline-none"
                            value={recurrencePattern}
                            onChange={(e) => setRecurrencePattern(e.target.value as any)}
                          >
                            <option value="daily">Diariamente</option>
                            <option value="weekly">Semanalmente</option>
                            <option value="monthly">Mensualmente</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Fecha Fin (Opcional)</label>
                          <input 
                            type="date"
                            className="w-full bg-muted/50 border rounded-xl p-2 text-sm focus:outline-none"
                            value={recurrenceEndDate}
                            onChange={(e) => setRecurrenceEndDate(e.target.value)}
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>

              {/* Footer */}
              <div className="p-6 bg-muted/30 border-t flex items-center justify-end gap-3">
                <Button variant="ghost" onClick={onClose}>Cancelar</Button>
                <Button onClick={handleSave} className="px-8 shadow-lg shadow-primary/20">
                  Guardar Tarea
                </Button>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
