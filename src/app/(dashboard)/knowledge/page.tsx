import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  BookOpen,
  Calculator,
  Scale,
  Zap,
  Gavel,
  PoundSterling,
  Shield,
  Coins,
  AlertTriangle,
  ArrowRight,
  HelpCircle,
} from 'lucide-react';
import Link from 'next/link';

const guides = [
  {
    title: 'MTD for Landlords: Step-by-Step Guide',
    description: 'Everything you need to know about Making Tax Digital for Income Tax, including registration, deadlines, and software choices.',
    pillar: 'mtd',
    icon: Calculator,
    link: '/mtd',
    readTime: '10 min read',
  },
  {
    title: "Renters' Rights Act: What Landlords Must Do Before May 2026",
    description: 'A comprehensive guide to all the changes coming on 1 May 2026, including the abolition of Section 21, new tenancy rules, and required actions.',
    pillar: 'renters_rights',
    icon: Scale,
    link: '/renters-rights',
    readTime: '15 min read',
  },
  {
    title: 'EPC Requirements: Your Roadmap to 2030',
    description: 'Understand the EPC C requirement, key dates, the £10,000 spending cap, and how to plan your property upgrades.',
    pillar: 'epc',
    icon: Zap,
    link: '/epc',
    readTime: '12 min read',
  },
  {
    title: 'Section 8 Eviction Grounds Explained',
    description: 'With Section 21 gone, understand all the mandatory and discretionary grounds for possession under Section 8.',
    pillar: 'renters_rights',
    icon: Gavel,
    link: '/renters-rights/section8',
    readTime: '8 min read',
  },
  {
    title: 'How to Increase Rent Under the New Rules',
    description: 'Learn about Section 13 notices, the once-per-year limit, 2-month notice periods, and tenant tribunal rights.',
    pillar: 'renters_rights',
    icon: PoundSterling,
    link: '/renters-rights/rent-increase',
    readTime: '6 min read',
  },
  {
    title: 'Gas Safety, EICR & Other Compliance Certificates',
    description: 'A guide to all the certificates landlords need, renewal frequencies, costs, and penalties for non-compliance.',
    pillar: 'general',
    icon: Shield,
    link: '/properties',
    readTime: '8 min read',
  },
  {
    title: 'Available Grants and Funding for Property Upgrades',
    description: 'Explore the Warm Homes grant, Boiler Upgrade Scheme, Great British Insulation Scheme, ECO4, and more.',
    pillar: 'epc',
    icon: Coins,
    link: '/epc/grants',
    readTime: '7 min read',
  },
  {
    title: 'Understanding Penalty Points and Fines',
    description: 'How the MTD penalty points system works, late payment penalties, and fines under the Renters\' Rights Act and EPC regulations.',
    pillar: 'mtd',
    icon: AlertTriangle,
    link: '/mtd',
    readTime: '5 min read',
  },
];

const pillarColors: Record<string, { bg: string; text: string; label: string }> = {
  mtd: { bg: 'bg-blue-50', text: 'text-blue-700', label: 'MTD' },
  renters_rights: { bg: 'bg-green-50', text: 'text-green-700', label: "Renters' Rights" },
  epc: { bg: 'bg-amber-50', text: 'text-amber-700', label: 'EPC' },
  general: { bg: 'bg-gray-50', text: 'text-gray-700', label: 'General' },
};

const faqs = [
  {
    q: 'Do I need to register for MTD if my rental income is below £50,000?',
    a: 'Not yet, but the threshold drops to £30,000 in April 2027 and £20,000 in April 2028. It\'s worth preparing early.',
  },
  {
    q: 'Can I still evict a tenant after Section 21 is abolished?',
    a: 'Yes, but only using Section 8 grounds. These include mandatory grounds (e.g., selling the property, 2+ months rent arrears) and discretionary grounds (e.g., anti-social behaviour, persistent late payment).',
  },
  {
    q: 'What if my property can\'t reach EPC C within the £10,000 cap?',
    a: 'You can register for a cost cap exemption on the PRS Exemptions Register, which lasts for 5 years. You must have completed all cost-effective improvements within the cap.',
  },
  {
    q: 'Do I need to allow pets in my rental property?',
    a: 'From 1 May 2026, you cannot unreasonably refuse a tenant\'s request to keep a pet. However, you can require the tenant to have pet insurance.',
  },
  {
    q: 'What is the penalty for not complying with MTD?',
    a: 'HMRC uses a points-based system. You get 1 point per late submission. At 4 points, you receive a £200 fine. Late payments incur 3% at day 15, another 3% at day 30, then 10% per annum.',
  },
  {
    q: 'Is LandlordShield MTD-compatible software?',
    a: 'No. LandlordShield helps you understand your compliance obligations and prepare your records. For actual MTD submissions to HMRC, you\'ll need HMRC-recognised software such as Landlord Studio, Xero, or QuickBooks.',
  },
];

