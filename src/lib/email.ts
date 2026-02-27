import { Resend } from 'resend';

export const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendDeadlineReminder(
  to: string,
  name: string,
  deadline: { title: string; date: string; daysLeft: number; pillar: string }
) {
  const pillarLabels: Record<string, string> = {
    mtd: 'Making Tax Digital',
    renters_rights: "Renters' Rights Act",
    epc: 'EPC Compliance',
    certificate: 'Certificate Renewal',
  };

  const pillarLabel = pillarLabels[deadline.pillar] || deadline.pillar;

  await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL || 'LandlordShield <onboarding@resend.dev>',
    to,
    subject: `${deadline.daysLeft <= 0 ? 'OVERDUE' : `${deadline.daysLeft} days left`}: ${deadline.title}`,
    html: `
      <div style="font-family: Inter, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #1E3A5F; padding: 24px; border-radius: 8px 8px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 20px;">LandlordShield</h1>
        </div>
        <div style="padding: 24px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px;">
          <p>Dear ${name},</p>
          <div style="background: ${deadline.daysLeft <= 0 ? '#FEF2F2' : deadline.daysLeft <= 7 ? '#FFFBEB' : '#F0F9FF'};
                      border-left: 4px solid ${deadline.daysLeft <= 0 ? '#DC2626' : deadline.daysLeft <= 7 ? '#F59E0B' : '#2563EB'};
                      padding: 16px; margin: 16px 0; border-radius: 0 8px 8px 0;">
            <p style="margin: 0 0 4px 0; font-weight: 600;">${deadline.title}</p>
            <p style="margin: 0; color: #6B7280; font-size: 14px;">
              ${pillarLabel} &bull; Due: ${deadline.date}
              ${deadline.daysLeft <= 0 ? ' &bull; <strong style="color: #DC2626;">OVERDUE</strong>' : ` &bull; ${deadline.daysLeft} days remaining`}
            </p>
          </div>
          <p>Log in to your LandlordShield dashboard to take action.</p>
          <p style="font-size: 12px; color: #9CA3AF; margin-top: 24px;">
            This is an automated reminder from LandlordShield. This tool provides guidance only.
            It is not legal, tax, or financial advice.
          </p>
        </div>
      </div>
    `,
  });
}
