'use client'

import React, { useState } from 'react'
import { ChevronLeft, ChevronRight, Info } from 'lucide-react'
import { Button, cn } from '@/components/ui/Button'
import { format, startOfYear, endOfYear, eachMonthOfInterval, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addYears, subYears } from 'date-fns'
import { es } from 'date-fns/locale'
import { motion } from 'framer-motion'
import { useAppStore } from '@/store/useAppStore'
import { useRouter } from 'next/navigation'

export default function CalendarPage() {
  const [currentYear, setCurrentYear] = useState(new Date())
  const { setSelectedDate } = useAppStore()
  const router = useRouter()

  const months = eachMonthOfInterval({
    start: startOfYear(currentYear),
    end: endOfYear(currentYear)
  })

  const navigateYear = (direction: 'prev' | 'next') => {
    setCurrentYear(direction === 'next' ? addYears(currentYear, 1) : subYears(currentYear, 1))
  }

  const handleDayClick = (day: Date) => {
    setSelectedDate(day)
    router.push('/')
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Vista Anual</h1>
          <p className="text-muted-foreground mt-1">Explora tu agenda a largo plazo</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={() => navigateYear('prev')}>
              <ChevronLeft size={20} />
            </Button>
            <h2 className="text-2xl font-bold min-w-[100px] text-center">
              {format(currentYear, 'yyyy')}
            </h2>
            <Button variant="outline" size="icon" onClick={() => navigateYear('next')}>
              <ChevronRight size={20} />
            </Button>
          </div>
          <Button variant="outline" onClick={() => setCurrentYear(new Date())}>
            Este año
          </Button>
        </div>
      </div>

      {/* Yearly Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {months.map((month) => (
          <div key={month.toISOString()} className="space-y-3">
            <h3 className="font-semibold text-lg capitalize px-2">
              {format(month, 'MMMM', { locale: es })}
            </h3>
            <div className="grid grid-cols-7 gap-1 text-[10px] text-center text-muted-foreground font-medium mb-1">
              {['L', 'M', 'X', 'J', 'V', 'S', 'D'].map(d => <div key={d}>{d}</div>)}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {/* Empty spaces for start of month */}
              {Array.from({ length: (startOfMonth(month).getDay() + 6) % 7 }).map((_, i) => (
                <div key={`empty-${i}`} />
              ))}
              
              {eachDayOfInterval({
                start: startOfMonth(month),
                end: endOfMonth(month)
              }).map((day) => {
                const isToday = isSameDay(day, new Date())
                return (
                  <button
                    key={day.toISOString()}
                    onClick={() => handleDayClick(day)}
                    className={cn(
                      "aspect-square flex items-center justify-center text-xs rounded-lg transition-all relative group",
                      isToday 
                        ? "bg-primary text-primary-foreground font-bold shadow-sm" 
                        : "hover:bg-accent text-foreground"
                    )}
                  >
                    {format(day, 'd')}
                    {/* Mock indicator for annotations */}
                    {Math.random() > 0.8 && !isToday && (
                      <div className="absolute bottom-1 w-1 h-1 rounded-full bg-primary" />
                    )}
                  </button>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="p-4 bg-muted/50 rounded-2xl flex items-center gap-3 text-sm text-muted-foreground border">
        <Info size={18} className="text-primary" />
        <p>Haz clic en cualquier día para ver las tareas programadas o añadir nuevas anotaciones.</p>
      </div>
    </div>
  )
}
