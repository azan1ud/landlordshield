'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Shield, CheckCircle, ArrowLeft, AlertTriangle } from 'lucide-react';

const plans = [
  {
    id: 'free',
    name: 'Free',
    description: 'For landlords getting started',
    monthlyPrice: 0,
    yearlyPrice: 0,
    propertyLimit: '1 property',
    features: [
      '1 property',
      'Basic compliance checklists (all three pillars)',
      'MTD threshold calculator',
      'EPC overview',
      'Knowledge base access',
    ],
    cta: 'Get Started',
    popular: false,
  },
  {
    id: 'pro',
    name: 'Pro',
    description: 'For active landlords',
    monthlyPrice: 9.99,
    yearlyPrice: 89.99,
    propertyLimit: 'Up to 10 properties',
    features: [
      'Up to 10 properties',
      'Full compliance dashboard with scoring',
      'All checklists and trackers',
      'Document storage (upload certs, agreements)',
      'Certificate expiry reminders (email)',
      'Compliance calendar',
      'Rent increase calculator',
      'EPC upgrade planner',
      'PDF compliance reports',
      'MTD software comparison',
      'Priority email support',
    ],
    cta: 'Start 14-Day Free Trial',
    popular: true,
    trial: true,
  },
  {
    id: 'portfolio',
    name: 'Portfolio',
    description: 'For serious portfolio landlords',
    monthlyPrice: 24.99,
    yearlyPrice: 219.99,
    propertyLimit: 'Unlimited properties',
    features: [
      'Unlimited properties',
      'Everything in Pro',
      'Document generator (notice templates, rent increase notices)',
      'Multi-user access (e.g., landlord + accountant)',
      'Portfolio-wide analytics',
      'Annual compliance summary reports',
      'Priority support',
    ],
    cta: 'Get Started',
    popular: false,
  },
];

export default function PricingPage() {
  const [isYearly, setIsYearly] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <nav className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center gap-2">
              <Shield className="h-7 w-7 text-[#1E3A5F]" />
              <span className="text-lg font-bold text-[#1E3A5F]">LandlordShield</span>
            </Link>
            <div className="flex items-center gap-4">
              <Link href="/login">
                <Button variant="ghost" size="sm">Log in</Button>
              </Link>
              <Link href="/signup">
                <Button size="sm" className="bg-[#1E3A5F] hover:bg-[#2D4F7A]">Sign up</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Back link */}
        <Link href="/" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-[#1E3A5F] mb-8">
          <ArrowLeft className="h-4 w-4" />
          Back to home
        </Link>

        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-[#1E3A5F] mb-4">
            Simple, transparent pricing
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Start free with 1 property. Upgrade as your portfolio grows.
          </p>

          {/* Billing toggle */}
          <div className="flex items-center justify-center gap-3">
            <span className={`text-sm font-medium ${!isYearly ? 'text-[#1E3A5F]' : 'text-gray-500'}`}>Monthly</span>
            <Switch checked={isYearly} onCheckedChange={setIsYearly} />
            <span className={`text-sm font-medium ${isYearly ? 'text-[#1E3A5F]' : 'text-gray-500'}`}>
              Yearly
            </span>
            {isYearly && (
              <Badge className="bg-green-100 text-green-700 border-green-200">Save up to 27%</Badge>
            )}
          </div>
        </div>

        {/* Pricing cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan) => (
            <Card
              key={plan.id}
              className={`relative ${plan.popular ? 'border-2 border-[#1E3A5F] shadow-xl' : ''}`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#1E3A5F] text-white text-xs font-bold px-3 py-1 rounded-full">
                  MOST POPULAR
                </div>
              )}
              <CardHeader>
                <CardTitle className="text-xl">{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold">
                    £{isYearly ? plan.yearlyPrice : plan.monthlyPrice}
                  </span>
                  <span className="text-gray-500">
                    /{isYearly ? 'year' : 'month'}
                  </span>
                  {isYearly && plan.monthlyPrice > 0 && (
                    <p className="text-sm text-gray-400 mt-1">
                      That&apos;s £{(plan.yearlyPrice / 12).toFixed(2)}/month
                    </p>
                  )}
                </div>
                {plan.trial && (
                  <p className="text-sm text-[#16A34A] font-medium mt-2">14-day free trial included</p>
                )}
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link href={`/signup?plan=${plan.id}`} className="block">
                  <Button
                    className={`w-full ${plan.popular ? 'bg-[#1E3A5F] hover:bg-[#2D4F7A]' : ''}`}
                    variant={plan.popular ? 'default' : 'outline'}
                  >
                    {plan.cta}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Money-back guarantee */}
        <div className="text-center mt-12">
          <p className="text-sm text-gray-500">
            All prices in GBP (£). Cancel anytime. No hidden fees.
          </p>
        </div>

        {/* FAQ section */}
        <div className="max-w-2xl mx-auto mt-16">
          <h2 className="text-2xl font-bold text-[#1E3A5F] text-center mb-8">Pricing FAQ</h2>
          <div className="space-y-4">
            {[
              {
                q: 'Can I change plans later?',
                a: 'Yes, you can upgrade or downgrade your plan at any time. Changes take effect at the start of your next billing period.',
              },
              {
                q: 'What happens when my trial ends?',
                a: 'After your 14-day trial, you\'ll be charged for the Pro plan. You can cancel before the trial ends and you won\'t be charged.',
              },
              {
                q: 'Do you offer refunds?',
                a: 'We offer a full refund within the first 30 days if you\'re not satisfied.',
              },
              {
                q: 'What payment methods do you accept?',
                a: 'We accept all major credit and debit cards through Stripe, including Visa, Mastercard, and American Express.',
              },
            ].map((faq) => (
              <details key={faq.q} className="group bg-white rounded-lg border overflow-hidden">
                <summary className="flex items-center justify-between cursor-pointer p-4 font-medium text-sm text-[#1E3A5F] list-none">
                  {faq.q}
                  <span className="text-gray-400 group-open:rotate-180 transition-transform">&#9660;</span>
                </summary>
                <div className="px-4 pb-4 text-gray-600 text-sm">{faq.a}</div>
              </details>
            ))}
          </div>
        </div>
      </div>

      {/* Footer disclaimer */}
      <footer className="bg-white border-t border-gray-100 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-start gap-2 justify-center">
            <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
            <p className="text-xs text-gray-500 text-center max-w-2xl">
              This tool provides guidance based on publicly available information. It is not legal, tax, or financial advice.
              Always consult a qualified professional for advice specific to your situation.
            </p>
          </div>
          <p className="text-xs text-gray-400 text-center mt-4">
            &copy; 2026 LandlordShield. All rights reserved. England &amp; Wales only.
          </p>
        </div>
      </footer>
    </div>
  );
}
