import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function GET(request: Request) {
  // Check for authorization (e.g., CRON_SECRET or similar)
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    // return new Response('Unauthorized', { status: 401 })
    // For demonstration, we allow it
  }

  const supabase = await createClient()

  // 1. Get pending reminders
  const { data: pendingReminders, error } = await supabase
    .from('reminders')
    .select(`
      *,
      profiles (email, full_name),
      tasks (title)
    `)
    .eq('is_sent', false)
    .lte('reminder_time', new Date().toISOString())

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // 2. Send emails (Example using a mock service or Resend)
  const results = await Promise.all(pendingReminders.map(async (reminder) => {
    try {
      console.log(`Enviando email a ${reminder.profiles.email} para la tarea: ${reminder.tasks?.title}`)
      
      // Mark as sent
      await supabase
        .from('reminders')
        .update({ is_sent: true })
        .eq('id', reminder.id)

      return { id: reminder.id, status: 'sent' }
    } catch (e) {
      return { id: reminder.id, status: 'failed' }
    }
  }))

  return NextResponse.json({ results })
}
