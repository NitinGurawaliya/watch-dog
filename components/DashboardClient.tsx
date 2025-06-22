'use client'

import { signOut } from 'next-auth/react'
import { Session } from 'next-auth'
import React, { useState, useEffect, useCallback } from 'react'
import { 
  ChartBarIcon, 
  EyeIcon, 
  CogIcon, 
  PlusIcon,
  ArrowRightOnRectangleIcon,
  GlobeAltIcon,
  LinkIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline'

interface DashboardClientProps {
  session: Session
}

interface Project {
  id: string
  name: string
  createdAt: string
}

interface RealtimeStats {
  count: number
  visitors: Array<{
    id: string
    pageUrl: string
    referrer: string
    country: string
    city: string
    userAgent: string
    timestamp: string
  }>
}

interface DailyStats {
  date: string
  visitors: number
}

interface CountryStats {
  country: string
  visitors: number
}

interface ReferrerStats {
  referrer: string
  visitors: number
}

const DashboardClient = ({ session }: DashboardClientProps) => {
  const [activeTab, setActiveTab] = useState('overview')
  const [projects, setProjects] = useState<Project[]>([])
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [realtimeStats, setRealtimeStats] = useState<RealtimeStats>({ count: 0, visitors: [] })
  const [dailyStats, setDailyStats] = useState<DailyStats[]>([])
  const [countryStats, setCountryStats] = useState<CountryStats[]>([])
  const [referrerStats, setReferrerStats] = useState<ReferrerStats[]>([])
  const [showNewProjectModal, setShowNewProjectModal] = useState(false)
  const [newProjectName, setNewProjectName] = useState('')
  const [loading, setLoading] = useState(true)

  const fetchProjects = useCallback(async () => {
    try {
      const response = await fetch('/api/project')
      const data = await response.json()
      setProjects(data)
      if (data.length > 0 && !selectedProject) {
        setSelectedProject(data[0])
      }
      setLoading(false)
    } catch (error) {
      console.error('Error fetching projects:', error)
      setLoading(false)
    }
  }, [selectedProject])

  const fetchStats = useCallback(async () => {
    if (!selectedProject) return

    try {
      const [realtimeRes, dailyRes, countriesRes, referrersRes] = await Promise.all([
        fetch(`/api/stats/project/${selectedProject.id}/realtime`),
        fetch(`/api/stats/project/${selectedProject.id}/7days`),
        fetch(`/api/stats/project/${selectedProject.id}/countries`),
        fetch(`/api/stats/project/${selectedProject.id}/referrers`)
      ])

      const [realtimeData, dailyData, countriesData, referrersData] = await Promise.all([
        realtimeRes.json(),
        dailyRes.json(),
        countriesRes.json(),
        referrersRes.json()
      ])

      setRealtimeStats(realtimeData)
      setDailyStats(dailyData)
      setCountryStats(countriesData)
      setReferrerStats(referrersData)
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }, [selectedProject])

  useEffect(() => {
    fetchProjects()
  }, [fetchProjects])

  useEffect(() => {
    if (selectedProject) {
      fetchStats()
      const interval = setInterval(fetchStats, 30000)
      return () => clearInterval(interval)
    }
  }, [selectedProject, fetchStats])

  const createProject = async () => {
    if (!newProjectName.trim()) return

    try {
      const response = await fetch('/api/project', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newProjectName })
      })
      
      const newProject = await response.json()
      setProjects([newProject, ...projects])
      setSelectedProject(newProject)
      setShowNewProjectModal(false)
      setNewProjectName('')
    } catch (error) {
      console.error('Error creating project:', error)
    }
  }

  const getTrackingScript = (projectId: string) => {
    // Use environment variable for production, fallback to current origin
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || window.location.origin;
    return `<script src="${baseUrl}/track.js" data-site="${projectId}"></script>`
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#18181b] text-neutral-100 flex items-center justify-center">
        <div className="text-lime-400 font-mono">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#18181b] text-neutral-100 flex">
      {/* Sidebar */}
      <div className="w-64 bg-[#23272e] border-r border-neutral-800">
        <div className="p-6">
          <div className="flex items-center gap-2 mb-8">
            <UserGroupIcon className="h-6 w-6 text-lime-400" />
            <span className="font-bold text-lg text-lime-400 font-mono">who&apos;s viewing me</span>
          </div>
          
          <nav className="space-y-2">
            <button
              onClick={() => setActiveTab('overview')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded text-sm font-mono transition ${
                activeTab === 'overview' 
                  ? 'bg-lime-400 text-[#18181b]' 
                  : 'text-neutral-300 hover:text-lime-400 hover:bg-neutral-800'
              }`}
            >
              <ChartBarIcon className="h-5 w-5" />
              Overview
            </button>
            <button
              onClick={() => setActiveTab('live')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded text-sm font-mono transition ${
                activeTab === 'live' 
                  ? 'bg-lime-400 text-[#18181b]' 
                  : 'text-neutral-300 hover:text-lime-400 hover:bg-neutral-800'
              }`}
            >
              <EyeIcon className="h-5 w-5" />
              Live Feed
            </button>
            <button
              onClick={() => setActiveTab('setup')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded text-sm font-mono transition ${
                activeTab === 'setup' 
                  ? 'bg-lime-400 text-[#18181b]' 
                  : 'text-neutral-300 hover:text-lime-400 hover:bg-neutral-800'
              }`}
            >
              <CogIcon className="h-5 w-5" />
              Setup
            </button>
          </nav>
        </div>
        
        <div className="mt-auto p-6 border-t border-neutral-800">
          <div className="text-xs text-neutral-500 mb-2 font-mono">
            {session.user?.name || session.user?.email}
          </div>
          <button
            onClick={() => signOut({ callbackUrl: '/' })}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-neutral-300 hover:text-red-400 transition font-mono"
          >
            <ArrowRightOnRectangleIcon className="h-4 w-4" />
            Sign Out
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <div className="bg-[#23272e] border-b border-neutral-800 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <select
                value={selectedProject?.id || ''}
                onChange={(e) => {
                  const project = projects.find(p => p.id === e.target.value)
                  setSelectedProject(project || null)
                }}
                className="bg-[#18181b] border border-neutral-700 rounded px-3 py-2 text-lime-400 font-mono"
              >
                {projects.map(project => (
                  <option key={project.id} value={project.id}>
                    {project.name}
                  </option>
                ))}
              </select>
              <button
                onClick={() => setShowNewProjectModal(true)}
                className="flex items-center gap-2 px-3 py-2 bg-lime-400 text-[#18181b] rounded hover:bg-lime-300 transition font-mono text-sm"
              >
                <PlusIcon className="h-4 w-4" />
                New Project
              </button>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-6 overflow-auto">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-[#23272e] p-6 rounded-lg border border-neutral-800">
                  <div className="flex items-center gap-3 mb-2">
                    <EyeIcon className="h-6 w-6 text-green-400" />
                    <h3 className="text-green-400 font-semibold font-mono">Live Visitors</h3>
                  </div>
                  <p className="text-3xl font-bold text-lime-400">{realtimeStats.count}</p>
                </div>
                <div className="bg-[#23272e] p-6 rounded-lg border border-neutral-800">
                  <div className="flex items-center gap-3 mb-2">
                    <ChartBarIcon className="h-6 w-6 text-cyan-400" />
                    <h3 className="text-cyan-400 font-semibold font-mono">7-Day Total</h3>
                  </div>
                  <p className="text-3xl font-bold text-lime-400">
                    {dailyStats.reduce((sum, day) => sum + day.visitors, 0)}
                  </p>
                </div>
                <div className="bg-[#23272e] p-6 rounded-lg border border-neutral-800">
                  <div className="flex items-center gap-3 mb-2">
                    <GlobeAltIcon className="h-6 w-6 text-blue-400" />
                    <h3 className="text-blue-400 font-semibold font-mono">Countries</h3>
                  </div>
                  <p className="text-3xl font-bold text-lime-400">{countryStats.length}</p>
                </div>
                <div className="bg-[#23272e] p-6 rounded-lg border border-neutral-800">
                  <div className="flex items-center gap-3 mb-2">
                    <LinkIcon className="h-6 w-6 text-purple-400" />
                    <h3 className="text-purple-400 font-semibold font-mono">Referrers</h3>
                  </div>
                  <p className="text-3xl font-bold text-lime-400">{referrerStats.length}</p>
                </div>
              </div>

              {/* Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* 7-Day Chart */}
                <div className="bg-[#23272e] p-6 rounded-lg border border-neutral-800">
                  <h3 className="text-green-400 font-semibold mb-4 font-mono">7-Day Traffic</h3>
                  <div className="space-y-2">
                    {dailyStats.map((day) => (
                      <div key={day.date} className="flex items-center gap-3">
                        <span className="text-xs text-neutral-400 font-mono w-16">
                          {new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </span>
                        <div className="flex-1 bg-neutral-800 rounded-full h-2">
                          <div 
                            className="bg-lime-400 h-2 rounded-full transition-all"
                            style={{ width: `${Math.max(day.visitors * 10, 2)}%` }}
                          />
                        </div>
                        <span className="text-xs text-lime-400 font-mono w-8 text-right">
                          {day.visitors}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Countries Chart */}
                <div className="bg-[#23272e] p-6 rounded-lg border border-neutral-800">
                  <h3 className="text-green-400 font-semibold mb-4 font-mono">Top Countries</h3>
                  <div className="space-y-2">
                    {countryStats.slice(0, 5).map((country) => (
                      <div key={country.country} className="flex items-center gap-3">
                        <span className="text-xs text-neutral-400 font-mono flex-1">
                          {country.country}
                        </span>
                        <div className="flex-1 bg-neutral-800 rounded-full h-2">
                          <div 
                            className="bg-blue-400 h-2 rounded-full transition-all"
                            style={{ width: `${(country.visitors / Math.max(...countryStats.map(c => c.visitors))) * 100}%` }}
                          />
                        </div>
                        <span className="text-xs text-blue-400 font-mono w-8 text-right">
                          {country.visitors}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Referrers Table */}
              <div className="bg-[#23272e] p-6 rounded-lg border border-neutral-800">
                <h3 className="text-green-400 font-semibold mb-4 font-mono">Top Referrers</h3>
                <div className="space-y-2">
                  {referrerStats.slice(0, 10).map((referrer) => (
                    <div key={referrer.referrer} className="flex items-center justify-between py-2 border-b border-neutral-800 last:border-b-0">
                      <span className="text-sm text-neutral-300 font-mono">{referrer.referrer}</span>
                      <span className="text-sm text-purple-400 font-mono">{referrer.visitors} visitors</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'live' && (
            <div className="space-y-6">
              <div className="bg-[#23272e] p-6 rounded-lg border border-neutral-800">
                <div className="flex items-center gap-3 mb-4">
                  <EyeIcon className="h-6 w-6 text-green-400" />
                  <h2 className="text-xl font-bold text-green-400 font-mono">Live Feed</h2>
                  <span className="text-sm text-neutral-400 font-mono">
                    {realtimeStats.count} active visitors
                  </span>
                </div>
                
                {realtimeStats.visitors.length > 0 ? (
                  <div className="space-y-3">
                    {realtimeStats.visitors.map((visitor) => (
                      <div key={visitor.id} className="bg-[#18181b] p-4 rounded border border-neutral-800">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-lime-400 font-mono">
                            {visitor.country}, {visitor.city}
                          </span>
                          <span className="text-xs text-neutral-500 font-mono">
                            {new Date(visitor.timestamp).toLocaleTimeString()}
                          </span>
                        </div>
                        <div className="text-sm text-neutral-300 font-mono mb-1">
                          📄 {visitor.pageUrl}
                        </div>
                        {visitor.referrer && (
                          <div className="text-sm text-neutral-400 font-mono">
                            🔗 From: {visitor.referrer}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <EyeIcon className="h-12 w-12 text-neutral-600 mx-auto mb-4" />
                    <p className="text-neutral-400 font-mono">No active visitors right now</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'setup' && selectedProject && (
            <div className="space-y-6">
              <div className="bg-[#23272e] p-6 rounded-lg border border-neutral-800">
                <h2 className="text-xl font-bold text-green-400 mb-4 font-mono">Tracking Script</h2>
                <p className="text-neutral-400 mb-4 font-mono">
                  Add this script to your website to start tracking visitors:
                </p>
                
                <div className="bg-[#18181b] p-4 rounded border border-neutral-800 mb-4">
                  <code className="text-lime-400 font-mono text-sm select-all">
                    {getTrackingScript(selectedProject.id)}
                  </code>
                </div>
                
                <button
                  onClick={() => copyToClipboard(getTrackingScript(selectedProject.id))}
                  className="px-4 py-2 bg-lime-400 text-[#18181b] rounded hover:bg-lime-300 transition font-mono"
                >
                  Copy Script
                </button>
              </div>

              <div className="bg-[#23272e] p-6 rounded-lg border border-neutral-800">
                <h3 className="text-green-400 font-semibold mb-4 font-mono">Project Details</h3>
                <div className="space-y-2 text-sm font-mono">
                  <div className="flex justify-between">
                    <span className="text-neutral-400">Project ID:</span>
                    <span className="text-lime-400">{selectedProject.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-400">Created:</span>
                    <span className="text-lime-400">
                      {new Date(selectedProject.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* New Project Modal */}
      {showNewProjectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-[#23272e] p-6 rounded-lg border border-neutral-800 w-96">
            <h3 className="text-xl font-bold text-green-400 mb-4 font-mono">Create New Project</h3>
            <input
              type="text"
              placeholder="Project name"
              value={newProjectName}
              onChange={(e) => setNewProjectName(e.target.value)}
              className="w-full bg-[#18181b] border border-neutral-700 rounded px-3 py-2 text-lime-400 font-mono mb-4"
              onKeyPress={(e) => e.key === 'Enter' && createProject()}
            />
            <div className="flex gap-3">
              <button
                onClick={createProject}
                className="flex-1 px-4 py-2 bg-lime-400 text-[#18181b] rounded hover:bg-lime-300 transition font-mono"
              >
                Create
              </button>
              <button
                onClick={() => {
                  setShowNewProjectModal(false)
                  setNewProjectName('')
                }}
                className="flex-1 px-4 py-2 bg-neutral-700 text-neutral-300 rounded hover:bg-neutral-600 transition font-mono"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default DashboardClient 