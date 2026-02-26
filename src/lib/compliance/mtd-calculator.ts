import type { MtdCalculatorInput, MtdCalculatorResult, MtdPhase } from '@/types';

export function calculateMtdStatus(input: MtdCalculatorInput): MtdCalculatorResult {
  // Limited company properties are excluded from MTD for ITSA
  if (input.hasLimitedCompanyProperties && input.grossRentalIncome === 0) {
    return {
      qualifyingIncome: 0,
      phase: 'not_required',
      deadline: '',
      message: 'Limited company rental income is not within scope of MTD for Income Tax Self Assessment.',
      isAffected: false,
    };
  }

  // For joint ownership, rental income is halved for threshold purposes
  const adjustedRentalIncome = input.isJointOwnership
    ? input.grossRentalIncome / 2
    : input.grossRentalIncome;

  // Qualifying income is the total of rental + self-employment income
  const qualifyingIncome = adjustedRentalIncome + input.selfEmploymentIncome;

  let phase: MtdPhase;
  let deadline: string;
  let message: string;
  let isAffected: boolean;

  if (qualifyingIncome > 50000) {
    phase = 'april_2026';
    deadline = '6 April 2026';
    message = 'You must comply NOW. MTD for Income Tax starts on 6 April 2026 for those with qualifying income over £50,000.';
    isAffected = true;
  } else if (qualifyingIncome > 30000) {
    phase = 'april_2027';
    deadline = '6 April 2027';
    message = 'You have 1 year to prepare. The threshold drops to £30,000 in April 2027.';
    isAffected = true;
  } else if (qualifyingIncome > 20000) {
    phase = 'april_2028';
    deadline = '6 April 2028';
    message = 'You have 2 years to prepare. The threshold drops to £20,000 in April 2028.';
    isAffected = true;
  } else {
    phase = 'not_required';
    deadline = '';
    message = 'Not currently required, but voluntary signup is available. If your income grows above £20,000 you will need to comply from April 2028.';
    isAffected = false;
  }

  return {
    qualifyingIncome,
    phase,
    deadline,
    message,
    isAffected,
  };
}

export function calculateLatePenalty(
  amountOwed: number,
  daysLate: number
): { penalty: number; breakdown: string } {
  let penalty = 0;
  const parts: string[] = [];

  if (daysLate >= 15) {
    const day15Penalty = amountOwed * 0.03;
    penalty += day15Penalty;
    parts.push(`3% at day 15: £${day15Penalty.toFixed(2)}`);
  }

  if (daysLate >= 30) {
    const day30Penalty = amountOwed * 0.03;
    penalty += day30Penalty;
    parts.push(`Additional 3% at day 30: £${day30Penalty.toFixed(2)}`);
  }

  if (daysLate > 30) {
    const extraDays = daysLate - 30;
    const annualPenalty = amountOwed * 0.10 * (extraDays / 365);
    penalty += annualPenalty;
    parts.push(`10% pa for ${extraDays} days after day 30: £${annualPenalty.toFixed(2)}`);
  }

  return {
    penalty: Math.round(penalty * 100) / 100,
    breakdown: parts.join('\n'),
  };
}
