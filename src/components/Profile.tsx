import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { User, Mail, Phone, Heart, Upload, Trash2, Save } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'

const profileSchema = z.object({
  name: z.string().min(1, '이름을 입력해주세요'),
  gender: z.enum(['male', 'female']).optional(),
  birth_year: z.number().min(1950).max(2010).optional(),
  phone: z.string().optional(),
  ideal_type: z.string().optional(),
})

type ProfileData = z.infer<typeof profileSchema>

export function Profile() {
  const { profile, updateProfile } = useAuth()
  const [facePhotos, setFacePhotos] = useState<string[]>([])
  const [bodyPhotos, setBodyPhotos] = useState<string[]>([])
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  // Initialize photos from profile
  React.useEffect(() => {
    if (profile?.photos) {
      // Assume first photo is face, second is body (or split evenly)
      const photos = profile.photos
      setFacePhotos(photos.slice(0, Math.ceil(photos.length / 2)))
      setBodyPhotos(photos.slice(Math.ceil(photos.length / 2)))
    }
  }, [profile])

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<ProfileData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: profile?.name || '',
      gender: profile?.gender,
      birth_year: profile?.birth_year || undefined,
      phone: profile?.phone || '',
      ideal_type: profile?.ideal_type || '',
    },
  })

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'face' | 'body') => {
    const file = e.target.files?.[0]
    if (!file || !profile) return

    const currentPhotos = type === 'face' ? facePhotos : bodyPhotos
    if (currentPhotos.length >= 2) {
      setMessage({ type: 'error', text: '최대 2장까지 업로드 가능합니다' })
      return
    }

    setUploading(true)
    try {
      // Create a preview URL from the uploaded file
      const mockPhotoUrl = URL.createObjectURL(file)

      if (type === 'face') {
        setFacePhotos(prev => [...prev, mockPhotoUrl])
      } else {
        setBodyPhotos(prev => [...prev, mockPhotoUrl])
      }
      
      setMessage({ type: 'success', text: '사진이 업로드되었습니다!' })
    } catch (err) {
      setMessage({ 
        type: 'error', 
        text: err instanceof Error ? err.message : '업로드에 실패했습니다' 
      })
    } finally {
      setUploading(false)
    }
  }

  const removePhoto = (index: number, type: 'face' | 'body') => {
    if (type === 'face') {
      setFacePhotos(prev => prev.filter((_, i) => i !== index))
    } else {
      setBodyPhotos(prev => prev.filter((_, i) => i !== index))
    }
  }

  const onSubmit = async (data: ProfileData) => {
    setSaving(true)
    setMessage(null)

    try {
      await updateProfile({
        ...data,
        photos: [...facePhotos, ...bodyPhotos],
      })
      setMessage({ type: 'success', text: '프로필이 성공적으로 업데이트되었습니다!' })
    } catch (err) {
      setMessage({ 
        type: 'error', 
        text: err instanceof Error ? err.message : '업데이트에 실패했습니다' 
      })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-gray-900 mb-2">내 프로필</h1>
        <p className="text-gray-600">개인정보와 선호사항을 관리하세요</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-xl shadow-lg p-6"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic Information */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
              <User className="w-5 h-5 text-orange-500" />
              <span>기본 정보</span>
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  이름 *
                </label>
                <input
                  {...register('name')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900 bg-white"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  이메일
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="email"
                    value={profile?.email || ''}
                    disabled
                    className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  성별
                </label>
                <select
                  {...register('gender')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900 bg-white"
                >
                  <option value="">성별 선택</option>
                  <option value="male">남성</option>
                  <option value="female">여성</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  출생년도
                </label>
                <input
                  type="number"
                  {...register('birth_year', { valueAsNumber: true })}
                  min="1950"
                  max="2010"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900 bg-white"
                />
                {errors.birth_year && (
                  <p className="mt-1 text-sm text-red-600">{errors.birth_year.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  연락처
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    {...register('phone')}
                    className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900 bg-white"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Photos */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-6">
              프로필 사진
            </h3>
            
            <div className="space-y-6">
              {/* Face Photos */}
              <div>
                <h4 className="text-md font-medium text-gray-800 mb-3">얼굴 사진 (최소 1장, 최대 2장)</h4>
                <div className="grid grid-cols-2 gap-4">
                  {facePhotos.map((photo, index) => (
                    <div key={index} className="relative">
                      <img
                        src={photo}
                        alt={`얼굴 사진 ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removePhoto(index, 'face')}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  
                  {facePhotos.length < 2 && (
                    <label className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-orange-500 transition-colors">
                      {uploading ? (
                        <div className="animate-spin w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full"></div>
                      ) : (
                        <>
                          <Upload className="w-8 h-8 text-gray-400 mb-2" />
                          <span className="text-sm text-gray-500">얼굴 사진 업로드</span>
                        </>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handlePhotoUpload(e, 'face')}
                        className="hidden"
                        disabled={uploading}
                      />
                    </label>
                  )}
                </div>
              </div>

              {/* Body Photos */}
              <div>
                <h4 className="text-md font-medium text-gray-800 mb-3">전신 사진 (최소 1장, 최대 2장)</h4>
                <div className="grid grid-cols-2 gap-4">
                  {bodyPhotos.map((photo, index) => (
                    <div key={index} className="relative">
                      <img
                        src={photo}
                        alt={`전신 사진 ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removePhoto(index, 'body')}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  
                  {bodyPhotos.length < 2 && (
                    <label className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-orange-500 transition-colors">
                      {uploading ? (
                        <div className="animate-spin w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full"></div>
                      ) : (
                        <>
                          <Upload className="w-8 h-8 text-gray-400 mb-2" />
                          <span className="text-sm text-gray-500">전신 사진 업로드</span>
                        </>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handlePhotoUpload(e, 'body')}
                        className="hidden"
                        disabled={uploading}
                      />
                    </label>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Preferences */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
              <Heart className="w-5 h-5 text-orange-500" />
              <span>선호사항</span>
            </h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                이상형을 설명해주세요
              </label>
              <textarea
                {...register('ideal_type')}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900 bg-white"
                placeholder="어떤 분과 만나고 싶으신지 간단히 적어주세요..."
              />
            </div>
          </div>

          {/* Message */}
          {message && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-3 rounded-lg border ${
                message.type === 'success' 
                  ? 'bg-green-50 border-green-200 text-green-700'
                  : 'bg-red-50 border-red-200 text-red-700'
              }`}
            >
              {message.text}
            </motion.div>
          )}

          {/* Submit Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={saving || (!isDirty && JSON.stringify([...facePhotos, ...bodyPhotos]) === JSON.stringify(profile?.photos || []))}
            className="w-full bg-gradient-to-r from-orange-500 to-pink-500 text-white py-3 px-4 rounded-lg font-semibold hover:from-orange-600 hover:to-pink-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            <Save className="w-5 h-5" />
            <span>{saving ? '저장 중...' : '프로필 저장'}</span>
          </motion.button>
        </form>
      </motion.div>
    </div>
  )
}