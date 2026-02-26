// MTD for Income Tax - Key Deadlines & Thresholds
// Based on HMRC guidance as of February 2026

export const MTD_THRESHOLDS = [
  {
    phase: 'april_2026' as const,
    startDate: '2026-04-06',
    threshold: 50000,
    label: 'Phase 1 — April 2026',
    message: 'You must comply NOW',
    description: 'Landlords with gross rental income over £50,000 must keep digital records and submit quarterly updates.',
  },
  {
    phase: 'april_2027' as const,
    startDate: '2027-04-06',
    threshold: 30000,
    label: 'Phase 2 — April 2027',
    message: 'You have 1 year to prepare',
    description: 'The threshold drops to £30,000. More landlords will be brought into scope.',
  },
  {
    phase: 'april_2028' as const,
    startDate: '2028-04-06',
    threshold: 20000,
    label: 'Phase 3 — April 2028',
    message: 'You have 2 years to prepare',
    description: 'The threshold drops further to £20,000.',
  },
] as const;

export const MTD_QUARTERLY_DEADLINES_2026_27 = [
  {
    quarter: 1,
    periodStart: '2026-04-06',
    periodEnd: '2026-07-05',
    submissionDeadline: '2026-08-07',
    label: 'Q1: 6 Apr – 5 Jul 2026',
    submitBy: 'Submit by 7 Aug 2026',
  },
  {
    quarter: 2,
    periodStart: '2026-07-06',
    periodEnd: '2026-10-05',
    submissionDeadline: '2026-11-07',
    label: 'Q2: 6 Jul – 5 Oct 2026',
    submitBy: 'Submit by 7 Nov 2026',
  },
  {
    quarter: 3,
    periodStart: '2026-10-06',
    periodEnd: '2027-01-05',
    submissionDeadline: '2027-02-07',
    label: 'Q3: 6 Oct – 5 Jan 2027',
    submitBy: 'Submit by 7 Feb 2027',
  },
  {
    quarter: 4,
    periodStart: '2027-01-06',
    periodEnd: '2027-04-05',
    submissionDeadline: '2027-05-07',
    label: 'Q4: 6 Jan – 5 Apr 2027',
    submitBy: 'Submit by 7 May 2027',
  },
] as const;

export const MTD_FINAL_DECLARATION_DEADLINE = '2028-01-31';

export const MTD_PENALTY_POINTS = {
  maxPoints: 4,
  warningAt: 3,
  fineAtThreshold: 200, // £200
  latePenaltyDay15: 0.03, // 3%
  latePenaltyDay30: 0.03, // additional 3%
  latePenaltyAfter30: 0.10, // 10% per annum
} as const;

export const MTD_READINESS_CHECKLIST = [
  {
    key: 'check_income_threshold',
    title: 'Checked qualifying income against threshold',
    description: 'Calculate your total gross rental income to determine which MTD phase applies to you.',
    priority: 'critical' as const,
  },
  {
    key: 'government_gateway',
    title: 'Registered for Government Gateway account',
    description: 'You need a Government Gateway account to access HMRC online services.',
    priority: 'critical' as const,
  },
  {
    key: 'mtd_signup',
    title: 'Signed up for MTD for Income Tax on HMRC',
    description: 'Register for MTD for Income Tax through your Government Gateway account.',
    priority: 'critical' as const,
  },
  {
    key: 'chosen_software',
    title: 'Chosen HMRC-recognised MTD software',
    description: 'Select compatible software from the HMRC-approved list to keep digital records and submit updates.',
    priority: 'high' as const,
  },
  {
    key: 'digital_records',
    title: 'Set up digital record-keeping',
    description: 'Start keeping digital records of all rental income and expenses.',
    priority: 'high' as const,
  },
  {
    key: 'bank_feeds',
    title: 'Connected bank feeds (if using compatible software)',
    description: 'Link your bank account to your MTD software for automatic transaction imports.',
    priority: 'medium' as const,
  },
  {
    key: 'expense_categories',
    title: 'Categorised property expenses correctly',
    description: 'Ensure expenses are categorised using HMRC-aligned categories.',
    priority: 'high' as const,
  },
  {
    key: 'quarterly_schedule',
    title: 'Understood quarterly submission schedule',
    description: 'Know the four quarterly periods and their submission deadlines.',
    priority: 'medium' as const,
  },
  {
    key: 'self_assessment_filed',
    title: 'Filed 2024/25 Self Assessment (by 31 Jan 2026)',
    description: 'Ensure your most recent Self Assessment is filed before MTD begins.',
    priority: 'high' as const,
  },
  {
    key: 'agent_appointed',
    title: 'Appointed agent (if using one) and authorised them',
    description: 'If using a tax agent or accountant, ensure they are authorised to act on your behalf for MTD.',
    priority: 'medium' as const,
  },
] as const;

