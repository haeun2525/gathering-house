import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Layout } from './components/Layout'
import { CalendarView } from './components/CalendarView'
import { EventDetailPage } from './components/EventDetailPage'
import { AuthScreen } from './components/Auth'
import { MyPage } from './components/MyPage'
import { Profile } from './components/Profile'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { ApplyFormModal } from './components/ApplyFormModal'
import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'

function AppContent() {
  const { user, loading } = useAuth()
  const [searchParams] = useSearchParams()
  const [applyModalOpen, setApplyModalOpen] = useState(false)
  const [eventId, setEventId] = useState<string>('')

  // Handle deep link to apply modal after login
  useEffect(() => {
    if (user && !loading) {
      const nextUrl = searchParams.get('next')
      if (nextUrl && nextUrl.includes('/events/') && nextUrl.includes('/apply')) {
        const eventIdMatch = nextUrl.match(/\/events\/([^\/]+)\/apply/)
        if (eventIdMatch) {
          setEventId(eventIdMatch[1])
          setApplyModalOpen(true)
        }
      }
    }
  }, [user, loading, searchParams])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full"></div>
      </div>
    )
  }

  if (!user) {
    return <AuthScreen />
  }

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<CalendarView />} />
        <Route path="/events/:date" element={<EventDetailPage />} />
        <Route path="/events/:id/apply" element={<CalendarView />} />
        <Route path="/my" element={<MyPage />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      
      {/* Deep link apply modal */}
      <ApplyFormModal
        isOpen={applyModalOpen}
        onClose={() => setApplyModalOpen(false)}
        eventId={eventId}
      />
    </Layout>
  )
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  )
}

export default App