import { requireGuest } from '../../lib/auth-utils'
import React from 'react'
import { 
  ArrowRightEndOnRectangleIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import LoginButton from '../../components/LoginButton';

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