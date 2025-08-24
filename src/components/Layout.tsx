import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Calendar, Clock, User, Home, LogOut } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

interface LayoutProps {
  children: React.ReactNode
}

export function Layout({ children }: LayoutProps) {
  const location = useLocation()
  const { signOut } = useAuth()

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/'
    }
    return location.pathname.startsWith(path)
  }

  const navItems = [
    { path: '/', label: '홈', icon: Home },
    { path: '/my', label: '기록', icon: User },
    { path: '/profile', label: '프로필', icon: User },
  ]

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      {/* Desktop Header */}
      <header className="hidden md:block bg-gray-900/95 backdrop-blur-sm shadow-lg border-b border-gray-800 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg">
                <Home className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-black text-white">Gathering House</span>
            </Link>

            <nav className="flex space-x-8">
              {navItems.map(({ path, label, icon: Icon }) => (
                <Link
                  key={path}
                  to={path}
                  className={`px-4 py-2 text-sm font-semibold transition-all duration-200 rounded-xl ${
                    isActive(path) 
                      ? 'text-white bg-orange-400' 
                      : 'text-gray-300 hover:text-white hover:bg-gray-800'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <Icon className="w-4 h-4" />
                    <span>{label}</span>
                  </div>
                </Link>
              ))}
              <button
                onClick={signOut}
                className="px-4 py-2 text-sm font-semibold text-gray-300 hover:text-white hover:bg-gray-800 transition-all duration-200 rounded-xl flex items-center space-x-2"
              >
                <LogOut className="w-4 h-4" />
                <span>로그아웃</span>
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 pb-20 md:pb-0 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {children}
        </motion.div>
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden bg-gray-900/95 backdrop-blur-sm border-t border-gray-800 fixed bottom-0 left-0 right-0 z-50 safe-area-pb shadow-lg">
        <div className="grid grid-cols-3 py-2">
          {navItems.map(({ path, label, icon: Icon }) => (
            <Link
              key={path}
              to={path}
              className={`flex flex-col items-center py-3 px-1 min-h-[48px] transition-all duration-200 rounded-xl mx-1 ${
                isActive(path) ? 'text-white bg-orange-400' : 'text-gray-400 hover:text-white'
              }`}
            >
              <Icon className="w-6 h-6 mb-1" strokeWidth={isActive(path) ? 2.5 : 2} />
              <span className={`text-xs ${isActive(path) ? 'font-bold' : 'font-medium'}`}>{label}</span>
            </Link>
          ))}
        </div>
      </nav>
    </div>
  )
}