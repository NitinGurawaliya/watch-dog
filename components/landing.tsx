"use client"
import React, { useState } from 'react';
import { 
  CheckCircleIcon,
  ChartBarIcon,
  ShieldCheckIcon,
  ArrowRightIcon,
  CodeBracketIcon,
  CpuChipIcon,
  EyeIcon,
  ArrowRightEndOnRectangleIcon,
  Bars3Icon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { Session } from 'next-auth';
import { motion } from 'framer-motion';

interface LandingProps {
  session?: Session | null;
}

const features = [
  {
    icon: <EyeIcon className="h-7 w-7 text-green-400" />,
    title: 'Live User Feed',
    desc: 'See every visitor in real time, including device, browser, and location. No delay, pure live data.'
  },
  {
    icon: <ChartBarIcon className="h-7 w-7 text-cyan-400" />,
    title: 'Referrer & Country Insights',
    desc: 'Instantly know where your traffic comes from, which links are hot, and what countries are active.'
  },
  {
    icon: <CodeBracketIcon className="h-7 w-7 text-yellow-400" />,
    title: '1-Line Script',
    desc: 'Integrate in seconds. Just copy-paste a single line of code. No bloat, no nonsense.'
  },
  {
    icon: <CpuChipIcon className="h-7 w-7 text-fuchsia-400" />,
    title: 'Dev Console Mode',
    desc: 'Open a live analytics console right in your browser. Feels like debugging, but for your users.'
  },
  {
    icon: <ShieldCheckIcon className="h-7 w-7 text-blue-400" />,
    title: 'Privacy-First',
    desc: 'No cookies, no fingerprinting, no creepy stuff. GDPR, CCPA, and developer ethics compliant.'
  },
  {
    icon: <CheckCircleIcon className="h-7 w-7 text-indigo-400" />,
    title: 'Open API',
    desc: 'Fetch your analytics via REST API. Build your own dashboards, bots, or CLI tools.'
  },
];

const codeExample = '<script src="https://cdn.whosviewing.me/track.js" data-site="YOUR_SITE_ID"></script>';


export default function Landing({ session }: LandingProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="bg-[#18181b] text-neutral-100 min-h-screen font-mono">
      {/* Navbar */}
      <nav className="w-full border-b border-neutral-800 sticky top-0 z-30 bg-[#18181b]/90 backdrop-blur">
        <div className="max-w-6xl mx-auto px-4 sm:px-10 flex items-center justify-between h-14">
          <div className="flex items-center gap-4 font-bold text-lg tracking-tight text-lime-400">
            <span className="font-mono">WatchDog 🐕</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-xs font-semibold">
            <a href="#features" className="hover:text-lime-400 transition px-2">Features</a>
            <a href="#how" className="hover:text-lime-400 transition px-2">How It Works</a>
            <a href="#code" className="hover:text-lime-400 transition px-2">Code</a>
            <a href="#testimonials" className="hover:text-lime-400 transition px-2">Devs</a>
            {session?.user ? (
              <a href="/dashboard" className="hover:text-lime-400 transition flex items-center gap-2 px-3 py-1 border border-lime-400 rounded bg-[#18181b]">
                <ArrowRightEndOnRectangleIcon className="h-4 w-4" /> Dashboard
              </a>
            ) : (
              <a href="/auth" className="hover:text-lime-400 transition flex items-center gap-2 px-3 py-1 border border-lime-400 rounded bg-[#18181b]">
                <ArrowRightEndOnRectangleIcon className="h-4 w-4" /> Login
              </a>
            )}
            <a href="/auth" className="ml-4 px-5 py-2 rounded bg-lime-400 text-[#18181b] hover:bg-lime-300 transition font-bold shadow-sm">Get Started</a>
          </div>
          <div className="md:hidden">
            <button onClick={() => setIsMobileMenuOpen(true)} className="text-neutral-300">
              <Bars3Icon className="h-6 w-6" />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-[#18181b] md:hidden">
          <div className="flex justify-between items-center p-4 border-b border-neutral-800">
            <span className="font-mono font-bold text-lg text-lime-400">WatchDog 🐕</span>
            <button onClick={() => setIsMobileMenuOpen(false)} className="text-neutral-300">
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>
          <div className="flex flex-col items-center justify-center h-[calc(100vh-60px)] gap-6 text-lg">
            <a href="#features" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-lime-400 transition">Features</a>
            <a href="#how" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-lime-400 transition">How It Works</a>
            <a href="#code" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-lime-400 transition">Code</a>
            <a href="#testimonials" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-lime-400 transition">Devs</a>
            <div className="w-4/5 border-t border-neutral-800 my-4"></div>
            {session?.user ? (
              <a href="/dashboard" className="w-4/5 text-center px-6 py-3 rounded border-2 border-lime-400 bg-lime-400 text-[#18181b] font-bold shadow">
                Go to Dashboard
              </a>
            ) : (
              <a href="/auth" className="w-4/5 text-center px-6 py-3 rounded border-2 border-lime-400 bg-lime-400 text-[#18181b] font-bold shadow">
                Get Started Free
              </a>
            )}
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="max-w-2xl mx-auto px-3 sm:px-6 py-16 text-center flex flex-col items-center">
        <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="text-3xl sm:text-5xl font-extrabold mb-4 tracking-tight font-mono">
          <span className="inline-block w-full px-4 py-2 bg-gradient-to-r from-lime-400 via-teal-400 to-fuchsia-500 animate-text-gradient">
            See Who&apos;s On Your Site — Right Now
          </span>
        </motion.h1>
        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.7 }} className="text-base sm:text-lg text-lime-300 mb-8 font-mono">
          Realtime, privacy-first analytics for devs. Know who&apos;s visiting, where they came from, and what they&apos;re doing — instantly.
        </motion.p>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.7 }} className="flex flex-col sm:flex-row gap-3 justify-center mb-6 w-full">
          {session?.user ? (
            <a href="/dashboard" className="w-full sm:w-auto px-6 py-3 rounded border-2 border-lime-400 bg-lime-400 text-[#18181b] font-bold text-base shadow hover:bg-[#18181b] hover:text-lime-400 transition flex items-center gap-2 justify-center">
              Go to Dashboard <ArrowRightIcon className="h-5 w-5" />
            </a>
          ) : (
            <a href="/auth" className="w-full sm:w-auto px-6 py-3 rounded border-2 border-lime-400 bg-lime-400 text-[#18181b] font-bold text-base shadow hover:bg-[#18181b] hover:text-lime-400 transition flex items-center gap-2 justify-center">
              Get Started Free <ArrowRightIcon className="h-5 w-5" />
            </a>
          )}
          {/* <a href="https://demo.whosviewing.me" target="_blank" rel="noopener" className="w-full sm:w-auto px-6 py-3 rounded border-2 border-amber-400 text-amber-400 font-bold text-base hover:bg-amber-400 hover:text-[#18181b] transition flex items-center gap-2 justify-center">
            See Demo
          </a> */}
        </motion.div>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6, duration: 0.7 }} className="text-xs text-lime-700 mt-2 font-mono">
          Trusted by solo devs, indie hackers, and tiny startups.
        </motion.div>
      </section>

            <section id="code" className="max-w-3xl mx-auto px-3 sm:px-6 py-12">
        <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }} className="text-xl sm:text-2xl font-bold text-center mb-6 text-green-400 font-mono">Add Analytics in 5 Seconds</motion.h2>
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }} className="relative flex flex-col items-center justify-center">
          <pre className="bg-[#18181b] text-green-400 font-mono rounded-xl p-5 text-base shadow-2xl border border-green-900 text-center w-full max-w-2xl mb-2 whitespace-pre-line">
            <code className="select-all">{codeExample}</code>
          </pre>
          <button
            onClick={() => {navigator.clipboard.writeText(codeExample)}}
            className="absolute top-3 right-4 bg-lime-400 text-[#18181b] px-3 py-1 rounded font-bold text-xs shadow hover:bg-lime-300 transition focus:outline-none focus:ring-2 focus:ring-lime-400"
            aria-label="Copy code"
          >
            Copy
          </button>
        </motion.div>
        <div className="text-center text-neutral-500 mt-4 text-xs font-mono">No npm install. No build step. Just copy and go.</div>
      </section>

      {/* How It Works Section */}
      <section id="how" className="max-w-4xl mx-auto px-3 sm:px-6 py-12">
        <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }} className="text-xl sm:text-2xl font-bold text-center mb-8 text-green-400 font-mono">How It Works</motion.h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1, duration: 0.7 }} className="bg-[#23272e] rounded-lg p-5 flex flex-col items-center text-center shadow border border-neutral-800">
            <CodeBracketIcon className="h-8 w-8 text-yellow-400 mb-2" />
            <div className="font-semibold text-base mb-1 font-mono">Add Script</div>
            <div className="text-neutral-400 text-xs font-mono">Paste our 1-line script into your site. No config, no build step.</div>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2, duration: 0.7 }} className="bg-[#23272e] rounded-lg p-5 flex flex-col items-center text-center shadow border border-neutral-800">
            <CpuChipIcon className="h-8 w-8 text-fuchsia-400 mb-2" />
            <div className="font-semibold text-base mb-1 font-mono">Track Instantly</div>
            <div className="text-neutral-400 text-xs font-mono">See live data in your dashboard as soon as someone visits your site.</div>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3, duration: 0.7 }} className="bg-[#23272e] rounded-lg p-5 flex flex-col items-center text-center shadow border border-neutral-800">
            <EyeIcon className="h-8 w-8 text-green-400 mb-2" />
            <div className="font-semibold text-base mb-1 font-mono">Analyze & Build</div>
            <div className="text-neutral-400 text-xs font-mono">Use our API or dashboard to analyze, export, or automate your analytics.</div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="max-w-5xl mx-auto px-3 sm:px-6 py-12">
        <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }} className="text-xl sm:text-2xl font-bold text-center mb-8 text-green-400 font-mono">Features for Developers</motion.h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {features.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.6 }}
              className="bg-[#23272e] rounded-lg p-5 flex flex-col items-center text-center shadow border border-neutral-800"
            >
              <div className="mb-3">{f.icon}</div>
              <div className="font-semibold text-base mb-1 font-mono">{f.title}</div>
              <div className="text-neutral-400 text-xs font-mono">{f.desc}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Code Example Section */}



      {/* Footer */}
      <footer className="border-t border-neutral-800 py-8 mt-12 text-xs font-mono">
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
  );
}