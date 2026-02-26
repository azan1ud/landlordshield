import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';

// GET /api/reminders - List reminders (upcoming, filter by pillar)
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
    const pillar = searchParams.get('pillar');
    const upcoming = searchParams.get('upcoming') !== 'false'; // default to upcoming only
    const includeDismissed = searchParams.get('include_dismissed') === 'true';

    let query = supabase
      .from('reminders')
      .select('*')
      .eq('user_id', user.id)
      .order('due_date', { ascending: true });

    if (pillar) {
      query = query.eq('pillar', pillar);
    }

    if (upcoming) {
      const today = new Date().toISOString().split('T')[0];
      query = query.gte('due_date', today);
    }

    if (!includeDismissed) {
      query = query.eq('is_dismissed', false);
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
    console.error('GET /api/reminders error:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/reminders - Create a new reminder
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
    const { title, due_date } = body;
    if (!title || !due_date) {
      return NextResponse.json(
        { error: 'Missing required fields: title, due_date' },
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
      .from('reminders')
      .insert({
        user_id: user.id,
        property_id: body.property_id || null,
        title: body.title,
        message: body.message || null,
        due_date: body.due_date,
        pillar: body.pillar || null,
        is_sent: false,
        is_dismissed: false,
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
    console.error('POST /api/reminders error:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
