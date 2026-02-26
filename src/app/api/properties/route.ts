import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';

// GET /api/properties - List user's properties with optional joined data
export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = request.nextUrl;
    const includeTenancies = searchParams.get('include_tenancies') === 'true';
    const includeEpc = searchParams.get('include_epc') === 'true';
    const includeCertificates = searchParams.get('include_certificates') === 'true';

    let query = supabase
      .from('properties')
      .select(
        `
        *
        ${includeTenancies ? ', tenancies(*)' : ''}
        ${includeEpc ? ', epc_records(*)' : ''}
        ${includeCertificates ? ', certificates(*)' : ''}
        `
      )
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    const { data, error } = await query;

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ data });
  } catch (err) {
    console.error('GET /api/properties error:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/properties - Create a new property
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

    // Validate required fields
    const { address_line1, city, postcode } = body;
    if (!address_line1 || !city || !postcode) {
      return NextResponse.json(
        { error: 'Missing required fields: address_line1, city, postcode' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('properties')
      .insert({
        user_id: user.id,
        address_line1: body.address_line1,
        address_line2: body.address_line2 || null,
        city: body.city,
        county: body.county || null,
        postcode: body.postcode,
        property_type: body.property_type || null,
        bedrooms: body.bedrooms || null,
        monthly_rent: body.monthly_rent || null,
        ownership_type: body.ownership_type || null,
        joint_ownership_percentage: body.joint_ownership_percentage || null,
        is_furnished: body.is_furnished || null,
        has_mortgage: body.has_mortgage || false,
        mortgage_monthly: body.mortgage_monthly || null,
        managing_agent: body.managing_agent || null,
        hmo_licence_required: body.hmo_licence_required || false,
        notes: body.notes || null,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ data }, { status: 201 });
  } catch (err) {
    console.error('POST /api/properties error:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
