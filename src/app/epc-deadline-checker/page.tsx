'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Shield, ArrowRight, Zap, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { NewsletterSignup } from '@/components/shared/NewsletterSignup';

const ratings = [
  { grade: 'A', range: '92–100', compliant: true, upgradeEstimate: '' },
  { grade: 'B', range: '81–91', compliant: true, upgradeEstimate: '' },
  { grade: 'C', range: '69–80', compliant: true, upgradeEstimate: '' },
  { grade: 'D', range: '55–68', compliant: false, upgradeEstimate: '£3,000 – £8,000' },
  { grade: 'E', range: '39–54', compliant: false, upgradeEstimate: '£5,000 – £10,000' },
  { grade: 'F', range: '21–38', compliant: false, upgradeEstimate: '£8,000 – £10,000+' },
  { grade: 'G', range: '1–20', compliant: false, upgradeEstimate: '£10,000+' },
];

export default function EPCDeadlineCheckerPage() {
  const [selected, setSelected] = useState<string | null>(null);
  const rating = ratings.find((r) => r.grade === selected);

  const deadline = new Date('2030-10-01');
  const now = new Date();
  const daysLeft = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

  return (
    <div className="min-h-screen bg-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org', '@type': 'FAQPage',
        mainEntity: [
          { '@type': 'Question', name: 'When do rental properties need to be EPC C?', acceptedAnswer: { '@type': 'Answer', text: 'All private rental properties in England and Wales must achieve a minimum EPC rating of C by 1 October 2030. This was confirmed by the UK government in January 2026.' } },
          { '@type': 'Question', name: 'What is the penalty for not meeting EPC C?', acceptedAnswer: { '@type': 'Answer', text: 'Landlords face fines of up to £30,000 per property for failing to meet the minimum EPC rating by the deadline.' } },
          { '@type': 'Question', name: 'Is there a cost cap for EPC upgrades?', acceptedAnswer: { '@type': 'Answer', text: 'Yes, a cost cap of £10,000 per property applies. If you cannot reach EPC C within this budget, you may be eligible for an exemption.' } },
        ],
      }) }} />

      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center gap-2">
              <Shield className="h-8 w-8 text-[#1E3A5F]" />
              <span className="text-xl font-bold text-[#1E3A5F]">LandlordShield</span>
            </Link>
            <div className="hidden md:flex items-center gap-6">
              <Link href="/blog" className="text-sm text-gray-600 hover:text-[#1E3A5F]">Blog</Link>
              <Link href="/pricing" className="text-sm text-gray-600 hover:text-[#1E3A5F]">Pricing</Link>
              <Link href="/signup"><Button size="sm" className="bg-[#1E3A5F] hover:bg-[#2D4F7A]">Start Free</Button></Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-amber-50 text-amber-700 rounded-full px-4 py-1.5 text-sm font-medium mb-4">
            <Zap className="h-4 w-4" /> Deadline: 1 October 2030 — {daysLeft} days left
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-[#1E3A5F] mb-4">Is Your Rental Property Ready for EPC C?</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Select your current EPC rating to check if your property is compliant and estimate upgrade costs.
          </p>
        </div>

        {/* Rating selector */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {ratings.map((r) => (
            <button
              key={r.grade}
              onClick={() => setSelected(r.grade)}
              className={`w-16 h-16 rounded-xl text-xl font-bold border-2 transition-all ${
                selected === r.grade
                  ? r.compliant ? 'bg-green-500 text-white border-green-500 scale-110' : 'bg-red-500 text-white border-red-500 scale-110'
                  : r.compliant ? 'bg-green-50 text-green-700 border-green-200 hover:border-green-400' : 'bg-red-50 text-red-700 border-red-200 hover:border-red-400'
              }`}
            >
              {r.grade}
            </button>
          ))}
        </div>

        {/* Result */}
        {rating && (
          <Card className={`max-w-lg mx-auto mb-12 shadow-lg ${rating.compliant ? 'border-green-300' : 'border-red-300'}`}>
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                {rating.compliant ? <CheckCircle className="h-8 w-8 text-green-500" /> : <XCircle className="h-8 w-8 text-red-500" />}
                <div>
                  <h2 className={`text-xl font-bold ${rating.compliant ? 'text-green-700' : 'text-red-700'}`}>
                    EPC {rating.grade} ({rating.range}) — {rating.compliant ? 'Compliant' : 'Needs Upgrading'}
                  </h2>
                </div>
              </div>
              {rating.compliant ? (
                <p className="text-gray-600">Your property meets the minimum EPC C requirement. No action needed for the 2030 deadline, but consider further improvements to reduce energy costs and increase property value.</p>
              ) : (
                <div className="space-y-3">
                  <p className="text-gray-600">Your property needs to be upgraded to EPC C by <strong>1 October 2030</strong>.</p>
                  <div className="bg-red-50 rounded-lg p-3">
                    <p className="text-sm font-semibold text-red-700">Estimated upgrade cost: {rating.upgradeEstimate}</p>
                    <p className="text-xs text-red-600 mt-1">Cost cap: £10,000 per property</p>
                  </div>
                  <div className="bg-amber-50 rounded-lg p-3">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-amber-600" />
                      <p className="text-sm font-semibold text-amber-700">Penalty for non-compliance: up to £30,000</p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Educational content */}
        <div className="prose prose-gray max-w-none mb-12">
          <h2 className="text-2xl font-bold text-[#1E3A5F]">What Is the EPC C Requirement?</h2>
          <p>The UK government confirmed in January 2026 that all private rental properties in England and Wales must achieve a minimum EPC rating of <strong>C by 1 October 2030</strong>. The current minimum is EPC E.</p>

          <h2 className="text-2xl font-bold text-[#1E3A5F]">Cost Cap</h2>
          <p>A <strong>£10,000 cost cap</strong> applies per property. If you cannot reach EPC C within this budget, you can register an exemption after making improvements up to that amount. Works from October 2025 onwards count toward the cap.</p>

          <h2 className="text-2xl font-bold text-[#1E3A5F]">Common Improvements</h2>
          <ul>
            <li><strong>Loft insulation</strong> (£300–£1,000) — often the most cost-effective improvement</li>
            <li><strong>Cavity wall insulation</strong> (£500–£2,000)</li>
            <li><strong>Double glazing</strong> (£3,000–£7,000)</li>
            <li><strong>Boiler upgrade</strong> (£2,000–£4,000)</li>
            <li><strong>Smart heating controls</strong> (£200–£500)</li>
            <li><strong>LED lighting</strong> (£100–£300)</li>
          </ul>

          <h2 className="text-2xl font-bold text-[#1E3A5F]">Exemptions</h2>
          <p>Exemptions are available if:</p>
          <ul>
            <li>All cost-effective improvements have been made up to the £10,000 cap</li>
            <li>Required improvements would devalue the property by more than 5%</li>
            <li>You cannot obtain necessary consents (e.g. listed building)</li>
          </ul>
          <p>Exemptions last 5 years and must be registered on the PRS Exemptions Register.</p>
        </div>

        {/* CTA */}
        <Card className="border-2 border-[#1E3A5F] mb-12">
          <CardContent className="p-6 text-center">
            <h2 className="text-xl font-bold text-[#1E3A5F] mb-2">Track your EPC status and plan upgrades</h2>
            <p className="text-gray-600 mb-4">LandlordShield&apos;s EPC upgrade planner helps you prioritise improvements by cost-effectiveness and track spending against the £10,000 cap.</p>
            <Link href="/signup"><Button className="bg-[#1E3A5F] hover:bg-[#2D4F7A]">Start Free — 1 Property <ArrowRight className="ml-2 h-4 w-4" /></Button></Link>
          </CardContent>
        </Card>

        <NewsletterSignup />
      </main>

      <footer className="bg-gray-900 text-gray-400 py-8 mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs text-gray-500">&copy; 2026 LandlordShield by Avantware. All rights reserved. England &amp; Wales only.</p>
        </div>
      </footer>
    </div>
  );
}
