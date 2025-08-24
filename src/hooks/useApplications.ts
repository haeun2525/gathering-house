import { useState, useEffect } from 'react'
import { Application } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'

// Mock applications data
const MOCK_APPLICATIONS: (Application & { event: any })[] = [
  {
    id: 'app-1',
    event_id: 'event-1',
    user_id: '12345678-1234-5678-9012-123456789012',
    status: 'confirmed',
    form_snapshot: {
      name: 'Dev User',
      gender: 'male',
      age: 28,
      phone: '010-1234-5678',
      height: 175,
      weight: 70,
      photos: ['https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face'],
      ideal_type: '유머러스하고 대화가 잘 통하는 분',
      participation_type: 'both'
    },
    applied_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    event: {
      id: 'event-1',
      title: '을지로 솔로파티',
      event_date: '2025-01-26',
      start_time: '20:00',
      end_time: '02:00'
    }
  },
  {
    id: 'app-2',
    event_id: 'event-2',
    user_id: '12345678-1234-5678-9012-123456789012',
    status: 'waitlist',
    form_snapshot: {
      name: 'Dev User',
      gender: 'male',
      age: 28,
      phone: '010-1234-5678',
      height: 175,
      weight: 70,
      photos: ['https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face'],
      ideal_type: '활발하고 긍정적인 분',
      participation_type: 'part1'
    },
    applied_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    event: {
      id: 'event-2',
      title: '신촌 게하파티',
      event_date: '2025-01-27',
      start_time: '20:00',
      end_time: '02:00'
    }
  },
  {
    id: 'app-3',
    event_id: 'event-3',
    user_id: '12345678-1234-5678-9012-123456789012',
    status: 'completed',
    form_snapshot: {
      name: 'Dev User',
      gender: 'male',
      age: 28,
      phone: '010-1234-5678',
      height: 175,
      weight: 70,
      photos: ['https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face'],
      ideal_type: '진솔하고 따뜻한 분',
      participation_type: 'part2'
    },
    applied_at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(), // 14 days ago
    event: {
      id: 'event-3',
      title: '을지로 솔로파티',
      event_date: '2025-01-12',
      start_time: '20:00',
      end_time: '02:00'
    }
  },
  {
    id: 'app-4',
    event_id: 'event-4',
    user_id: '12345678-1234-5678-9012-123456789012',
    status: 'completed',
    form_snapshot: {
      name: 'Dev User',
      gender: 'male',
      age: 28,
      phone: '010-1234-5678',
      height: 175,
      weight: 70,
      photos: ['https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face'],
      ideal_type: '책임감 있고 성실한 분',
      participation_type: 'both'
    },
    applied_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days ago
    event: {
      id: 'event-4',
      title: '신촌 게하파티',
      event_date: '2024-12-29',
      start_time: '20:00',
      end_time: '02:00'
    }
  }
]

export function useMyApplications() {
  const { user } = useAuth()
  const [applications, setApplications] = useState<(Application & { event: any })[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (user) {
      // In development mode, show mock applications
      setApplications(MOCK_APPLICATIONS)
    }
  }, [user])

  const fetchApplications = async () => {
    // Mock function - applications are loaded in useEffect
  }

  return { applications, loading, error, refetch: fetchApplications }
}

export function useEventApplications(eventId: string | undefined) {
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchApplications = async () => {
    // Mock function
  }

  const updateApplicationStatus = async (applicationId: string, status: Application['status']) => {
    // Mock function
  }

  return { applications, loading, error, updateApplicationStatus, refetch: fetchApplications }
}