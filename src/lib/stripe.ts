import Stripe from 'stripe';

let _stripe: Stripe | null = null;

export function getStripe(): Stripe {
  if (!_stripe) {
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
  }
  return _stripe;
}

/** @deprecated Use getStripe() instead */
export const stripe = null as unknown as Stripe;

export const PLANS = {
  free: {
    name: 'Free',
    price: 0,
    priceId: null,
    yearlyPriceId: null,
    propertyLimit: 1,
    features: [
      '1 property',
      'Basic compliance checklists (all three pillars)',
      'MTD threshold calculator',
      'EPC overview',
      'Knowledge base access',
    ],
  },
  pro: {
    name: 'Pro',
    monthlyPrice: 9.99,
    yearlyPrice: 89.99,
    priceId: process.env.STRIPE_PRO_MONTHLY_PRICE_ID,
    yearlyPriceId: process.env.STRIPE_PRO_YEARLY_PRICE_ID,
    propertyLimit: 10,
    features: [
      'Up to 10 properties',
      'Full compliance dashboard with scoring',
      'All checklists and trackers',
      'Document storage (upload certs, agreements)',
      'Certificate expiry reminders (email)',
      'Compliance calendar',
      'Rent increase calculator',
      'EPC upgrade planner',
      'PDF compliance reports',
      'MTD software comparison',
      'Priority email support',
    ],
  },
  portfolio: {
    name: 'Portfolio',
    monthlyPrice: 24.99,
    yearlyPrice: 219.99,
    priceId: process.env.STRIPE_PORTFOLIO_MONTHLY_PRICE_ID,
    yearlyPriceId: process.env.STRIPE_PORTFOLIO_YEARLY_PRICE_ID,
    propertyLimit: Infinity,
    features: [
      'Unlimited properties',
      'Everything in Pro',
      'Document generator (notice templates, rent increase notices)',
      'Multi-user access (e.g., landlord + accountant)',
      'Portfolio-wide analytics',
      'Annual compliance summary reports',
      'Priority support',
    ],
  },
} as const;
