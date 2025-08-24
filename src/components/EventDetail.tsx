import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { format } from 'date-fns'
import { X, MapPin, Clock, Users, Heart } from 'lucide-react'
import { EventWithCounts } from '../lib/supabase'
import { ApplicationModal } from './ApplicationModal'
import { useAuth } from '../contexts/AuthContext'

interface EventDetailProps {
  date: Date
  events: EventWithCounts[]
  onClose: () => void
}

export function EventDetail({ date, events, onClose }: EventDetailProps) {
  const { user } = useAuth()
  const [selectedEvent, setSelectedEvent] = useState<EventWithCounts | null>(null)

  const getEventStatus = (event: EventWithCounts) => {
    const deadline = new Date(event.application_deadline)
    const now = new Date()
    
    if (now > deadline) return 'CLOSED'
    
    const maleSpots = event.capacity_male - event.male_confirmed
    const femaleSpots = event.capacity_female - event.female_confirmed
    
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

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-gray-100 rounded-2xl max-w-md w-full max-h-[80vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 bg-white rounded-t-2xl">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              {format(date, 'MM월 dd일')} ({format(date, 'E', { locale: { localize: { day: (n) => ['일', '월', '화', '수', '목', '금', '토'][n] } } })})
            </h2>
            <p className="text-gray-600 text-sm">모임 일정</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Events List */}
        <div className="p-4 space-y-4">
          {events.map((event) => {
            const status = getEventStatus(event)
            const canApply = user && status !== 'CLOSED'

            return (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gray-900 rounded-2xl p-6 text-white relative overflow-hidden"
              >
                {/* Status Badge */}
                <div className={`absolute top-4 right-4 w-3 h-3 rounded-full ${getStatusColor(status)}`} />

                {/* Event Info */}
                <div className="mb-4">
                  <p className="text-gray-400 text-sm mb-1">모임</p>
                  <h3 className="text-xl font-bold mb-3">{event.title}</h3>
                  
                  <div className="space-y-2 text-sm text-gray-300">
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4" />
                      <span>{event.start_time} - {event.end_time}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4" />
                      <span>{event.location || '강남역 근처 (신청 후 상세 위치 공개)'}</span>
                    </div>
                  </div>
                </div>

                {/* Participant Count */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex space-x-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-blue-400 rounded-full" />
                      <span className="text-sm">남 {event.male_confirmed}/{event.capacity_male}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-pink-400 rounded-full" />
                      <span className="text-sm">여 {event.female_confirmed}/{event.capacity_female}</span>
                    </div>
                  </div>
                  <Users className="w-5 h-5 text-gray-400" />
                </div>

                {/* Action Button */}
                {canApply ? (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedEvent(event)}
                    className="w-full bg-white text-gray-900 py-3 px-6 rounded-full font-semibold hover:bg-gray-100 transition-colors flex items-center justify-center space-x-2"
                  >
                    <Heart className="w-5 h-5" />
                    <span>신청하기</span>
                  </motion.button>
                ) : !user ? (
                  <button
                    disabled
                    className="w-full bg-gray-600 text-gray-400 py-3 px-6 rounded-full font-semibold cursor-not-allowed"
                  >
                    로그인 필요
                  </button>
                ) : (
                  <button
                    disabled
                    className="w-full bg-gray-600 text-gray-400 py-3 px-6 rounded-full font-semibold cursor-not-allowed"
                  >
                    신청 마감
                  </button>
                )}
              </motion.div>
            )
          })}
        </div>
      </motion.div>

      {/* Application Modal */}
      <AnimatePresence>
        {selectedEvent && (
          <ApplicationModal
            event={selectedEvent}
            onClose={() => setSelectedEvent(null)}
            onSuccess={() => {
              setSelectedEvent(null)
              onClose()
            }}
          />
        )}
      </AnimatePresence>
    </motion.div>
  )
}