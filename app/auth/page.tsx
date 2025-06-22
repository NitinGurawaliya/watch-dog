import LoginButton from '@/components/Loginbutton'
import { requireGuest } from '@/lib/auth-utils'
import React from 'react'

const Auth = async () => {
  // This will redirect authenticated users to /dashboard
  await requireGuest();

  return (
    <div className="min-h-screen bg-[#18181b] text-neutral-100 flex items-center justify-center">
      <div className="bg-[#23272e] p-8 rounded-lg border border-neutral-800 max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-lime-400 font-mono mb-2">
            who's viewing me
          </h1>
          <p className="text-neutral-400 text-sm font-mono">
            Sign in to access your analytics dashboard
          </p>
        </div>
        
        <div className="space-y-4">
          <LoginButton provider="google" />
          <LoginButton provider="github" />
          <LoginButton provider="twitter" />
        </div>
        
        <div className="mt-8 text-center">
          <p className="text-xs text-neutral-500 font-mono">
            Privacy-first analytics for developers
          </p>
        </div>
      </div>
    </div>
  )
}

export default Auth;