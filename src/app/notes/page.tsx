'use client'

import React, { useState } from 'react'
import { Plus, Search, Trash2, StickyNote, Save, Edit3 } from 'lucide-react'
import { Button, cn } from '@/components/ui/Button'
import { Note } from '@/types'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

export default function NotesPage() {
  const [notes, setNotes] = useState<Note[]>([
    { id: '1', title: 'Ideas de proyecto', content: 'Contenido de la nota 1...', user_id: '1', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    { id: '2', title: 'Lista de la compra', content: 'Leche, huevos, pan...', user_id: '1', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  ])
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>('1')
  const [searchQuery, setSearchQuery] = useState('')

  const selectedNote = notes.find(n => n.id === selectedNoteId)

  const handleAddNote = () => {
    const newNote: Note = {
      id: Math.random().toString(36).substr(2, 9),
      title: 'Nueva nota',
      content: '',
      user_id: '1',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
    setNotes([newNote, ...notes])
    setSelectedNoteId(newNote.id)
  }

  const handleUpdateNote = (id: string, updates: Partial<Note>) => {
    setNotes(notes.map(n => n.id === id ? { ...n, ...updates, updated_at: new Date().toISOString() } : n))
  }

  const handleDeleteNote = (id: string) => {
    setNotes(notes.filter(n => n.id !== id))
    if (selectedNoteId === id) setSelectedNoteId(notes.find(n => n.id !== id)?.id || null)
  }

  const filteredNotes = notes.filter(n => 
    n.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    n.content?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="flex h-[calc(100vh-4rem)] gap-8">
      {/* Notes Sidebar */}
      <div className="w-80 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Notas</h1>
          <Button size="icon" onClick={handleAddNote} className="rounded-full shadow-lg">
            <Plus size={20} />
          </Button>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
          <input 
            className="w-full bg-muted/50 border rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
            placeholder="Buscar notas..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex-1 overflow-y-auto space-y-2 pr-2">
          {filteredNotes.map((note) => (
            <button
              key={note.id}
              onClick={() => setSelectedNoteId(note.id)}
              className={cn(
                "w-full text-left p-4 rounded-2xl border transition-all hover:shadow-sm group",
                selectedNoteId === note.id 
                  ? "bg-primary/5 border-primary ring-1 ring-primary/20" 
                  : "bg-card hover:bg-muted/30"
              )}
            >
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-semibold text-sm truncate">{note.title}</h3>
                <span className="text-[10px] text-muted-foreground whitespace-nowrap mt-1">
                  {format(new Date(note.updated_at), 'd MMM', { locale: es })}
                </span>
              </div>
              <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                {note.content || 'Sin contenido'}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Note Editor */}
      <div className="flex-1 bg-card border rounded-3xl overflow-hidden flex flex-col shadow-sm">
        {selectedNote ? (
          <>
            <div className="p-6 border-b flex items-center justify-between bg-muted/10">
              <div className="flex items-center gap-3 flex-1">
                <div className="p-2 bg-primary/10 text-primary rounded-lg">
                  <StickyNote size={20} />
                </div>
                <input 
                  className="bg-transparent text-xl font-bold focus:outline-none flex-1"
                  value={selectedNote.title}
                  onChange={(e) => handleUpdateNote(selectedNote.id, { title: e.target.value })}
                  placeholder="Título de la nota"
                />
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" onClick={() => handleDeleteNote(selectedNote.id)} className="text-destructive">
                  <Trash2 size={18} />
                </Button>
                <Button variant="outline" size="sm" className="gap-2">
                  <Save size={16} />
                  Guardado
                </Button>
              </div>
            </div>
            <textarea 
              className="flex-1 p-8 text-lg bg-transparent resize-none focus:outline-none leading-relaxed"
              placeholder="Empieza a escribir..."
              value={selectedNote.content || ''}
              onChange={(e) => handleUpdateNote(selectedNote.id, { content: e.target.value })}
            />
            <div className="px-8 py-4 border-t bg-muted/5 flex items-center justify-between text-[10px] text-muted-foreground uppercase tracking-widest font-medium">
              <span>Caracteres: {selectedNote.content?.length || 0}</span>
              <span>Última edición: {format(new Date(selectedNote.updated_at), "d 'de' MMMM, HH:mm", { locale: es })}</span>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground gap-4">
            <div className="p-6 bg-muted rounded-full">
              <Edit3 size={48} />
            </div>
            <p>Selecciona una nota para ver su contenido</p>
            <Button onClick={handleAddNote}>Crear mi primera nota</Button>
          </div>
        )}
      </div>
    </div>
  )
}
