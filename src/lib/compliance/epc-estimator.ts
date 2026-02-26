import { EPC_IMPROVEMENTS, EPC_RATING_BANDS } from '@/lib/constants/epc-improvements';
import type { EpcRating } from '@/types';

export function getScoreForRating(rating: EpcRating): number {
  const band = EPC_RATING_BANDS[rating];
  return Math.round((band.min + band.max) / 2);
}

export function getRatingForScore(score: number): EpcRating {
  if (score >= 92) return 'A';
  if (score >= 81) return 'B';
  if (score >= 69) return 'C';
  if (score >= 55) return 'D';
  if (score >= 39) return 'E';
  if (score >= 21) return 'F';
  return 'G';
}

export function getGapToC(currentScore: number): number {
  const cMinimum = 69;
  return Math.max(0, cMinimum - currentScore);
}

export function isCompliant(rating: EpcRating): boolean {
  return ['A', 'B', 'C'].includes(rating);
}

export interface ImprovementRecommendation {
  type: string;
  label: string;
  description: string;
  estimatedCostMid: number;
  estimatedPointsMid: number;
  costPerPoint: number;
  costEffectiveness: string;
}

export function getRecommendedImprovements(
  currentScore: number,
  budget?: number
): ImprovementRecommendation[] {
  const gap = getGapToC(currentScore);
  if (gap <= 0) return [];

  const recommendations = EPC_IMPROVEMENTS.map((imp) => {
    const costMid = (imp.costMin + imp.costMax) / 2;
    const pointsMid = (imp.pointsMin + imp.pointsMax) / 2;
    return {
      type: imp.type,
      label: imp.label,
      description: imp.description,
      estimatedCostMid: costMid,
      estimatedPointsMid: pointsMid,
      costPerPoint: costMid / pointsMid,
      costEffectiveness: imp.costEffectiveness,
    };
  });

  // Sort by cost-effectiveness (lowest cost per point first)
  recommendations.sort((a, b) => a.costPerPoint - b.costPerPoint);

  if (budget) {
    let remaining = budget;
    return recommendations.filter((r) => {
      if (remaining >= r.estimatedCostMid) {
        remaining -= r.estimatedCostMid;
        return true;
      }
      return false;
    });
  }

  return recommendations;
}

export function estimateTotalUpgradeCost(currentScore: number): {
  minimum: number;
  maximum: number;
  midpoint: number;
} {
  const gap = getGapToC(currentScore);
  if (gap <= 0) return { minimum: 0, maximum: 0, midpoint: 0 };

  // Rough estimation based on points needed
  const costPerPoint = 200; // Average £200 per EPC point improvement
  const midpoint = gap * costPerPoint;
  return {
    minimum: Math.round(midpoint * 0.5),
    maximum: Math.round(midpoint * 1.8),
    midpoint: Math.round(midpoint),
  };
}
