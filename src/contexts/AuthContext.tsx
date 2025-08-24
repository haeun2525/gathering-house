import React, { createContext, useContext, useEffect, useState } from 'react'
import { User } from '@supabase/supabase-js'
import { supabase, Profile } from '../lib/supabase'

// Development mode - set to true to bypass authentication
const DEV_MODE = true

// Mock regular user data for development
const MOCK_USER: User = {
  id: '12345678-1234-5678-9012-123456789012',
  email: 'user@gmai  l.com',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  aud: 'authenticated',
  role: 'authenticated',
  app_metadata: {},
  user_metadata: { name: '김하은' },
  identities: [],
  factors: []
} as User

const MOCK_PROFILE: Profile = {
  id: '12345678-1234-5678-9012-123456789012',
  email: 'user@gmail.com',
  name: '김하은',
  gender: 'female',
  birth_year: 2000,
  phone: '010-1234-5678',
  height: 163,
  weight: 70,
  ideal_type: '키 크고 다정하신 분, 쉬는 날 함께 나가서 이곳저곳 돌아다닐 수 있는 분이 좋아요!',
  photos: [],
  is_admin: false,
  created_at: new Date().toISOString()
}

interface AuthContextType {
  user: User | null
  profile: Profile | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, name: string) => Promise<void>
  signOut: () => Promise<void>
  updateProfile: (updates: Partial<Profile>) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Development mode bypass
    if (DEV_MODE) {
      setUser(MOCK_USER)
      setProfile(MOCK_PROFILE)
      setLoading(false)
      return
    }

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        fetchProfile(session.user.id)
      } else {
        setLoading(false)
      }
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_ , session) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        await fetchProfile(session.user.id)
      } else {
        setProfile(null)
        setLoading(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) throw error
      setProfile(data)
    } catch (error) {
      console.error('Error fetching profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const signIn = async (email: string, password: string) => {
    // Development mode bypass
    if (DEV_MODE) {
      setUser(MOCK_USER)
      setProfile(MOCK_PROFILE)
      return
    }

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (error) {
      if (error.message.includes('For security purposes, you can only request this after')) {
        throw new Error('이메일 전송 요청이 너무 많습니다. 잠시 후 다시 시도해주세요.')
      }
      if (error.message === 'Email not confirmed' || error.code === 'email_not_confirmed') {
        throw new Error('이메일 인증이 완료되지 않았습니다. 이메일을 확인하여 인증 링크를 클릭해주세요.')
      }
      if (error.message === 'Invalid login credentials' || error.message.includes('invalid_credentials')) {
        throw new Error('이메일 또는 비밀번호가 올바르지 않습니다.')
      }
      throw new Error('로그인 중 오류가 발생했습니다. 다시 시도해주세요.')
    }
  }

  const signUp = async (email: string, password: string, name: string) => {
    // Development mode bypass
    if (DEV_MODE) {
      setUser(MOCK_USER)
      setProfile(MOCK_PROFILE)
      return
    }

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
        },
      },
    })
    if (error) {
      if (error.message.includes('For security purposes, you can only request this after')) {
        throw new Error('이메일 전송 요청이 너무 많습니다. 잠시 후 다시 시도해주세요.')
      }
      if (error.message.includes('already registered')) {
        throw new Error('이미 등록된 이메일입니다.')
      }
      throw error
    }
  }

  const signOut = async () => {
    // Development mode bypass
    if (DEV_MODE) {
      // In dev mode, don't actually sign out, just refresh the page
      window.location.reload()
      return
    }

    const { error } = await supabase.auth.signOut()
    if (error) throw error
  }

  const updateProfile = async (updates: Partial<Profile>) => {
    // Development mode bypass
    if (DEV_MODE) {
      setProfile(prev => prev ? { ...prev, ...updates } : null)
      return
    }

    if (!user) throw new Error('No user found')

    const { error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', user.id)

    if (error) throw error
    await fetchProfile(user.id)
  }

  return (
    <AuthContext.Provider value={{
      user,
      profile,
      loading,
      signIn,
      signUp,
      signOut,
      updateProfile,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}