export default function KnowledgePage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-[#1E3A5F]">Knowledge Base</h1>
        <p className="text-gray-500 mt-1">Guides and resources to help you navigate landlord compliance. Written in plain English.</p>
      </div>

      {/* Guides */}
      <section>
        <h2 className="text-lg font-semibold text-[#1E3A5F] mb-4 flex items-center gap-2">
          <BookOpen className="h-5 w-5" />
          Guides
        </h2>
        <div className="grid md:grid-cols-2 gap-4">
          {guides.map((guide) => {
            const color = pillarColors[guide.pillar] || pillarColors.general;
            return (
              <Card key={guide.title} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg ${color.bg} flex items-center justify-center`}>
                        <guide.icon className={`h-5 w-5 ${color.text}`} />
                      </div>
                      <div>
                        <CardTitle className="text-sm leading-tight">{guide.title}</CardTitle>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className={`text-xs ${color.text}`}>{color.label}</Badge>
                          <span className="text-xs text-gray-400">{guide.readTime}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-xs mb-3">{guide.description}</CardDescription>
                  <Link href={guide.link}>
                    <Button variant="ghost" size="sm" className="text-[#1E3A5F] p-0 h-auto">
                      Read guide <ArrowRight className="h-3 w-3 ml-1" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* FAQ */}
      <section>
        <h2 className="text-lg font-semibold text-[#1E3A5F] mb-4 flex items-center gap-2">
          <HelpCircle className="h-5 w-5" />
          Frequently Asked Questions
        </h2>
        <div className="space-y-3">
          {faqs.map((faq) => (
            <details key={faq.q} className="group bg-white rounded-lg border border-gray-200 overflow-hidden">
              <summary className="flex items-center justify-between cursor-pointer p-4 font-medium text-sm text-[#1E3A5F] list-none">
                {faq.q}
                <span className="text-gray-400 group-open:rotate-180 transition-transform text-xs">&#9660;</span>
              </summary>
              <div className="px-4 pb-4 text-gray-600 text-sm leading-relaxed">{faq.a}</div>
            </details>
          ))}
        </div>
      </section>

      {/* Regulatory update feed placeholder */}
      <section>
        <h2 className="text-lg font-semibold text-[#1E3A5F] mb-4">Regulatory Updates</h2>
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-start gap-3 pb-4 border-b">
                <div className="w-2 h-2 rounded-full bg-[#2563EB] mt-2 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium">HMRC publishes MTD for ITSA final guidance</p>
                  <p className="text-xs text-gray-500 mt-0.5">20 February 2026</p>
                  <p className="text-xs text-gray-600 mt-1">HMRC has published final guidance for landlords and sole traders on Making Tax Digital for Income Tax Self Assessment, including the quarterly submission schedule and penalty points system.</p>
                </div>
              </div>
              <div className="flex items-start gap-3 pb-4 border-b">
                <div className="w-2 h-2 rounded-full bg-[#16A34A] mt-2 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium">Renters&apos; Rights Act commencement date confirmed</p>
                  <p className="text-xs text-gray-500 mt-0.5">15 February 2026</p>
                  <p className="text-xs text-gray-600 mt-1">The government has confirmed 1 May 2026 as the commencement date for the Renters&apos; Rights Act 2025. The Information Sheet for existing tenants must be provided by 31 May 2026.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-[#F59E0B] mt-2 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium">EPC C consultation response published</p>
                  <p className="text-xs text-gray-500 mt-0.5">10 February 2026</p>
                  <p className="text-xs text-gray-600 mt-1">DESNZ has published the consultation response confirming the EPC C requirement by 1 October 2030, with spending from October 2025 counting toward the £10,000 cap.</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Disclaimer */}
      <div className="flex items-start gap-2 p-4 bg-amber-50 rounded-lg border border-amber-200">
        <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
        <p className="text-xs text-amber-800">
          This tool provides guidance based on publicly available information. It is not legal, tax, or financial advice.
          Always consult a qualified professional for advice specific to your situation.
        </p>
      </div>
    </div>
  );
}
