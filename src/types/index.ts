// ============================================
// LandlordShield - Type Definitions
// ============================================

export type PlanType = 'free' | 'pro' | 'portfolio';
export type SubscriptionStatus = 'active' | 'inactive' | 'trialing' | 'past_due' | 'canceled';
export type Pillar = 'mtd' | 'renters_rights' | 'epc';
export type ComplianceStatus = 'ready' | 'partial' | 'not_ready';
export type Priority = 'critical' | 'high' | 'medium' | 'low';

export interface User {
  id: string;
  email: string;
  name: string | null;
  business_name: string | null;
  phone: string | null;
  created_at: string;
  plan: PlanType;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  subscription_status: SubscriptionStatus;
  settings: Record<string, unknown>;
}

export type PropertyType = 'house' | 'flat' | 'hmo' | 'studio' | 'bungalow' | 'maisonette' | 'other';
export type OwnershipType = 'sole' | 'joint' | 'limited_company';
export type FurnishedStatus = 'furnished' | 'part_furnished' | 'unfurnished';

export interface Property {
  id: string;
  user_id: string;
  address_line1: string;
  address_line2: string | null;
  city: string;
  county: string | null;
  postcode: string;
  property_type: PropertyType | null;
  bedrooms: number | null;
  monthly_rent: number | null;
  ownership_type: OwnershipType | null;
  joint_ownership_percentage: number | null;
  is_furnished: FurnishedStatus | null;
  has_mortgage: boolean;
  mortgage_monthly: number | null;
  managing_agent: string | null;
  hmo_licence_required: boolean;
  notes: string | null;
  created_at: string;
  // Joined data
  tenancies?: Tenancy[];
  epc_records?: EpcRecord[];
  certificates?: Certificate[];
  checklist_items?: ChecklistItem[];
}

export type TenancyType = 'ast_fixed' | 'ast_periodic' | 'periodic_assured';
export type TenancyStatus = 'active' | 'ended' | 'notice_served';

export interface Tenancy {
  id: string;
  property_id: string;
  tenant_name: string;
  tenant_email: string | null;
  tenant_phone: string | null;
  tenancy_type: TenancyType | null;
  start_date: string | null;
  end_date: string | null;
  current_rent: number | null;
  deposit_amount: number | null;
  deposit_scheme: string | null;
  right_to_rent_checked: boolean;
  right_to_rent_date: string | null;
  pets_allowed: boolean;
  status: TenancyStatus;
  created_at: string;
}

export type EpcRating = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G';
export type EpcStatus = 'valid' | 'expiring_soon' | 'expired' | 'unknown';

export interface EpcRecord {
  id: string;
  property_id: string;
  current_rating: EpcRating | null;
  current_score: number | null;
  potential_rating: EpcRating | null;
  potential_score: number | null;
  certificate_number: string | null;
  issue_date: string | null;
  expiry_date: string | null;
  status: EpcStatus;
  created_at: string;
}

export type ImprovementType =
  | 'loft_insulation'
  | 'cavity_wall'
  | 'double_glazing'
  | 'led_lighting'
  | 'hot_water_insulation'
  | 'boiler_upgrade'
  | 'solar_panels'
  | 'heat_pump'
  | 'other';

export type ImprovementStatus = 'planned' | 'in_progress' | 'completed';

export interface EpcImprovement {
  id: string;
  property_id: string;
  improvement_type: ImprovementType;
  description: string | null;
  estimated_cost: number | null;
  actual_cost: number | null;
  estimated_points_gain: number | null;
  status: ImprovementStatus;
  completed_date: string | null;
  counts_toward_cap: boolean;
  created_at: string;
}

export type CertificateType =
  | 'gas_safety'
  | 'eicr'
  | 'epc'
  | 'smoke_co'
  | 'legionella'
  | 'buildings_insurance'
  | 'landlord_insurance'
  | 'hmo_licence'
  | 'right_to_rent';

export type CertificateStatus = 'valid' | 'expiring_soon' | 'expired' | 'missing';

export interface Certificate {
  id: string;
  property_id: string;
  cert_type: CertificateType;
  issued_date: string | null;
  expiry_date: string | null;
  provider: string | null;
  reference_number: string | null;
  document_url: string | null;
  status: CertificateStatus;
  created_at: string;
}

export interface ChecklistItem {
  id: string;
  user_id: string;
  property_id: string | null;
  pillar: Pillar;
  item_key: string;
  title: string;
  description: string | null;
  is_completed: boolean;
  completed_at: string | null;
  due_date: string | null;
  priority: Priority;
  created_at: string;
}

export type MtdStatus = 'not_started' | 'in_progress' | 'submitted' | 'overdue';

export interface MtdRecord {
  id: string;
  user_id: string;
  tax_year: string;
  quarter: number;
  period_start: string;
  period_end: string;
  submission_deadline: string;
  total_income: number | null;
  total_expenses: number | null;
  status: MtdStatus;
  submitted_at: string | null;
  penalty_points: number;
  created_at: string;
}

export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: string;
  user_id: string;
  property_id: string | null;
  type: TransactionType;
  category: string;
  amount: number;
  description: string | null;
  date: string;
  receipt_url: string | null;
  created_at: string;
}

export interface Reminder {
  id: string;
  user_id: string;
  property_id: string | null;
  title: string;
  message: string | null;
  due_date: string;
  pillar: string | null;
  is_sent: boolean;
  is_dismissed: boolean;
  created_at: string;
}

// Compliance scoring
export interface PillarScore {
  pillar: Pillar;
  score: number; // 0-100
  status: ComplianceStatus;
  totalItems: number;
  completedItems: number;
  outstandingActions: number;
  nextDeadline: Date | null;
  daysUntilDeadline: number | null;
}

export interface ComplianceOverview {
  overallScore: number;
  mtd: PillarScore;
  rentersRights: PillarScore;
  epc: PillarScore;
}

// MTD Calculator
export interface MtdCalculatorInput {
  grossRentalIncome: number;
  selfEmploymentIncome: number;
  isJointOwnership: boolean;
  hasLimitedCompanyProperties: boolean;
}

export type MtdPhase = 'april_2026' | 'april_2027' | 'april_2028' | 'not_required';

export interface MtdCalculatorResult {
  qualifyingIncome: number;
  phase: MtdPhase;
  deadline: string;
  message: string;
  isAffected: boolean;
}

// Deadline
export interface Deadline {
  id: string;
  title: string;
  date: Date;
  pillar: Pillar | 'certificate' | 'custom';
  description?: string;
  propertyId?: string;
  isOverdue?: boolean;
  isCritical?: boolean;
}
