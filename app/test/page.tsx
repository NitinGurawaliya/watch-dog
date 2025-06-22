import { requireAuth } from '@/lib/auth-utils'
import { prisma } from '@/lib/prisma'
import React from 'react'
import TestClient from '@/components/TestClient'

const TestPage = async () => {
  const session = await requireAuth();
  const projects = await prisma.project.findMany({
    where: { userId: (session.user as any).id },
    orderBy: { createdAt: 'asc' },
  });

  return <TestClient projects={projects} />
}

export default TestPage