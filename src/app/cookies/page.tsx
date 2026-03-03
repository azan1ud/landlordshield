import Link from 'next/link';
import { Shield, ArrowLeft } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Cookie Policy — LandlordShield',
  description: 'How LandlordShield uses cookies and similar technologies.',
};

export default function CookiePolicyPage() {
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

        <h1 className="text-3xl md:text-4xl font-bold text-[#1E3A5F] mb-2">Cookie Policy</h1>
        <p className="text-sm text-gray-500 mb-8">Last updated: 3 March 2026</p>

        <div className="prose prose-gray max-w-none space-y-8">
          <section id="what-are-cookies">
            <h2 className="text-xl font-bold text-[#1E3A5F]">1. What Are Cookies?</h2>
            <p className="text-gray-600">Cookies are small text files placed on your device when you visit a website. They are widely used to make websites work efficiently and to provide information to site owners. This policy explains what cookies LandlordShield uses and why.</p>
          </section>

          <section id="essential-cookies">
            <h2 className="text-xl font-bold text-[#1E3A5F]">2. Essential Cookies</h2>
            <p className="text-gray-600">These cookies are strictly necessary for the Service to function. They cannot be switched off. They include:</p>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm text-gray-600 border border-gray-200 rounded-lg">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left font-semibold">Cookie</th>
                    <th className="px-4 py-2 text-left font-semibold">Purpose</th>
                    <th className="px-4 py-2 text-left font-semibold">Duration</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t border-gray-200">
                    <td className="px-4 py-2 font-mono text-xs">sb-*-auth-token</td>
                    <td className="px-4 py-2">Supabase authentication session. Keeps you logged in.</td>
                    <td className="px-4 py-2">Session / 1 year</td>
                  </tr>
                  <tr className="border-t border-gray-200">
                    <td className="px-4 py-2 font-mono text-xs">sb-*-auth-token-code-verifier</td>
                    <td className="px-4 py-2">PKCE code verifier for secure authentication flow.</td>
                    <td className="px-4 py-2">Session</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section id="analytics-cookies">
            <h2 className="text-xl font-bold text-[#1E3A5F]">3. Analytics Cookies</h2>
            <p className="text-gray-600">We may use Google Analytics 4 to understand how visitors interact with the Service. These cookies collect anonymous, aggregated data and do not identify you personally.</p>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm text-gray-600 border border-gray-200 rounded-lg">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left font-semibold">Cookie</th>
                    <th className="px-4 py-2 text-left font-semibold">Purpose</th>
                    <th className="px-4 py-2 text-left font-semibold">Duration</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t border-gray-200">
                    <td className="px-4 py-2 font-mono text-xs">_ga</td>
                    <td className="px-4 py-2">Google Analytics — distinguishes unique visitors.</td>
                    <td className="px-4 py-2">2 years</td>
                  </tr>
                  <tr className="border-t border-gray-200">
                    <td className="px-4 py-2 font-mono text-xs">_ga_*</td>
                    <td className="px-4 py-2">Google Analytics — maintains session state.</td>
                    <td className="px-4 py-2">2 years</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-gray-600">Analytics cookies are only loaded when the NEXT_PUBLIC_GA_ID environment variable is configured. If it is not set, no analytics cookies are placed.</p>
          </section>

          <section id="third-party-cookies">
            <h2 className="text-xl font-bold text-[#1E3A5F]">4. Third-Party Cookies</h2>
            <p className="text-gray-600">When you use the Stripe checkout or customer portal, Stripe may place its own cookies to process your payment securely and prevent fraud. These cookies are governed by <a href="https://stripe.com/privacy" className="text-[#1E3A5F] underline" target="_blank" rel="noopener noreferrer">Stripe&rsquo;s Privacy Policy</a>.</p>
          </section>

          <section id="managing-cookies">
            <h2 className="text-xl font-bold text-[#1E3A5F]">5. Managing Cookies</h2>
            <p className="text-gray-600">You can control and delete cookies through your browser settings. Note that disabling essential cookies may prevent the Service from functioning correctly. Here are links to cookie management instructions for common browsers:</p>
            <ul className="list-disc pl-6 text-gray-600 space-y-1">
              <li><a href="https://support.google.com/chrome/answer/95647" className="text-[#1E3A5F] underline" target="_blank" rel="noopener noreferrer">Google Chrome</a></li>
              <li><a href="https://support.mozilla.org/en-US/kb/cookies-information-websites-store-on-your-computer" className="text-[#1E3A5F] underline" target="_blank" rel="noopener noreferrer">Mozilla Firefox</a></li>
              <li><a href="https://support.apple.com/en-gb/guide/safari/sfri11471/mac" className="text-[#1E3A5F] underline" target="_blank" rel="noopener noreferrer">Safari</a></li>
              <li><a href="https://support.microsoft.com/en-gb/microsoft-edge/delete-cookies-in-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" className="text-[#1E3A5F] underline" target="_blank" rel="noopener noreferrer">Microsoft Edge</a></li>
            </ul>
          </section>

          <section id="changes">
            <h2 className="text-xl font-bold text-[#1E3A5F]">6. Changes to This Policy</h2>
            <p className="text-gray-600">We may update this Cookie Policy from time to time. Changes will be posted on this page with an updated &ldquo;Last updated&rdquo; date.</p>
          </section>

          <section id="contact">
            <h2 className="text-xl font-bold text-[#1E3A5F]">7. Contact Us</h2>
            <p className="text-gray-600">For questions about our use of cookies:</p>
            <ul className="list-disc pl-6 text-gray-600 space-y-1">
              <li>Email: <a href="mailto:contact@avantware.uk" className="text-[#1E3A5F] underline">contact@avantware.uk</a></li>
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
