import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { format } from 'date-fns'
import { Calendar, Clock, Users, AlertCircle, CheckCircle, XCircle, Hourglass, User, Trophy, History, Star, MessageCircle } from 'lucide-react'
import { useMyApplications } from '../hooks/useApplications'
import { useAuth } from '../contexts/AuthContext'
import { ReviewModal } from './ReviewModal'
import { useUserReview } from '../hooks/useReviews'

// Review Banner Component
interface ReviewBannerProps {
  eventId: string
  eventTitle: string
}

function ReviewBanner({ eventId, eventTitle }: ReviewBannerProps) {
  const { review, loading, createReview, updateReview } = useUserReview(eventId)
  const [reviewModalOpen, setReviewModalOpen] = useState(false)

  const handleReviewSubmit = async (rating: number, content: string) => {
    if (review) {
      await updateReview(rating, content)
    } else {
      await createReview(rating, content)
    }
    setReviewModalOpen(false)
  }

  if (loading) {
    return (
      <div className="mt-6 p-6 bg-gradient-to-r from-orange-500 to-purple-600 rounded-2xl animate-pulse">
        <div className="h-6 bg-white/20 rounded w-1/3 mb-2"></div>
        <div className="h-4 bg-white/20 rounded w-2/3"></div>
      </div>
    )
  }

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setReviewModalOpen(true)}
        role="button"
        aria-label={review ? "후기 수정" : "후기 남기기"}
        className="mt-6 w-full p-6 bg-gradient-to-r from-orange-500 to-purple-600 text-white rounded-2xl hover:shadow-xl transition-all duration-300 shadow-lg relative overflow-hidden"
      >
        {/* 별점 칩 (작성된 경우에만 표시) */}
        {review && (
          <div className="absolute top-4 right-4 bg-black/50 px-3 py-1 rounded-full text-sm font-medium">
            ⭐ {review.rating}/5
          </div>
        )}
        
        <div className="flex items-center justify-center space-x-3 mb-2">
          <Star className="w-6 h-6" />
          <MessageCircle className="w-6 h-6" />
          <span className="font-bold text-xl uppercase-spaced">
            {review ? '후기 수정' : '후기 남기기'}
          </span>
        </div>
        <div className="text-base opacity-90">
          {review 
            ? '이미 남긴 후기를 수정할 수 있어요' 
            : '이번 모임은 어땠나요? 솔직한 후기를 들려주세요'
          }
        </div>
      </motion.button>

      <ReviewModal
        isOpen={reviewModalOpen}
        onClose={() => setReviewModalOpen(false)}
        eventId={eventId}
        eventTitle={eventTitle}
        existingReview={review}
        onSubmit={handleReviewSubmit}
      />
    </>
  )
}

