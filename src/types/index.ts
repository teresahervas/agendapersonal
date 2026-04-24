export type Profile = {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  theme: 'light' | 'dark';
  primary_color: string;
  updated_at: string;
};

export type Task = {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  is_completed: boolean;
  due_date: string | null;
  created_at: string;
};

export type Note = {
  id: string;
  user_id: string;
  title: string;
  content: string | null;
  created_at: string;
  updated_at: string;
};

export type Reminder = {
  id: string;
  user_id: string;
  task_id: string | null;
  note_id: string | null;
  reminder_time: string;
  is_sent: boolean;
  created_at: string;
};
