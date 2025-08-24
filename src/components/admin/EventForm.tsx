import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ArrowLeft, Save, Calendar, Clock, Users } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../contexts/AuthContext'

const eventSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  event_date: z.string().min(1, 'Date is required'),
  start_time: z.string().min(1, 'Start time is required'),
  end_time: z.string().min(1, 'End time is required'),
  capacity_male: z.number().min(1, 'Male capacity must be at least 1'),
  capacity_female: z.number().min(1, 'Female capacity must be at least 1'),
  application_deadline: z.string().min(1, 'Application deadline is required'),
})

type EventData = z.infer<typeof eventSchema>

export function EventForm() {
  const navigate = useNavigate()
  const { eventId } = useParams()
  const { profile } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const isEditing = Boolean(eventId)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<EventData>({
    resolver: zodResolver(eventSchema),
  })

  useEffect(() => {
    if (isEditing && eventId) {
      fetchEvent()
    }
  }, [eventId, isEditing])

  const fetchEvent = async () => {
    if (!eventId) return

    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('id', eventId)
        .single()

      if (error) throw error

      setValue('title', data.title)
      setValue('description', data.description || '')
      setValue('event_date', data.event_date)
      setValue('start_time', data.start_time)
      setValue('end_time', data.end_time)
      setValue('capacity_male', data.capacity_male)
      setValue('capacity_female', data.capacity_female)
      setValue('application_deadline', data.application_deadline.split('.')[0]) // Remove milliseconds for datetime-local
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch event')
    }
  }

  const onSubmit = async (data: EventData) => {
    if (!profile) return

    setLoading(true)
    setError(null)

    try {
      const eventData = {
        ...data,
        created_by: profile.id,
        application_deadline: new Date(data.application_deadline).toISOString(),
      }

      if (isEditing) {
        const { error } = await supabase
          .from('events')
          .update(eventData)
          .eq('id', eventId)

        if (error) throw error
      } else {
        const { error } = await supabase
          .from('events')
          .insert([eventData])

        if (error) throw error
      }

      navigate('/admin/events')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save event')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center space-x-4 mb-8">
        <button
          onClick={() => navigate('/admin/events')}
          className="text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-2xl font-bold text-gray-900">
          {isEditing ? 'Edit Event' : 'Create New Event'}
        </h1>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-lg p-6"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic Information */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-orange-500" />
              <span>Event Information</span>
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Event Title *
                </label>
                <input
                  {...register('title')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Enter event title"
                />
                {errors.title && (
                  <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  {...register('description')}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Describe the event..."
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Event Date *
                  </label>
                  <input
                    type="date"
                    {...register('event_date')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                  {errors.event_date && (
                    <p className="mt-1 text-sm text-red-600">{errors.event_date.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Start Time *
                  </label>
                  <input
                    type="time"
                    {...register('start_time')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                  {errors.start_time && (
                    <p className="mt-1 text-sm text-red-600">{errors.start_time.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    End Time *
                  </label>
                  <input
                    type="time"
                    {...register('end_time')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                  {errors.end_time && (
                    <p className="mt-1 text-sm text-red-600">{errors.end_time.message}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Capacity */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
              <Users className="w-5 h-5 text-orange-500" />
              <span>Capacity Settings</span>
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Male Capacity *
                </label>
                <input
                  type="number"
                  {...register('capacity_male', { valueAsNumber: true })}
                  min="1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
                {errors.capacity_male && (
                  <p className="mt-1 text-sm text-red-600">{errors.capacity_male.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Female Capacity *
                </label>
                <input
                  type="number"
                  {...register('capacity_female', { valueAsNumber: true })}
                  min="1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
                {errors.capacity_female && (
                  <p className="mt-1 text-sm text-red-600">{errors.capacity_female.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Application Deadline */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
              <Clock className="w-5 h-5 text-orange-500" />
              <span>Application Settings</span>
            </h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Application Deadline *
              </label>
              <input
                type="datetime-local"
                {...register('application_deadline')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
              {errors.application_deadline && (
                <p className="mt-1 text-sm text-red-600">{errors.application_deadline.message}</p>
              )}
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700">
              {error}
            </div>
          )}

          {/* Submit Button */}
          <div className="flex space-x-3 pt-6">
            <button
              type="button"
              onClick={() => navigate('/admin/events')}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50 flex items-center justify-center space-x-2"
            >
              <Save className="w-5 h-5" />
              <span>{loading ? 'Saving...' : isEditing ? 'Update Event' : 'Create Event'}</span>
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}