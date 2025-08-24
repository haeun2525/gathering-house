import React from 'react'
import { Routes, Route, Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Calendar, Users, Settings, BarChart, MessageCircle } from 'lucide-react'
import { EventsManager } from './EventsManager'
import { ApplicationsManager } from './ApplicationsManager'
import { ReviewsManager } from './ReviewsManager'

export function AdminDashboard() {
  const location = useLocation()
  
  const isActive = (path: string) => location.pathname === path || location.pathname.startsWith(path)

  const navItems = [
    { path: '/admin', label: 'Overview', icon: BarChart },
    { path: '/admin/events', label: 'Events', icon: Calendar },
    { path: '/admin/applications', label: 'Applications', icon: Users },
    { path: '/admin/reviews', label: 'Reviews', icon: MessageCircle },
  ]

  return (
    <div className="max-w-7xl mx-auto p-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
        <p className="text-gray-600">Manage events and applications</p>
      </div>

      {/* Navigation */}
      <div className="flex space-x-1 mb-8 bg-gray-100 p-1 rounded-lg w-fit">
        {navItems.map(({ path, label, icon: Icon }) => (
          <Link
            key={path}
            to={path}
            className={`px-4 py-2 rounded-md font-medium transition-all ${
              isActive(path)
                ? 'bg-white text-orange-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <div className="flex items-center space-x-2">
              <Icon className="w-4 h-4" />
              <span>{label}</span>
            </div>
          </Link>
        ))}
      </div>

      {/* Content */}
      <Routes>
        <Route path="/" element={<AdminOverview />} />
        <Route path="/events/*" element={<EventsManager />} />
        <Route path="/applications/*" element={<ApplicationsManager />} />
        <Route path="/reviews" element={<ReviewsManager />} />
      </Routes>
    </div>
  )
}

function AdminOverview() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="grid grid-cols-1 md:grid-cols-3 gap-6"
    >
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold mb-2">Quick Stats</h3>
        <p className="text-gray-600">Overview of platform activity</p>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold mb-2">Recent Activity</h3>
        <p className="text-gray-600">Latest applications and events</p>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold mb-2">Actions</h3>
        <div className="space-y-2">
          <Link
            to="/admin/events/new"
            className="block w-full text-center bg-orange-500 text-white py-2 px-4 rounded-lg hover:bg-orange-600 transition-colors"
          >
            Create Event
          </Link>
        </div>
      </div>
    </motion.div>
  )
}