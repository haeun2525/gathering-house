import React from 'react'
import { motion } from 'framer-motion'
import { Calendar, CalendarDays } from 'lucide-react'

interface SegmentedControlProps {
  viewMode: 'month' | 'week'
  onViewModeChange: (mode: 'month' | 'week') => void
}

export function SegmentedControl({ viewMode, onViewModeChange }: SegmentedControlProps) {
  return (
    <div className="flex justify-center">
      <div className="flex bg-white/20 backdrop-blur-sm p-1 rounded-2xl border border-white/30">
        <button
          onClick={() => onViewModeChange('month')}
          className={`
            relative px-6 tablet:px-8 py-3 tablet:py-4 rounded-xl font-semibold transition-all duration-300
            flex items-center space-x-2 min-h-[44px]
            ${viewMode === 'month' ? 'text-primary' : 'text-white/80 hover:text-white'}
          `}
        >
          {viewMode === 'month' && (
            <motion.div
              layoutId="activeTab"
              className="absolute inset-0 bg-white rounded-xl shadow-lg"
              transition={{ type: "spring", bounce: 0.15, duration: 0.5 }}
            />
          )}
          <Calendar className="w-5 h-5 relative z-10" />
          <span className="relative z-10 text-base font-semibold">Month</span>
        </button>
        
        <button
          onClick={() => onViewModeChange('week')}
          className={`
            relative px-6 tablet:px-8 py-3 tablet:py-4 rounded-xl font-semibold transition-all duration-300
            flex items-center space-x-2 min-h-[44px]
            ${viewMode === 'week' ? 'text-primary' : 'text-white/80 hover:text-white'}
          `}
        >
          {viewMode === 'week' && (
            <motion.div
              layoutId="activeTab"
              className="absolute inset-0 bg-white rounded-xl shadow-lg"
              transition={{ type: "spring", bounce: 0.15, duration: 0.5 }}
            />
          )}
          <CalendarDays className="w-5 h-5 relative z-10" />
          <span className="relative z-10 text-base font-semibold">Week</span>
        </button>
      </div>
    </div>
  )
}