export function MyPage() {
  const { applications, loading, error } = useMyApplications()
  const { profile } = useAuth()
  const [activeTab, setActiveTab] = useState<'current' | 'completed'>('current')

  // 현재 진행 중인 신청 (pending, waitlist, confirmed)
  const currentApplications = applications.filter(app => 
    ['pending', 'waitlist', 'confirmed'].includes(app.status)
  )

  // 완료된 모임 (참여 완료된 것들)
  const completedApplications = applications.filter(app => 
    app.status === 'completed'
  )

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'waitlist':
        return <Hourglass className="w-5 h-5 text-yellow-500" />
      case 'cancelled':
        return <XCircle className="w-5 h-5 text-red-500" />
      case 'completed':
        return <Trophy className="w-5 h-5 text-purple-500" />
      default:
        return <Clock className="w-5 h-5 text-blue-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800'
      case 'waitlist':
        return 'bg-yellow-100 text-yellow-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      case 'completed':
        return 'bg-purple-100 text-purple-800'
      default:
        return 'bg-blue-100 text-blue-800'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'confirmed': return '참여 확정'
      case 'waitlist': return '대기 중'
      case 'cancelled': return '취소됨'
      case 'completed': return '참여 완료'
      default: return '검토 중'
    }
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gray-900">
      {/* Hero Section */}
      <div className="relative py-16 tablet:py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/40"></div>
        <div className="absolute top-10 left-10 w-96 h-96 bg-yellow-400/10 rounded-full blur-3xl"></div>
        
        <div className="hero-overlay"></div>
        <div className="relative z-10 max-w-4xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center text-white"
          >
            <div className="uppercase-spaced text-orange-400 text-sm tablet:text-base mb-4">
              개인 대시보드
            </div>
            <h1 className="text-cinematic tablet:text-6xl font-black mb-4 text-cinematic">
              나의 기록
            </h1>
            <p className="text-xl tablet:text-2xl font-medium text-gray-300 text-shadow">
              모임 참여 기록을 확인하고 관리하세요
            </p>
          </motion.div>
        </div>
      </div>

      {/* Content */}
      <div className="relative -mt-6 z-20 max-w-4xl mx-auto px-4 pb-8 pt-8 min-h-[50vh]">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-red-500" />
              <span className="text-red-700 font-medium">{error}</span>
            </div>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="flex space-x-1 bg-gray-800 p-1 rounded-2xl w-fit mx-auto shadow-lg border border-gray-700">
            <button
              onClick={() => setActiveTab('current')}
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center space-x-2 ${
                activeTab === 'current'
                  ? 'bg-orange-400 text-black shadow-sm'
                  : 'text-gray-300 hover:text-white hover:bg-gray-700'
              }`}
            >
              <Clock className="w-4 h-4" />
              <span className="uppercase-spaced">진행중 ({currentApplications.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('completed')}
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center space-x-2 ${
                activeTab === 'completed'
                  ? 'bg-orange-400 text-black shadow-sm'
                  : 'text-gray-300 hover:text-white hover:bg-gray-700'
              }`}
            >
              <Trophy className="w-4 h-4" />
              <span className="uppercase-spaced">완료됨 ({completedApplications.length})</span>
            </button>
          </div>
        </div>

        {/* Applications List */}
        <div className="space-y-6">
          {activeTab === 'current' ? (
            currentApplications.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gray-800 rounded-2xl text-center py-16 border border-gray-700"
              >
                <Clock className="w-16 h-16 text-gray-500 mx-auto mb-6" />
                <h3 className="text-2xl font-bold text-white mb-3">진행중인 신청이 없습니다</h3>
                <p className="text-gray-400 text-lg">캘린더에서 참여 가능한 모임을 찾아보세요!</p>
              </motion.div>
            ) : (
              currentApplications.map((application, index) => (
                <motion.div
                  key={application.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-gray-800 rounded-2xl hover:shadow-lg transition-all duration-300 border border-gray-700"
                >
                  <div className="p-8">
                    <div className="flex items-start justify-between mb-6">
                      <div>
                        <h3 className="text-2xl font-bold text-white mb-3">
                          {application.event.title}
                        </h3>
                        <div className="flex items-center space-x-6 text-gray-300">
                          <div className="flex items-center space-x-2">
                            <Calendar className="w-5 h-5 text-yellow-400" />
                            <span className="font-medium">{format(new Date(application.event.event_date), 'yyyy년 MM월 dd일')}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Clock className="w-5 h-5 text-yellow-400" />
                            <span className="font-medium">
                              {application.form_snapshot.participation_type === 'part1' && '1부 참여 (20:00-23:00)'}
                              {application.form_snapshot.participation_type === 'part2' && '2부 참여 (23:00-02:00)'}
                              {application.form_snapshot.participation_type === 'both' && '1+2부 참여 (20:00-02:00)'}
                              {!application.form_snapshot.participation_type && `${application.event.start_time} - ${application.event.end_time}`}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        {getStatusIcon(application.status)}
                        <span className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(application.status)}`}>
                          {getStatusText(application.status)}
                        </span>
                      </div>
                    </div>

                    {application.status === 'confirmed' && (
                      <div className="mt-6 p-5 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl">
                        <div className="flex items-center space-x-3">
                          <CheckCircle className="w-6 h-6 text-green-500" />
                          <span className="text-green-800 font-bold text-lg uppercase-spaced">
                            확정! 참여가 확정되었습니다.
                          </span>
                        </div>
                        <div className="mt-3 text-green-700 text-sm">
                          신청일: {format(new Date(application.applied_at), 'yyyy년 MM월 dd일')}
                        </div>
                      </div>
                    )}

                    {application.status === 'waitlist' && (
                      <div className="mt-6 p-5 bg-gradient-to-r from-yellow-50 to-amber-50 border border-yellow-200 rounded-2xl">
                        <div className="flex items-center space-x-3">
                          <Hourglass className="w-6 h-6 text-yellow-500" />
                          <span className="text-yellow-800 font-bold text-lg uppercase-spaced">
                            대기중입니다. 자리가 생기면 알려드릴게요.
                          </span>
                        </div>
                        <div className="mt-3 text-yellow-700 text-sm">
                          신청일: {format(new Date(application.applied_at), 'yyyy년 MM월 dd일')}
                        </div>
                      </div>
                    )}

                    {application.status === 'pending' && (
                      <div className="mt-6 p-5 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl">
                        <div className="flex items-center space-x-3">
                          <Clock className="w-6 h-6 text-blue-500" />
                          <span className="text-blue-800 font-bold text-lg uppercase-spaced">
                            신청이 접수되었습니다. 검토중입니다.
                          </span>
                        </div>
                        <div className="mt-3 text-blue-700 text-sm">
                          신청일: {format(new Date(application.applied_at), 'yyyy년 MM월 dd일')}
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))
            )
          ) : (
            completedApplications.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gray-800 rounded-2xl text-center py-16 border border-gray-700"
              >
                <History className="w-16 h-16 text-gray-500 mx-auto mb-6" />
                <h3 className="text-2xl font-bold text-white mb-3">완료된 모임이 없습니다</h3>
                <p className="text-gray-400 text-lg">첫 모임에 참여하여 기록을 남겨보세요!</p>
              </motion.div>
            ) : (
              completedApplications.map((application, index) => (
                <motion.div
                  key={application.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-gray-800 rounded-2xl hover:shadow-lg transition-all duration-300 border border-gray-700"
                >
                  <div className="p-8">
                    <div className="flex items-start justify-between mb-6">
                      <div>
                        <h3 className="text-2xl font-bold text-white mb-3">
                          {application.event.title}
                        </h3>
                        <div className="flex items-center space-x-6 text-gray-300">
                          <div className="flex items-center space-x-2">
                            <Calendar className="w-5 h-5 text-yellow-400" />
                            <span className="font-medium">{format(new Date(application.event.event_date), 'yyyy년 MM월 dd일')}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Clock className="w-5 h-5 text-yellow-400" />
                            <span className="font-medium">{application.event.start_time} - {application.event.end_time}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        {getStatusIcon(application.status)}
                        <span className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(application.status)}`}>
                          {getStatusText(application.status)}
                        </span>
                      </div>
                    </div>

                    <div className="mt-6 p-5 bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-2xl">
                      <div className="flex items-center space-x-3">
                        <Trophy className="w-6 h-6 text-purple-500" />
                        <span className="text-purple-800 font-bold text-lg uppercase-spaced">
                          모임 완료! 즐거운 시간이었길 바랍니다.
                        </span>
                      </div>
                      <div className="mt-3 text-purple-700 text-sm">
                        참여일: {format(new Date(application.event.event_date), 'yyyy년 MM월 dd일')}
                      </div>
                    </div>

                    {/* 후기 배너 */}
                    <ReviewBanner 
                      eventId={application.event.id}
                      eventTitle={application.event.title}
                    />
                  </div>
                </motion.div>
              ))
            )
          )}
        </div>
      </div>

    </div>
  )
}