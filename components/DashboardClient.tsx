 'use client'

import { signOut } from 'next-auth/react'
import { Session } from 'next-auth'
import React from 'react'

interface DashboardClientProps {
  session: Session
}

const DashboardClient = ({ session }: DashboardClientProps) => {
  return (
    <div className="min-h-screen bg-[#18181b] text-neutral-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="bg-[#23272e] rounded-lg p-6 border border-neutral-800">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-lime-400 font-mono">
                Dashboard
              </h1>
              <p className="text-neutral-400 text-sm font-mono">
                Welcome back, {session.user?.name || session.user?.email}
              </p>
            </div>
            <button
              onClick={() => signOut({ callbackUrl: '/' })}
              className="px-4 py-2 bg-red-500 cursor-pointer text-white rounded hover:bg-red-600 transition font-mono text-sm"
            >
              Logout
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-[#18181b] p-4 rounded border border-neutral-800">
              <h3 className="text-green-400 font-semibold mb-2 font-mono">Active Visitors</h3>
              <p className="text-2xl font-bold text-lime-400">0</p>
            </div>
            <div className="bg-[#18181b] p-4 rounded border border-neutral-800">
              <h3 className="text-green-400 font-semibold mb-2 font-mono">Total Views</h3>
              <p className="text-2xl font-bold text-lime-400">0</p>
            </div>
            <div className="bg-[#18181b] p-4 rounded border border-neutral-800">
              <h3 className="text-green-400 font-semibold mb-2 font-mono">Projects</h3>
              <p className="text-2xl font-bold text-lime-400">0</p>
            </div>
          </div>
          
          <div className="bg-[#18181b] p-4 rounded border border-neutral-800">
            <h3 className="text-green-400 font-semibold mb-4 font-mono">Recent Activity</h3>
            <p className="text-neutral-400 text-sm font-mono">
              No activity yet. Add your first tracking script to get started.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardClient