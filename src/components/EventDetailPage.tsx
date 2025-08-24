import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { format } from 'date-fns'
import { ArrowLeft, MapPin, Clock, Users, Calendar } from 'lucide-react'
import { useEvents } from '../hooks/useEvents'
import { ApplyButton } from './ApplyButton'
import { ApplyFormModal } from './ApplyFormModal'

export function EventDetailPage() {
  const { date } = useParams<{ date: string }>()
  const navigate = useNavigate()
  const { events } = useEvents()
  const [applyModalOpen, setApplyModalOpen] = useState(false)
  const [applyingEvent, setApplyingEvent] = useState<any>(null)

  if (!date) {
    navigate('/')
    return null
  }

  // Filter events for the selected date
  const dayEvents = events.filter(event => {
    return event.date === date
  })

  console.log('Date param:', date)
  console.log('All events:', events.length)
  console.log('Day events:', dayEvents.length)
  console.log('Sample event dates:', events.slice(0, 3).map(e => e.date))

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
      case 'OPEN': return 'bg-green-500'
      case 'WAIT': return 'bg-yellow-500'
      case 'CLOSED': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    const dayNames = ['일', '월', '화', '수', '목', '금', '토']
    return {
      month: format(date, 'MM'),
      day: format(date, 'dd'),
      dayName: dayNames[date.getDay()]
    }
  }

  const dateInfo = formatDate(date)

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Hero Header */}
      <div className="relative py-16 tablet:py-20 overflow-hidden">
        {/* Cinematic background */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/50"></div>
        
        {/* Ambient effects */}
        <div className="absolute top-10 right-10 w-80 h-80 bg-yellow-400/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl"></div>
        
        <div className="hero-overlay"></div>
        <div className="relative z-10 max-w-4xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center space-x-4 mb-6"
          >
            <button
              onClick={() => navigate('/')}
              className="p-3 bg-black/30 backdrop-blur-sm hover:bg-black/50 rounded-2xl transition-all duration-200 min-h-[48px] min-w-[48px] flex items-center justify-center border border-white/20"
            >
              <ArrowLeft className="w-6 h-6 text-white" />
            </button>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-white text-center"
          >
            <div className="uppercase-spaced text-yellow-400 text-sm tablet:text-base mb-4">
              SPECIAL SCREENING
            </div>
            <h1 className="text-cinematic tablet:text-6xl font-black mb-4 text-cinematic">
              {dateInfo.month}월 {dateInfo.day}일
            </h1>
            <div className="inline-flex items-center space-x-2 bg-black/30 backdrop-blur-sm px-6 py-3 rounded-full border border-white/20">
              <Calendar className="w-5 h-5" />
              <span className="text-lg font-bold uppercase-spaced">{dateInfo.dayName}요일의 특별한 만남</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Content */}
      <div className="relative -mt-6 z-20 max-w-4xl mx-auto px-4 tablet:px-6 pb-8 pt-8">
        {dayEvents.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-800 rounded-2xl text-center py-16 border border-gray-700"
          >
            <Calendar className="w-16 h-16 text-gray-500 mx-auto mb-6" />
            <h3 className="text-2xl font-bold text-white mb-3">
              No Screenings Available
            </h3>
            <p className="text-gray-400 text-lg mb-8">
              Check other dates for available gatherings
            </p>
            <button
              onClick={() => navigate('/')}
              className="btn-primary text-lg px-8 py-4 uppercase-spaced"
            >
              Back to Calendar
            </button>
          </motion.div>
        ) : (
          <div className="space-y-6">
            {dayEvents.map((event, index) => {
              const status = getEventStatus(event)
              const canApply = status !== 'CLOSED'

              return (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="movie-card overflow-hidden hover:shadow-2xl transition-all duration-300"
                >
                  <div className="p-8 tablet:p-10 text-black">
                    {/* Event Header */}
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-4">
                          <div className="uppercase-spaced text-white text-sm opacity-80">
                            VENUE STATUS
                          </div>
                          <span className={`px-4 py-2 rounded-full text-sm font-black uppercase-spaced ${
                            status === 'OPEN' ? 'bg-white text-orange-500' :
                            status === 'WAIT' ? 'bg-white text-yellow-500' :
                            'bg-white text-red-500'
                          }`}>
                            {status === 'OPEN' ? 'Available' : 
                             status === 'WAIT' ? 'Waitlist' : 'Sold Out'}
                          </span>
                        </div>
                        <h2 className="text-3xl tablet:text-4xl font-black text-white mb-4 uppercase">
                          {event.title}
                        </h2>
                        
                        <div className="space-y-3 text-white opacity-80">
                          <div className="flex items-center space-x-2">
                            <Clock className="w-5 h-5" />
                            <span className="text-lg tablet:text-xl font-bold uppercase-spaced">
                              {event.start_time} - {event.end_time}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <MapPin className="w-5 h-5" />
                            <span className="text-lg tablet:text-xl font-bold uppercase-spaced">
                              {event.location || '강남역 근처 (신청 후 상세 위치 공개)'}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Participant Counts */}
                      <div className="grid grid-cols-2 gap-6 mb-8">
                        <div className="bg-white bg-opacity-10 rounded-2xl p-6 text-center border-2 border-white border-opacity-20">
                          <div className="text-3xl tablet:text-4xl font-black text-white mb-2">
                            {event.counts.male}
                          </div>
                          <div className="text-white font-black text-lg mb-2 uppercase-spaced">Men</div>
                          <div className="text-sm text-white font-bold opacity-80 uppercase-spaced">
                            {status === 'CLOSED' ? 'Sold Out' : 'Available'}
                          </div>
                        </div>
                        
                        <div className="bg-white bg-opacity-10 rounded-2xl p-6 text-center border-2 border-white border-opacity-20">
                          <div className="text-3xl tablet:text-4xl font-black text-white mb-2">
                            {event.counts.female}
                          </div>
                          <div className="text-white font-black text-lg mb-2 uppercase-spaced">Women</div>
                          <div className="text-sm text-white font-bold opacity-80 uppercase-spaced">
                            {status === 'CLOSED' ? 'Sold Out' : 'Available'}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Event Description */}
                    <div className="mb-8">
                      <h3 className="text-xl font-black text-white mb-4 uppercase-spaced">About This Gathering</h3>
                      <p className="text-white leading-relaxed text-lg opacity-80">
                        {event.description || 
                         'An exclusive gathering for meaningful connections. Join us for an evening of authentic conversations and new friendships in a sophisticated atmosphere.'}
                      </p>
                    </div>

                    {/* Apply Button */}
                    <div className="pt-6 border-t-2 border-white border-opacity-20">
                      {canApply ? (
                        <ApplyButton
                          eventId={event.id}
                          className="w-full tablet:w-auto tablet:min-w-[240px] bg-white text-orange-500 hover:bg-gray-100 text-xl py-5 font-black shadow-lg hover:shadow-xl uppercase-spaced"
                          onApply={() => {
                            setApplyingEvent(event)
                            setApplyModalOpen(true)
                          }}
                        >
                          Book Ticket
                        </ApplyButton>
                      ) : (
                        <button
                          disabled
                          className="w-full tablet:w-auto tablet:min-w-[240px] bg-gray-800 text-gray-500 py-5 px-8 rounded-full font-black cursor-not-allowed text-xl uppercase-spaced"
                        >
                          Sold Out
                        </button>
                      )}
                      
                      {status === 'WAIT' && (
                        <p className="text-white text-base mt-3 font-bold opacity-80">
                          Currently on waitlist. We'll notify you if spots become available.
                        </p>
                      )}
                    </div>
                    
                    {/* Price Information */}
                    <div className="mt-6 p-6 bg-white bg-opacity-10 rounded-2xl border-2 border-white border-opacity-20">
                      <h4 className="font-black text-white mb-4 text-lg uppercase-spaced">Ticket Prices</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-base">
                        <div className="flex items-center space-x-2">
                          <span className="text-white">👨</span>
                          <div>
                            <div className="font-bold text-white">Men Standard: {event.price_male_standard?.toLocaleString()}원</div>
                            <div className="font-bold text-white">Men Premium: {event.price_male_premium?.toLocaleString()}원</div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-white">👩</span>
                          <div>
                            <div className="font-bold text-white">Women Standard: {event.price_female_standard?.toLocaleString()}원</div>
                            <div className="font-bold text-white">Women Premium: {event.price_female_premium?.toLocaleString()}원</div>
                          </div>
                        </div>
                      </div>
                    </div>
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