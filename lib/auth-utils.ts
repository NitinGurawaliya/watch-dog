import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authConfig } from './auth';

export async function getSession() {
  return await getServerSession(authConfig);
}

export async function requireAuth() {
  const session = await getSession();
  
  if (!session?.user) {
    redirect('/auth');
  }
  
  return session;
}

export async function requireGuest() {
  const session = await getSession();
  
  if (session?.user) {
    redirect('/dashboard');
  }
  
  return session;
}

export async function getOptionalSession() {
  return await getSession();
}