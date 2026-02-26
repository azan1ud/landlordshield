import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';

// GET /api/tenancies - List tenancies (optionally filter by property_id)
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
    const propertyId = searchParams.get('property_id');

    // First get the user's property IDs to ensure they can only see their own tenancies
    const { data: properties, error: propError } = await supabase
      .from('properties')
      .select('id')
      .eq('user_id', user.id);

    if (propError) {
      return NextResponse.json(
        { error: propError.message },
        { status: 500 }
      );
    }

    const propertyIds = properties.map((p) => p.id);

    if (propertyIds.length === 0) {
      return NextResponse.json({ data: [] });
    }

    let query = supabase
      .from('tenancies')
      .select('*')
      .in('property_id', propertyIds)
      .order('created_at', { ascending: false });

    if (propertyId) {
      // Verify the property belongs to the user
      if (!propertyIds.includes(propertyId)) {
        return NextResponse.json(
          { error: 'Property not found or not authorized' },
          { status: 403 }
        );
      }
      query = query.eq('property_id', propertyId);
    }

    const { data, error } = await query;

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ data });
  } catch (err) {
    console.error('GET /api/tenancies error:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/tenancies - Create a new tenancy
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
    const { property_id, tenant_name } = body;
    if (!property_id || !tenant_name) {
      return NextResponse.json(
        { error: 'Missing required fields: property_id, tenant_name' },
        { status: 400 }
      );
    }

    // Verify the property belongs to the user
    const { data: property, error: propError } = await supabase
      .from('properties')
      .select('id')
      .eq('id', property_id)
      .eq('user_id', user.id)
      .single();

    if (propError || !property) {
      return NextResponse.json(
        { error: 'Property not found or not authorized' },
        { status: 403 }
      );
    }

    const { data, error } = await supabase
      .from('tenancies')
      .insert({
        property_id: body.property_id,
        tenant_name: body.tenant_name,
        tenant_email: body.tenant_email || null,
        tenant_phone: body.tenant_phone || null,
        tenancy_type: body.tenancy_type || null,
        start_date: body.start_date || null,
        end_date: body.end_date || null,
        current_rent: body.current_rent || null,
        deposit_amount: body.deposit_amount || null,
        deposit_scheme: body.deposit_scheme || null,
        right_to_rent_checked: body.right_to_rent_checked || false,
        right_to_rent_date: body.right_to_rent_date || null,
        pets_allowed: body.pets_allowed || false,
        status: body.status || 'active',
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
    console.error('POST /api/tenancies error:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
