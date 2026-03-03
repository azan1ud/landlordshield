import Link from 'next/link';
import { Shield, ArrowLeft } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy — LandlordShield',
  description: 'How LandlordShield collects, uses, and protects your personal data under UK GDPR.',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-white">
      <nav className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center gap-2">
              <Shield className="h-7 w-7 text-[#1E3A5F]" />
              <span className="text-lg font-bold text-[#1E3A5F]">LandlordShield</span>
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Link href="/" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-[#1E3A5F] mb-8">
          <ArrowLeft className="h-4 w-4" />
          Back to home
        </Link>

        <h1 className="text-3xl md:text-4xl font-bold text-[#1E3A5F] mb-2">Privacy Policy</h1>
        <p className="text-sm text-gray-500 mb-8">Last updated: 3 March 2026</p>

        <div className="prose prose-gray max-w-none space-y-8">
          <section id="introduction">
            <h2 className="text-xl font-bold text-[#1E3A5F]">1. Introduction</h2>
            <p className="text-gray-600">LandlordShield is operated by Avantware (&ldquo;we&rdquo;, &ldquo;us&rdquo;, &ldquo;our&rdquo;). We are the data controller for the personal data we collect through our web application at landlordshield.vercel.app (the &ldquo;Service&rdquo;). We are committed to protecting your personal data and being transparent about how we process it in accordance with the UK General Data Protection Regulation (UK GDPR) and the Data Protection Act 2018.</p>
            <p className="text-gray-600">Contact email: <a href="mailto:contact@avantware.uk" className="text-[#1E3A5F] underline">contact@avantware.uk</a></p>
          </section>

          <section id="data-collected">
            <h2 className="text-xl font-bold text-[#1E3A5F]">2. Personal Data We Collect</h2>
            <p className="text-gray-600">We collect the following categories of personal data:</p>
            <ul className="list-disc pl-6 text-gray-600 space-y-1">
              <li><strong>Account information:</strong> Email address and password (hashed) when you register.</li>
              <li><strong>Property data:</strong> Property addresses, types, tenancy details, and tenant names you enter.</li>
              <li><strong>Certificate and compliance data:</strong> Gas safety, EICR, EPC, legionella, PAT, and smoke/CO alarm certificate dates, statuses, and related information.</li>
              <li><strong>Financial data:</strong> Rental income and expense figures entered for MTD tracking. We do not store payment card details — these are handled directly by Stripe.</li>
              <li><strong>Documents:</strong> Certificate documents (PDF, PNG, JPG) you upload to the Service.</li>
              <li><strong>Subscription and billing data:</strong> Your subscription plan, billing history, and Stripe customer ID.</li>
              <li><strong>Usage data:</strong> Pages visited, features used, and timestamps to improve the Service.</li>
              <li><strong>Communication data:</strong> Email address for sending reminders and notifications.</li>
            </ul>
          </section>

          <section id="legal-basis">
            <h2 className="text-xl font-bold text-[#1E3A5F]">3. Legal Bases for Processing</h2>
            <p className="text-gray-600">We process your personal data on the following legal bases:</p>
            <ul className="list-disc pl-6 text-gray-600 space-y-1">
              <li><strong>Performance of a contract (Article 6(1)(b)):</strong> To provide the Service, manage your account, process payments, and deliver features you have subscribed to.</li>
              <li><strong>Legitimate interests (Article 6(1)(f)):</strong> To improve the Service, prevent fraud, and ensure security. Our legitimate interests do not override your fundamental rights.</li>
              <li><strong>Consent (Article 6(1)(a)):</strong> For optional marketing communications and newsletter subscriptions. You may withdraw consent at any time.</li>
              <li><strong>Legal obligation (Article 6(1)(c)):</strong> To comply with applicable laws such as tax and anti-money laundering regulations.</li>
            </ul>
          </section>

          <section id="how-we-use">
            <h2 className="text-xl font-bold text-[#1E3A5F]">4. How We Use Your Data</h2>
            <ul className="list-disc pl-6 text-gray-600 space-y-1">
              <li>To create and manage your account.</li>
              <li>To provide compliance tracking, certificate reminders, and dashboard features.</li>
              <li>To process payments and manage your subscription.</li>
              <li>To send email reminders about expiring certificates and upcoming deadlines.</li>
              <li>To send optional newsletter and compliance update emails (with your consent).</li>
              <li>To store and display documents you upload.</li>
              <li>To generate compliance reports you request.</li>
              <li>To improve the Service, fix bugs, and develop new features.</li>
            </ul>
          </section>

          <section id="third-parties">
            <h2 className="text-xl font-bold text-[#1E3A5F]">5. Third-Party Data Processors</h2>
            <p className="text-gray-600">We share your personal data with the following trusted third-party processors, each under appropriate data processing agreements:</p>
            <ul className="list-disc pl-6 text-gray-600 space-y-1">
              <li><strong>Supabase (Supabase Inc.):</strong> Database hosting, user authentication, and file storage. Data is stored on servers in the EU/US.</li>
              <li><strong>Stripe (Stripe, Inc.):</strong> Payment processing. Stripe processes your payment card details directly — we never see or store your full card number. Stripe&rsquo;s privacy policy applies to payment data.</li>
              <li><strong>Resend (Resend, Inc.):</strong> Transactional email delivery for certificate reminders and notifications.</li>
              <li><strong>Vercel (Vercel, Inc.):</strong> Web application hosting and serverless function execution.</li>
            </ul>
            <p className="text-gray-600">We do not sell your personal data to any third party.</p>
          </section>

          <section id="international-transfers">
            <h2 className="text-xl font-bold text-[#1E3A5F]">6. International Data Transfers</h2>
            <p className="text-gray-600">Some of our third-party processors (Supabase, Stripe, Resend, Vercel) may process data outside the UK and EEA, primarily in the United States. Where this occurs, we ensure appropriate safeguards are in place, including Standard Contractual Clauses (SCCs) approved by the UK Information Commissioner, or reliance on the processor&rsquo;s participation in recognised data protection frameworks.</p>
          </section>

          <section id="data-retention">
            <h2 className="text-xl font-bold text-[#1E3A5F]">7. Data Retention</h2>
            <ul className="list-disc pl-6 text-gray-600 space-y-1">
              <li><strong>Account data:</strong> Retained for as long as your account is active. Deleted within 30 days of account deletion.</li>
              <li><strong>Property and compliance data:</strong> Retained for as long as your account is active.</li>
              <li><strong>Uploaded documents:</strong> Retained until you delete them or your account is deleted.</li>
              <li><strong>Billing records:</strong> Retained for 7 years to comply with UK tax and accounting obligations.</li>
              <li><strong>Email logs:</strong> Retained for 12 months for delivery troubleshooting.</li>
            </ul>
          </section>

          <section id="your-rights">
            <h2 className="text-xl font-bold text-[#1E3A5F]">8. Your Rights Under UK GDPR</h2>
            <p className="text-gray-600">You have the following rights in relation to your personal data:</p>
            <ul className="list-disc pl-6 text-gray-600 space-y-1">
              <li><strong>Right of access:</strong> Request a copy of the personal data we hold about you.</li>
              <li><strong>Right to rectification:</strong> Request correction of inaccurate personal data.</li>
              <li><strong>Right to erasure:</strong> Request deletion of your personal data (subject to legal retention requirements).</li>
              <li><strong>Right to restrict processing:</strong> Request that we limit how we use your data.</li>
              <li><strong>Right to data portability:</strong> Request your data in a structured, commonly used format.</li>
              <li><strong>Right to object:</strong> Object to processing based on legitimate interests or for direct marketing.</li>
              <li><strong>Right to withdraw consent:</strong> Where processing is based on consent, you may withdraw it at any time.</li>
            </ul>
            <p className="text-gray-600">To exercise any of these rights, email us at <a href="mailto:contact@avantware.uk" className="text-[#1E3A5F] underline">contact@avantware.uk</a>. We will respond within one month.</p>
          </section>

          <section id="data-security">
            <h2 className="text-xl font-bold text-[#1E3A5F]">9. Data Security</h2>
            <p className="text-gray-600">We implement appropriate technical and organisational measures to protect your personal data, including:</p>
            <ul className="list-disc pl-6 text-gray-600 space-y-1">
              <li>Encryption of data in transit (TLS/HTTPS) and at rest.</li>
              <li>Row Level Security (RLS) policies ensuring users can only access their own data.</li>
              <li>Hashed passwords — we never store plaintext passwords.</li>
              <li>Secure API authentication for all backend services.</li>
              <li>Regular security updates and dependency audits.</li>
            </ul>
          </section>

          <section id="cookies">
            <h2 className="text-xl font-bold text-[#1E3A5F]">10. Cookies</h2>
            <p className="text-gray-600">We use essential cookies to maintain your session and ensure the Service functions correctly. For full details, see our <Link href="/cookies" className="text-[#1E3A5F] underline">Cookie Policy</Link>.</p>
          </section>

          <section id="children">
            <h2 className="text-xl font-bold text-[#1E3A5F]">11. Children&rsquo;s Data</h2>
            <p className="text-gray-600">The Service is not intended for individuals under the age of 18. We do not knowingly collect personal data from children. If you believe a child has provided us with personal data, please contact us and we will delete it.</p>
          </section>

          <section id="changes">
            <h2 className="text-xl font-bold text-[#1E3A5F]">12. Changes to This Policy</h2>
            <p className="text-gray-600">We may update this Privacy Policy from time to time. We will notify you of material changes by email or through a notice on the Service. Your continued use of the Service after any changes constitutes acceptance of the updated policy.</p>
          </section>

          <section id="complaints">
            <h2 className="text-xl font-bold text-[#1E3A5F]">13. Complaints</h2>
            <p className="text-gray-600">If you are unhappy with how we handle your personal data, you have the right to lodge a complaint with the UK Information Commissioner&rsquo;s Office (ICO):</p>
            <ul className="list-disc pl-6 text-gray-600 space-y-1">
              <li>Website: <a href="https://ico.org.uk" className="text-[#1E3A5F] underline" target="_blank" rel="noopener noreferrer">ico.org.uk</a></li>
              <li>Telephone: 0303 123 1113</li>
            </ul>
          </section>

          <section id="contact">
            <h2 className="text-xl font-bold text-[#1E3A5F]">14. Contact Us</h2>
            <p className="text-gray-600">For any questions about this Privacy Policy or your personal data:</p>
            <ul className="list-disc pl-6 text-gray-600 space-y-1">
              <li>Email: <a href="mailto:contact@avantware.uk" className="text-[#1E3A5F] underline">contact@avantware.uk</a></li>
              <li>Support: <a href="mailto:support@avantware.uk" className="text-[#1E3A5F] underline">support@avantware.uk</a></li>
            </ul>
          </section>
        </div>
      </div>

      <footer className="bg-gray-900 text-gray-400 py-8 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs text-gray-500">&copy; 2026 LandlordShield by Avantware. All rights reserved. England &amp; Wales only.</p>
        </div>
      </footer>
    </div>
  );
}
