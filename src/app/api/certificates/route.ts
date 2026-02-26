import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';

// GET /api/certificates - List certificates (optionally filter by property_id)
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

    // Get user's property IDs for authorization
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
      .from('certificates')
      .select('*')
      .in('property_id', propertyIds)
      .order('expiry_date', { ascending: true });

    if (propertyId) {
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
    console.error('GET /api/certificates error:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/certificates - Create a new certificate
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
    const { property_id, cert_type } = body;
    if (!property_id || !cert_type) {
      return NextResponse.json(
        { error: 'Missing required fields: property_id, cert_type' },
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

    // Determine status based on expiry date
    let status: string = body.status || 'valid';
    if (body.expiry_date && !body.status) {
      const expiryDate = new Date(body.expiry_date);
      const now = new Date();
      const thirtyDaysFromNow = new Date();
      thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

      if (expiryDate < now) {
        status = 'expired';
      } else if (expiryDate < thirtyDaysFromNow) {
        status = 'expiring_soon';
      } else {
        status = 'valid';
      }
    }

    const { data, error } = await supabase
      .from('certificates')
      .insert({
        property_id: body.property_id,
        cert_type: body.cert_type,
        issued_date: body.issued_date || null,
        expiry_date: body.expiry_date || null,
        provider: body.provider || null,
        reference_number: body.reference_number || null,
        document_url: body.document_url || null,
        status,
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
    console.error('POST /api/certificates error:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
