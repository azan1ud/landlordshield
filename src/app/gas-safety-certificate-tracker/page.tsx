'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Shield, ArrowRight, Flame, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { NewsletterSignup } from '@/components/shared/NewsletterSignup';

export default function GasSafetyTrackerPage() {
  const [date, setDate] = useState('');
  const result = date ? calculateExpiry(date) : null;

  function calculateExpiry(lastInspection: string) {
    const inspDate = new Date(lastInspection);
    const expiry = new Date(inspDate);
    expiry.setFullYear(expiry.getFullYear() + 1);
    const now = new Date();
    const diffMs = expiry.getTime() - now.getTime();
    const daysLeft = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
    const renewBy = new Date(expiry);
    renewBy.setMonth(renewBy.getMonth() - 1);
    return { inspDate, expiry, daysLeft, renewBy };
  }

  return (
    <div className="min-h-screen bg-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org', '@type': 'FAQPage',
        mainEntity: [
          { '@type': 'Question', name: 'How often does a landlord need a gas safety certificate?', acceptedAnswer: { '@type': 'Answer', text: 'UK landlords must renew their gas safety certificate (CP12) every 12 months. The certificate must be issued by a Gas Safe registered engineer.' } },
          { '@type': 'Question', name: 'What happens if a landlord does not have a gas safety certificate?', acceptedAnswer: { '@type': 'Answer', text: 'Non-compliance can result in fines up to £6,000, up to 6 months imprisonment, and invalidation of your ability to serve eviction notices.' } },
          { '@type': 'Question', name: 'How much does a gas safety certificate cost?', acceptedAnswer: { '@type': 'Answer', text: 'A gas safety check typically costs between £60 and £120, depending on the number of gas appliances and your location.' } },
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
          <div className="inline-flex items-center gap-2 bg-red-50 text-red-700 rounded-full px-4 py-1.5 text-sm font-medium mb-4">
            <Flame className="h-4 w-4" /> Free Tool for UK Landlords
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-[#1E3A5F] mb-4">Gas Safety Certificate Expiry Tracker</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Enter your last inspection date to check if your gas safety certificate is still valid and when to book your next renewal.
          </p>
        </div>

        {/* Tool */}
        <Card className="max-w-lg mx-auto mb-12 shadow-lg">
          <CardContent className="p-6">
            <label className="block text-sm font-semibold text-[#1E3A5F] mb-2">Last Gas Safety Inspection Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1E3A5F]"
            />
            {result && (
              <div className="mt-6 space-y-4">
                <div className={`rounded-lg p-4 ${result.daysLeft > 60 ? 'bg-green-50 border border-green-200' : result.daysLeft > 0 ? 'bg-amber-50 border border-amber-200' : 'bg-red-50 border border-red-200'}`}>
                  <div className="flex items-center gap-2 mb-2">
                    {result.daysLeft > 60 ? <CheckCircle className="h-5 w-5 text-green-600" /> : result.daysLeft > 0 ? <Clock className="h-5 w-5 text-amber-600" /> : <AlertTriangle className="h-5 w-5 text-red-600" />}
                    <span className={`text-lg font-bold ${result.daysLeft > 60 ? 'text-green-700' : result.daysLeft > 0 ? 'text-amber-700' : 'text-red-700'}`}>
                      {result.daysLeft > 0 ? 'Valid' : 'Expired'} — {result.daysLeft > 0 ? `${result.daysLeft} days remaining` : `Expired ${Math.abs(result.daysLeft)} days ago`}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>Expiry date: <strong>{result.expiry.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</strong></p>
                    <p>Book renewal by: <strong>{result.renewBy.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</strong></p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Educational content */}
        <div className="prose prose-gray max-w-none mb-12">
          <h2 className="text-2xl font-bold text-[#1E3A5F]">What Is a Gas Safety Certificate?</h2>
          <p>A Gas Safety Certificate (also known as a CP12) is a legal document issued after a gas safety check on a rental property. It confirms that all gas appliances, fittings, and flues are safe to use.</p>

          <h2 className="text-2xl font-bold text-[#1E3A5F]">Legal Requirements</h2>
          <p>Under the Gas Safety (Installation and Use) Regulations 1998, all landlords who let properties with gas appliances must:</p>
          <ul>
            <li>Have a gas safety check carried out <strong>every 12 months</strong> by a Gas Safe registered engineer</li>
            <li>Give a copy of the certificate to existing tenants within <strong>28 days</strong> of the check</li>
            <li>Give a copy to new tenants <strong>before they move in</strong></li>
            <li>Keep records for at least <strong>2 years</strong></li>
          </ul>

          <h2 className="text-2xl font-bold text-[#1E3A5F]">Typical Cost</h2>
          <p>A gas safety check typically costs <strong>£60–£120</strong>, depending on the number of gas appliances and your location. Some engineers offer discounts for multiple properties.</p>

          <h2 className="text-2xl font-bold text-[#1E3A5F]">Penalties for Non-Compliance</h2>
          <p>Failing to have a valid gas safety certificate can result in:</p>
          <ul>
            <li>Fines up to <strong>£6,000</strong></li>
            <li>Up to <strong>6 months imprisonment</strong></li>
            <li>Inability to serve valid eviction notices</li>
            <li>Potential manslaughter charges in the event of a fatality</li>
          </ul>
        </div>

        {/* CTA */}
        <Card className="border-2 border-[#1E3A5F] mb-12">
          <CardContent className="p-6 text-center">
            <h2 className="text-xl font-bold text-[#1E3A5F] mb-2">Never miss a gas safety deadline</h2>
            <p className="text-gray-600 mb-4">LandlordShield sends automatic reminders at 30, 7, and 0 days before your certificate expires. Track all 6 compliance pillars in one dashboard.</p>
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
