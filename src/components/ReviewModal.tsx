import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Star, Send } from 'lucide-react'
import { Review } from '../hooks/useReviews'

interface ReviewModalProps {
  isOpen: boolean
  onClose: () => void
  eventId: string
  eventTitle: string
  existingReview?: Review | null
  onSubmit: (rating: number, content: string) => Promise<void>
}

export function ReviewModal({ 
  isOpen, 
  onClose, 
  eventId, 
  eventTitle, 
  existingReview, 
  onSubmit 
}: ReviewModalProps) {
  const [rating, setRating] = useState(existingReview?.rating || 0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [content, setContent] = useState(existingReview?.content || '')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const isEditMode = !!existingReview

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (rating === 0) {
      setError('별점을 선택해주세요.')
      return
    }
    
    if (content.trim().length === 0) {
      setError('후기 내용을 입력해주세요.')
      return
    }

    if (content.length > 300) {
      setError('후기는 300자 이내로 작성해주세요.')
      return
    }

    setSubmitting(true)
    setError(null)

    try {
      await onSubmit(rating, content)
      
      // 성공 토스트 메시지
      const toast = document.createElement('div')
      toast.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50'
      toast.textContent = isEditMode ? '후기가 수정되었습니다!' : '후기가 제출되었습니다!'
      document.body.appendChild(toast)
      setTimeout(() => document.body.removeChild(toast), 3000)
      
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : '후기 제출에 실패했습니다. 다시 시도해주세요.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleClose = () => {
    setRating(existingReview?.rating || 0)
    setHoveredRating(0)
    setContent(existingReview?.content || '')
    setError(null)
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  {isEditMode ? '후기를 수정하세요' : '후기를 남겨주세요'}
                </h2>
                <p className="text-sm text-gray-600 mt-1">{eventTitle}</p>
              </div>
              <button
                onClick={handleClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* 별점 입력 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  이번 모임은 어떠셨나요?
                </label>
                <div className="flex items-center space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoveredRating(star)}
                      onMouseLeave={() => setHoveredRating(0)}
                      className="p-1 transition-transform hover:scale-110"
                    >
                      <Star
                        className={`w-8 h-8 transition-colors ${
                          star <= (hoveredRating || rating)
                            ? 'text-yellow-400 fill-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    </button>
                  ))}
                </div>
                {rating > 0 && (
                  <p className="text-sm text-gray-600 mt-2">
                    {rating === 1 && '아쉬웠어요'}
                    {rating === 2 && '별로였어요'}
                    {rating === 3 && '보통이었어요'}
                    {rating === 4 && '좋았어요'}
                    {rating === 5 && '최고였어요!'}
                  </p>
                )}
              </div>

              {/* 텍스트 입력 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  자세한 후기를 들려주세요
                </label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={4}
                  maxLength={300}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none text-gray-900"
                  placeholder="이번 모임은 어땠나요?"
                />
                <div className="flex justify-between items-center mt-2">
                  <span className={`text-sm ${content.length > 300 ? 'text-red-500' : 'text-gray-500'}`}>
                    {content.length}/300자
                  </span>
                </div>
              </div>

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                  {error}
                </div>
              )}

              {/* 제출 버튼 */}
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={handleClose}
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  취소
                </button>
                <button
                  type="submit"
                  disabled={submitting || rating === 0 || content.trim().length === 0}
                  className="flex-1 px-4 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  <Send className="w-4 h-4" />
                  <span>
                    {submitting 
                      ? '제출 중...' 
                      : isEditMode 
                        ? '후기 수정 완료' 
                        : '후기 제출'
                    }
                  </span>
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}