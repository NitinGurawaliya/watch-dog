import LoginButton from '@/components/Loginbutton'
import { requireGuest } from '@/lib/auth-utils'
import React from 'react'

const Auth = async () => {
  // This will redirect authenticated users to /dashboard
  await requireGuest();

  return (
    <div className="min-h-screen bg-[#18181b] text-neutral-100 flex items-center justify-center">
      <div className="bg-[#23272e] p-8 rounded-lg border border-neutral-800 max-w-md w-full">
        <h1 className="text-2xl font-bold text-center mb-6 text-lime-400 font-mono">
          Sign In
        </h1>
        <LoginButton />
      </div>
    </div>
  )
}

export default Auth;