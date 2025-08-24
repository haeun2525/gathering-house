import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Upload, Trash2, AlertCircle, Check } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'

const applyFormSchema = z.object({
  name: z.string().min(1, '이름을 입력해주세요'),
  gender: z.enum(['male', 'female'], { required_error: '성별을 선택해주세요' }),
  birthYear: z.number().min(1950).max(2010, '올바른 출생년도를 입력해주세요'),
  phone: z.string().min(1, '연락처를 입력해주세요'),
  ticketOption: z.string().min(1, '참가 옵션을 선택해주세요'),
  consent: z.boolean().refine(val => val === true, '개인정보 수집 및 이용에 동의해주세요'),
})

type ApplyFormData = z.infer<typeof applyFormSchema>

interface ApplyFormModalProps {
  isOpen: boolean
  onClose: () => void
  eventId: string
  event?: any
}

export function ApplyFormModal({ isOpen, onClose, eventId, event }: ApplyFormModalProps) {
  const { profile } = useAuth()
  const navigate = useNavigate()
  const [photos, setPhotos] = useState<string[]>([])
  const [uploading, setUploading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ApplyFormData>({
    resolver: zodResolver(applyFormSchema),
    defaultValues: {
      name: profile?.name || '',
      gender: profile?.gender,
      birthYear: profile?.birth_year || undefined,
      phone: profile?.phone || '',
      consent: false,
    },
  })

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen && profile) {
      reset({
        name: profile.name || '',
        gender: profile.gender,
        birthYear: profile.birth_year || undefined,
        phone: profile.phone || '',
        consent: false,
      })
      setPhotos(profile.photos || [])
    }
  }, [isOpen, profile, reset])

  // Handle keyboard events
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown)
      return () => document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onClose])

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (photos.length >= 2) {
      setError('최대 2장까지 업로드 가능합니다')
      return
    }

    setUploading(true)
    try {
      // Mock photo upload - create a placeholder URL
      const mockPhotoUrl = `https://images.unsplash.com/photo-${Date.now()}?w=300&h=300&fit=crop&crop=face`
      setPhotos(prev => [...prev, mockPhotoUrl])
    } catch (err) {
      setError('사진 업로드에 실패했습니다')
    } finally {
      setUploading(false)
    }
  }

  const removePhoto = (index: number) => {
    setPhotos(prev => prev.filter((_, i) => i !== index))
  }

  const onSubmit = async (data: ApplyFormData) => {
    if (photos.length === 0) {
      setError('최소 1장의 사진을 업로드해주세요')
      return
    }

    setSubmitting(true)
    setError(null)

    try {
      // Mock API call to create application
      const applicationData = {
        eventId,
        ...data,
        photos,
        appliedAt: new Date().toISOString(),
      }
      
      console.log('Creating application:', applicationData)
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      setSuccess(true)
      
      // Show success and navigate after delay
      setTimeout(() => {
        onClose()
        navigate('/my')
        // Show toast notification
        const toast = document.createElement('div')
        toast.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50'
        toast.textContent = '신청 완료!'
        document.body.appendChild(toast)
        setTimeout(() => document.body.removeChild(toast), 3000)
      }, 2000)
    } catch (err) {
      setError(err instanceof Error ? err.message : '신청에 실패했습니다')
    } finally {
      setSubmitting(false)
    }
  }

  if (success) {
    return (
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-8 max-w-sm w-full text-center"
            >
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">신청 완료!</h3>
              <p className="text-gray-600">모임 신청이 성공적으로 완료되었습니다. 결과는 마이페이지에서 확인하실 수 있습니다.</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    )
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-bold text-gray-900">
                {event?.title || '모임'} 신청
              </h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    이름 *
                  </label>
                  <input
                    {...register('name')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900 bg-white"
                    placeholder="이름을 입력하세요"
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    성별 *
                  </label>
                  <select
                    {...register('gender')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900 bg-white"
                  >
                    <option value="">성별 선택</option>
                    <option value="male">남성</option>
                    <option value="female">여성</option>
                  </select>
                  {errors.gender && (
                    <p className="mt-1 text-sm text-red-600">{errors.gender.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    출생년도 *
                  </label>
                  <input
                    type="number"
                    {...register('birthYear', { valueAsNumber: true })}
                    min="1950"
                    max="2010"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900 bg-white"
                    placeholder="1990"
                  />
                  {errors.birthYear && (
                    <p className="mt-1 text-sm text-red-600">{errors.birthYear.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    연락처 *
                  </label>
                  <input
                    {...register('phone')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900 bg-white"
                    placeholder="010-0000-0000"
                  />
                  {errors.phone && (
                    <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
                  )}
                </div>
              </div>

              {/* Ticket Option */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  참가 옵션 *
                </label>
                <select
                  {...register('ticketOption')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900 bg-white"
                >
                  <option value="">옵션 선택</option>
                  <option value="male-standard">💙 남성 스탠다드 (1부만) - 43,000원</option>
                  <option value="male-premium">💙 남성 프리미엄 (1부+2부) - 63,000원</option>
                  <option value="female-standard">🩷 여성 스탠다드 (1부만) - 37,000원</option>
                  <option value="female-premium">🩷 여성 프리미엄 (1부+2부) - 53,000원</option>
                </select>
                {errors.ticketOption && (
                  <p className="mt-1 text-sm text-red-600">{errors.ticketOption.message}</p>
                )}
              </div>

              {/* Photos */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  사진 (1-2장 필수) *
                </label>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  {photos.map((photo, index) => (
                    <div key={index} className="relative">
                      <img
                        src={photo}
                        alt={`사진 ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removePhoto(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                  
                  {photos.length < 2 && (
                    <label className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-orange-500 transition-colors">
                      {uploading ? (
                        <div className="animate-spin w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full"></div>
                      ) : (
                        <>
                          <Upload className="w-8 h-8 text-gray-400 mb-2" />
                          <span className="text-sm text-gray-500">업로드</span>
                        </>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoUpload}
                        className="hidden"
                        disabled={uploading}
                      />
                    </label>
                  )}
                </div>
                
                {photos.length === 0 && (
                  <p className="text-sm text-red-600">최소 1장의 사진을 업로드해주세요</p>
                )}
              </div>

              {/* Consent */}
              <div className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  {...register('consent')}
                  className="mt-1 w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
                />
                <div className="text-sm">
                  <label className="text-gray-700">
                    개인정보 수집 및 이용에 동의합니다. *
                  </label>
                  <p className="text-gray-500 text-xs mt-1">
                    모임 매칭을 위해 제공된 정보가 사용됩니다.
                  </p>
                </div>
              </div>
              {errors.consent && (
                <p className="text-sm text-red-600">{errors.consent.message}</p>
              )}

              {error && (
                <div className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700">
                  <AlertCircle className="w-5 h-5" />
                  <span>{error}</span>
                </div>
              )}

              {/* Submit Button */}
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  취소
                </button>
                <button
                  type="submit"
                  disabled={submitting || uploading}
                  className="flex-1 px-4 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50 font-semibold"
                >
                  {submitting ? '신청 중...' : '신청하기'}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}