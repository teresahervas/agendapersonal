import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Task } from '@/types'

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    fetchTasks()
  }, [])

  async function fetchTasks() {
    setLoading(true)
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .order('due_date', { ascending: true })

    if (!error && data) {
      setTasks(data)
    }
    setLoading(false)
  }

  async function addTask(task: Partial<Task>) {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data, error } = await supabase
      .from('tasks')
      .insert([{ ...task, user_id: user.id }])
      .select()
      .single()

    if (!error && data) {
      setTasks([...tasks, data])
    }
  }

  async function toggleTask(id: string, is_completed: boolean) {
    const { error } = await supabase
      .from('tasks')
      .update({ is_completed })
      .eq('id', id)

    if (!error) {
      setTasks(tasks.map(t => t.id === id ? { ...t, is_completed } : t))
    }
  }

  async function deleteTask(id: string) {
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', id)

    if (!error) {
      setTasks(tasks.filter(t => t.id !== id))
    }
  }

  return { tasks, loading, addTask, toggleTask, deleteTask, refresh: fetchTasks }
}
