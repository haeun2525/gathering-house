import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { X, Upload, Trash2, AlertCircle, Check } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Event } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'

const applicationSchema = z.object({
  name: z.string().min(1, '이름을 입력해주세요'),
  gender: z.enum(['male', 'female'], { required_error: '성별을 선택해주세요' }),
  age: z.number().min(18, '18세 이상만 신청 가능합니다').max(80, '80세 이하만 신청 가능합니다'),
  phone: z.string().min(1, '연락처를 입력해주세요'),
  height: z.number().min(100, '키는 100cm 이상이어야 합니다').max(250, '키는 250cm 이하여야 합니다'),
  weight: z.number().min(30, '체중은 30kg 이상이어야 합니다').max(200, '체중은 200kg 이하여야 합니다'),
  ideal_type: z.string().min(1, '이상형을 입력해주세요'),
  consent: z.boolean().refine(val => val === true, '개인정보 수집 및 이용에 동의해주세요'),
})

type ApplicationData = z.infer<typeof applicationSchema>

interface ApplicationModalProps {
  event: Event
  onClose: () => void
  onSuccess: () => void
}

export function ApplicationModal({ event, onClose, onSuccess }: ApplicationModalProps) {
  const { user, profile } = useAuth()
  const [photos, setPhotos] = useState<string[]>(profile?.photos || [])
  const [uploading, setUploading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<ApplicationData>({
    resolver: zodResolver(applicationSchema),
    defaultValues: profile ? {
      name: profile.name || '',
      gender: profile.gender,
      age: profile.birth_year ? new Date().getFullYear() - profile.birth_year : undefined,
      phone: profile.phone || '',
      height: profile.height || undefined,
      weight: profile.weight || undefined,
      ideal_type: profile.ideal_type || '',
      consent: false,
    } : {
      consent: false,
    },
  })

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !user) return

    if (photos.length >= 3) {
      setError('최대 3장까지 업로드 가능합니다')
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

  const onSubmit = async (data: ApplicationData) => {
    if (!user) return
    if (photos.length === 0) {
      setError('최소 1장의 사진을 업로드해주세요')
      return
    }

    setSubmitting(true)
    setError(null)

    try {
      // Mock application submission
      console.log('Application submitted:', {
        event_id: event.id,
        user_id: user.id,
        form_snapshot: { ...data, photos }
      })
      
      // Simulate success after a short delay
      await new Promise(resolve => setTimeout(resolve, 1500))
      setSuccess(true)
      
      // Close modal after showing success
      setTimeout(() => {
        onSuccess()
      }, 2000)
    } catch (err) {
      setError(err instanceof Error ? err.message : '신청에 실패했습니다')
    } finally {
      setSubmitting(false)
    }
  }

  if (success) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-2xl p-8 max-w-sm w-full text-center"
        >
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-green-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">신청 완료!</h3>
          <p className="text-gray-600">모임 신청이 성공적으로 완료되었습니다. 결과는 마이페이지에서 확인하실 수 있습니다.</p>
        </motion.div>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-bold text-gray-900">{event.title} 신청</h2>
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
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
                나이 *
              </label>
              <input
                type="number"
                {...register('age', { valueAsNumber: true })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="나이를 입력하세요"
              />
              {errors.age && (
                <p className="mt-1 text-sm text-red-600">{errors.age.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                연락처 *
              </label>
              <input
                {...register('phone')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="010-0000-0000"
              />
              {errors.phone && (
                <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                키 (cm) *
              </label>
              <input
                type="number"
                {...register('height', { valueAsNumber: true })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="170"
              />
              {errors.height && (
                <p className="mt-1 text-sm text-red-600">{errors.height.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                체중 (kg) *
              </label>
              <input
                type="number"
                {...register('weight', { valueAsNumber: true })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="65"
              />
              {errors.weight && (
                <p className="mt-1 text-sm text-red-600">{errors.weight.message}</p>
              )}
            </div>
          </div>

          {/* Ideal Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              이상형 *
            </label>
            <textarea
              {...register('ideal_type')}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="어떤 분과 만나고 싶으신지 간단히 적어주세요..."
            />
            {errors.ideal_type && (
              <p className="mt-1 text-sm text-red-600">{errors.ideal_type.message}</p>
            )}
          </div>

          {/* Photos */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              사진 (1-3장 필수) *
            </label>
            
            <div className="grid grid-cols-3 gap-4 mb-4">
              {photos.map((photo, index) => (
                <div key={index} className="relative">
                  <img
                    src={photo}
                    alt={`사진 ${index + 1}`}
                    className="w-full h-24 object-cover rounded-lg"
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
              
              {photos.length < 3 && (
                <label className="flex flex-col items-center justify-center h-24 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-orange-500 transition-colors">
                  {uploading ? (
                    <div className="animate-spin w-5 h-5 border-2 border-orange-500 border-t-transparent rounded-full"></div>
                  ) : (
                    <>
                      <Upload className="w-6 h-6 text-gray-400" />
                      <span className="text-xs text-gray-500 mt-1">업로드</span>
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
              className="mt-1 w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
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
  )
}