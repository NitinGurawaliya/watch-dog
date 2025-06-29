'use client'

import React, { useState } from 'react'
import { LockClosedIcon } from '@heroicons/react/24/outline'

interface FeatureGateProps {
  children: React.ReactNode
  isLocked: boolean
  tooltipText?: string
  className?: string
}

const FeatureGate = ({ 
  children, 
  isLocked, 
  tooltipText = "Upgrade to Pro to unlock this feature",
  className = ""
}: FeatureGateProps) => {
  const [showTooltip, setShowTooltip] = useState(false)

  if (!isLocked) {
    return <div className={className}>{children}</div>
  }

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        {children}
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm rounded-lg flex items-center justify-center">
          <div className="bg-[#23272e] p-3 rounded-lg border border-neutral-700">
            <LockClosedIcon className="h-6 w-6 text-neutral-400" />
          </div>
        </div>
      </div>
      
      <div 
        className="absolute inset-0 cursor-pointer"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      />
      
      {showTooltip && (
        <div className="absolute z-50 bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-[#23272e] text-neutral-300 text-xs font-mono rounded border border-neutral-700 shadow-lg whitespace-nowrap">
          {tooltipText}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-[#23272e]"></div>
        </div>
      )}
    </div>
  )
}

export default FeatureGate 