'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, CheckCircle, Mail } from 'lucide-react';

export function NewsletterSignup() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || status === 'loading') return;
    setStatus('loading');
    try {
      const res = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to subscribe');
      setStatus('success');
      setMessage('You\'re subscribed! Check your inbox for compliance updates.');
      setEmail('');
    } catch (err) {
      setStatus('error');
      setMessage(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    }
  };

  if (status === 'success') {
    return (
      <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
        <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
        <p className="text-green-800 font-medium">{message}</p>
      </div>
    );
  }

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 md:p-8">
      <div className="flex items-center gap-2 mb-2">
        <Mail className="h-5 w-5 text-[#1E3A5F]" />
        <h3 className="text-lg font-bold text-[#1E3A5F]">Get UK Landlord Compliance Updates</h3>
      </div>
      <p className="text-sm text-gray-600 mb-4">
        Weekly regulatory updates, deadline reminders, and compliance tips. Free.
      </p>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
        <input
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => { setEmail(e.target.value); setStatus('idle'); }}
          required
          className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1E3A5F] focus:border-transparent"
        />
        <Button
          type="submit"
          disabled={status === 'loading'}
          className="bg-[#1E3A5F] hover:bg-[#2D4F7A] px-6"
        >
          {status === 'loading' ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Subscribe'}
        </Button>
      </form>
      {status === 'error' && <p className="text-sm text-red-600 mt-2">{message}</p>}
      <p className="text-xs text-gray-500 mt-3">No spam. Unsubscribe at any time.</p>
    </div>
  );
}
