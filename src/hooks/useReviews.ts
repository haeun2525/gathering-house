import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'

export interface Review {
  id: string
  event_id: string
  user_id: string
  rating: number
  content: string
  created_at: string
  updated_at: string
}

// Mock reviews for development
const MOCK_REVIEWS: Review[] = []

export function useUserReview(eventId: string) {
  const { user } = useAuth()
  const [review, setReview] = useState<Review | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchReview = async () => {
    if (!user || !eventId) return

    setLoading(true)
    setError(null)

    try {
      // In development mode, check mock data
      const mockReview = MOCK_REVIEWS.find(r => r.event_id === eventId && r.user_id === user.id)
      if (mockReview) {
        setReview(mockReview)
        return
      }

      // In production, fetch from Supabase
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('event_id', eventId)
        .eq('user_id', user.id)
        .maybeSingle()

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
        throw error
      }

      setReview(data || null)
    } catch (err) {
      console.error('Error fetching review:', err)
      setError(err instanceof Error ? err.message : '후기를 불러오는데 실패했습니다')
    } finally {
      setLoading(false)
    }
  }

  const createReview = async (rating: number, content: string): Promise<Review> => {
    if (!user) throw new Error('로그인이 필요합니다')

    const reviewData = {
      event_id: eventId,
      user_id: user.id,
      rating,
      content: content.trim(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    // In development mode, add to mock data
    const newReview: Review = {
      id: `review-${Date.now()}`,
      ...reviewData
    }
    
    MOCK_REVIEWS.push(newReview)
    setReview(newReview)
    return newReview

    // In production, save to Supabase
    // const { data, error } = await supabase
    //   .from('reviews')
    //   .insert([reviewData])
    //   .select()
    //   .single()

    // if (error) throw error
    // setReview(data)
    // return data
  }

  const updateReview = async (rating: number, content: string): Promise<Review> => {
    if (!user || !review) throw new Error('후기를 찾을 수 없습니다')

    const updatedData = {
      rating,
      content: content.trim(),
      updated_at: new Date().toISOString()
    }

    // In development mode, update mock data
    const mockIndex = MOCK_REVIEWS.findIndex(r => r.id === review.id)
    if (mockIndex >= 0) {
      MOCK_REVIEWS[mockIndex] = { ...review, ...updatedData }
      setReview(MOCK_REVIEWS[mockIndex])
      return MOCK_REVIEWS[mockIndex]
    }

    // In production, update in Supabase
    // const { data, error } = await supabase
    //   .from('reviews')
    //   .update(updatedData)
    //   .eq('id', review.id)
    //   .select()
    //   .single()

    // if (error) throw error
    // setReview(data)
    // return data

    const updatedReview = { ...review, ...updatedData }
    setReview(updatedReview)
    return updatedReview
  }

  useEffect(() => {
    fetchReview()
  }, [user, eventId])

  return {
    review,
    loading,
    error,
    createReview,
    updateReview,
    refetch: fetchReview
  }
}