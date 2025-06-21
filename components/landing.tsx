"use client"
import React from 'react';
import { 
  CheckCircleIcon,
  ChartBarIcon,
  ShieldCheckIcon,
  ArrowRightIcon,
  UserGroupIcon,
  CodeBracketIcon,
  CpuChipIcon,
  EyeIcon,
  ArrowRightEndOnRectangleIcon
} from '@heroicons/react/24/outline';


import Link from 'next/link';
import { motion } from 'framer-motion';

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

const pricing = [
  {
    name: 'Free',
    price: '$0',
    period: '/mo',
    features: [
      '1 project',
      '10K events/month',
      'Live feed',
      'Basic country/referrer stats',
      '1 month data retention',
      'Community support',
    ],
    highlight: false,
  },
  {
    name: 'Pro',
    price: '$9',
    period: '/mo',
    features: [
      '3 projects',
      '100K events/month',
      'All Free features',
      'Advanced filtering',
      'API access',
      '6 months data retention',
      'Email support',
    ],
    highlight: true,
  },
  {
    name: 'Unlimited',
    price: '$29',
    period: '/mo',
    features: [
      'Unlimited projects',
      'Unlimited events',
      'All Pro features',
      'Priority support',
      'Custom integrations',
      '1 year data retention',
    ],
    highlight: false,
  },
];

const codeExample = `\n<script src=\"https://cdn.whosviewing.me/track.js\" data-site=\"YOUR_SITE_ID\"></script>\n`;

const testimonials = [
  {
    img: '/tweet1.png',
    alt: 'Tweet from @devguy',
    url: 'https://twitter.com/devguy/status/1234567890',
    user: '@devguy',
    text: 'Absolutely loving the privacy-first analytics from @whosviewingme! So easy to integrate and the live feed is 🔥'
  },
  {
    img: '/tweet2.png',
    alt: 'Tweet from @indiehacker',
    url: 'https://twitter.com/indiehacker/status/2345678901',
    user: '@indiehacker',
    text: 'Finally, analytics that respect my users. The API is a dream for custom dashboards.'
  },
  {
    img: '/tweet3.png',
    alt: 'Tweet from @startuplady',
    url: 'https://twitter.com/startuplady/status/3456789012',
    user: '@startuplady',
    text: 'Setup took 30 seconds. No cookies, no bloat. Just what I want as a dev.'
  },
];

