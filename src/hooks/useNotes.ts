import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Note } from '@/types'

export function useNotes() {
  const [notes, setNotes] = useState<Note[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    fetchNotes()
  }, [])

  async function fetchNotes() {
    setLoading(true)
    const { data, error } = await supabase
      .from('notes')
      .select('*')
      .order('updated_at', { ascending: false })

    if (!error && data) {
      setNotes(data)
    }
    setLoading(false)
  }

  async function addNote() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data, error } = await supabase
      .from('notes')
      .insert([{ title: 'Nueva nota', content: '', user_id: user.id }])
      .select()
      .single()

    if (!error && data) {
      setNotes([data, ...notes])
      return data
    }
  }

  async function updateNote(id: string, updates: Partial<Note>) {
    const { error } = await supabase
      .from('notes')
      .update(updates)
      .eq('id', id)

    if (!error) {
      setNotes(notes.map(n => n.id === id ? { ...n, ...updates } : n))
    }
  }

  async function deleteNote(id: string) {
    const { error } = await supabase
      .from('notes')
      .delete()
      .eq('id', id)

    if (!error) {
      setNotes(notes.filter(n => n.id !== id))
    }
  }

  return { notes, loading, addNote, updateNote, deleteNote, refresh: fetchNotes }
}
