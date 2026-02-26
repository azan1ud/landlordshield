import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { getStripe, PLANS } from '@/lib/stripe';

// POST /api/stripe/checkout - Create Stripe Checkout session for subscription
export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { plan, billing_period } = body;

    // Validate plan
    if (!plan || (plan !== 'pro' && plan !== 'portfolio')) {
      return NextResponse.json(
        { error: 'Invalid plan: must be "pro" or "portfolio"' },
        { status: 400 }
      );
    }

    // Validate billing period
    if (!billing_period || (billing_period !== 'monthly' && billing_period !== 'yearly')) {
      return NextResponse.json(
        { error: 'Invalid billing_period: must be "monthly" or "yearly"' },
        { status: 400 }
      );
    }

    const selectedPlan = PLANS[plan as keyof typeof PLANS];
    const priceId = billing_period === 'yearly'
      ? selectedPlan.yearlyPriceId
      : selectedPlan.priceId;

    if (!priceId) {
      return NextResponse.json(
        { error: 'Price ID not configured for this plan' },
        { status: 500 }
      );
    }

    // Check if user already has a Stripe customer ID
    const { data: profile } = await supabase
      .from('users')
      .select('stripe_customer_id')
      .eq('id', user.id)
      .single();

    let customerId = profile?.stripe_customer_id;

    // Create a new Stripe customer if one doesn't exist
    if (!customerId) {
      const customer = await getStripe().customers.create({
        email: user.email,
        metadata: {
          supabase_user_id: user.id,
        },
      });
      customerId = customer.id;

      // Save the Stripe customer ID
      await supabase
        .from('users')
        .update({ stripe_customer_id: customerId })
        .eq('id', user.id);
    }

    const origin = request.nextUrl.origin;

    // Build checkout session parameters
    const sessionParams: Record<string, unknown> = {
      customer: customerId,
      mode: 'subscription',
      payment_method_types: ['card'],
      currency: 'gbp',
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${origin}/dashboard?checkout=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/pricing?checkout=cancelled`,
      metadata: {
        supabase_user_id: user.id,
        plan,
        billing_period,
      },
    };

    // Include 14-day trial for pro plan
    if (plan === 'pro') {
      (sessionParams as Record<string, unknown>).subscription_data = {
        trial_period_days: 14,
        metadata: {
          supabase_user_id: user.id,
          plan,
        },
      };
    } else {
      (sessionParams as Record<string, unknown>).subscription_data = {
        metadata: {
          supabase_user_id: user.id,
          plan,
        },
      };
    }

    const session = await getStripe().checkout.sessions.create(
      sessionParams as Parameters<ReturnType<typeof getStripe>['checkout']['sessions']['create']>[0]
    );

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error('POST /api/stripe/checkout error:', err);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