export default function Landing() {
  return (
    <div className="bg-[#18181b] text-neutral-100 min-h-screen font-mono">
      {/* Navbar */}
      <nav className="w-full border-b border-neutral-800 sticky top-0 z-30 bg-[#18181b]/90 backdrop-blur">
        <div className="max-w-6xl mx-auto px-4 sm:px-10 flex items-center justify-between h-14">
          <div className="flex items-center gap-4 font-bold text-lg tracking-tight text-lime-400">
            <UserGroupIcon className="h-6 w-6" />
            <span className="font-mono">who's viewing me</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-xs font-semibold">
            <a href="#features" className="hover:text-lime-400 transition px-2">Features</a>
            <a href="#how" className="hover:text-lime-400 transition px-2">How It Works</a>
            <a href="#code" className="hover:text-lime-400 transition px-2">Code</a>
            <a href="#pricing" className="hover:text-lime-400 transition px-2">Pricing</a>
            <a href="#testimonials" className="hover:text-lime-400 transition px-2">Devs</a>
            <a href="/auth" className="hover:text-lime-400 transition flex items-center gap-2 px-3 py-1 border border-lime-400 rounded bg-[#18181b]"> <ArrowRightEndOnRectangleIcon className="h-4 w-4" /> Login</a>
            <a href="#pricing" className="ml-4 px-5 py-2 rounded bg-lime-400 text-[#18181b] hover:bg-lime-300 transition font-bold shadow-sm">Get Started</a>
          </div>
          <div className="md:hidden">
            {/* Mobile menu could go here */}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-2xl mx-auto px-3 sm:px-6 py-16 text-center flex flex-col items-center">
        <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="text-3xl sm:text-5xl font-extrabold mb-4 tracking-tight font-mono">
          <span className="inline-block w-full px-4 py-2 rounded border-2 border-lime-400 bg-[#18181b] text-lime-400">
            See Who's On Your Site — Right Now
          </span>
        </motion.h1>
        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.7 }} className="text-base sm:text-lg text-lime-300 mb-8 font-mono">
          Realtime, privacy-first analytics for devs. Know who's visiting, where they came from, and what they're doing — instantly.
        </motion.p>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.7 }} className="flex flex-col sm:flex-row gap-3 justify-center mb-6 w-full">
          <a href="#pricing" className="w-full sm:w-auto px-6 py-3 rounded border-2 border-lime-400 bg-lime-400 text-[#18181b] font-bold text-base shadow hover:bg-[#18181b] hover:text-lime-400 transition flex items-center gap-2 justify-center">
            Get Started Free <ArrowRightIcon className="h-5 w-5" />
          </a>
          <a href="https://demo.whosviewing.me" target="_blank" rel="noopener" className="w-full sm:w-auto px-6 py-3 rounded border-2 border-amber-400 text-amber-400 font-bold text-base hover:bg-amber-400 hover:text-[#18181b] transition flex items-center gap-2 justify-center">
            See Demo
          </a>
        </motion.div>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6, duration: 0.7 }} className="text-xs text-lime-700 mt-2 font-mono">
          Trusted by solo devs, indie hackers, and tiny startups.
        </motion.div>
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
      <section id="code" className="max-w-3xl mx-auto px-3 sm:px-6 py-12">
        <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }} className="text-xl sm:text-2xl font-bold text-center mb-6 text-green-400 font-mono">Add Analytics in 5 Seconds</motion.h2>
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }} className="bg-[#18181b] text-green-400 font-mono rounded-lg p-5 text-base shadow-lg border border-green-900 overflow-x-auto text-left">
          <span className="select-all">{codeExample}</span>
        </motion.div>
        <div className="text-center text-neutral-500 mt-4 text-xs font-mono">No npm install. No build step. Just copy and go.</div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="max-w-5xl mx-auto px-3 sm:px-6 py-12">
        <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }} className="text-xl sm:text-2xl font-bold text-center mb-8 text-green-400 font-mono">What Devs Are Saying</motion.h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {testimonials.map((t, i) => (
            <motion.a
              key={i}
              href={t.url}
              target="_blank"
              rel="noopener"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              className="bg-[#23272e] rounded-lg p-4 flex flex-col items-center text-center shadow border border-neutral-800 hover:border-green-400 transition cursor-pointer group"
            >
              <div className="w-full h-32 bg-neutral-900 rounded mb-3 flex items-center justify-center overflow-hidden border border-neutral-800 group-hover:border-green-400 transition">
                {/* Replace with real screenshots later */}
                <span className="text-green-400 text-xs font-mono">[tweet screenshot here]</span>
              </div>
              <div className="font-mono text-xs text-green-400 mb-1">{t.user}</div>
              <div className="text-neutral-300 text-xs font-mono mb-2">{t.text}</div>
              <span className="text-xs text-green-400 group-hover:underline">View on Twitter →</span>
            </motion.a>
          ))}
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="max-w-5xl mx-auto px-3 sm:px-6 py-12">
        <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }} className="text-xl sm:text-2xl font-bold text-center mb-8 text-green-400 font-mono">Pricing</motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {pricing.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.7 }}
              className={`rounded-xl border shadow-sm p-6 flex flex-col items-center text-center transition-all font-mono ${plan.highlight ? 'border-green-400 bg-[#23272e] scale-105' : 'border-neutral-800 bg-[#18181b]'}`}
            >
              <div className="font-bold text-base mb-2 text-green-400">{plan.name}</div>
              <div className="text-2xl font-extrabold mb-2 text-green-300">{plan.price}<span className="text-base font-medium text-neutral-500">{plan.period}</span></div>
              <ul className="mb-6 space-y-1 text-left w-full max-w-xs mx-auto">
                {plan.features.map((f, j) => (
                  <li key={j} className="flex items-center gap-2 text-neutral-300 text-xs">
                    <CheckCircleIcon className="h-4 w-4 text-green-400" /> {f}
                  </li>
                ))}
              </ul>
              <a
                href={plan.name === 'Free' ? '#pricing' : '/auth'}
                className={`mt-auto px-5 py-2 rounded font-bold transition shadow-sm w-full ${plan.highlight ? 'bg-green-400 text-[#18181b] hover:bg-green-300' : 'bg-[#23272e] text-green-400 border border-green-400 hover:bg-green-400 hover:text-[#18181b]'}`}
              >
                {plan.name === 'Free' ? 'Get Started' : 'Choose Plan'}
              </a>
            </motion.div>
          ))}
        </div>
        <div className="mt-8 max-w-2xl mx-auto text-center text-neutral-500 text-xs font-mono">
          <span className="font-semibold text-green-400">All plans</span> include privacy-first tracking, no cookies, and developer-friendly API access. Upgrade anytime. Cancel anytime.
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-neutral-800 py-8 mt-12 text-xs font-mono">
        <div className="max-w-5xl mx-auto px-3 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex gap-4 mb-2 md:mb-0">
            <a href="https://twitter.com/whosviewingme" target="_blank" rel="noopener" className="hover:text-green-400 transition">Twitter</a>
            <a href="https://github.com/whosviewingme" target="_blank" rel="noopener" className="hover:text-green-400 transition">GitHub</a>
            <a href="/privacy" className="hover:text-green-400 transition">Privacy</a>
            <a href="/terms" className="hover:text-green-400 transition">Terms</a>
          </div>
          <div className="text-neutral-500">© 2025 Who's Viewing Me</div>
        </div>
      </footer>
    </div>
  );
} 