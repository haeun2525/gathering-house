import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { format, addMonths, subMonths, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, addWeeks, subWeeks, isSameMonth, isSameDay, isToday, getDay, startOfDay } from 'date-fns'
import { ChevronLeft, ChevronRight, Heart, MapPin, Clock, Calendar, CalendarDays } from 'lucide-react'
import { useEvents } from '../hooks/useEvents'
import { ApplyButton } from './ApplyButton'
import { ApplyFormModal } from './ApplyFormModal'
import { MonthlyCalendar } from './MonthlyCalendar'

export function CalendarView() {
  const navigate = useNavigate()
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [viewMode, setViewMode] = useState<'week' | 'month'>('week')
  const { events } = useEvents()
  const [applyModalOpen, setApplyModalOpen] = useState(false)
  const [applyingEvent, setApplyingEvent] = useState<any>(null)

  // Generate 7 days starting from today
  const generateDateTabs = () => {
    const today = new Date()
    const dates = []
    for (let i = 0; i < 7; i++) {
      dates.push(addDays(today, i))
    }
    return dates
  }

  const dateTabs = generateDateTabs()

  const handleDateClick = (date: Date) => {
    setSelectedDate(date)
  }

  const getEventStatus = (event: any) => {
    const deadline = new Date(event.application_deadline || Date.now() + 86400000)
    const now = new Date()
    
    if (now > deadline) return 'CLOSED'
    
    const maleSpots = event.capacity_male - event.counts.male
    const femaleSpots = event.capacity_female - event.counts.female
    
    if (maleSpots <= 0 && femaleSpots <= 0) return 'WAIT'
    return 'OPEN'
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'OPEN': return 'bg-green-500 text-white'
      case 'WAIT': return 'bg-gray-500 text-white'
      case 'CLOSED': return 'bg-gray-700 text-white'
      default: return 'bg-gray-500 text-white'
    }
  }

  const getDateLabel = (date: Date) => {
    if (isToday(date)) return 'TODAY'
    return format(date, 'EEE').toUpperCase()
  }

  // Get events for selected date
  const selectedDateStr = format(selectedDate, 'yyyy-MM-dd')
  const selectedDateEvents = events.filter(event => event.date === selectedDateStr)
  
  if (viewMode === 'month') {
    return <MonthlyCalendar />
  }

  return (
    <div className="bg-gray-900">
      {/* Hero Section */}
      <div className="relative py-16 tablet:py-20 desktop:py-24 overflow-hidden night-stars">
        {/* Background with cinematic overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-purple-900/30"></div>
        
        {/* Ambient light effects */}
        <div className="absolute top-10 left-10 w-96 h-96 bg-orange-400/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-gradient-to-r from-purple-500/5 via-orange-400/10 to-pink-500/5 rounded-full blur-3xl"></div>
        
        <div className="hero-overlay"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 tablet:px-6 desktop:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-white space-y-8"
          >
            <div className="uppercase-spaced text-orange-400 text-sm tablet:text-base mb-4">
              GATHERING OF THE WEEK
            </div>
            <h1 className="text-cinematic tablet:text-7xl desktop:text-8xl font-black mb-6 text-cinematic">
              Gathering House
            </h1>
            <p className="text-lg tablet:text-xl font-medium text-gray-300 max-w-2xl mx-auto leading-relaxed">
              서울에서 가장 특별한 만남이 시작되는 곳. 매주 금요일과 토요일, 새로운 인연을 만나보세요.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Date Tabs Section */}
      <div className="relative z-20 -mt-8">
        {/* View Mode Toggle */}
        <div className="flex justify-center mb-6">
          <div className="flex bg-white/10 backdrop-blur-sm p-1 rounded-2xl border border-white/20">
            <button
              onClick={() => setViewMode('week')}
              className={`
                relative px-6 tablet:px-8 py-3 tablet:py-4 rounded-xl font-semibold transition-all duration-300
                flex items-center space-x-2 min-h-[44px]
                ${viewMode === 'week' ? 'text-white' : 'text-white/60 hover:text-white/80'}
              `}
            >
              {viewMode === 'week' && (
                <motion.div
                  layoutId="activeViewTab"
                  className="absolute inset-0 bg-orange-400 rounded-xl shadow-lg"
                  transition={{ type: "spring", bounce: 0.15, duration: 0.5 }}
                />
              )}
              <CalendarDays className="w-5 h-5 relative z-10" />
              <span className="relative z-10 text-base font-semibold uppercase-spaced">Week</span>
            </button>
            
            <button
              onClick={() => setViewMode('month')}
              className={`
                relative px-6 tablet:px-8 py-3 tablet:py-4 rounded-xl font-semibold transition-all duration-300
                flex items-center space-x-2 min-h-[44px]
                ${viewMode === 'month' ? 'text-white' : 'text-white/60 hover:text-white/80'}
              `}
            >
              {viewMode === 'month' && (
                <motion.div
                  layoutId="activeViewTab"
                  className="absolute inset-0 bg-orange-400 rounded-xl shadow-lg"
                  transition={{ type: "spring", bounce: 0.15, duration: 0.5 }}
                />
              )}
              <Calendar className="w-5 h-5 relative z-10" />
              <span className="relative z-10 text-base font-semibold uppercase-spaced">Month</span>
            </button>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="max-w-7xl mx-auto px-4 tablet:px-6 desktop:px-8"
        >
          {/* File-tab Style Date Selector */}
          <div className="grid grid-cols-7 gap-1 mb-8">
            {dateTabs.map((date, index) => {
              const isActive = isSameDay(date, selectedDate)
              const hasEvents = events.some(event => event.date === format(date, 'yyyy-MM-dd'))
              
              return (
                <motion.button
                  key={date.toString()}
                  onClick={() => handleDateClick(date)}
                  className={`
                    date-tab px-2 py-4 w-full text-center
                    ${isActive ? 'active' : ''}
                    ${!hasEvents ? 'opacity-50' : ''}
                  `}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className={`font-black text-lg uppercase-spaced ${isActive ? 'text-white' : 'text-white'}`}>
                    {getDateLabel(date)}
                  </div>
                  <div className={`text-sm font-medium ${isActive ? 'text-white' : 'text-gray-400'}`}>
                    {format(date, 'MMM d')}
                  </div>
                  {hasEvents && (
                    <div className={`w-2 h-2 rounded-full mx-auto mt-2 ${isActive ? 'bg-white' : 'bg-orange-400'}`} />
                  )}
                </motion.button>
              )
            })}
          </div>
        </motion.div>
      </div>

      {/* Events Section */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 tablet:px-6 desktop:px-8 pb-12 min-h-[50vh]">
        {selectedDateEvents.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <div className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
              <Clock className="w-12 h-12 text-gray-500" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">
              No Screenings Today
            </h3>
            <p className="text-gray-400 text-lg">
              Select another date to see available gatherings
            </p>
          </motion.div>
        ) : (
          <div className="space-y-6">
            {selectedDateEvents.map((event, index) => {
              const status = getEventStatus(event)
              const canApply = status !== 'CLOSED'

              return (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="movie-card p-8 tablet:p-10 overflow-hidden relative"
                >
                  {/* Venue Header */}
                  <div className="mb-6">
                    <div className="uppercase-spaced text-white text-sm mb-2 opacity-80">
                      SCREENING VENUE
                    </div>
                    <h2 className="text-3xl tablet:text-4xl font-black text-white mb-2 uppercase">
                      {event.title}
                    </h2>
                    <div className="flex items-center space-x-2 text-white opacity-80">
                      <MapPin className="w-5 h-5" />
                      <span className="font-bold uppercase-spaced text-sm">
                        {event.location || '서울 강남구 (신청 후 상세 위치 공개)'}
                      </span>
                    </div>
                  </div>

                  {/* Screening Times */}
                  <div className="mb-8">
                    <div className="uppercase-spaced text-white text-sm mb-4 opacity-80">
                      SCREENING TIMES
                    </div>
                    <div className="flex flex-wrap gap-3">
                      {event.parts?.map((part: any, partIndex: number) => (
                        <div key={partIndex} className="screening-time">
                          {part.time}
                          <div className="text-xs opacity-70 mt-1">{part.name}</div>
                        </div>
                      )) || (
                        <div className="screening-time">
                          {event.start_time} - {event.end_time}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Participant Stats */}
                  <div className="grid grid-cols-2 gap-6 mb-8">
                    <div className="text-center">
                      <div className="text-3xl font-black text-white mb-1">
                        {event.counts.male}
                      </div>
                      <div className="uppercase-spaced text-white text-sm opacity-80">
                        Men Confirmed
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-black text-white mb-1">
                        {event.counts.female}
                      </div>
                      <div className="uppercase-spaced text-white text-sm opacity-80">
                        Women Confirmed
                      </div>
                    </div>
                  </div>

                  {/* Apply Button */}
                  <div className="flex justify-center">
                    {canApply ? (
                      <ApplyButton
                        eventId={event.id}
                        className="bg-white text-orange-500 hover:bg-gray-100 border-2 border-white font-black text-lg px-8 py-4"
                        onApply={() => {
                          setApplyingEvent(event)
                          setApplyModalOpen(true)
                        }}
                      >
                        BOOK TICKET
                      </ApplyButton>
                    ) : (
                      <button
                        disabled
                        className="bg-gray-800 text-gray-500 py-4 px-8 rounded-full font-black cursor-not-allowed text-lg uppercase-spaced"
                      >
                        SOLD OUT
                      </button>
                    )}
                  </div>
                </motion.div>
              )
            })}
          </div>
        )}
      </div>

      {/* Apply Modal */}
      <ApplyFormModal
        isOpen={applyModalOpen}
        onClose={() => {
          setApplyModalOpen(false)
          setApplyingEvent(null)
        }}
        eventId={applyingEvent?.id || ''}
        event={applyingEvent}
      />
    </div>
  )
}