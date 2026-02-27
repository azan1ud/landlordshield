import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { sendDeadlineReminder } from '@/lib/email';

// Vercel Cron runs this daily at 8am UTC
// GET /api/cron/reminders
export async function GET(request: NextRequest) {
  // Verify the request is from Vercel Cron
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabase = createAdminClient();
  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];

  // Reminder thresholds in days
  const THRESHOLDS = [30, 7, 0];

  let emailsSent = 0;
  let errors = 0;

  try {
    // 1. Fetch all users with their notification preferences
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('id, email, name, settings');

    if (usersError || !users) {
      return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
    }

    for (const user of users) {
      // Check notification preferences
      const settings = (user.settings as Record<string, unknown>) ?? {};
      const notifs = (settings.notifications as Record<string, boolean>) ?? {};

      // Skip if email reminders are disabled
      if (notifs.emailReminders === false) continue;

      // 2. Check certificate expiry dates for this user's properties
      const { data: certificates } = await supabase
        .from('certificates')
        .select('id, cert_type, expiry_date, property_id, properties!inner(user_id, address_line1, city, postcode)')
        .eq('properties.user_id', user.id)
        .not('expiry_date', 'is', null);

      if (certificates) {
        for (const cert of certificates) {
          const expiryDate = new Date(cert.expiry_date!);
          const daysLeft = Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

          // Check if this matches any threshold
          const matchedThreshold = THRESHOLDS.find(t => {
            if (t === 0) return daysLeft <= 0 && (notifs.onDayReminder !== false || notifs.overdueAlert !== false);
            if (t === 7) return daysLeft === 7 && notifs.sevenDayReminder !== false;
            if (t === 30) return daysLeft === 30 && notifs.thirtyDayReminder !== false;
            return false;
          });

          if (matchedThreshold === undefined) continue;

          // Check if we already sent this reminder
          const reminderKey = `cert_${cert.id}_${daysLeft <= 0 ? 'overdue' : `${matchedThreshold}d`}`;
          const { data: existing } = await supabase
            .from('reminders')
            .select('id')
            .eq('user_id', user.id)
            .eq('title', reminderKey)
            .eq('is_sent', true)
            .limit(1);

          if (existing && existing.length > 0) continue;

          // Build property address
          const prop = cert.properties as unknown as { address_line1: string; city: string; postcode: string };
          const address = `${prop.address_line1}, ${prop.city} ${prop.postcode}`;

          const certLabels: Record<string, string> = {
            gas_safety: 'Gas Safety Certificate',
            eicr: 'EICR (Electrical)',
            epc: 'EPC Certificate',
            smoke_co: 'Smoke & CO Alarms',
            legionella: 'Legionella Assessment',
            buildings_insurance: 'Buildings Insurance',
            landlord_insurance: 'Landlord Insurance',
            hmo_licence: 'HMO Licence',
            right_to_rent: 'Right to Rent Check',
          };

          const title = `${certLabels[cert.cert_type] || cert.cert_type} at ${address}`;

          try {
            await sendDeadlineReminder(
              user.email,
              user.name || 'Landlord',
              {
                title,
                date: cert.expiry_date!,
                daysLeft,
                pillar: 'certificate',
              }
            );

            // Record the sent reminder
            await supabase.from('reminders').insert({
              user_id: user.id,
              property_id: cert.property_id,
              title: reminderKey,
              message: title,
              due_date: cert.expiry_date,
              pillar: 'certificate',
              is_sent: true,
              is_dismissed: false,
            });

            emailsSent++;
          } catch (e) {
            console.error(`Failed to send reminder to ${user.email}:`, e);
            errors++;
          }
        }
      }

      // 3. Check checklist items with due dates
      const { data: checklistItems } = await supabase
        .from('checklist_items')
        .select('id, title, due_date, pillar')
        .eq('user_id', user.id)
        .eq('is_completed', false)
        .not('due_date', 'is', null);

      if (checklistItems) {
        for (const item of checklistItems) {
          const dueDate = new Date(item.due_date!);
          const daysLeft = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

          const matchedThreshold = THRESHOLDS.find(t => {
            if (t === 0) return daysLeft <= 0 && (notifs.onDayReminder !== false || notifs.overdueAlert !== false);
            if (t === 7) return daysLeft === 7 && notifs.sevenDayReminder !== false;
            if (t === 30) return daysLeft === 30 && notifs.thirtyDayReminder !== false;
            return false;
          });

          if (matchedThreshold === undefined) continue;

          const reminderKey = `checklist_${item.id}_${daysLeft <= 0 ? 'overdue' : `${matchedThreshold}d`}`;
          const { data: existing } = await supabase
            .from('reminders')
            .select('id')
            .eq('user_id', user.id)
            .eq('title', reminderKey)
            .eq('is_sent', true)
            .limit(1);

          if (existing && existing.length > 0) continue;

          try {
            await sendDeadlineReminder(
              user.email,
              user.name || 'Landlord',
              {
                title: item.title,
                date: item.due_date!,
                daysLeft,
                pillar: item.pillar,
              }
            );

            await supabase.from('reminders').insert({
              user_id: user.id,
              title: reminderKey,
              message: item.title,
              due_date: item.due_date,
              pillar: item.pillar,
              is_sent: true,
              is_dismissed: false,
            });

            emailsSent++;
          } catch (e) {
            console.error(`Failed to send checklist reminder to ${user.email}:`, e);
            errors++;
          }
        }
      }
    }

    return NextResponse.json({
      success: true,
      date: todayStr,
      emailsSent,
      errors,
      usersChecked: users.length,
    });
  } catch (err) {
    console.error('Cron /api/cron/reminders error:', err);
    return NextResponse.json({ error: 'Cron job failed' }, { status: 500 });
  }
}
