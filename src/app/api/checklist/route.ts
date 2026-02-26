import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';

// GET /api/checklist - List checklist items (filter by pillar, property_id)
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
    const propertyId = searchParams.get('property_id');

    let query = supabase
      .from('checklist_items')
      .select('*')
      .eq('user_id', user.id)
      .order('priority', { ascending: true })
      .order('created_at', { ascending: false });

    if (pillar && ['mtd', 'renters_rights', 'epc'].includes(pillar)) {
      query = query.eq('pillar', pillar);
    }

    if (propertyId) {
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
    console.error('GET /api/checklist error:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/checklist - Create a checklist item
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
    const { pillar, item_key, title } = body;
    if (!pillar || !item_key || !title) {
      return NextResponse.json(
        { error: 'Missing required fields: pillar, item_key, title' },
        { status: 400 }
      );
    }

    if (!['mtd', 'renters_rights', 'epc'].includes(pillar)) {
      return NextResponse.json(
        { error: 'Invalid pillar: must be "mtd", "renters_rights", or "epc"' },
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
      .from('checklist_items')
      .insert({
        user_id: user.id,
        property_id: body.property_id || null,
        pillar: body.pillar,
        item_key: body.item_key,
        title: body.title,
        description: body.description || null,
        is_completed: body.is_completed || false,
        completed_at: body.is_completed ? new Date().toISOString() : null,
        due_date: body.due_date || null,
        priority: body.priority || 'medium',
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
    console.error('POST /api/checklist error:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PATCH /api/checklist - Update a checklist item (toggle completion)
export async function PATCH(request: NextRequest) {
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

    const { id, is_completed } = body;
    if (!id || typeof is_completed !== 'boolean') {
      return NextResponse.json(
        { error: 'Missing required fields: id, is_completed (boolean)' },
        { status: 400 }
      );
    }

    // Verify the checklist item belongs to the user
    const { data: existingItem, error: fetchError } = await supabase
      .from('checklist_items')
      .select('id')
      .eq('id', id)
      .eq('user_id', user.id)
      .single();

    if (fetchError || !existingItem) {
      return NextResponse.json(
        { error: 'Checklist item not found or not authorized' },
        { status: 404 }
      );
    }

    const updateData: Record<string, unknown> = {
      is_completed,
      completed_at: is_completed ? new Date().toISOString() : null,
    };

    // Allow updating other optional fields if provided
    if (body.title !== undefined) updateData.title = body.title;
    if (body.description !== undefined) updateData.description = body.description;
    if (body.due_date !== undefined) updateData.due_date = body.due_date;
    if (body.priority !== undefined) updateData.priority = body.priority;

    const { data, error } = await supabase
      .from('checklist_items')
      .update(updateData)
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ data });
  } catch (err) {
    console.error('PATCH /api/checklist error:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
