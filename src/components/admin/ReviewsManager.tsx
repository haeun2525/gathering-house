import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { format } from 'date-fns'
import { Star, MessageCircle, Calendar, User } from 'lucide-react'

interface Review {
  id: string
  event_id: string
  user_id: string
  rating: number
  content: string
  created_at: string
  event_title?: string
  user_name?: string
}

// Mock 후기 데이터
const MOCK_REVIEWS: Review[] = [
  {
    id: 'review-1',
    event_id: 'euljiro-fri-0',
    user_id: '12345678-1234-5678-9012-123456789012',
    rating: 5,
    content: '정말 좋은 사람들과 만날 수 있어서 즐거웠습니다! 분위기도 좋고 음식도 맛있었어요. 다음에도 꼭 참여하고 싶습니다.',
    created_at: '2025-01-20T10:30:00Z',
    event_title: '을지로 솔로파티',
    user_name: 'Dev User'
  },
  {
    id: 'review-2',
    event_id: 'sinchon-fri-0',
    user_id: '12345678-1234-5678-9012-123456789013',
    rating: 4,
    content: '전체적으로 만족스러웠어요. 처음엔 조금 어색했지만 시간이 지나면서 편해졌습니다. 운영진분들도 친절하셨고요.',
    created_at: '2025-01-19T15:45:00Z',
    event_title: '신촌 게하파티',
    user_name: 'User 2'
  },
  {
    id: 'review-3',
    event_id: 'euljiro-sat-0',
    user_id: '12345678-1234-5678-9012-123456789014',
    rating: 3,
    content: '보통이었어요. 기대했던 것보다는 아쉬웠지만 나쁘지 않았습니다.',
    created_at: '2025-01-18T20:15:00Z',
    event_title: '을지로 솔로파티',
    user_name: 'User 3'
  }
]

export function ReviewsManager() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 1 | 2 | 3 | 4 | 5>('all')

  useEffect(() => {
    // Mock 데이터 로드
    setTimeout(() => {
      setReviews(MOCK_REVIEWS)
      setLoading(false)
    }, 500)
  }, [])

  const filteredReviews = reviews.filter(review => 
    filter === 'all' || review.rating === filter
  )

  const averageRating = reviews.length > 0 
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
    : 0

  const ratingCounts = [1, 2, 3, 4, 5].map(rating => 
    reviews.filter(review => review.rating === rating).length
  )

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    )
  }

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-8 bg-gray-200 rounded w-1/4"></div>
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">후기 관리</h2>
      </div>

      {/* 통계 요약 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center space-x-3">
            <MessageCircle className="w-8 h-8 text-orange-500" />
            <div>
              <div className="text-2xl font-bold text-gray-900">{reviews.length}</div>
              <div className="text-sm text-gray-600">총 후기 수</div>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center space-x-3">
            <Star className="w-8 h-8 text-yellow-500" />
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {averageRating.toFixed(1)}
              </div>
              <div className="text-sm text-gray-600">평균 별점</div>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map((rating) => (
              <div key={rating} className="flex items-center space-x-2">
                <span className="text-sm w-2">{rating}</span>
                <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-yellow-400 h-2 rounded-full"
                    style={{
                      width: `${reviews.length > 0 ? (ratingCounts[rating - 1] / reviews.length) * 100 : 0}%`
                    }}
                  />
                </div>
                <span className="text-sm text-gray-600 w-6">
                  {ratingCounts[rating - 1]}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 필터 */}
      <div className="flex space-x-2 mb-6">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            filter === 'all'
              ? 'bg-orange-500 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          전체
        </button>
        {[5, 4, 3, 2, 1].map((rating) => (
          <button
            key={rating}
            onClick={() => setFilter(rating as 1 | 2 | 3 | 4 | 5)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-1 ${
              filter === rating
                ? 'bg-orange-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <span>{rating}</span>
            <Star className="w-4 h-4" />
          </button>
        ))}
      </div>

      {/* 후기 목록 */}
      <div className="space-y-4">
        {filteredReviews.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg border">
            <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">후기가 없습니다</h3>
            <p className="text-gray-600">아직 작성된 후기가 없습니다.</p>
          </div>
        ) : (
          filteredReviews.map((review, index) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-all p-6"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <User className="w-5 h-5 text-gray-400" />
                    <span className="font-medium text-gray-900">
                      {review.user_name || '익명'}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">
                      {review.event_title}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  {renderStars(review.rating)}
                  <span className="text-sm text-gray-600">
                    {format(new Date(review.created_at), 'yyyy.MM.dd')}
                  </span>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-800 leading-relaxed">{review.content}</p>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  )
}