import { requireGuest } from '@/lib/auth-utils'
import React from 'react'
import { 
  ArrowRightEndOnRectangleIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { signIn } from 'next-auth/react';

// Inline LoginButton component to avoid import issues
function LoginButton({ provider }: { provider: 'google' | 'github' | 'twitter' }) {
  const providerConfig = {
    google: {
      name: 'Google',
      color: 'bg-white text-gray-800 hover:bg-gray-100 border-gray-300',
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24">
          <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
          <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
      )
    },
    github: {
      name: 'GitHub',
      color: 'bg-[#24292e] text-white hover:bg-[#2f363d] border-[#24292e]',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
        </svg>
      )
    },
    twitter: {
      name: 'Twitter',
      color: 'bg-[#1da1f2] text-white hover:bg-[#1a91da] border-[#1da1f2]',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
        </svg>
      )
    }
  };

  const config = providerConfig[provider];
  
  const handleSignIn = () => {
    signIn(provider, { callbackUrl: '/dashboard' });
  };

  return (
    <button
      onClick={handleSignIn}
      className={`w-full p-3 rounded border transition font-mono font-semibold flex items-center justify-center gap-3 ${config.color}`}
    >
      {config.icon}
      Continue with {config.name}
    </button>
  );
}

const Auth = async () => {
  // This will redirect authenticated users to /dashboard
  await requireGuest();

  return (
    <div className="bg-[#18181b] text-neutral-100 min-h-screen font-mono">
      {/* Navbar */}
      <nav className="w-full border-b border-neutral-800 sticky top-0 z-30 bg-[#18181b]/90 backdrop-blur">
        <div className="max-w-6xl mx-auto px-4 sm:px-10 flex items-center justify-between h-14">
          <div className="flex items-center gap-4 font-bold text-lg tracking-tight text-lime-400">
            <span className="font-mono">WatchDog 🐕</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-xs font-semibold">
            <Link href="/#features" className="hover:text-lime-400 transition px-2">Features</Link>
            <Link href="/#how" className="hover:text-lime-400 transition px-2">How It Works</Link>
            <Link href="/#code" className="hover:text-lime-400 transition px-2">Code</Link>
            <Link href="/#testimonials" className="hover:text-lime-400 transition px-2">Devs</Link>
            <Link href="/auth" className="hover:text-lime-400 transition flex items-center gap-2 px-3 py-1 border border-lime-400 rounded bg-[#18181b]">
              <ArrowRightEndOnRectangleIcon className="h-4 w-4" /> Login
            </Link>
            <Link href="/auth" className="ml-4 px-5 py-2 rounded bg-lime-400 text-[#18181b] hover:bg-lime-300 transition font-bold shadow-sm">Get Started</Link>
          </div>
        </div>
      </nav>

      {/* Auth Content */}
      <div className="min-h-[calc(100vh-120px)] flex items-center justify-center px-4">
        <div className="bg-[#23272e] p-8 rounded-lg border border-neutral-800 max-w-md w-full shadow-lg">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-lime-400 font-mono mb-2">
              WatchDog 🐕
            </h1>
            <p className="text-neutral-400 text-sm font-mono">
              Sign in to access your analytics dashboard
            </p>
          </div>
          
          <div className="space-y-4">
            <LoginButton provider="google" />
          </div>
          
          <div className="mt-8 text-center">
            <p className="text-xs text-neutral-500 font-mono">
              Privacy-first analytics for developers
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-neutral-800 py-8 text-xs font-mono">
        <div className="max-w-5xl mx-auto px-3 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex gap-4 mb-2 md:mb-0">
            <a href="https://x.com/nitin93937331" target="_blank" rel="noopener" className="hover:text-green-400 transition">Twitter</a>
            <a href="https://github.com/NitinGurawaliya/" target="_blank" rel="noopener" className="hover:text-green-400 transition">GitHub</a>
          </div>
          <div className="text-neutral-500 flex items-center gap-2">
            <span>© 2025 Watch Dog</span>
            <span>•</span>
            <span>Made with ❤️ by <a href="https://x.com/nitin93937331" target="_blank" rel="noopener" className="text-green-400 hover:underline">Nitin</a></span>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Auth;