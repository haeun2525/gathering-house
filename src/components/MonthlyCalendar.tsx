import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { format, addMonths, subMonths, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, isSameMonth, isSameDay, isToday, getDay } from 'date-fns'
import { ChevronLeft, ChevronRight, Calendar, CalendarDays, Clock } from 'lucide-react'
import { useEvents } from '../hooks/useEvents'
import { EventDetail } from './EventDetail'

export function MonthlyCalendar() {
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
      const dayEvents = events.filter(event => isSameDay(new Date(event.date), day))
      const isCurrentMonth = isSameMonth(day, monthStart)
      const isFridayOrSaturday = getDay(day) === 5 || getDay(day) === 6
      const hasEvents = dayEvents.length > 0

      days.push(
        <motion.div
          key={day.toString()}
          className={`min-h-[100px] border border-gray-700 p-3 cursor-pointer transition-all ${
            !isCurrentMonth ? 'bg-gray-800/50 text-gray-500' : 'bg-gray-800 hover:bg-gray-700'
          } ${isToday(cloneDay) ? 'bg-orange-500/20 border-orange-400' : ''}`}
          onClick={() => hasEvents && setSelectedDate(cloneDay)}
          whileHover={hasEvents ? { scale: 1.02 } : {}}
          whileTap={hasEvents ? { scale: 0.98 } : {}}
        >
          <div className={`text-sm font-bold mb-2 ${
            isToday(cloneDay) ? 'text-orange-400' : 
            !isCurrentMonth ? 'text-gray-500' : 'text-white'
          }`}>
            {format(cloneDay, dateFormat)}
          </div>
          
          {isFridayOrSaturday && isCurrentMonth && hasEvents && (
            <div className="space-y-1">
              {dayEvents.slice(0, 2).map((event) => (
                <div key={event.id} className="text-xs bg-orange-500/20 text-orange-300 px-2 py-1 rounded truncate">
                  {event.title}
                </div>
              ))}
              {dayEvents.length > 2 && (
                <div className="text-xs text-gray-400">+{dayEvents.length - 2} more</div>
              )}
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
    <div className="bg-gray-900">
      {/* Hero Section */}
      <div className="relative py-16 tablet:py-20 overflow-hidden night-stars">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-purple-900/30"></div>
        
        <div className="absolute top-10 left-10 w-96 h-96 bg-orange-400/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl"></div>
        
        <div className="hero-overlay"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 tablet:px-6 desktop:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-white space-y-8"
          >
            <div className="uppercase-spaced text-orange-400 text-sm tablet:text-base mb-4">
              MONTHLY SCHEDULE
            </div>
            <h1 className="text-cinematic tablet:text-7xl desktop:text-8xl font-black mb-6 text-cinematic">
              {format(currentDate, 'MMMM yyyy')}
            </h1>
            <p className="text-lg tablet:text-xl font-medium text-gray-300 max-w-2xl mx-auto leading-relaxed">
              전체 월별 일정을 한눈에 확인하고 원하는 날짜를 선택하세요
            </p>
          </motion.div>
        </div>
      </div>

      {/* Calendar Section */}
      <div className="relative z-20 -mt-8 max-w-7xl mx-auto px-4 tablet:px-6 desktop:px-8 pb-12 min-h-[50vh]">
        {/* View Mode Toggle */}
        <div className="flex justify-center mb-8">
          <div className="flex bg-white/10 backdrop-blur-sm p-1 rounded-2xl border border-white/20">
            <button
              onClick={() => window.history.back()}
              className="relative px-6 tablet:px-8 py-3 tablet:py-4 rounded-xl font-semibold transition-all duration-300 flex items-center space-x-2 min-h-[44px] text-white/60 hover:text-white/80"
            >
              <CalendarDays className="w-5 h-5" />
              <span className="text-base font-semibold uppercase-spaced">Week</span>
            </button>
            
            <button className="relative px-6 tablet:px-8 py-3 tablet:py-4 rounded-xl font-semibold transition-all duration-300 flex items-center space-x-2 min-h-[44px] text-white">
              <motion.div
                layoutId="activeViewTab"
                className="absolute inset-0 bg-orange-400 rounded-xl shadow-lg"
                transition={{ type: "spring", bounce: 0.15, duration: 0.5 }}
              />
              <Calendar className="w-5 h-5 relative z-10" />
              <span className="relative z-10 text-base font-semibold uppercase-spaced">Month</span>
            </button>
          </div>
        </div>

        {/* Calendar Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-800 rounded-t-2xl border border-gray-700 p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => navigateMonth('prev')}
              className="p-3 hover:bg-gray-700 rounded-xl transition-colors text-white"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <h2 className="text-2xl font-black text-white uppercase-spaced">
              {format(currentDate, 'MMMM yyyy')}
            </h2>
            <button
              onClick={() => navigateMonth('next')}
              className="p-3 hover:bg-gray-700 rounded-xl transition-colors text-white"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          {/* Days of week header */}
          <div className="grid grid-cols-7 mb-4">
            {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map((day, index) => (
              <div key={day} className={`p-4 text-center font-black uppercase-spaced ${
                index === 5 || index === 6 ? 'text-orange-400' : 'text-gray-400'
              }`}>
                {day}
              </div>
            ))}
          </div>
        </motion.div>
        
        {/* Calendar Grid */}
        <motion.div
            GATHERING OF THE WEEK
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
            Gathering House
        >
          <div className="divide-y divide-gray-700">
            서울에서 가장 특별한 만남이 시작되는 곳. 매주 금요일과 토요일, 새로운 인연을 만나보세요.
          </div>
        </motion.div>
      </div>

      {/* Event Detail Modal */}
      <AnimatePresence>
        {selectedDate && (
          <EventDetail
            date={selectedDate}
            events={events.filter(event => isSameDay(new Date(event.date), selectedDate))}
            onClose={() => setSelectedDate(null)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}