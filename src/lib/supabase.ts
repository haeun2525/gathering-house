import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface Profile {
  id: string
  email: string
  name: string
  gender?: 'male' | 'female'
  birth_year?: number
  phone?: string
  height?: number
  weight?: number
  ideal_type?: string
  photos: string[]
  is_admin: boolean
  created_at: string
}

export interface Event {
  id: string
  title: string
  description?: string
  event_date: string
  start_time: string
  end_time: string
  capacity_male: number
  capacity_female: number
  application_deadline: string
  status: 'active' | 'cancelled'
  created_at: string
  created_by?: string
}

export interface Application {
  id: string
  event_id: string
  user_id: string
  status: 'pending' | 'confirmed' | 'waitlist' | 'cancelled'
  form_snapshot: {
    name: string
    gender: 'male' | 'female'
    age: number
    phone: string
    height: number
    weight: number
    photos: string[]
    ideal_type: string
  }
  applied_at: string
}

export interface EventWithCounts extends Event {
  male_confirmed: number
  female_confirmed: number
  male_total: number
  female_total: number
}