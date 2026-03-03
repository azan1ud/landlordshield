'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Shield, CheckCircle, Circle, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { NewsletterSignup } from '@/components/shared/NewsletterSignup';

const items = [
  { id: 'gas', category: 'Certificates', title: 'Gas Safety Certificate (CP12)', desc: 'Annual inspection by Gas Safe registered engineer.', frequency: 'Every 12 months', penalty: '£6,000 + imprisonment' },
  { id: 'eicr', category: 'Certificates', title: 'EICR (Electrical Safety)', desc: 'Electrical Installation Condition Report by qualified electrician.', frequency: 'Every 5 years', penalty: '£30,000' },
  { id: 'epc', category: 'Certificates', title: 'EPC (Energy Performance)', desc: 'Valid EPC. Must reach C by October 2030.', frequency: 'Every 10 years', penalty: '£30,000' },
  { id: 'legionella', category: 'Certificates', title: 'Legionella Risk Assessment', desc: 'Water system risk assessment.', frequency: 'Every 2 years', penalty: 'Unlimited' },
  { id: 'pat', category: 'Certificates', title: 'PAT Testing', desc: 'Portable Appliance Testing of supplied appliances.', frequency: 'Annual (best practice)', penalty: 'Unlimited' },
  { id: 'smoke', category: 'Safety', title: 'Smoke & CO Alarms', desc: 'Smoke alarm on every floor, CO alarm with combustion appliances.', frequency: 'Each tenancy start', penalty: '£5,000' },
  { id: 'deposit', category: 'Tenancy', title: 'Deposit Protection', desc: 'Protect deposit in approved scheme within 30 days.', frequency: 'Within 30 days', penalty: '3x deposit' },
  { id: 'righttorent', category: 'Tenancy', title: 'Right to Rent Check', desc: 'Verify all adult tenants have right to live in the UK.', frequency: 'Before tenancy', penalty: '£20,000' },
  { id: 'prescribed', category: 'Tenancy', title: 'Prescribed Information', desc: 'Provide deposit prescribed information to tenant.', frequency: 'Within 30 days', penalty: '3x deposit' },
  { id: 'howtorent', category: 'Tenancy', title: "How to Rent Guide", desc: "Provide the government's How to Rent booklet to tenant.", frequency: 'Each new tenancy', penalty: 'Cannot serve Section 8' },
];

export default function ComplianceChecklistPage() {
  const [checked, setChecked] = useState<Set<string>>(new Set());

  const toggle = (id: string) => {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const pct = Math.round((checked.size / items.length) * 100);

  return (
    <div className="min-h-screen bg-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org', '@type': 'FAQPage',
        mainEntity: [
          { '@type': 'Question', name: 'What certificates does a landlord need in the UK?', acceptedAnswer: { '@type': 'Answer', text: 'UK landlords need a Gas Safety Certificate (CP12), EICR, EPC, Legionella Risk Assessment, and smoke/CO alarms. PAT testing is best practice for supplied appliances.' } },
          { '@type': 'Question', name: 'How often does a landlord need a gas safety certificate?', acceptedAnswer: { '@type': 'Answer', text: 'A gas safety certificate must be renewed every 12 months by a Gas Safe registered engineer.' } },
          { '@type': 'Question', name: 'What is the penalty for not having an EICR?', acceptedAnswer: { '@type': 'Answer', text: 'Landlords can face fines of up to £30,000 for not having a valid EICR.' } },
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
        <h1 className="text-3xl md:text-4xl font-bold text-[#1E3A5F] mb-4 text-center">
          UK Landlord Compliance Checklist 2026
        </h1>
        <p className="text-lg text-gray-600 text-center mb-8 max-w-2xl mx-auto">
          Check your compliance across all legal requirements — free. Click each item as you complete it.
        </p>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-[#1E3A5F]">Your Compliance Score</span>
            <span className={`text-2xl font-bold ${pct === 100 ? 'text-green-600' : pct >= 60 ? 'text-amber-600' : 'text-red-600'}`}>{pct}%</span>
          </div>
          <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${pct === 100 ? 'bg-green-500' : pct >= 60 ? 'bg-amber-500' : 'bg-red-500'}`}
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>

        {/* Checklist */}
        <div className="space-y-3">
          {items.map((item) => (
            <Card
              key={item.id}
              className={`cursor-pointer transition-all ${checked.has(item.id) ? 'border-green-300 bg-green-50/50' : 'hover:border-gray-300'}`}
              onClick={() => toggle(item.id)}
            >
              <CardContent className="p-4 flex items-start gap-4">
                {checked.has(item.id) ? (
                  <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0 mt-0.5" />
                ) : (
                  <Circle className="h-6 w-6 text-gray-300 flex-shrink-0 mt-0.5" />
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className={`font-semibold ${checked.has(item.id) ? 'text-green-700 line-through' : 'text-[#1E3A5F]'}`}>{item.title}</h3>
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{item.category}</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{item.desc}</p>
                  <div className="flex gap-4 mt-2 text-xs text-gray-500">
                    <span>Frequency: {item.frequency}</span>
                    <span>Max penalty: {item.penalty}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA */}
        <Card className="mt-12 border-2 border-[#1E3A5F]">
          <CardContent className="p-6 text-center">
            <h2 className="text-xl font-bold text-[#1E3A5F] mb-2">Track all of this automatically</h2>
            <p className="text-gray-600 mb-4">LandlordShield monitors every certificate, sends reminders before they expire, and gives you a real-time compliance score.</p>
            <Link href="/signup">
              <Button className="bg-[#1E3A5F] hover:bg-[#2D4F7A]">Start Free — 1 Property <ArrowRight className="ml-2 h-4 w-4" /></Button>
            </Link>
          </CardContent>
        </Card>

        <div className="mt-12">
          <NewsletterSignup />
        </div>
      </main>

      <footer className="bg-gray-900 text-gray-400 py-8 mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs text-gray-500">&copy; 2026 LandlordShield by Avantware. All rights reserved. England &amp; Wales only.</p>
        </div>
      </footer>
    </div>
  );
}
