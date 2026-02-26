import type { ChecklistItem, PillarScore, ComplianceOverview, ComplianceStatus, Pillar } from '@/types';

function getStatus(score: number): ComplianceStatus {
  if (score >= 80) return 'ready';
  if (score >= 40) return 'partial';
  return 'not_ready';
}

function getNextDeadline(pillar: Pillar): Date | null {
  const now = new Date();
  const deadlines: Record<Pillar, Date[]> = {
    mtd: [
      new Date('2026-04-06'),
      new Date('2026-08-07'),
      new Date('2026-11-07'),
      new Date('2027-02-07'),
      new Date('2027-05-07'),
    ],
    renters_rights: [
      new Date('2026-05-01'),
      new Date('2026-05-31'),
      new Date('2026-12-31'),
    ],
    epc: [
      new Date('2029-10-01'),
      new Date('2030-10-01'),
    ],
  };

  const futureDates = deadlines[pillar].filter((d) => d > now);
  return futureDates.length > 0 ? futureDates[0] : null;
}

function getDaysUntil(date: Date | null): number | null {
  if (!date) return null;
  const now = new Date();
  const diff = date.getTime() - now.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export function calculatePillarScore(
  pillar: Pillar,
  items: ChecklistItem[]
): PillarScore {
  const pillarItems = items.filter((item) => item.pillar === pillar);
  const completed = pillarItems.filter((item) => item.is_completed).length;
  const total = pillarItems.length;
  const score = total > 0 ? Math.round((completed / total) * 100) : 0;
  const nextDeadline = getNextDeadline(pillar);

  return {
    pillar,
    score,
    status: getStatus(score),
    totalItems: total,
    completedItems: completed,
    outstandingActions: total - completed,
    nextDeadline,
    daysUntilDeadline: getDaysUntil(nextDeadline),
  };
}

export function calculateOverallCompliance(
  items: ChecklistItem[]
): ComplianceOverview {
  const mtd = calculatePillarScore('mtd', items);
  const rentersRights = calculatePillarScore('renters_rights', items);
  const epc = calculatePillarScore('epc', items);

  // Weighted average: MTD 35%, Renters Rights 40%, EPC 25%
  // (MTD and Renters Rights have nearer deadlines)
  const overallScore = Math.round(
    mtd.score * 0.35 + rentersRights.score * 0.4 + epc.score * 0.25
  );

  return {
    overallScore,
    mtd,
    rentersRights,
    epc,
  };
}
