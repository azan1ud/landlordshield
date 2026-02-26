import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Shield,
  Calculator,
  Scale,
  Zap,
  CalendarDays,
  FileText,
  Building2,
  Bell,
  CheckCircle,
  ArrowRight,
  ChevronDown,
} from 'lucide-react';

const features = [
  {
    icon: Shield,
    title: 'Unified compliance dashboard',
    description: 'See your MTD, Renters\' Rights, and EPC compliance status at a glance.',
  },
  {
    icon: Building2,
    title: 'Property portfolio management',
    description: 'Track all your properties, tenancies, and compliance certificates in one place.',
  },
  {
    icon: Calculator,
    title: 'MTD readiness checker',
    description: 'Find out if you\'re affected and what you need to do before April 2026.',
  },
  {
    icon: Scale,
    title: 'Renters\' Rights action plan',
    description: 'Step-by-step checklist for every change coming on 1 May 2026.',
  },
  {
    icon: Zap,
    title: 'EPC upgrade planner with cost estimates',
    description: 'Prioritise improvements by cost-effectiveness and track spending against the £10,000 cap.',
  },
  {
    icon: Bell,
    title: 'Certificate expiry reminders',
    description: 'Never miss a gas safety, EICR, or insurance renewal date again.',
  },
  {
    icon: FileText,
    title: 'Document templates',
    description: 'Section 13 rent increase notices, Section 8 notices, pet consent forms, and more.',
  },
  {
    icon: CalendarDays,
    title: 'Compliance calendar',
    description: 'All your regulatory and certificate deadlines in one colour-coded calendar.',
  },
];