export const MTD_INCOME_CATEGORIES = [
  { key: 'rent', label: 'Rent' },
  { key: 'insurance_payouts', label: 'Insurance payouts' },
  { key: 'grant_income', label: 'Grant income' },
  { key: 'other_income', label: 'Other income' },
] as const;

export const MTD_EXPENSE_CATEGORIES = [
  { key: 'rent_rates_ground_rent', label: 'Rent, rates and ground rent' },
  { key: 'repairs_maintenance', label: 'Property repairs and maintenance' },
  { key: 'legal_management_fees', label: 'Legal, management and professional fees' },
  { key: 'wages', label: 'Cost of services (wages)' },
  { key: 'insurance', label: 'Insurance' },
  { key: 'travel', label: 'Travel costs' },
  { key: 'loan_interest', label: 'Interest on property loans (basic rate relief)' },
  { key: 'other_expenses', label: 'Other allowable expenses' },
] as const;

export const MTD_SOFTWARE_COMPARISON = [
  {
    name: 'Landlord Studio',
    pricing: 'From £9.99/month',
    keyFeatures: ['Property accounting', 'Receipt scanning', 'Tenant management', 'MTD filing'],
    hmrcApproved: true,
    bestFor: 'Small portfolio landlords',
  },
  {
    name: 'Landlord Vision',
    pricing: 'From £13/month',
    keyFeatures: ['Full accounting', 'Tax returns', 'Document storage', 'MTD submission'],
    hmrcApproved: true,
    bestFor: 'Landlords wanting comprehensive accounting',
  },
  {
    name: 'Hammock',
    pricing: 'From £8/month',
    keyFeatures: ['Automated bookkeeping', 'Bank feed', 'Tax calculation', 'MTD ready'],
    hmrcApproved: true,
    bestFor: 'Landlords wanting automation',
  },
  {
    name: 'Latch',
    pricing: 'Free basic plan',
    keyFeatures: ['Income tracking', 'Expense management', 'Tax reports', 'MTD compatible'],
    hmrcApproved: true,
    bestFor: 'Budget-conscious landlords',
  },
  {
    name: 'Xero',
    pricing: 'From £15/month',
    keyFeatures: ['Full accounting', 'Bank reconciliation', 'Invoicing', 'MTD filing'],
    hmrcApproved: true,
    bestFor: 'Landlords with complex finances or a company structure',
  },
  {
    name: 'QuickBooks',
    pricing: 'From £12/month',
    keyFeatures: ['Bookkeeping', 'Tax preparation', 'Bank feeds', 'MTD submission'],
    hmrcApproved: true,
    bestFor: 'Landlords already using QuickBooks',
  },
  {
    name: 'FreeAgent',
    pricing: 'From £14.50/month',
    keyFeatures: ['Self Assessment', 'Bank feeds', 'Expense tracking', 'MTD filing'],
    hmrcApproved: true,
    bestFor: 'Landlords who are also self-employed',
  },
] as const;
