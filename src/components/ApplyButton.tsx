import React from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Heart } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

interface ApplyButtonProps {
  eventId: string
  className?: string
  children?: React.ReactNode
  onApply?: () => void
}

export function ApplyButton({ eventId, className = '', children, onApply }: ApplyButtonProps) {
  const { user } = useAuth()
  const navigate = useNavigate()

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    
    if (!user) {
      // Not logged in - redirect to login with next parameter
      navigate(`/login?next=/events/${eventId}/apply`)
    } else {
      // Logged in - trigger modal
      onApply?.()
    }
  }

  return (
    <div className="relative z-10">
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleClick}
        data-testid="apply-button"
        className={`btn-primary flex items-center justify-center space-x-2 min-h-[48px] ${className}`}
      >
        <Heart className="w-5 h-5" />
        <span>{children || '신청하기'}</span>
      </motion.button>
    </div>
  )
}