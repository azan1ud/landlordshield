import Link from 'next/link';
import { Shield, ArrowLeft } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service — LandlordShield',
  description: 'Terms and conditions for using the LandlordShield UK landlord compliance dashboard.',
};

export default function TermsOfServicePage() {
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

        <h1 className="text-3xl md:text-4xl font-bold text-[#1E3A5F] mb-2">Terms of Service</h1>
        <p className="text-sm text-gray-500 mb-8">Last updated: 3 March 2026</p>

        <div className="prose prose-gray max-w-none space-y-8">
          <section id="acceptance">
            <h2 className="text-xl font-bold text-[#1E3A5F]">1. Acceptance of Terms</h2>
            <p className="text-gray-600">By accessing or using LandlordShield (the &ldquo;Service&rdquo;), operated by Avantware (&ldquo;we&rdquo;, &ldquo;us&rdquo;, &ldquo;our&rdquo;), you agree to be bound by these Terms of Service. If you do not agree, you must not use the Service.</p>
          </section>

          <section id="service-description">
            <h2 className="text-xl font-bold text-[#1E3A5F]">2. Service Description</h2>
            <p className="text-gray-600">LandlordShield is a web-based compliance tracking dashboard for UK private landlords. The Service helps users track safety certificates, monitor regulatory deadlines (Making Tax Digital, Renters&rsquo; Rights Act, EPC requirements), manage property portfolios, store documents, and receive automated reminders. The Service covers England and Wales only.</p>
          </section>

          <section id="eligibility">
            <h2 className="text-xl font-bold text-[#1E3A5F]">3. Eligibility</h2>
            <p className="text-gray-600">You must be at least 18 years old and based in the United Kingdom to use the Service. By registering, you represent that you meet these requirements.</p>
          </section>

          <section id="accounts">
            <h2 className="text-xl font-bold text-[#1E3A5F]">4. Account Registration</h2>
            <p className="text-gray-600">You must provide a valid email address and create a password to register. You are responsible for maintaining the confidentiality of your account credentials and for all activity that occurs under your account. You must notify us immediately if you suspect unauthorised access.</p>
          </section>

          <section id="plans-billing">
            <h2 className="text-xl font-bold text-[#1E3A5F]">5. Plans and Billing</h2>
            <p className="text-gray-600">The Service offers the following plans:</p>
            <ul className="list-disc pl-6 text-gray-600 space-y-1">
              <li><strong>Free:</strong> Limited to 1 property. No payment required.</li>
              <li><strong>Pro (£9.99/month or £89.99/year):</strong> Up to 10 properties with full features. Includes a 14-day free trial.</li>
              <li><strong>Portfolio (£24.99/month or £219.99/year):</strong> Unlimited properties with advanced features.</li>
            </ul>
            <p className="text-gray-600">All payments are processed securely by Stripe. Prices are in GBP and inclusive of VAT where applicable. Subscriptions renew automatically at the end of each billing period unless cancelled.</p>
          </section>

          <section id="trial">
            <h2 className="text-xl font-bold text-[#1E3A5F]">6. Free Trial</h2>
            <p className="text-gray-600">The Pro plan includes a 14-day free trial. You will not be charged during the trial period. If you do not cancel before the trial ends, your subscription will automatically begin and you will be charged the applicable subscription fee.</p>
          </section>

          <section id="refunds">
            <h2 className="text-xl font-bold text-[#1E3A5F]">7. Refund Policy</h2>
            <p className="text-gray-600">We offer a full refund within 30 days of your first paid subscription charge if you are not satisfied with the Service. Refund requests should be sent to <a href="mailto:support@avantware.uk" className="text-[#1E3A5F] underline">support@avantware.uk</a>. Refunds after the 30-day period are at our discretion.</p>
          </section>

          <section id="cancellation">
            <h2 className="text-xl font-bold text-[#1E3A5F]">8. Cancellation</h2>
            <p className="text-gray-600">You may cancel your subscription at any time through the Stripe Customer Portal (accessible via Settings). Cancellation takes effect at the end of your current billing period. You will retain access to paid features until that date. No partial refunds are issued for unused time beyond the 30-day refund window.</p>
          </section>

          <section id="acceptable-use">
            <h2 className="text-xl font-bold text-[#1E3A5F]">9. Acceptable Use</h2>
            <p className="text-gray-600">You agree not to:</p>
            <ul className="list-disc pl-6 text-gray-600 space-y-1">
              <li>Use the Service for any unlawful purpose.</li>
              <li>Attempt to gain unauthorised access to any part of the Service or its infrastructure.</li>
              <li>Upload malicious files, viruses, or harmful code.</li>
              <li>Use automated scripts to access the Service without our written permission.</li>
              <li>Resell, sublicense, or redistribute the Service without our permission.</li>
              <li>Use the Service to store or process data that you do not have the right to use.</li>
            </ul>
          </section>

          <section id="intellectual-property">
            <h2 className="text-xl font-bold text-[#1E3A5F]">10. Intellectual Property</h2>
            <p className="text-gray-600">All content, design, code, and trademarks of the Service are owned by Avantware. You retain ownership of the data you enter into the Service. By using the Service, you grant us a limited licence to process your data solely to provide the Service to you.</p>
          </section>

          <section id="data-privacy">
            <h2 className="text-xl font-bold text-[#1E3A5F]">11. Data and Privacy</h2>
            <p className="text-gray-600">Your use of the Service is also governed by our <Link href="/privacy" className="text-[#1E3A5F] underline">Privacy Policy</Link>, which explains how we collect, use, and protect your personal data.</p>
          </section>

          <section id="disclaimer">
            <h2 className="text-xl font-bold text-[#1E3A5F]">12. Disclaimer</h2>
            <p className="text-gray-600 font-medium">The Service provides guidance and tracking tools based on publicly available regulatory information. It is not legal, tax, or financial advice. You should always consult a qualified solicitor, accountant, or other professional for advice specific to your circumstances.</p>
            <p className="text-gray-600">While we make reasonable efforts to keep regulatory information up to date, we do not guarantee the accuracy, completeness, or timeliness of any information provided through the Service.</p>
          </section>

          <section id="limitation-of-liability">
            <h2 className="text-xl font-bold text-[#1E3A5F]">13. Limitation of Liability</h2>
            <p className="text-gray-600">To the maximum extent permitted by law:</p>
            <ul className="list-disc pl-6 text-gray-600 space-y-1">
              <li>The Service is provided &ldquo;as is&rdquo; and &ldquo;as available&rdquo; without warranties of any kind, whether express or implied.</li>
              <li>We shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of the Service.</li>
              <li>Our total liability to you for any claim arising from these Terms or the Service shall not exceed the total amount you have paid us in the 12 months preceding the claim.</li>
              <li>We are not liable for any fines, penalties, or losses you incur due to non-compliance with landlord regulations, whether or not you used the Service.</li>
            </ul>
            <p className="text-gray-600">Nothing in these Terms excludes our liability for death or personal injury caused by our negligence, fraud, or any other liability that cannot be excluded by law.</p>
          </section>

          <section id="availability">
            <h2 className="text-xl font-bold text-[#1E3A5F]">14. Service Availability</h2>
            <p className="text-gray-600">We aim to keep the Service available at all times but do not guarantee uninterrupted access. We may occasionally need to suspend the Service for maintenance, updates, or reasons beyond our control. We will provide reasonable notice of planned downtime where possible.</p>
          </section>

          <section id="termination">
            <h2 className="text-xl font-bold text-[#1E3A5F]">15. Termination</h2>
            <p className="text-gray-600">We may suspend or terminate your access to the Service if you breach these Terms. You may delete your account at any time by contacting us at <a href="mailto:support@avantware.uk" className="text-[#1E3A5F] underline">support@avantware.uk</a>. Upon account deletion, your personal data will be removed in accordance with our Privacy Policy.</p>
          </section>

          <section id="governing-law">
            <h2 className="text-xl font-bold text-[#1E3A5F]">16. Governing Law</h2>
            <p className="text-gray-600">These Terms are governed by the laws of England and Wales. Any disputes arising under these Terms shall be subject to the exclusive jurisdiction of the courts of England and Wales.</p>
          </section>

          <section id="changes">
            <h2 className="text-xl font-bold text-[#1E3A5F]">17. Changes to These Terms</h2>
            <p className="text-gray-600">We may update these Terms from time to time. Material changes will be communicated via email or a notice within the Service. Your continued use of the Service after any changes constitutes acceptance of the updated Terms.</p>
          </section>

          <section id="contact">
            <h2 className="text-xl font-bold text-[#1E3A5F]">18. Contact Us</h2>
            <p className="text-gray-600">For questions about these Terms:</p>
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
