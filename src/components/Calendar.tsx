import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { format, addMonths, subMonths, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, isSameMonth, isSameDay, isToday, getDay } from 'date-fns'
import { ChevronLeft, ChevronRight, Users, MapPin, Clock } from 'lucide-react'
import { useEvents } from '../hooks/useEvents'
import { EventDetail } from './EventDetail'

export function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const { events } = useEvents()

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => direction === 'next' ? addMonths(prev, 1) : subMonths(prev, 1))
  }

  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(monthStart)
  const startDate = startOfWeek(monthStart, { weekStartsOn: 0 })
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 0 })

  const dateFormat = "d"
  const rows = []
  let days = []
  let day = startDate

  while (day <= endDate) {
    for (let i = 0; i < 7; i++) {
      const cloneDay = day
      const dayEvents = events.filter(event => isSameDay(new Date(event.event_date), day))
      const isCurrentMonth = isSameMonth(day, monthStart)
      const isFridayOrSaturday = getDay(day) === 5 || getDay(day) === 6
      const hasEvents = dayEvents.length > 0

      days.push(
        <motion.div
          key={day.toString()}
          className={`min-h-[80px] border border-gray-100 p-2 cursor-pointer transition-all ${
            !isCurrentMonth ? 'bg-gray-50 text-gray-400' : 'bg-white hover:bg-gray-50'
          } ${isToday(cloneDay) ? 'bg-orange-50 border-orange-200' : ''}`}
          onClick={() => hasEvents && setSelectedDate(cloneDay)}
          whileHover={hasEvents ? { scale: 1.02 } : {}}
          whileTap={hasEvents ? { scale: 0.98 } : {}}
        >
          <div className={`text-sm font-medium mb-1 ${
            isToday(cloneDay) ? 'text-orange-600' : 
            !isCurrentMonth ? 'text-gray-400' : 'text-gray-900'
          }`}>
            {format(cloneDay, dateFormat)}
          </div>
          
          {isFridayOrSaturday && isCurrentMonth && (
            <div className="space-y-1">
              {dayEvents.map((event) => {
                const getStatusColor = (status: string) => {
                  switch (status) {
                    case 'OPEN': return 'bg-green-100 text-green-800'
                    case 'WAIT': return 'bg-yellow-100 text-yellow-800'
                    case 'CLOSED': return 'bg-red-100 text-red-800'
                    default: return 'bg-gray-100 text-gray-800'
                  }
                }

                const getEventStatus = () => {
                  const deadline = new Date(event.application_deadline)
                  const now = new Date()
                  
                  if (now > deadline) return 'CLOSED'
                  
                  const maleSpots = event.capacity_male - event.male_confirmed
                  const femaleSpots = event.capacity_female - event.female_confirmed
                  
                  if (maleSpots <= 0 && femaleSpots <= 0) return 'WAIT'
                  return 'OPEN'
                }

                const status = getEventStatus()

                return (
                  <div key={event.id} className="text-xs">
                    <div className={`px-2 py-1 rounded text-xs font-medium mb-1 ${getStatusColor(status)}`}>
                      {status}
                    </div>
                    <div className="flex justify-between text-xs text-gray-600">
                      <span className="text-blue-600">♂ {event.male_confirmed}/{event.capacity_male}</span>
                      <span className="text-pink-600">♀ {event.female_confirmed}/{event.capacity_female}</span>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </motion.div>
      )
      day = addDays(day, 1)
    }
    rows.push(
      <div className="grid grid-cols-7" key={day.toString()}>
        {days}
      </div>
    )
    days = []
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <motion.h1 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-2xl font-bold text-gray-900"
        >
          Gathering House
        </motion.h1>
        
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigateMonth('prev')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h2 className="text-xl font-semibold min-w-[120px] text-center">
            {format(currentDate, 'yyyy년 MM월')}
          </h2>
          <button
            onClick={() => navigateMonth('next')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Calendar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-lg overflow-hidden"
      >
        {/* Days of week header */}
        <div className="grid grid-cols-7 bg-gray-50">
          {['일', '월', '화', '수', '목', '금', '토'].map((day, index) => (
            <div key={day} className={`p-4 text-center font-medium ${
              index === 5 || index === 6 ? 'text-orange-600 bg-orange-50' : 'text-gray-700'
            }`}>
              {day}
            </div>
          ))}
        </div>
        
        {/* Calendar grid */}
        <div className="divide-y divide-gray-100">
          {rows}
        </div>
      </motion.div>

      {/* Event Detail Modal */}
      <AnimatePresence>
        {selectedDate && (
          <EventDetail
            date={selectedDate}
            events={events.filter(event => isSameDay(new Date(event.event_date), selectedDate))}
            onClose={() => setSelectedDate(null)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}