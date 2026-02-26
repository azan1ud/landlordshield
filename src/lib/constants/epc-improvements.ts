// EPC Improvements — Standard improvements with costs and impact estimates
// Based on typical EPC recommendation data

export const EPC_IMPROVEMENTS = [
  {
    type: 'loft_insulation' as const,
    label: 'Loft insulation',
    description: 'Install or top up loft insulation to at least 270mm depth.',
    costMin: 300,
    costMax: 500,
    pointsMin: 3,
    pointsMax: 5,
    costEffectiveness: 'high',
    typicalTimeline: '1 day',
  },
  {
    type: 'cavity_wall' as const,
    label: 'Cavity wall insulation',
    description: 'Fill cavity walls with insulation material.',
    costMin: 350,
    costMax: 500,
    pointsMin: 5,
    pointsMax: 10,
    costEffectiveness: 'high',
    typicalTimeline: '1 day',
  },
  {
    type: 'double_glazing' as const,
    label: 'Double glazing',
    description: 'Replace single-glazed windows with double or triple glazing.',
    costMin: 3000,
    costMax: 7000,
    pointsMin: 5,
    pointsMax: 10,
    costEffectiveness: 'medium',
    typicalTimeline: '1-2 weeks',
  },
  {
    type: 'led_lighting' as const,
    label: 'LED lighting',
    description: 'Replace all light fittings with LED bulbs.',
    costMin: 50,
    costMax: 200,
    pointsMin: 1,
    pointsMax: 2,
    costEffectiveness: 'high',
    typicalTimeline: '1 day',
  },
  {
    type: 'hot_water_insulation' as const,
    label: 'Hot water cylinder insulation',
    description: 'Add or upgrade hot water cylinder jacket.',
    costMin: 20,
    costMax: 50,
    pointsMin: 1,
    pointsMax: 2,
    costEffectiveness: 'high',
    typicalTimeline: '1 hour',
  },
  {
    type: 'boiler_upgrade' as const,
    label: 'Boiler upgrade',
    description: 'Replace old boiler with a modern condensing boiler.',
    costMin: 1500,
    costMax: 3000,
    pointsMin: 5,
    pointsMax: 15,
    costEffectiveness: 'medium',
    typicalTimeline: '1-2 days',
  },
  {
    type: 'solar_panels' as const,
    label: 'Solar panels',
    description: 'Install photovoltaic solar panels on the roof.',
    costMin: 4000,
    costMax: 8000,
    pointsMin: 8,
    pointsMax: 12,
    costEffectiveness: 'medium',
    typicalTimeline: '1-2 days',
  },
  {
    type: 'heat_pump' as const,
    label: 'Heat pump',
    description: 'Install an air source or ground source heat pump.',
    costMin: 8000,
    costMax: 15000,
    pointsMin: 10,
    pointsMax: 20,
    costEffectiveness: 'low',
    typicalTimeline: '1-2 weeks',
  },
] as const;

export const EPC_RATING_BANDS = {
  A: { min: 92, max: 100, color: '#008054', label: 'A (92-100)' },
  B: { min: 81, max: 91, color: '#19B459', label: 'B (81-91)' },
  C: { min: 69, max: 80, color: '#8DCA2F', label: 'C (69-80)' },
  D: { min: 55, max: 68, color: '#FCD601', label: 'D (55-68)' },
  E: { min: 39, max: 54, color: '#F0B400', label: 'E (39-54)' },
  F: { min: 21, max: 38, color: '#ED8B18', label: 'F (21-38)' },
  G: { min: 1, max: 20, color: '#E9153B', label: 'G (1-20)' },
} as const;

export const EPC_KEY_DATES = {
  currentMethodologyDeadline: '2029-10-01',
  newHemMethodology: '2029-10-01',
  finalDeadline: '2030-10-01',
  spendingCapStart: '2025-10-01',
  spendingCap: 10000,
  nonComplianceFine: 30000,
} as const;

export const EPC_EXEMPTIONS = [
  {
    type: 'cost_cap',
    label: 'Cost cap exemption',
    description: 'All cost-effective improvements have been made within the £10,000 cap.',
    duration: '5 years',
  },
  {
    type: 'tenant_consent',
    label: 'Tenant consent refused',
    description: 'The tenant has refused consent for the improvements to be carried out.',
    duration: '5 years',
  },
  {
    type: 'devaluation',
    label: 'Property devaluation',
    description: 'An independent surveyor has determined the improvements would devalue the property by more than 5%.',
    duration: '5 years',
  },
  {
    type: 'listed_building',
    label: 'Listed building / conservation area',
    description: 'The property is a listed building or in a conservation area where improvements would unacceptably alter the character.',
    duration: '5 years',
  },
  {
    type: 'new_landlord',
    label: 'New landlord (6-month grace period)',
    description: 'You have recently become the landlord and have a 6-month grace period to comply.',
    duration: '6 months',
  },
] as const;

export const EPC_GRANTS = [
  {
    name: 'Warm Homes: Local Grant',
    description: '1 property fully funded per landlord, 50% contribution for additional properties.',
    amount: 'Up to full cost (1st property) / 50% (additional)',
    eligibility: 'Private landlords with properties rated D-G',
  },
  {
    name: 'Boiler Upgrade Scheme',
    description: 'Grants for heat pump installation.',
    amount: '£5,000 – £7,500',
    eligibility: 'Properties replacing fossil fuel heating with a heat pump',
  },
  {
    name: 'Great British Insulation Scheme',
    description: 'Insulation measures for qualifying properties.',
    amount: 'Varies',
    eligibility: 'Properties in Council Tax bands A-D (England) or A-E (Scotland/Wales)',
  },
  {
    name: 'ECO4 Scheme',
    description: 'Energy efficiency measures for properties with low-income tenants.',
    amount: 'Varies',
    eligibility: 'Tenants on qualifying benefits',
  },
] as const;
