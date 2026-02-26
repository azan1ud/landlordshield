import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { calculateOverallCompliance } from '@/lib/compliance/score-calculator';
import { getUpcomingDeadlines } from '@/lib/compliance/deadline-engine';
import type { Property, Certificate, ChecklistItem } from '@/types';

// POST /api/reports/generate - Generate compliance report data (JSON for client-side PDF)
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

    const body = await request.json().catch(() => ({}));
    const propertyId = body.property_id; // optional: filter to a single property

    // Fetch user profile
    const { data: profile } = await supabase
      .from('users')
      .select('name, business_name, plan')
      .eq('id', user.id)
      .single();

    // Fetch properties
    let propertiesQuery = supabase
      .from('properties')
      .select('*')
      .eq('user_id', user.id)
      .order('address_line1', { ascending: true });

    if (propertyId) {
      propertiesQuery = propertiesQuery.eq('id', propertyId);
    }

    const { data: properties, error: propError } = await propertiesQuery;

    if (propError) {
      return NextResponse.json(
        { error: propError.message },
        { status: 500 }
      );
    }

    const typedProperties = (properties || []) as Property[];
    const propertyIds = typedProperties.map((p) => p.id);

    // Fetch all related data in parallel
    const [checklistResult, certificatesResult, tenanciesResult, transactionsResult] = await Promise.all([
      supabase
        .from('checklist_items')
        .select('*')
        .eq('user_id', user.id),
      propertyIds.length > 0
        ? supabase
            .from('certificates')
            .select('*')
            .in('property_id', propertyIds)
        : Promise.resolve({ data: [], error: null }),
      propertyIds.length > 0
        ? supabase
            .from('tenancies')
            .select('*')
            .in('property_id', propertyIds)
            .eq('status', 'active')
        : Promise.resolve({ data: [], error: null }),
      supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false }),
    ]);

    const checklistItems = (checklistResult.data || []) as ChecklistItem[];
    const certificates = (certificatesResult.data || []) as Certificate[];
    const tenancies = tenanciesResult.data || [];
    const transactions = transactionsResult.data || [];

    // Calculate overall compliance scores
    const complianceOverview = calculateOverallCompliance(checklistItems);

    // Get upcoming deadlines
    const upcomingDeadlines = getUpcomingDeadlines(typedProperties, certificates, 20);

    // Build per-property breakdown
    const propertyBreakdowns = typedProperties.map((property) => {
      const propertyCerts = certificates.filter((c) => c.property_id === property.id);
      const propertyTenancies = tenancies.filter((t) => t.property_id === property.id);
      const propertyChecklist = checklistItems.filter(
        (item) => item.property_id === property.id || item.property_id === null
      );

      // Certificate status summary
      const certSummary = {
        total: propertyCerts.length,
        valid: propertyCerts.filter((c) => c.status === 'valid').length,
        expiring_soon: propertyCerts.filter((c) => c.status === 'expiring_soon').length,
        expired: propertyCerts.filter((c) => c.status === 'expired').length,
        missing: propertyCerts.filter((c) => c.status === 'missing').length,
      };

      return {
        property: {
          id: property.id,
          address: `${property.address_line1}${property.address_line2 ? ', ' + property.address_line2 : ''}, ${property.city}, ${property.postcode}`,
          property_type: property.property_type,
          monthly_rent: property.monthly_rent,
        },
        active_tenancies: propertyTenancies.length,
        certificates: certSummary,
        expiring_certificates: propertyCerts
          .filter((c) => c.status === 'expiring_soon' || c.status === 'expired')
          .map((c) => ({
            type: c.cert_type,
            status: c.status,
            expiry_date: c.expiry_date,
          })),
        checklist_completion: {
          total: propertyChecklist.length,
          completed: propertyChecklist.filter((item) => item.is_completed).length,
        },
      };
    });

    // Outstanding actions (incomplete checklist items)
    const outstandingActions = checklistItems
      .filter((item) => !item.is_completed)
      .map((item) => {
        const property = typedProperties.find((p) => p.id === item.property_id);
        return {
          id: item.id,
          title: item.title,
          pillar: item.pillar,
          priority: item.priority,
          due_date: item.due_date,
          property_address: property
            ? `${property.address_line1}, ${property.postcode}`
            : 'General',
        };
      })
      .sort((a, b) => {
        const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
        return (priorityOrder[a.priority] || 3) - (priorityOrder[b.priority] || 3);
      });

    // Financial summary
    const totalIncome = transactions
      .filter((t) => t.type === 'income')
      .reduce((sum: number, t) => sum + (t.amount || 0), 0);
    const totalExpenses = transactions
      .filter((t) => t.type === 'expense')
      .reduce((sum: number, t) => sum + (t.amount || 0), 0);

    const reportData = {
      generated_at: new Date().toISOString(),
      landlord: {
        name: profile?.name || user.email,
        business_name: profile?.business_name || null,
        email: user.email,
        plan: profile?.plan || 'free',
      },
      compliance: {
        overall_score: complianceOverview.overallScore,
        mtd: {
          score: complianceOverview.mtd.score,
          status: complianceOverview.mtd.status,
          completed: complianceOverview.mtd.completedItems,
          total: complianceOverview.mtd.totalItems,
          outstanding: complianceOverview.mtd.outstandingActions,
          next_deadline: complianceOverview.mtd.nextDeadline?.toISOString() || null,
          days_until_deadline: complianceOverview.mtd.daysUntilDeadline,
        },
        renters_rights: {
          score: complianceOverview.rentersRights.score,
          status: complianceOverview.rentersRights.status,
          completed: complianceOverview.rentersRights.completedItems,
          total: complianceOverview.rentersRights.totalItems,
          outstanding: complianceOverview.rentersRights.outstandingActions,
          next_deadline: complianceOverview.rentersRights.nextDeadline?.toISOString() || null,
          days_until_deadline: complianceOverview.rentersRights.daysUntilDeadline,
        },
        epc: {
          score: complianceOverview.epc.score,
          status: complianceOverview.epc.status,
          completed: complianceOverview.epc.completedItems,
          total: complianceOverview.epc.totalItems,
          outstanding: complianceOverview.epc.outstandingActions,
          next_deadline: complianceOverview.epc.nextDeadline?.toISOString() || null,
          days_until_deadline: complianceOverview.epc.daysUntilDeadline,
        },
      },
      portfolio_summary: {
        total_properties: typedProperties.length,
        total_active_tenancies: tenancies.length,
        total_certificates: certificates.length,
        certificates_valid: certificates.filter((c) => c.status === 'valid').length,
        certificates_expiring: certificates.filter((c) => c.status === 'expiring_soon').length,
        certificates_expired: certificates.filter((c) => c.status === 'expired').length,
      },
      financial_summary: {
        total_income: totalIncome,
        total_expenses: totalExpenses,
        net_income: totalIncome - totalExpenses,
      },
      property_breakdowns: propertyBreakdowns,
      outstanding_actions: outstandingActions,
      upcoming_deadlines: upcomingDeadlines.map((d) => ({
        id: d.id,
        title: d.title,
        date: d.date.toISOString(),
        pillar: d.pillar,
        description: d.description || null,
        is_overdue: d.isOverdue || false,
        is_critical: d.isCritical || false,
      })),
    };

    return NextResponse.json({ data: reportData });
  } catch (err) {
    console.error('POST /api/reports/generate error:', err);
    return NextResponse.json(
      { error: 'Failed to generate report' },
      { status: 500 }
    );
  }
}
