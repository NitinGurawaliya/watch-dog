import { requireAuth } from '@/lib/auth-utils'
import DashboardClient from '@/components/DashboardClient'
import React from 'react'

const Dashboard = async () => {
  const session = await requireAuth();

  return <DashboardClient session={session} />
}

export default Dashboard;