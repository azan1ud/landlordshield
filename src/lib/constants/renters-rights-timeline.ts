// Renters' Rights Act 2025 — Timeline & Compliance Data
// Based on MHCLG guidance as of February 2026

export const RENTERS_RIGHTS_PHASES = [
  {
    phase: 1,
    title: 'Phase 1 — 1 May 2026',
    date: '2026-05-01',
    changes: [
      {
        title: 'Section 21 abolished',
        description: 'No more "no-fault" evictions. All existing Section 21 notices become invalid.',
        impact: 'critical',
      },
      {
        title: 'ASTs convert to periodic assured tenancies',
        description: 'All Assured Shorthold Tenancies automatically convert to periodic assured tenancies. Fixed terms no longer exist for new tenancies.',
        impact: 'critical',
      },
      {
        title: 'Rent increases limited',
        description: 'Rent can only be increased once per year via a Section 13 notice. No more rent review clauses.',
        impact: 'high',
      },
      {
        title: '2 months\' notice for rent increases',
        description: 'Landlords must give 2 months\' notice of a rent increase (up from 1 month).',
        impact: 'high',
      },
      {
        title: 'Tenants can challenge increases',
        description: 'Tenants can challenge rent increases at the First-tier Tribunal.',
        impact: 'medium',
      },
      {
        title: 'No bidding wars',
        description: 'Landlords and agents must stick to the advertised rent. Cannot accept offers above the listed price.',
        impact: 'medium',
      },
      {
        title: 'Pets allowed by default',
        description: 'Tenants have the right to request a pet. Landlords cannot unreasonably refuse. Landlords can require pet insurance.',
        impact: 'medium',
      },
      {
        title: 'Written statement of terms',
        description: 'A written statement of the terms of the tenancy is required for all new tenancies from 1 May 2026.',
        impact: 'high',
      },
      {
        title: 'Information Sheet for existing tenants',
        description: 'Landlords must provide the government "Information Sheet" to all existing tenants by 31 May 2026.',
        impact: 'critical',
      },
    ],
  },
  {
    phase: 2,
    title: 'Phase 2 — Late 2026',
    date: '2026-10-01',
    changes: [
      {
        title: 'Mandatory Landlord Database',
        description: 'Regional rollout of the mandatory Landlord Database. Must register: contact details, property details, tenancy info, compliance status.',
        impact: 'high',
      },
      {
        title: 'Fines for non-registration',
        description: 'Financial penalties for landlords who fail to register on the database.',
        impact: 'high',
      },
    ],
  },
  {
    phase: 3,
    title: 'Phase 3 — 2027-2028',
    date: '2027-06-01',
    changes: [
      {
        title: 'Landlord Ombudsman established',
        description: 'All private landlords must join the Landlord Ombudsman. Tenants can complain directly.',
        impact: 'medium',
      },
      {
        title: 'Decent Homes Standard',
        description: 'Consultation on applying the Decent Homes Standard to the private rented sector.',
        impact: 'medium',
      },
      {
        title: "Awaab's Law",
        description: 'Mandatory response times for hazards in rented properties.',
        impact: 'medium',
      },
    ],
  },
] as const;

export const RENTERS_RIGHTS_CHECKLIST = [
  {
    key: 'tenancy_type_understood',
    title: 'Tenancy type updated/understood (AST to periodic assured)',
    description: 'Understand that all ASTs will convert to periodic assured tenancies from 1 May 2026.',
    priority: 'critical' as const,
    dueDate: '2026-05-01',
    perProperty: true,
  },
  {
    key: 'written_statement',
    title: 'Written statement of terms prepared',
    description: 'Prepare a written statement of terms for new tenancies from 1 May 2026.',
    priority: 'high' as const,
    dueDate: '2026-05-01',
    perProperty: true,
  },
  {
    key: 'information_sheet',
    title: 'Government Information Sheet provided to existing tenants',
    description: 'Provide the government Information Sheet to all existing tenants by 31 May 2026.',
    priority: 'critical' as const,
    dueDate: '2026-05-31',
    perProperty: true,
  },
  {
    key: 'section8_grounds',
    title: 'Section 8 grounds understood',
    description: 'Understand the replacement grounds for possession now that Section 21 is abolished.',
    priority: 'high' as const,
    dueDate: '2026-05-01',
    perProperty: false,
  },
  {
    key: 'rent_increase_process',
    title: 'Rent increase process updated (Section 13, once per year, 2 months notice)',
    description: 'Update your rent increase process to comply with the new Section 13 requirements.',
    priority: 'high' as const,
    dueDate: '2026-05-01',
    perProperty: false,
  },
  {
    key: 'pet_policy',
    title: 'Pet policy updated (must allow with insurance option)',
    description: 'Update your pet policy. You cannot unreasonably refuse pets. You can require pet insurance.',
    priority: 'medium' as const,
    dueDate: '2026-05-01',
    perProperty: true,
  },
  {
    key: 'landlord_database',
    title: 'Landlord Database registration',
    description: 'Register on the mandatory Landlord Database when available in your region.',
    priority: 'high' as const,
    dueDate: '2026-12-31',
    perProperty: true,
  },
  {
    key: 'ombudsman_registration',
    title: 'Ombudsman registration (when required)',
    description: 'Register with the Landlord Ombudsman when the requirement comes into effect.',
    priority: 'medium' as const,
    dueDate: '2028-06-30',
    perProperty: false,
  },
  {
    key: 'asb_process',
    title: 'Anti-social behaviour process documented',
    description: 'Document your process for dealing with anti-social behaviour complaints.',
    priority: 'medium' as const,
    dueDate: '2026-05-01',
    perProperty: false,
  },
  {
    key: 'rent_arrears_process',
    title: 'Rent arrears process documented (for Section 8 Ground 8/10/11)',
    description: 'Document your process for dealing with rent arrears under the new Section 8 grounds.',
    priority: 'high' as const,
    dueDate: '2026-05-01',
    perProperty: false,
  },
] as const;
