// HMRC-aligned income and expense categories for MTD

export const INCOME_CATEGORIES = [
  { key: 'rent', label: 'Rent', hmrcBox: 'Box 20' },
  { key: 'insurance_payouts', label: 'Insurance payouts', hmrcBox: 'Box 22' },
  { key: 'grant_income', label: 'Grant income', hmrcBox: 'Box 22' },
  { key: 'other_income', label: 'Other income', hmrcBox: 'Box 22' },
] as const;

export const EXPENSE_CATEGORIES = [
  { key: 'rent_rates_ground_rent', label: 'Rent, rates and ground rent', hmrcBox: 'Box 24' },
  { key: 'repairs_maintenance', label: 'Property repairs and maintenance', hmrcBox: 'Box 25' },
  { key: 'legal_management_fees', label: 'Legal, management and professional fees', hmrcBox: 'Box 26' },
  { key: 'wages', label: 'Cost of services (wages)', hmrcBox: 'Box 27' },
  { key: 'insurance', label: 'Insurance', hmrcBox: 'Box 28' },
  { key: 'travel', label: 'Travel costs', hmrcBox: 'Box 29' },
  { key: 'loan_interest', label: 'Interest on property loans (basic rate relief)', hmrcBox: 'Box 44' },
  { key: 'other_expenses', label: 'Other allowable expenses', hmrcBox: 'Box 30' },
] as const;

export type IncomeCategory = typeof INCOME_CATEGORIES[number]['key'];
export type ExpenseCategory = typeof EXPENSE_CATEGORIES[number]['key'];
