import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AppState {
  theme: 'light' | 'dark'
  primaryColor: string
  selectedDate: Date
  viewMode: 'day' | 'week'
  setTheme: (theme: 'light' | 'dark') => void
  setPrimaryColor: (color: string) => void
  setSelectedDate: (date: Date) => void
  setViewMode: (mode: 'day' | 'week') => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      theme: 'light',
      primaryColor: '#3b82f6',
      selectedDate: new Date(),
      viewMode: 'day',
      setTheme: (theme) => set({ theme }),
      setPrimaryColor: (primaryColor) => set({ primaryColor }),
      setSelectedDate: (selectedDate) => set({ selectedDate }),
      setViewMode: (viewMode) => set({ viewMode }),
    }),
    {
      name: 'agenda-storage',
    }
  )
)