const faqs = [
  {
    q: 'Does LandlordShield submit my tax returns to HMRC?',
    a: 'No. LandlordShield is not MTD software. We help you understand if you\'re affected, prepare your records, track deadlines, and point you to HMRC-recognised software for actual submissions.',
  },
  {
    q: 'Is this suitable for landlords in Scotland or Northern Ireland?',
    a: 'LandlordShield currently covers England and Wales only. Scotland and Northern Ireland have different tenancy legislation. MTD applies UK-wide, but the Renters\' Rights Act and some EPC rules differ.',
  },
  {
    q: 'How many properties can I manage?',
    a: 'The Free plan includes 1 property. Pro supports up to 10 properties, and Portfolio is unlimited.',
  },
  {
    q: 'Is there a free trial?',
    a: 'Yes — the Pro plan includes a 14-day free trial. No credit card required for the Free plan.',
  },
  {
    q: 'Can my accountant access my dashboard?',
    a: 'The Portfolio plan includes multi-user access, so you can invite your accountant to view your compliance data and financial records.',
  },
  {
    q: 'How do you keep the regulatory information up to date?',
    a: 'Our team monitors HMRC, MHCLG, and DESNZ publications and updates the platform with every regulatory change. All dates and thresholds are maintained in our system and reflected immediately.',
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <Shield className="h-8 w-8 text-[#1E3A5F]" />
              <span className="text-xl font-bold text-[#1E3A5F]">LandlordShield</span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-sm text-gray-600 hover:text-[#1E3A5F]">Features</a>
              <a href="#pricing" className="text-sm text-gray-600 hover:text-[#1E3A5F]">Pricing</a>
              <a href="#faq" className="text-sm text-gray-600 hover:text-[#1E3A5F]">FAQ</a>
              <Link href="/login">
                <Button variant="ghost" size="sm">Log in</Button>
              </Link>
              <Link href="/signup">
                <Button size="sm" className="bg-[#1E3A5F] hover:bg-[#2D4F7A]">Start Free</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#1E3A5F] via-[#1E3A5F] to-[#2D4F7A] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32 relative">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-1.5 text-sm mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-400"></span>
              </span>
              MTD starts 6 April 2026 — Renters&apos; Rights Act 1 May 2026
            </div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
              Three Deadlines.<br />One Dashboard.
            </h1>
            <p className="text-xl md:text-2xl text-gray-200 mb-8 leading-relaxed">
              MTD, Renters&apos; Rights Act, EPC C — UK landlords face the biggest regulatory
              shake-up in 35 years. Track your compliance across all three in one place.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/signup">
                <Button size="lg" className="bg-white text-[#1E3A5F] hover:bg-gray-100 text-lg px-8 py-6">
                  Start Free — 1 Property
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <a href="#features">
                <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 text-lg px-8 py-6">
                  See How It Works
                  <ChevronDown className="ml-2 h-5 w-5" />
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* The Problem */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[#1E3A5F] mb-4">
              A regulatory tsunami is hitting UK landlords
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Three major regulatory changes are converging in 2026. No single tool tracks all three. Until now.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="border-t-4 border-t-[#2563EB] shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                    <Calculator className="h-5 w-5 text-[#2563EB]" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">Making Tax Digital</h3>
                    <p className="text-sm text-[#2563EB] font-medium">April 2026</p>
                  </div>
                </div>
                <p className="text-gray-600 mb-4">
                  Quarterly digital tax returns become mandatory. Penalties for non-compliance.
                </p>
                <div className="bg-blue-50 rounded-lg p-3 text-sm">
                  <p className="font-semibold text-[#2563EB]">864,000 landlords affected</p>
                  <p className="text-gray-600">Only 30% are aware of the changes</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-t-4 border-t-[#16A34A] shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                    <Scale className="h-5 w-5 text-[#16A34A]" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">Renters&apos; Rights Act</h3>
                    <p className="text-sm text-[#16A34A] font-medium">May 2026</p>
                  </div>
                </div>
                <p className="text-gray-600 mb-4">
                  Section 21 abolished. New tenancy rules. Fines up to £7,000.
                </p>
                <div className="bg-green-50 rounded-lg p-3 text-sm">
                  <p className="font-semibold text-[#16A34A]">11 million renters gain new protections</p>
                  <p className="text-gray-600">Are you ready?</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-t-4 border-t-[#F59E0B] shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
                    <Zap className="h-5 w-5 text-[#F59E0B]" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">EPC C Requirement</h3>
                    <p className="text-sm text-[#F59E0B] font-medium">October 2030</p>
                  </div>
                </div>
                <p className="text-gray-600 mb-4">
                  All rentals must achieve EPC C. Fines up to £30,000 per property.
                </p>
                <div className="bg-amber-50 rounded-lg p-3 text-sm">
                  <p className="font-semibold text-[#F59E0B]">2.5 million homes need upgrades</p>
                  <p className="text-gray-600">£10,000 spending cap per property</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Dashboard Preview */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[#1E3A5F] mb-4">
              Your compliance at a glance
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              One dashboard that scores your readiness across all three regulatory areas.
            </p>
          </div>
          <div className="max-w-4xl mx-auto">
            <Card className="shadow-2xl border-0 overflow-hidden">
              <div className="bg-[#1E3A5F] px-6 py-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-400"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                  <div className="w-3 h-3 rounded-full bg-green-400"></div>
                  <span className="ml-4 text-white/60 text-sm">LandlordShield Dashboard</span>
                </div>
              </div>
              <CardContent className="p-8 bg-gray-50">
                <div className="text-center mb-6">
                  <p className="text-sm text-gray-500 uppercase tracking-wide font-medium">Overall Compliance</p>
                  <p className="text-5xl font-bold text-[#1E3A5F]">64%</p>
                </div>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="bg-white rounded-xl p-5 border border-blue-200 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-500">MTD</span>
                      <span className="text-xs px-2 py-0.5 bg-amber-100 text-amber-700 rounded-full font-medium">Partial</span>
                    </div>
                    <p className="text-3xl font-bold text-[#2563EB]">70%</p>
                    <div className="mt-3 space-y-1">
                      <p className="text-xs text-gray-500">Deadline: <span className="font-medium text-gray-700">6 Apr 2026</span></p>
                      <p className="text-xs text-red-600 font-medium">42 days left</p>
                      <p className="text-xs text-gray-500">3 actions remaining</p>
                    </div>
                  </div>
                  <div className="bg-white rounded-xl p-5 border border-green-200 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-500">Renters&apos; Rights</span>
                      <span className="text-xs px-2 py-0.5 bg-red-100 text-red-700 rounded-full font-medium">Not Ready</span>
                    </div>
                    <p className="text-3xl font-bold text-[#16A34A]">35%</p>
                    <div className="mt-3 space-y-1">
                      <p className="text-xs text-gray-500">Deadline: <span className="font-medium text-gray-700">1 May 2026</span></p>
                      <p className="text-xs text-red-600 font-medium">67 days left</p>
                      <p className="text-xs text-gray-500">7 actions remaining</p>
                    </div>
                  </div>
                  <div className="bg-white rounded-xl p-5 border border-amber-200 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-500">EPC</span>
                      <span className="text-xs px-2 py-0.5 bg-amber-100 text-amber-700 rounded-full font-medium">In Progress</span>
                    </div>
                    <p className="text-3xl font-bold text-[#F59E0B]">60%</p>
                    <div className="mt-3 space-y-1">
                      <p className="text-xs text-gray-500">Deadline: <span className="font-medium text-gray-700">1 Oct 2030</span></p>
                      <p className="text-xs text-gray-500">1,680 days left</p>
                      <p className="text-xs text-gray-500">4 actions remaining</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[#1E3A5F] mb-4">
              Everything you need in one place
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Purpose-built for UK landlords navigating the 2026 regulatory changes.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature) => (
              <Card key={feature.title} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <feature.icon className="h-8 w-8 text-[#1E3A5F] mb-3" />
                  <h3 className="font-semibold mb-2">{feature.title}</h3>
                  <p className="text-sm text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[#1E3A5F] mb-4">
              Simple, transparent pricing
            </h2>
            <p className="text-lg text-gray-600">Start free. Upgrade when you need more.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Free */}
            <Card className="relative">
              <CardContent className="p-8">
                <h3 className="text-xl font-bold mb-1">Free</h3>
                <p className="text-gray-500 text-sm mb-4">For landlords getting started</p>
                <div className="mb-6">
                  <span className="text-4xl font-bold">£0</span>
                  <span className="text-gray-500">/month</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {['1 property', 'Basic compliance checklists', 'MTD threshold calculator', 'EPC overview', 'Knowledge base access'].map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link href="/signup" className="block">
                  <Button variant="outline" className="w-full">Get Started</Button>
                </Link>
              </CardContent>
            </Card>

            {/* Pro */}
            <Card className="relative border-2 border-[#1E3A5F] shadow-xl">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#1E3A5F] text-white text-xs font-bold px-3 py-1 rounded-full">
                MOST POPULAR
              </div>
              <CardContent className="p-8">
                <h3 className="text-xl font-bold mb-1">Pro</h3>
                <p className="text-gray-500 text-sm mb-4">For active landlords</p>
                <div className="mb-6">
                  <span className="text-4xl font-bold">£9.99</span>
                  <span className="text-gray-500">/month</span>
                  <p className="text-sm text-gray-400 mt-1">or £89.99/year (save 25%)</p>
                </div>
                <ul className="space-y-3 mb-8">
                  {['Up to 10 properties', 'Full compliance dashboard', 'All checklists and trackers', 'Document storage', 'Certificate expiry reminders', 'Compliance calendar', 'Rent increase calculator', 'EPC upgrade planner', 'PDF compliance reports', 'Priority email support'].map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link href="/signup?plan=pro" className="block">
                  <Button className="w-full bg-[#1E3A5F] hover:bg-[#2D4F7A]">Start 14-Day Free Trial</Button>
                </Link>
              </CardContent>
            </Card>

            {/* Portfolio */}
            <Card className="relative">
              <CardContent className="p-8">
                <h3 className="text-xl font-bold mb-1">Portfolio</h3>
                <p className="text-gray-500 text-sm mb-4">For serious portfolio landlords</p>
                <div className="mb-6">
                  <span className="text-4xl font-bold">£24.99</span>
                  <span className="text-gray-500">/month</span>
                  <p className="text-sm text-gray-400 mt-1">or £219.99/year (save 27%)</p>
                </div>
                <ul className="space-y-3 mb-8">
                  {['Unlimited properties', 'Everything in Pro', 'Document generator', 'Multi-user access', 'Portfolio-wide analytics', 'Annual compliance reports', 'Priority support'].map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link href="/signup?plan=portfolio" className="block">
                  <Button variant="outline" className="w-full">Get Started</Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Trust */}
      <section className="py-16 bg-[#1E3A5F] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-4">
                <Building2 className="h-6 w-6" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Built by landlords, for landlords</h3>
              <p className="text-gray-300 text-sm">Designed around real compliance challenges faced by UK private landlords.</p>
            </div>
            <div>
              <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-4">
                <Shield className="h-6 w-6" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Based on official guidance</h3>
              <p className="text-gray-300 text-sm">All information sourced from HMRC, MHCLG, and DESNZ official publications.</p>
            </div>
            <div>
              <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-4">
                <Bell className="h-6 w-6" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Updated with every change</h3>
              <p className="text-gray-300 text-sm">Regulatory information is monitored and updated as soon as changes are announced.</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-[#1E3A5F] text-center mb-12">
            Frequently asked questions
          </h2>
          <div className="space-y-4">
            {faqs.map((faq) => (
              <details key={faq.q} className="group bg-white rounded-lg border border-gray-200 overflow-hidden">
                <summary className="flex items-center justify-between cursor-pointer p-5 font-medium text-[#1E3A5F] list-none">
                  {faq.q}
                  <ChevronDown className="h-5 w-5 text-gray-400 group-open:rotate-180 transition-transform" />
                </summary>
                <div className="px-5 pb-5 text-gray-600 text-sm leading-relaxed">{faq.a}</div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-[#1E3A5F] mb-4">
            Don&apos;t wait for the deadlines to hit
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            April 2026 is weeks away. Get your compliance on track today with a free account.
          </p>
          <Link href="/signup">
            <Button size="lg" className="bg-[#1E3A5F] hover:bg-[#2D4F7A] text-lg px-8 py-6">
              Start Free — 1 Property
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Shield className="h-6 w-6 text-white" />
                <span className="text-lg font-bold text-white">LandlordShield</span>
              </div>
              <p className="text-sm">The unified compliance dashboard for UK private landlords.</p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-3">Product</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#features" className="hover:text-white">Features</a></li>
                <li><a href="#pricing" className="hover:text-white">Pricing</a></li>
                <li><Link href="/knowledge" className="hover:text-white">Knowledge Base</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-3">Compliance</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/mtd" className="hover:text-white">Making Tax Digital</Link></li>
                <li><Link href="/renters-rights" className="hover:text-white">Renters&apos; Rights Act</Link></li>
                <li><Link href="/epc" className="hover:text-white">EPC Requirements</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-3">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/privacy" className="hover:text-white">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-white">Terms of Service</Link></li>
                <li><Link href="/cookies" className="hover:text-white">Cookie Policy</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8">
            <p className="text-xs text-gray-500 text-center">
              This tool provides guidance based on publicly available information. It is not legal, tax, or financial advice.
              Always consult a qualified professional for advice specific to your situation.
            </p>
            <p className="text-xs text-gray-500 text-center mt-2">
              &copy; 2026 LandlordShield. All rights reserved. England &amp; Wales only.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
