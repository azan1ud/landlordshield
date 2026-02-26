import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';

// GET /api/transactions - List transactions (filter by property_id, type, date range)
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
    const type = searchParams.get('type'); // 'income' | 'expense'
    const startDate = searchParams.get('start_date');
    const endDate = searchParams.get('end_date');

    let query = supabase
      .from('transactions')
      .select('*')
      .eq('user_id', user.id)
      .order('date', { ascending: false });

    if (propertyId) {
      // Verify ownership
      const { data: property } = await supabase
        .from('properties')
        .select('id')
        .eq('id', propertyId)
        .eq('user_id', user.id)
        .single();

      if (!property) {
        return NextResponse.json(
          { error: 'Property not found or not authorized' },
          { status: 403 }
        );
      }
      query = query.eq('property_id', propertyId);
    }

    if (type && (type === 'income' || type === 'expense')) {
      query = query.eq('type', type);
    }

    if (startDate) {
      query = query.gte('date', startDate);
    }

    if (endDate) {
      query = query.lte('date', endDate);
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
    console.error('GET /api/transactions error:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/transactions - Create a new transaction
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
    const { type, category, amount, date } = body;
    if (!type || !category || amount === undefined || !date) {
      return NextResponse.json(
        { error: 'Missing required fields: type, category, amount, date' },
        { status: 400 }
      );
    }

    if (type !== 'income' && type !== 'expense') {
      return NextResponse.json(
        { error: 'Invalid type: must be "income" or "expense"' },
        { status: 400 }
      );
    }

    if (typeof amount !== 'number' || amount < 0) {
      return NextResponse.json(
        { error: 'Invalid amount: must be a non-negative number' },
        { status: 400 }
      );
    }

    // If property_id is provided, verify ownership
    if (body.property_id) {
      const { data: property } = await supabase
        .from('properties')
        .select('id')
        .eq('id', body.property_id)
        .eq('user_id', user.id)
        .single();

      if (!property) {
        return NextResponse.json(
          { error: 'Property not found or not authorized' },
          { status: 403 }
        );
      }
    }

    const { data, error } = await supabase
      .from('transactions')
      .insert({
        user_id: user.id,
        property_id: body.property_id || null,
        type: body.type,
        category: body.category,
        amount: body.amount,
        description: body.description || null,
        date: body.date,
        receipt_url: body.receipt_url || null,
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
    console.error('POST /api/transactions error:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
