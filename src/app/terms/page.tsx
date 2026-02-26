import Link from 'next/link';
import { Shield, ArrowLeft } from 'lucide-react';

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
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

        <h1 className="text-3xl md:text-4xl font-bold text-[#1E3A5F] mb-6">
          Terms of Service
        </h1>

        <div className="prose prose-gray max-w-none">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
            <p className="text-[#1E3A5F] font-medium mb-1">Coming Soon</p>
            <p className="text-gray-600 text-sm">
              Our full Terms of Service are being finalised and will be published here shortly.
              If you have any questions, please contact us at{' '}
              <a href="mailto:support@landlordshield.co.uk" className="text-[#1E3A5F] underline">
                support@landlordshield.co.uk
              </a>.
            </p>
          </div>

          <p className="text-gray-600 text-sm">
            By using LandlordShield, you agree to abide by our terms once published. The terms
            will cover acceptable use, subscription billing, intellectual property, limitation of
            liability, and the governing law of England and Wales.
          </p>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-8 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs text-gray-500">
            &copy; 2026 LandlordShield. All rights reserved. England &amp; Wales only.
          </p>
        </div>
      </footer>
    </div>
  );
}
