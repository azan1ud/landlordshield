// Section 8 Grounds for Possession — Renters' Rights Act 2025
// Reference guide for landlords

export interface Section8Ground {
  ground: number;
  type: 'mandatory' | 'discretionary';
  title: string;
  description: string;
  noticePeriod: string;
  evidence: string[];
}

export const SECTION_8_GROUNDS: Section8Ground[] = [
  // Mandatory grounds (court must grant)
  {
    ground: 1,
    type: 'mandatory',
    title: 'Landlord or family member wants to live in the property',
    description: 'The landlord or a close family member wants to occupy the property as their only or principal home. Cannot be used in the first 12 months of a tenancy.',
    noticePeriod: '4 months',
    evidence: [
      'Evidence that the landlord or family member intends to occupy',
      'Proof the property will be their principal home',
      'Tenancy must be at least 12 months old',
    ],
  },
  {
    ground: 1.5,
    type: 'mandatory',
    title: 'Sale of the property',
    description: 'The landlord intends to sell the property. New ground introduced by the Renters\' Rights Act.',
    noticePeriod: '4 months',
    evidence: [
      'Evidence of intention to sell (e.g., estate agent instructions)',
      'Must sell within a reasonable period after possession',
    ],
  },
  {
    ground: 6,
    type: 'mandatory',
    title: 'Demolition or major works',
    description: 'The landlord intends to demolish or substantially refurbish the property.',
    noticePeriod: '4 months',
    evidence: [
      'Planning permission or building control approval',
      'Contractor quotes or plans',
      'Evidence the work cannot be done with the tenant in situ',
    ],
  },
  {
    ground: 8,
    type: 'mandatory',
    title: 'Serious rent arrears (2+ months)',
    description: 'The tenant is at least 2 months in rent arrears at the date of the notice AND at the date of the court hearing.',
    noticePeriod: '4 weeks',
    evidence: [
      'Rent statements showing 2+ months arrears',
      'Evidence of payment demands',
      'Arrears must exist at notice date AND hearing date',
    ],
  },
  // Discretionary grounds (court may grant)
  {
    ground: 10,
    type: 'discretionary',
    title: 'Some rent arrears',
    description: 'Some rent is unpaid at the date of the notice and at the date of the hearing. The court will consider the history and circumstances.',
    noticePeriod: '2 weeks',
    evidence: [
      'Rent statements showing arrears',
      'History of payment',
      'Any communication about payment difficulties',
    ],
  },
  {
    ground: 11,
    type: 'discretionary',
    title: 'Persistent late payment',
    description: 'The tenant has persistently delayed paying rent, regardless of whether any rent is currently outstanding.',
    noticePeriod: '2 weeks',
    evidence: [
      'Rent payment records showing pattern of late payment',
      'Bank statements or payment receipts',
      'Communication regarding late payments',
    ],
  },
  {
    ground: 12,
    type: 'discretionary',
    title: 'Breach of tenancy terms',
    description: 'The tenant has broken one or more terms of the tenancy agreement (other than rent payment).',
    noticePeriod: '2 weeks',
    evidence: [
      'Copy of the tenancy agreement showing the broken term',
      'Evidence of the breach (photos, complaints, etc.)',
      'Records of warnings given',
    ],
  },
  {
    ground: 14,
    type: 'discretionary',
    title: 'Anti-social behaviour',
    description: 'The tenant, a visitor, or someone living with the tenant has caused nuisance or annoyance to people in the locality.',
    noticePeriod: 'Immediate (no notice required in serious cases)',
    evidence: [
      'Complaints from neighbours or community',
      'Police reports or crime reference numbers',
      'Council environmental health records',
      'Diary of incidents with dates and details',
    ],
  },
  {
    ground: 17,
    type: 'discretionary',
    title: 'False statement by tenant',
    description: 'The tenant obtained the tenancy by making a false statement (e.g., about income, references, or right to rent).',
    noticePeriod: '2 weeks',
    evidence: [
      'The false statement (application form, emails)',
      'Evidence that it was false',
      'Evidence the tenancy was granted based on the statement',
    ],
  },
];
