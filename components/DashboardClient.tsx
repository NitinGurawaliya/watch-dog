'use client'

import { signOut } from 'next-auth/react'
import { Session } from 'next-auth'
import React, { useState, useEffect, useCallback, useRef } from 'react'
import { 
  ChartBarIcon, 
  EyeIcon, 
  CogIcon, 
  PlusIcon,
  ArrowRightOnRectangleIcon,
  GlobeAltIcon,
  LinkIcon,
  UserGroupIcon,
  Bars3Icon,
  XMarkIcon,
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
  const [activeTab, setActiveTab] = useState('overview');
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [realtimeStats, setRealtimeStats] = useState<RealtimeStats>({ count: 0, visitors: [] });
  const [dailyStats, setDailyStats] = useState<DailyStats[]>([]);
  const [countryStats, setCountryStats] = useState<CountryStats[]>([]);
  const [referrerStats, setReferrerStats] = useState<ReferrerStats[]>([]);
  const [showNewProjectModal, setShowNewProjectModal] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [loading, setLoading] = useState(true);
  
  // Real-time connection state
  const [isConnecting, setIsConnecting] = useState(false);
  const [realtimeConnected, setRealtimeConnected] = useState(false);
  const [reconnectionAttempts, setReconnectionAttempts] = useState(0);
  const maxReconnectionAttempts = 5;
  const [reconnectionTimeout, setReconnectionTimeout] = useState<NodeJS.Timeout | null>(null);
  
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmationName, setDeleteConfirmationName] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCreatingProject, setIsCreatingProject] = useState(false);
  const [isDeletingProject, setIsDeletingProject] = useState(false);
  const [isCopyingScript, setIsCopyingScript] = useState(false);
  
  const eventSourceRef = useRef<EventSource | null>(null);

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
  }, [selectedProject]);

  const fetchStats = useCallback(async () => {
    if (!selectedProject) return

    try {
      const [dailyRes, countriesRes, referrersRes] = await Promise.all([
        fetch(`/api/stats/project/${selectedProject.id}/7days`),
        fetch(`/api/stats/project/${selectedProject.id}/countries`),
        fetch(`/api/stats/project/${selectedProject.id}/referrers`)
      ])

      const [dailyData, countriesData, referrersData] = await Promise.all([
        dailyRes.json(),
        countriesRes.json(),
        referrersRes.json()
      ])

      setDailyStats(dailyData)
      setCountryStats(countriesData)
      setReferrerStats(referrersData)
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }, [selectedProject]);

  const setupRealtimeConnection = useCallback(() => {
    if (!selectedProject || eventSourceRef.current?.readyState === EventSource.OPEN) return;

    if (eventSourceRef.current) {
      eventSourceRef.current.close();
    }
    if (reconnectionTimeout) {
      clearTimeout(reconnectionTimeout);
    }
    
    if (reconnectionAttempts >= maxReconnectionAttempts) {
        console.log('Max reconnection attempts reached.');
        setIsConnecting(false);
        return;
    }

    setIsConnecting(true);
    setRealtimeConnected(false);
    console.log(`Attempting to connect (attempt ${reconnectionAttempts + 1})`);

    const eventSource = new EventSource(`/api/realtime?projectId=${selectedProject.id}`);
    eventSourceRef.current = eventSource;

    eventSource.onopen = () => {
      console.log('SSE connection established');
      setIsConnecting(false);
      setRealtimeConnected(true);
      setReconnectionAttempts(0);
    };

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'error') {
          console.error('SSE server error:', data.message);
          eventSource.close();
          return;
        }
        if (data.type === 'stats') {
          setRealtimeStats(data);
        }
      } catch (error) {
        console.error('Error parsing SSE data:', error);
      }
    };

    eventSource.onerror = () => {
      console.log('SSE connection error. Scheduling reconnect.');
      eventSource.close();
      setIsConnecting(false);
      setRealtimeConnected(false);

      const nextAttempt = reconnectionAttempts + 1;
      const delay = Math.min(1000 * Math.pow(2, nextAttempt), 30000);
      
      const timeout = setTimeout(() => {
        setReconnectionAttempts(nextAttempt);
      }, delay);
      setReconnectionTimeout(timeout);
    };
  }, [selectedProject, reconnectionAttempts, reconnectionTimeout]);
  
  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  useEffect(() => {
    if (selectedProject) {
        fetchStats();
        // Trigger connection logic whenever project or reconnection state changes
        setupRealtimeConnection();
    }
    
    // Cleanup on unmount or when dependencies change
    return () => {
        if (eventSourceRef.current) {
            eventSourceRef.current.close();
        }
        if (reconnectionTimeout) {
            clearTimeout(reconnectionTimeout);
        }
    };
  }, [selectedProject, reconnectionAttempts, fetchStats, setupRealtimeConnection, reconnectionTimeout]);

  const createProject = async () => {
    if (!newProjectName.trim()) return

    setIsCreatingProject(true)
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
    } finally {
      setIsCreatingProject(false)
    }
  }

  const deleteProject = async () => {
    if (!selectedProject || selectedProject.name !== deleteConfirmationName) {
      // Maybe show an error toast here
      console.error('Confirmation name does not match')
      return
    }

    setIsDeletingProject(true)
    try {
      await fetch(`/api/project/${selectedProject.id}`, { method: 'DELETE' })
      
      // Reset state and fetch new project list
      setDeleteConfirmationName('')
      setShowDeleteModal(false)
      setSelectedProject(null) // This will trigger a re-fetch in useEffect
      await fetchProjects()

    } catch (error) {
      console.error('Error deleting project:', error)
      // Maybe show an error toast here
    } finally {
      setIsDeletingProject(false)
    }
  }

  const getTrackingScript = (projectId: string) => {
    // Use environment variable for production, fallback to current origin
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || window.location.origin;
    return `<script src="${baseUrl}/track.js" data-site="${projectId}"></script>`
  }

  const copyToClipboard = async (text: string) => {
    setIsCopyingScript(true)
    try {
      await navigator.clipboard.writeText(text)
    } catch (error) {
      console.error('Error copying to clipboard:', error)
    } finally {
      setIsCopyingScript(false)
    }
  }

  // Function to extract page name from URL
  const getPageName = (url: string) => {
    try {
      const urlObj = new URL(url)
      const path = urlObj.pathname
      
      if (path === '/' || path === '') {
        return 'Home'
      }
      
      // Remove leading slash and get the last part
      const parts = path.split('/').filter(part => part.length > 0)
      if (parts.length === 0) {
        return 'Home'
      }
      
      // Get the last part and capitalize it
      const lastPart = parts[parts.length - 1]
      return lastPart.charAt(0).toUpperCase() + lastPart.slice(1).replace(/[-_]/g, ' ')
    } catch {
      return 'Unknown Page'
    }
  }

  // Function to get domain from URL
  const getDomain = (url: string) => {
    try {
      const urlObj = new URL(url)
      return urlObj.hostname
    } catch {
      return 'Unknown'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#18181b] text-neutral-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-lime-400 mx-auto mb-4"></div>
          <div className="text-lime-400 font-mono text-lg">Loading your dashboard...</div>
          <div className="text-neutral-500 font-mono text-sm mt-2">Setting up real-time connections</div>
        </div>
      </div>
    )
  }

  // Show loading state when no projects exist yet
  if (projects.length === 0) {
  return (
      <>
        <div className="min-h-screen bg-[#18181b] text-neutral-100 flex items-center justify-center">
          <div className="text-center max-w-md mx-auto px-4">
            <div className="animate-pulse">
              <div className="h-16 w-16 bg-lime-400/20 rounded-full mx-auto mb-6 flex items-center justify-center">
                <UserGroupIcon className="h-8 w-8 text-lime-400" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-lime-400 font-mono mb-4">Welcome to WatchDog! 🐕</h2>
            <p className="text-neutral-400 font-mono mb-6">
              Create your first project to start tracking visitors in real-time. It only takes a few seconds to set up.
            </p>
            <button
              onClick={() => setShowNewProjectModal(true)}
              className="flex items-center gap-2 px-6 py-3 bg-lime-400 text-[#18181b] rounded hover:bg-lime-300 transition font-mono font-bold mx-auto cursor-pointer"
            >
              <PlusIcon className="h-5 w-5" />
              Create Your First Project
            </button>
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
                  disabled={isCreatingProject}
                  className="flex-1 px-4 py-2 bg-lime-400 text-[#18181b] rounded hover:bg-lime-300 transition font-mono cursor-pointer disabled:bg-lime-400/50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isCreatingProject ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#18181b]"></div>
                      Creating...
                    </>
                  ) : (
                    'Create'
                  )}
                </button>
                <button
                  onClick={() => {
                    setShowNewProjectModal(false)
                    setNewProjectName('')
                  }}
                  disabled={isCreatingProject}
                  className="flex-1 px-4 py-2 bg-neutral-700 text-neutral-300 rounded hover:bg-neutral-600 transition font-mono cursor-pointer disabled:bg-neutral-700/50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </>
    )
  }

  return (
    <div className="min-h-screen bg-[#18181b] text-neutral-100 flex">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-40 w-64 bg-[#23272e] border-r border-neutral-800 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 transition-transform duration-300 ease-in-out`}>
        <div className="p-6">
          <div className="flex items-center justify-between gap-2 mb-8">
            <div className="flex items-center gap-2">
              <UserGroupIcon className="h-6 w-6 text-lime-400" />
              <span className="font-bold text-lg text-lime-400 font-mono">Watch Dog 🐕</span>
            </div>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="md:hidden text-neutral-400 hover:text-white cursor-pointer"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>
          
          <nav className="space-y-2">
            <button
              onClick={() => setActiveTab('overview')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded text-sm font-mono transition cursor-pointer ${
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
              className={`w-full flex items-center gap-3 px-3 py-2 rounded text-sm font-mono transition cursor-pointer ${
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
              className={`w-full flex items-center gap-3 px-3 py-2 rounded text-sm font-mono transition cursor-pointer ${
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
            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-neutral-300 hover:text-red-400 transition font-mono cursor-pointer"
          >
            <ArrowRightOnRectangleIcon className="h-4 w-4" />
            Sign Out
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col md:ml-0">
        {/* Top Bar */}
        <div className="bg-[#23272e] border-b border-neutral-800 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="md:hidden text-neutral-400 hover:text-white cursor-pointer"
              >
                <Bars3Icon className="h-6 w-6" />
              </button>
              <select
                value={selectedProject?.id || ''}
                onChange={(e) => {
                  const project = projects.find(p => p.id === e.target.value)
                  setSelectedProject(project || null)
                }}
                className="bg-[#18181b] border border-neutral-700 rounded px-3 py-2 text-lime-400 font-mono cursor-pointer"
              >
                {projects.map(project => (
                  <option key={project.id} value={project.id}>
                    {project.name}
                  </option>
                ))}
              </select>
              <button
                onClick={() => setShowNewProjectModal(true)}
                className="flex items-center gap-2 px-3 py-2 bg-lime-400 text-[#18181b] rounded hover:bg-lime-300 transition font-mono text-sm cursor-pointer"
              >
                <PlusIcon className="h-4 w-4" />
                <span className="hidden sm:inline">New Project</span>
              </button>
            </div>
            
            {/* Real-time connection indicator */}
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${
                realtimeConnected 
                  ? 'bg-green-400' 
                  : isConnecting 
                    ? 'bg-blue-400 animate-pulse' 
                    : reconnectionAttempts > 0 
                      ? 'bg-yellow-400 animate-pulse' 
                      : 'bg-red-400 animate-pulse'
              }`}></div>
              <span className="text-xs text-neutral-400 font-mono">
                {realtimeConnected 
                  ? 'Live' 
                  : isConnecting
                    ? 'Connecting...'
                    : reconnectionAttempts > 0 
                      ? `Reconnecting... (${reconnectionAttempts}/${maxReconnectionAttempts})`
                      : 'Disconnected'
                }
              </span>
              {!realtimeConnected && !isConnecting && reconnectionAttempts >= maxReconnectionAttempts && (
                <button
                  onClick={() => {
                    setReconnectionAttempts(0)
                    setupRealtimeConnection()
                  }}
                  className="text-xs text-lime-400 hover:text-lime-300 transition cursor-pointer font-mono"
                >
                  Retry
                </button>
              )}
              {/* Debug button - remove in production */}
              <button
                onClick={() => {
                  console.log('Manual connection test')
                  console.log('Selected project:', selectedProject)
                  console.log('Current state:', { realtimeConnected, isConnecting, reconnectionAttempts })
                  setReconnectionAttempts(0)
                  setupRealtimeConnection()
                }}
                className="text-xs text-blue-400 hover:text-blue-300 transition cursor-pointer font-mono ml-2"
              >
                Debug
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
                    <EyeIcon className={`h-6 w-6 text-green-400 ${realtimeStats.count > 0 ? 'animate-pulse' : ''}`} />
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
                    {dailyStats.map((day) => {
                      const maxViews = Math.max(...dailyStats.map(d => d.visitors), 1);
                      const percentage = (day.visitors / maxViews) * 100;

                      return (
                        <div key={day.date} className="flex items-center gap-3">
                          <span className="text-xs text-neutral-400 font-mono w-16">
                            {new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          </span>
                          <div className="flex-1 bg-neutral-800 rounded-full h-2 overflow-hidden">
                            <div 
                              className="bg-lime-400 h-2 rounded-full transition-all"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                          <span className="text-xs text-lime-400 font-mono w-8 text-right">
                            {day.visitors}
                          </span>
                        </div>
                      )
                    })}
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
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                            <span className="text-sm text-lime-400 font-mono font-semibold">
                              {visitor.country}, {visitor.city}
                            </span>
                          </div>
                          <span className="text-xs text-neutral-500 font-mono">
                            {new Date(visitor.timestamp).toLocaleTimeString()}
                          </span>
                        </div>
                        
                        {/* Page Information */}
                        <div className="bg-[#23272e] p-3 rounded mb-2">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs text-neutral-500 font-mono">🌐</span>
                            <span className="text-xs text-neutral-400 font-mono">{getDomain(visitor.pageUrl)}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-neutral-500 font-mono">📄</span>
                            <span className="text-sm text-lime-400 font-mono font-semibold">
                              {getPageName(visitor.pageUrl)}
                            </span>
                          </div>
                          <div className="mt-1">
                            <span className="text-xs text-neutral-600 font-mono break-all">
                              {visitor.pageUrl}
                            </span>
                          </div>
                        </div>
                        
                        {/* Referrer Information */}
                        {visitor.referrer && visitor.referrer !== '' && (
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-neutral-500 font-mono">🔗</span>
                            <span className="text-xs text-neutral-400 font-mono">
                              From: {visitor.referrer}
                            </span>
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
                <h2 className="text-xl font-bold text-green-400 mb-4 font-mono">Setup Instructions</h2>
                <p className="text-neutral-400 mb-4 font-mono">
                  Add this script to your website&apos;s <code className="bg-[#18181b] p-1 rounded text-lime-400">&lt;head&gt;</code> to start tracking visitors:
                </p>
                
                <div className="bg-[#18181b] p-4 rounded border border-neutral-800 mb-4">
                  <code className="text-lime-400 font-mono text-sm select-all">
                    {getTrackingScript(selectedProject.id)}
                  </code>
                </div>
                
                <button
                  onClick={() => copyToClipboard(getTrackingScript(selectedProject.id))}
                  disabled={isCopyingScript}
                  className="px-4 py-2 bg-lime-400 text-[#18181b] rounded hover:bg-lime-300 transition font-mono cursor-pointer disabled:bg-lime-400/50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isCopyingScript ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#18181b]"></div>
                      Copying...
                    </>
                  ) : (
                    'Copy Script'
                  )}
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

              <div className="bg-red-900/20 p-6 rounded-lg border border-red-500/30">
                <h3 className="text-red-400 font-semibold mb-2 font-mono">Danger Zone</h3>
                <p className="text-neutral-400 text-sm mb-4 font-mono">
                  Deleting a project is irreversible. It will permanently remove the project and all associated event data.
                </p>
                <button
                  onClick={() => setShowDeleteModal(true)}
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition font-mono cursor-pointer"
                >
                  Delete Project
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Delete Project Modal */}
      {showDeleteModal && selectedProject && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-[#23272e] p-6 rounded-lg border border-red-500/50 w-full max-w-md">
            <h3 className="text-xl font-bold text-red-400 mb-2 font-mono">Delete Project</h3>
            <p className="text-neutral-400 mb-4 text-sm font-mono">
              This action cannot be undone. This will permanently delete the <strong className="text-lime-400">{selectedProject.name}</strong> project and all of its associated data.
            </p>
            <p className="text-neutral-400 mb-4 text-sm font-mono">
              Please type the project name to confirm:
            </p>
            <input
              type="text"
              placeholder={selectedProject.name}
              value={deleteConfirmationName}
              onChange={(e) => setDeleteConfirmationName(e.target.value)}
              className="w-full bg-[#18181b] border border-neutral-700 rounded px-3 py-2 text-lime-400 font-mono mb-4"
              onKeyPress={(e) => e.key === 'Enter' && deleteProject()}
            />
            <div className="flex gap-3">
              <button
                onClick={deleteProject}
                disabled={deleteConfirmationName !== selectedProject.name || isDeletingProject}
                className="flex-1 px-4 py-2 bg-red-500 text-white rounded transition font-mono cursor-pointer disabled:bg-red-500/30 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isDeletingProject ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Deleting...
                  </>
                ) : (
                  'Delete this project'
                )}
              </button>
              <button
                onClick={() => {
                  setShowDeleteModal(false)
                  setDeleteConfirmationName('')
                }}
                disabled={isDeletingProject}
                className="flex-1 px-4 py-2 bg-neutral-700 text-neutral-300 rounded hover:bg-neutral-600 transition font-mono cursor-pointer disabled:bg-neutral-700/50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

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
                disabled={isCreatingProject}
                className="flex-1 px-4 py-2 bg-lime-400 text-[#18181b] rounded hover:bg-lime-300 transition font-mono cursor-pointer disabled:bg-lime-400/50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isCreatingProject ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#18181b]"></div>
                    Creating...
                  </>
                ) : (
                  'Create'
                )}
              </button>
              <button
                onClick={() => {
                  setShowNewProjectModal(false)
                  setNewProjectName('')
                }}
                disabled={isCreatingProject}
                className="flex-1 px-4 py-2 bg-neutral-700 text-neutral-300 rounded hover:bg-neutral-600 transition font-mono cursor-pointer disabled:bg-neutral-700/50 disabled:cursor-not-allowed"
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