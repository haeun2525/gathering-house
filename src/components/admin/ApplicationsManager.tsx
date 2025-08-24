import React, { useState } from 'react'
import { Routes, Route, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { format } from 'date-fns'
import { Download, User, Phone, Ruler, Weight, Check, X, Clock, ArrowLeft } from 'lucide-react'
import { useEventApplications } from '../../hooks/useApplications'
import { useEvent } from '../../hooks/useEvents'

export function ApplicationsManager() {
  return (
    <Routes>
      <Route path="/" element={<ApplicationsOverview />} />
      <Route path="/:eventId" element={<EventApplications />} />
    </Routes>
  )
}

function ApplicationsOverview() {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Applications Overview</h2>
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <p className="text-gray-600">Select an event from the Events page to manage applications.</p>
      </div>
    </div>
  )
}

function EventApplications() {
  const { eventId } = useParams()
  const { event, loading: eventLoading } = useEvent(eventId)
  const { applications, loading: applicationsLoading, updateApplicationStatus } = useEventApplications(eventId)
  const [selectedApplication, setSelectedApplication] = useState<string | null>(null)

  const handleStatusChange = async (applicationId: string, status: 'confirmed' | 'waitlist' | 'cancelled') => {
    try {
      await updateApplicationStatus(applicationId, status)
    } catch (error) {
      console.error('Failed to update application status:', error)
    }
  }

  const exportToCSV = () => {
    if (!applications.length) return

    const headers = ['Name', 'Gender', 'Age', 'Phone', 'Height', 'Weight', 'Status', 'Applied At']
    const csvContent = [
      headers.join(','),
      ...applications.map(app => [
        app.form_snapshot.name,
        app.form_snapshot.gender,
        app.form_snapshot.age,
        app.form_snapshot.phone,
        app.form_snapshot.height,
        app.form_snapshot.weight,
        app.status,
        format(new Date(app.applied_at), 'yyyy-MM-dd HH:mm')
      ].join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${event?.title || 'event'}_applications.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800'
      case 'waitlist': return 'bg-yellow-100 text-yellow-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      default: return 'bg-blue-100 text-blue-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed': return <Check className="w-4 h-4 text-green-500" />
      case 'waitlist': return <Clock className="w-4 h-4 text-yellow-500" />
      case 'cancelled': return <X className="w-4 h-4 text-red-500" />
      default: return <Clock className="w-4 h-4 text-blue-500" />
    }
  }

  if (eventLoading || applicationsLoading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-8 bg-gray-200 rounded w-1/3"></div>
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-24 bg-gray-200 rounded-lg"></div>
          ))}
        </div>
      </div>
    )
  }

  if (!event) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Event not found</p>
      </div>
    )
  }

  const maleApplications = applications.filter(app => app.form_snapshot.gender === 'male')
  const femaleApplications = applications.filter(app => app.form_snapshot.gender === 'female')
  const confirmedMale = maleApplications.filter(app => app.status === 'confirmed').length
  const confirmedFemale = femaleApplications.filter(app => app.status === 'confirmed').length

  return (
    <div>
      <div className="flex items-center space-x-4 mb-6">
        <button
          onClick={() => history.back()}
          className="text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h2 className="text-2xl font-bold text-gray-900">
          Applications for {event.title}
        </h2>
      </div>

      {/* Event Summary */}
      <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-blue-900">
              {confirmedMale}/{event.capacity_male}
            </div>
            <div className="text-sm text-blue-700">Men Confirmed</div>
          </div>
          
          <div className="bg-pink-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-pink-900">
              {confirmedFemale}/{event.capacity_female}
            </div>
            <div className="text-sm text-pink-700">Women Confirmed</div>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-gray-900">
              {applications.length}
            </div>
            <div className="text-sm text-gray-700">Total Applications</div>
          </div>
          
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-green-900">
              {confirmedMale + confirmedFemale}
            </div>
            <div className="text-sm text-green-700">Total Confirmed</div>
          </div>
        </div>

        <button
          onClick={exportToCSV}
          disabled={applications.length === 0}
          className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50 flex items-center space-x-2"
        >
          <Download className="w-5 h-5" />
          <span>Export CSV</span>
        </button>
      </div>

      {/* Applications List */}
      <div className="space-y-4">
        {applications.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg border">
            <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No applications yet</h3>
            <p className="text-gray-600">Applications will appear here once users start applying.</p>
          </div>
        ) : (
          applications.map((application, index) => (
            <motion.div
              key={application.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-all"
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {application.form_snapshot.name}
                    </h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                      <span className="capitalize">{application.form_snapshot.gender}</span>
                      <span>{application.form_snapshot.age} years old</span>
                      <span>Applied {format(new Date(application.applied_at), 'MMM d, h:mm a')}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(application.status)}
                    <span className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${getStatusColor(application.status)}`}>
                      {application.status}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
                  <div className="flex items-center space-x-2">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <span className="text-sm">{application.form_snapshot.phone}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Ruler className="w-4 h-4 text-gray-400" />
                    <span className="text-sm">{application.form_snapshot.height}cm</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Weight className="w-4 h-4 text-gray-400" />
                    <span className="text-sm">{application.form_snapshot.weight}kg</span>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Photos: </span>
                    <span className="text-sm font-medium">{application.form_snapshot.photos.length}</span>
                  </div>
                </div>

                {application.form_snapshot.ideal_type && (
                  <div className="mb-4">
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Ideal type:</span> {application.form_snapshot.ideal_type}
                    </p>
                  </div>
                )}

                {/* Photos */}
                {application.form_snapshot.photos.length > 0 && (
                  <div className="mb-4">
                    <div className="flex space-x-2">
                      {application.form_snapshot.photos.map((photo, photoIndex) => (
                        <img
                          key={photoIndex}
                          src={photo}
                          alt={`Photo ${photoIndex + 1}`}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleStatusChange(application.id, 'confirmed')}
                    disabled={application.status === 'confirmed'}
                    className="px-3 py-1 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-1"
                  >
                    <Check className="w-4 h-4" />
                    <span>Confirm</span>
                  </button>
                  
                  <button
                    onClick={() => handleStatusChange(application.id, 'waitlist')}
                    disabled={application.status === 'waitlist'}
                    className="px-3 py-1 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-1"
                  >
                    <Clock className="w-4 h-4" />
                    <span>Waitlist</span>
                  </button>
                  
                  <button
                    onClick={() => handleStatusChange(application.id, 'cancelled')}
                    disabled={application.status === 'cancelled'}
                    className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-1"
                  >
                    <X className="w-4 h-4" />
                    <span>Cancel</span>
                  </button>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  )
}