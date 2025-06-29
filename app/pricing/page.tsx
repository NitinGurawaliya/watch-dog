'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { 
  CheckIcon,
  XMarkIcon,
  ArrowRightIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline'
import Link from 'next/link'

const Pricing = () => {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<'FREE' | 'PRO' | null>(null)

  const plans = [
    {
      name: 'Free',
      price: '₹0',
      period: '/mo',
      description: 'Perfect for getting started',
      features: [
        'Up to 2 projects',
        'Basic analytics',
        'Real-time visitor tracking',
        '7-day data retention',
        'Standard support'
      ],
      limitations: [
        'No geo tracking',
        'No advanced exports',
        'No custom domains'
      ],
      buttonText: 'Get Started Free',
      popular: false,
      plan: 'FREE' as const
    },
    {
      name: 'Pro',
      price: '₹499',
      period: '/mo',
      description: 'For serious developers and teams',
      features: [
        'Unlimited projects',
        'Advanced analytics',
        'Geo tracking & insights',
        '30-day data retention',
        'Priority support',
        'Custom domains',
        'Data exports',
        'Team collaboration'
      ],
      limitations: [],
      buttonText: 'Upgrade to Pro',
      popular: true,
      plan: 'PRO' as const
    }
  ]

  const handlePlanSelect = async (plan: 'FREE' | 'PRO') => {
    if (!session) {
      router.push('/auth')
      return
    }

    setSelectedPlan(plan)
    setIsLoading(true)

    try {
      if (plan === 'FREE') {
        // For now, just redirect to dashboard
        // In a real implementation, you'd update the user's plan in the database
        router.push('/dashboard')
      } else if (plan === 'PRO') {
        // Redirect to Stripe checkout
        const response = await fetch('/api/stripe/checkout', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            plan: 'PRO'
          }),
        })

        if (response.ok) {
          const { url } = await response.json()
          window.location.href = url
        } else {
          throw new Error('Failed to create checkout session')
        }
      }
    } catch (error) {
      console.error('Error selecting plan:', error)
      alert('Something went wrong. Please try again.')
    } finally {
      setIsLoading(false)
      setSelectedPlan(null)
    }
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-[#18181b] text-neutral-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-lime-400 mx-auto mb-4"></div>
          <div className="text-lime-400 font-mono text-lg">Loading...</div>
        </div>
      </div>
    )
  }

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
            {session ? (
              <Link href="/dashboard" className="hover:text-lime-400 transition px-3 py-1 border border-lime-400 rounded bg-[#18181b]">
                Dashboard
              </Link>
            ) : (
              <Link href="/auth" className="hover:text-lime-400 transition px-3 py-1 border border-lime-400 rounded bg-[#18181b]">
                Login
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* Pricing Content */}
      <div className="min-h-[calc(100vh-120px)] flex items-center justify-center px-4 py-12">
        <div className="max-w-6xl mx-auto w-full">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-lime-400 font-mono mb-4">
              Choose Your Plan
            </h1>
            <p className="text-neutral-400 text-lg font-mono max-w-2xl mx-auto">
              Start free and upgrade when you need more power. All plans include real-time analytics and privacy-first tracking.
            </p>
          </div>

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`relative bg-[#23272e] rounded-lg border p-8 ${
                  plan.popular 
                    ? 'border-lime-400 shadow-lg shadow-lime-400/10' 
                    : 'border-neutral-800'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-lime-400 text-[#18181b] px-4 py-1 rounded-full text-xs font-bold font-mono flex items-center gap-1">
                      <SparklesIcon className="h-3 w-3" />
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-lime-400 font-mono mb-2">
                    {plan.name}
                  </h3>
                  <div className="flex items-baseline justify-center gap-1 mb-2">
                    <span className="text-4xl font-bold text-lime-400">{plan.price}</span>
                    <span className="text-neutral-400 font-mono">{plan.period}</span>
                  </div>
                  <p className="text-neutral-400 text-sm font-mono">{plan.description}</p>
                </div>

                {/* Features */}
                <div className="space-y-4 mb-8">
                  <h4 className="text-green-400 font-semibold font-mono flex items-center gap-2">
                    <CheckIcon className="h-4 w-4" />
                    What&apos;s included:
                  </h4>
                  <ul className="space-y-3">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <CheckIcon className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-neutral-300 font-mono">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {plan.limitations.length > 0 && (
                    <>
                      <h4 className="text-red-400 font-semibold font-mono flex items-center gap-2 mt-6">
                        <XMarkIcon className="h-4 w-4" />
                        Limitations:
                      </h4>
                      <ul className="space-y-3">
                        {plan.limitations.map((limitation, index) => (
                          <li key={index} className="flex items-start gap-3">
                            <XMarkIcon className="h-4 w-4 text-red-400 mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-neutral-400 font-mono">{limitation}</span>
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
                </div>

                {/* CTA Button */}
                <button
                  onClick={() => handlePlanSelect(plan.plan)}
                  disabled={isLoading}
                  className={`w-full py-3 px-6 rounded-lg font-bold font-mono transition-all duration-200 flex items-center justify-center gap-2 ${
                    plan.popular
                      ? 'bg-lime-400 text-[#18181b] hover:bg-lime-300 shadow-lg shadow-lime-400/20'
                      : 'bg-neutral-700 text-neutral-300 hover:bg-neutral-600 border border-neutral-600'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {isLoading && selectedPlan === plan.plan ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      {plan.buttonText}
                      <ArrowRightIcon className="h-4 w-4" />
                    </>
                  )}
                </button>
              </div>
            ))}
          </div>

          {/* FAQ Section */}
          <div className="mt-16 max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-lime-400 font-mono text-center mb-8">
              Frequently Asked Questions
            </h2>
            <div className="space-y-6">
              <div className="bg-[#23272e] p-6 rounded-lg border border-neutral-800">
                <h3 className="text-green-400 font-semibold font-mono mb-2">
                  Can I upgrade or downgrade my plan anytime?
                </h3>
                <p className="text-neutral-400 text-sm font-mono">
                  Yes! You can upgrade to Pro anytime. Downgrading to Free will take effect at the end of your current billing period.
                </p>
              </div>
              <div className="bg-[#23272e] p-6 rounded-lg border border-neutral-800">
                <h3 className="text-green-400 font-semibold font-mono mb-2">
                  What happens to my data if I downgrade?
                </h3>
                <p className="text-neutral-400 text-sm font-mono">
                  Your existing data is safe. You&apos;ll keep access to your first 2 projects, and we&apos;ll archive the rest until you upgrade again.
                </p>
              </div>
              <div className="bg-[#23272e] p-6 rounded-lg border border-neutral-800">
                <h3 className="text-green-400 font-semibold font-mono mb-2">
                  Is there a free trial for Pro?
                </h3>
                <p className="text-neutral-400 text-sm font-mono">
                  Yes! You can try Pro features free for 7 days. No credit card required to start.
                </p>
              </div>
            </div>
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

export default Pricing 