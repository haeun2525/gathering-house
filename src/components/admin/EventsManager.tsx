import React, { useState } from 'react'
import { Routes, Route, Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { format } from 'date-fns'
import { Plus, Edit, Trash2, Users, Calendar, Clock } from 'lucide-react'
import { useEvents } from '../../hooks/useEvents'
import { EventForm } from './EventForm'

export function EventsManager() {
  return (
    <Routes>
      <Route path="/" element={<EventsList />} />
      <Route path="/new" element={<EventForm />} />
      <Route path="/:eventId/edit" element={<EventForm />} />
    </Routes>
  )
}

function EventsList() {
  const { events, loading, refetch } = useEvents()
  const navigate = useNavigate()

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-24 bg-gray-200 rounded-lg"></div>
        ))}
      </div>
    )
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Events Management</h2>
        <Link
          to="/admin/events/new"
          className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Create Event</span>
        </Link>
      </div>

      <div className="space-y-4">
        {events.map((event, index) => (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {event.title}
                </h3>
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span>{format(new Date(event.event_date), 'MMM d, yyyy')}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>{event.start_time} - {event.end_time}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Link
                  to={`/admin/events/${event.id}/edit`}
                  className="p-2 text-gray-600 hover:text-orange-600 transition-colors"
                >
                  <Edit className="w-5 h-5" />
                </Link>
                <button
                  onClick={() => {
                    if (confirm('Delete this event?')) {
                      // TODO: Implement delete
                    }
                  }}
                  className="p-2 text-gray-600 hover:text-red-600 transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-blue-50 p-3 rounded-lg">
                <div className="text-2xl font-bold text-blue-900">
                  {event.male_confirmed}/{event.capacity_male}
                </div>
                <div className="text-sm text-blue-700">Men</div>
              </div>
              
              <div className="bg-pink-50 p-3 rounded-lg">
                <div className="text-2xl font-bold text-pink-900">
                  {event.female_confirmed}/{event.capacity_female}
                </div>
                <div className="text-sm text-pink-700">Women</div>
              </div>
              
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="text-2xl font-bold text-gray-900">
                  {event.male_total + event.female_total}
                </div>
                <div className="text-sm text-gray-700">Total Applications</div>
              </div>
              
              <div className="bg-green-50 p-3 rounded-lg">
                <div className="text-2xl font-bold text-green-900">
                  {event.male_confirmed + event.female_confirmed}
                </div>
                <div className="text-sm text-green-700">Confirmed</div>
              </div>
            </div>

            <div className="mt-4 flex justify-end">
              <Link
                to={`/admin/applications/${event.id}`}
                className="text-orange-600 hover:text-orange-800 font-medium flex items-center space-x-1"
              >
                <Users className="w-4 h-4" />
                <span>Manage Applications</span>
              </Link>
            </div>
          </motion.div>
        ))}
      </div>

      {events.length === 0 && (
        <div className="text-center py-12">
          <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No events yet</h3>
          <p className="text-gray-600 mb-4">Create your first event to get started</p>
          <Link
            to="/admin/events/new"
            className="inline-flex items-center space-x-2 bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span>Create Event</span>
          </Link>
        </div>
      )}
    </div>
  )
}