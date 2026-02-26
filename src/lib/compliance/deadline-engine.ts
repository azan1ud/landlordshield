import type { Deadline, Property, Certificate } from '@/types';
import { MTD_QUARTERLY_DEADLINES_2026_27 } from '@/lib/constants/mtd-deadlines';
import { RENTERS_RIGHTS_PHASES } from '@/lib/constants/renters-rights-timeline';
import { EPC_KEY_DATES } from '@/lib/constants/epc-improvements';

export function getMtdDeadlines(): Deadline[] {
  return MTD_QUARTERLY_DEADLINES_2026_27.map((q) => ({
    id: `mtd-q${q.quarter}`,
    title: `MTD ${q.label}`,
    date: new Date(q.submissionDeadline),
    pillar: 'mtd' as const,
    description: q.submitBy,
  }));
}

export function getRentersRightsDeadlines(): Deadline[] {
  const deadlines: Deadline[] = [];

  deadlines.push({
    id: 'rra-phase1',
    title: "Renters' Rights Act takes effect",
    date: new Date('2026-05-01'),
    pillar: 'renters_rights',
    description: 'Section 21 abolished. ASTs convert to periodic. New rules take effect.',
    isCritical: true,
  });

  deadlines.push({
    id: 'rra-info-sheet',
    title: 'Information Sheet deadline for existing tenants',
    date: new Date('2026-05-31'),
    pillar: 'renters_rights',
    description: 'Government Information Sheet must be provided to all existing tenants.',
    isCritical: true,
  });

  deadlines.push({
    id: 'rra-database',
    title: 'Landlord Database registration (estimated)',
    date: new Date('2026-12-31'),
    pillar: 'renters_rights',
    description: 'Mandatory registration on the Landlord Database (regional rollout).',
  });

  return deadlines;
}

export function getEpcDeadlines(): Deadline[] {
  return [
    {
      id: 'epc-current-method',
      title: 'EPC C under current methodology deadline',
      date: new Date(EPC_KEY_DATES.currentMethodologyDeadline),
      pillar: 'epc',
      description: 'Last date to get EPC C under current EER methodology (valid for up to 10 years).',
    },
    {
      id: 'epc-final',
      title: 'EPC C final deadline — all rental properties',
      date: new Date(EPC_KEY_DATES.finalDeadline),
      pillar: 'epc',
      description: 'All rental properties must meet EPC C. Fines up to £30,000 per property.',
      isCritical: true,
    },
  ];
}

export function getCertificateDeadlines(
  properties: Property[],
  certificates: Certificate[]
): Deadline[] {
  return certificates
    .filter((cert) => cert.expiry_date)
    .map((cert) => {
      const property = properties.find((p) => p.id === cert.property_id);
      return {
        id: `cert-${cert.id}`,
        title: `${cert.cert_type.replace(/_/g, ' ')} renewal${property ? ` — ${property.address_line1}` : ''}`,
        date: new Date(cert.expiry_date!),
        pillar: 'certificate' as const,
        propertyId: cert.property_id,
        description: `Certificate expires on ${cert.expiry_date}`,
      };
    });
}

export function getAllDeadlines(
  properties: Property[] = [],
  certificates: Certificate[] = []
): Deadline[] {
  const all = [
    ...getMtdDeadlines(),
    ...getRentersRightsDeadlines(),
    ...getEpcDeadlines(),
    ...getCertificateDeadlines(properties, certificates),
  ];

  const now = new Date();
  return all
    .map((d) => ({
      ...d,
      isOverdue: d.date < now,
    }))
    .sort((a, b) => a.date.getTime() - b.date.getTime());
}

export function getUpcomingDeadlines(
  properties: Property[] = [],
  certificates: Certificate[] = [],
  limit = 10
): Deadline[] {
  const now = new Date();
  return getAllDeadlines(properties, certificates)
    .filter((d) => d.date >= now)
    .slice(0, limit);
}
