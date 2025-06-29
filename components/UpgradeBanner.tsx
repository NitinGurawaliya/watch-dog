'use client'

import React from 'react'
import { 
  SparklesIcon,
  ArrowRightIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline'
import { useRouter } from 'next/navigation'

interface UpgradeBannerProps {
  reason?: string
  onClose?: () => void
  showCloseButton?: boolean
}

const UpgradeBanner = ({ 
  reason = "You've reached the free plan limit", 
  onClose, 
  showCloseButton = true 
}: UpgradeBannerProps) => {
  const router = useRouter()

  const handleUpgrade = () => {
    router.push('/pricing')
  }

  return (
    <div className="bg-gradient-to-r from-lime-400/10 to-green-400/10 border border-lime-400/30 rounded-lg p-4 mb-6 relative">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0">
          <div className="w-8 h-8 bg-lime-400/20 rounded-full flex items-center justify-center">
            <SparklesIcon className="h-4 w-4 text-lime-400" />
          </div>
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="text-lime-400 font-semibold font-mono text-sm mb-1">
            Upgrade to Pro
          </h3>
          <p className="text-neutral-400 text-sm font-mono mb-3">
            {reason}. Unlock unlimited projects, advanced analytics, and geo tracking.
          </p>
          
          <div className="flex items-center gap-3">
            <button
              onClick={handleUpgrade}
              className="bg-lime-400 text-[#18181b] px-4 py-2 rounded font-bold text-sm font-mono hover:bg-lime-300 transition flex items-center gap-2"
            >
              Upgrade Now
              <ArrowRightIcon className="h-3 w-3" />
            </button>
            
            <button
              onClick={handleUpgrade}
              className="text-lime-400 hover:text-lime-300 text-sm font-mono transition"
            >
              View Plans
            </button>
          </div>
        </div>

        {showCloseButton && onClose && (
          <button
            onClick={onClose}
            className="flex-shrink-0 text-neutral-400 hover:text-neutral-300 transition"
          >
            <XMarkIcon className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  )
}

export default UpgradeBanner 