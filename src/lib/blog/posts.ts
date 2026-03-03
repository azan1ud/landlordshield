export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  content: string;
  author: string;
  publishedAt: string;
  updatedAt?: string;
  category: 'compliance' | 'tax' | 'legislation' | 'guides' | 'news';
  tags: string[];
  readTime: string;
  featured?: boolean;
}

export const blogPosts: BlogPost[] = [
  {
    slug: 'uk-landlord-compliance-checklist-2026',
    title: 'The Complete UK Landlord Compliance Checklist 2026',
    description: 'Every certificate, check, and legal requirement UK landlords must meet in 2026 — in one comprehensive checklist.',
    author: 'LandlordShield Team',
    publishedAt: '2026-03-03',
    category: 'compliance',
    tags: ['compliance', 'certificates', 'gas safety', 'EICR', 'EPC', 'landlord checklist'],
    readTime: '10 min read',
    featured: true,
    content: `
<p>UK landlords face more legal obligations than ever before. With the Renters' Rights Act 2025 in effect, Making Tax Digital launching in April 2026, and the EPC C deadline confirmed for 2030, keeping track of every requirement is critical. This checklist covers <strong>every certificate, check, and legal duty</strong> you need to meet.</p>

<h2>1. Gas Safety Certificate (CP12)</h2>
<p><strong>Legal requirement:</strong> The Gas Safety (Installation and Use) Regulations 1998 require all landlords to have gas appliances, fittings, and flues checked by a Gas Safe registered engineer <strong>every 12 months</strong>.</p>
<ul>
<li>A copy must be given to existing tenants within 28 days of the check, and to new tenants before they move in.</li>
<li>Records must be kept for 2 years.</li>
<li><strong>Penalty:</strong> Fines up to £6,000 and/or 6 months imprisonment for non-compliance.</li>
</ul>
<p><strong>Action:</strong> Book your annual gas safety check and store the CP12 certificate securely.</p>

<h2>2. Electrical Installation Condition Report (EICR)</h2>
<p><strong>Legal requirement:</strong> The Electrical Safety Standards in the Private Rented Sector (England) Regulations 2020 require an EICR at least <strong>every 5 years</strong>.</p>
<ul>
<li>Must be carried out by a qualified electrician registered with a competent person scheme.</li>
<li>Provide a copy to tenants within 28 days of the inspection.</li>
<li>Any urgent remedial work (C1/C2 codes) must be completed within 28 days.</li>
<li><strong>Penalty:</strong> Fines up to £30,000.</li>
</ul>
<p><strong>Action:</strong> Check your EICR date and schedule a renewal if it was last done before 2021.</p>

<h2>3. Energy Performance Certificate (EPC)</h2>
<p><strong>Legal requirement:</strong> All rental properties must have a valid EPC. Currently, the minimum is EPC E, but the government confirmed in January 2026 that all rentals must reach <strong>EPC C by 1 October 2030</strong>.</p>
<ul>
<li>EPCs are valid for 10 years.</li>
<li>Must be provided to prospective tenants before they sign a tenancy agreement.</li>
<li>A cost cap of £10,000 applies to upgrade costs.</li>
<li><strong>Penalty:</strong> Up to £30,000 per property for non-compliance with the 2030 deadline.</li>
</ul>
<p><strong>Action:</strong> Check your current EPC rating and start planning upgrades if you are below C.</p>

<h2>4. Legionella Risk Assessment</h2>
<p><strong>Legal requirement:</strong> Under the Health and Safety at Work Act 1974, landlords have a duty to assess the risk of legionella in their water systems.</p>
<ul>
<li>There is no set frequency in law, but the HSE recommends <strong>every 2 years</strong> or when the property changes tenants.</li>
<li>Simple risk assessments for typical domestic properties can cost as little as £50–£100.</li>
<li>Keep records of the assessment and any actions taken.</li>
</ul>
<p><strong>Action:</strong> If you have not had a legionella risk assessment, book one now.</p>

<h2>5. Portable Appliance Testing (PAT)</h2>
<p><strong>Legal requirement:</strong> While not explicitly mandated by a single regulation, the Electrical Equipment (Safety) Regulations 1994 and the general duty of care under the Defective Premises Act mean landlords should ensure all electrical appliances they supply are <strong>safe</strong>.</p>
<ul>
<li>Annual PAT testing of all supplied appliances is best practice.</li>
<li>HMO landlords have a specific duty under the HMO Management Regulations.</li>
<li>Keep records of all tests.</li>
</ul>
<p><strong>Action:</strong> If you provide electrical appliances (kettle, microwave, washing machine etc.), schedule PAT testing annually.</p>

<h2>6. Smoke and Carbon Monoxide Alarms</h2>
<p><strong>Legal requirement:</strong> The Smoke and Carbon Monoxide Alarm (Amendment) Regulations 2022 require:</p>
<ul>
<li>A <strong>smoke alarm on every floor</strong> of the property.</li>
<li>A <strong>carbon monoxide alarm in any room with a fixed combustion appliance</strong> (excluding gas cookers).</li>
<li>Alarms must be checked and confirmed as working at the <strong>start of each tenancy</strong>.</li>
<li><strong>Penalty:</strong> Up to £5,000.</li>
</ul>
<p><strong>Action:</strong> Check all alarms are present and working. Replace batteries or units as needed.</p>

<h2>7. Deposit Protection</h2>
<p><strong>Legal requirement:</strong> Under the Housing Act 2004, tenancy deposits must be protected in a government-approved scheme within <strong>30 days</strong> of receipt.</p>
<ul>
<li>Approved schemes: DPS, MyDeposits, TDS.</li>
<li>You must provide prescribed information to the tenant within 30 days.</li>
<li><strong>Penalty:</strong> You cannot serve a Section 8 notice (post-Renters' Rights Act) if the deposit is not protected. Courts can order compensation of 1–3 times the deposit amount.</li>
</ul>

<h2>8. Right to Rent Checks</h2>
<p><strong>Legal requirement:</strong> Under the Immigration Act 2014, landlords in England must check that all adult tenants have the <strong>right to live in the UK</strong> before granting a tenancy.</p>
<ul>
<li>Use the Home Office online checking service or check original documents.</li>
<li>Follow-up checks are required for tenants with time-limited immigration status.</li>
<li><strong>Penalty:</strong> Civil penalties up to £10,000 per tenant for a first offence, £20,000 for repeat offences.</li>
</ul>

<h2>9. HMO Licensing</h2>
<p>If your property is a House in Multiple Occupation (5+ people from 2+ households sharing facilities), you need a <strong>mandatory HMO licence</strong> from your local council. Many councils also run additional licensing schemes for smaller HMOs.</p>
<ul>
<li>Licence fees vary by council (typically £500–£1,500).</li>
<li>Licences are usually valid for 5 years.</li>
<li><strong>Penalty:</strong> Unlimited fines and potential rent repayment orders.</li>
</ul>

<h2>Your 2026 Compliance Summary</h2>
<table style="width:100%;border-collapse:collapse;">
<tr style="border-bottom:1px solid #e5e7eb;"><th style="text-align:left;padding:8px;">Requirement</th><th style="text-align:left;padding:8px;">Frequency</th><th style="text-align:left;padding:8px;">Max Penalty</th></tr>
<tr style="border-bottom:1px solid #e5e7eb;"><td style="padding:8px;">Gas Safety (CP12)</td><td style="padding:8px;">Annual</td><td style="padding:8px;">£6,000 + prison</td></tr>
<tr style="border-bottom:1px solid #e5e7eb;"><td style="padding:8px;">EICR</td><td style="padding:8px;">Every 5 years</td><td style="padding:8px;">£30,000</td></tr>
<tr style="border-bottom:1px solid #e5e7eb;"><td style="padding:8px;">EPC</td><td style="padding:8px;">Every 10 years</td><td style="padding:8px;">£30,000</td></tr>
<tr style="border-bottom:1px solid #e5e7eb;"><td style="padding:8px;">Legionella</td><td style="padding:8px;">Every 2 years</td><td style="padding:8px;">Unlimited</td></tr>
<tr style="border-bottom:1px solid #e5e7eb;"><td style="padding:8px;">PAT Testing</td><td style="padding:8px;">Annual (best practice)</td><td style="padding:8px;">Unlimited</td></tr>
<tr style="border-bottom:1px solid #e5e7eb;"><td style="padding:8px;">Smoke & CO Alarms</td><td style="padding:8px;">Each tenancy start</td><td style="padding:8px;">£5,000</td></tr>
<tr style="border-bottom:1px solid #e5e7eb;"><td style="padding:8px;">Deposit Protection</td><td style="padding:8px;">Within 30 days</td><td style="padding:8px;">3x deposit</td></tr>
<tr><td style="padding:8px;">Right to Rent</td><td style="padding:8px;">Before tenancy</td><td style="padding:8px;">£20,000</td></tr>
</table>

<h2>Track It All Automatically</h2>
<p>LandlordShield tracks every one of these requirements across all your properties, sends automatic reminders before certificates expire, and gives you a real-time compliance score. <a href="/signup">Start free with 1 property</a>.</p>
`,
  },
  {
    slug: 'renters-rights-act-2025-landlord-guide',
    title: "Renters' Rights Act 2025: Everything Landlords Must Do Before 1 May 2026",
    description: "Section 21 is abolished from 1 May 2026. Here's what every UK landlord needs to know and do before the deadline.",
    author: 'LandlordShield Team',
    publishedAt: '2026-03-03',
    category: 'legislation',
    tags: ['renters rights act', 'section 21', 'section 8', 'periodic tenancy', 'landlord guide'],
    readTime: '12 min read',
    featured: true,
    content: `
<p>The Renters' Rights Act 2025 received Royal Assent on 27 October 2025 and represents the <strong>biggest reform to private renting in England in over 35 years</strong>. The headline change — the abolition of Section 21 "no-fault" evictions — takes effect on <strong>1 May 2026</strong>. Here is everything landlords need to understand and prepare for.</p>

<h2>What Is the Renters' Rights Act?</h2>
<p>The Act fundamentally changes the relationship between landlords and tenants in England. It replaces the current system of fixed-term assured shorthold tenancies with a new framework of periodic tenancies, strengthened tenant protections, and new regulatory requirements for landlords.</p>

<h2>Key Changes at a Glance</h2>

<h3>1. Section 21 Abolished (1 May 2026)</h3>
<p>From 1 May 2026, landlords in England can no longer use Section 21 to evict tenants without giving a reason. This applies to <strong>all existing and new tenancies</strong> — there is no grandfather clause for current tenancies.</p>
<p>This means you must use Section 8 (fault-based or specific grounds) for all evictions going forward.</p>

<h3>2. All Tenancies Become Periodic</h3>
<p>Fixed-term tenancies are abolished. All tenancies automatically become <strong>rolling periodic tenancies</strong> from the start. Tenants can leave with 2 months' notice at any time. Landlords cannot include break clauses or minimum terms.</p>

<h3>3. Expanded Section 8 Grounds</h3>
<p>To compensate for the loss of Section 21, several Section 8 grounds have been updated or added:</p>
<ul>
<li><strong>Ground 1 (landlord moving in):</strong> Now available after the first 12 months. 4 months' notice required.</li>
<li><strong>Ground 1A (sale of property):</strong> New ground. Landlord can evict to sell, with 4 months' notice. Cannot be used in the first 12 months.</li>
<li><strong>Ground 6 (redevelopment):</strong> Expanded. Requires evidence of planning permission or intent.</li>
<li><strong>Ground 8A (repeated rent arrears):</strong> New ground for tenants in at least 2 months' rent arrears on 3+ occasions in 3 years.</li>
<li><strong>Grounds 14/14A (anti-social behaviour):</strong> Strengthened. Landlords can act more quickly on ASB reports.</li>
</ul>

<h3>4. Rent Increases via Section 13 Only</h3>
<p>Rent increases must follow the <strong>Section 13 process</strong>:</p>
<ul>
<li>Maximum one increase per year.</li>
<li>Must give at least 2 months' notice.</li>
<li>Must reflect market rent.</li>
<li>Tenants can challenge increases at the First-tier Tribunal.</li>
<li>No more rent review clauses in tenancy agreements.</li>
</ul>

<h3>5. PRS Database and Ombudsman</h3>
<p>A new <strong>Private Rented Sector Database</strong> will launch in late 2026. All landlords will be required to register their properties. A new <strong>PRS Ombudsman</strong> will handle tenant complaints — landlord membership will be mandatory.</p>

<h3>6. Decent Homes Standard</h3>
<p>For the first time, the Decent Homes Standard will apply to the private rented sector. Properties must meet minimum standards for repair, thermal comfort, and modern facilities.</p>

<h3>7. Awaab's Law Extension</h3>
<p>Awaab's Law — requiring landlords to address damp, mould, and hazards within specified timeframes — will be extended from social housing to private rentals. Exact timescales for the private sector are expected in 2026.</p>

<h3>8. Tenants' Right to Request Pets</h3>
<p>Tenants will have the right to request permission to keep a pet. Landlords must not unreasonably refuse. If consent is given, landlords may require the tenant to have pet damage insurance.</p>

<h3>9. Penalties and Enforcement</h3>
<ul>
<li>Fines up to <strong>£7,000</strong> for initial breaches of the Act.</li>
<li>Fines up to <strong>£40,000</strong> for repeat offences.</li>
<li>Local councils will have enhanced investigation powers from December 2025.</li>
</ul>

<h2>What Landlords Should Do NOW</h2>
<ol>
<li><strong>Review your tenancy agreements:</strong> Remove any fixed-term clauses, break clauses, or Section 21 references. Update to rolling periodic tenancy format.</li>
<li><strong>Update your rent increase process:</strong> Ensure you follow Section 13 procedure only. Remove any rent review clauses.</li>
<li><strong>Prepare Section 8 evidence:</strong> Start documenting rent arrears, anti-social behaviour, or other issues carefully — you will need evidence for any future possession claims.</li>
<li><strong>Get your compliance in order:</strong> Ensure all certificates (gas safety, EICR, EPC, smoke/CO alarms) are current. Non-compliance weakens your position in any tribunal.</li>
<li><strong>Budget for the PRS Database fee:</strong> Registration fees have not been confirmed but are expected to be modest.</li>
<li><strong>Review pet policies:</strong> Prepare a standard pet consent process with insurance requirements.</li>
<li><strong>Check your properties against the Decent Homes Standard:</strong> Address any repair issues, damp, or safety concerns proactively.</li>
</ol>

<h2>Key Dates</h2>
<table style="width:100%;border-collapse:collapse;">
<tr style="border-bottom:1px solid #e5e7eb;"><th style="text-align:left;padding:8px;">Date</th><th style="text-align:left;padding:8px;">Change</th></tr>
<tr style="border-bottom:1px solid #e5e7eb;"><td style="padding:8px;">27 Oct 2025</td><td style="padding:8px;">Royal Assent</td></tr>
<tr style="border-bottom:1px solid #e5e7eb;"><td style="padding:8px;">Dec 2025</td><td style="padding:8px;">Enhanced council investigation powers</td></tr>
<tr style="border-bottom:1px solid #e5e7eb;"><td style="padding:8px;">1 May 2026</td><td style="padding:8px;">Section 21 abolished, new tenancy regime begins</td></tr>
<tr><td style="padding:8px;">Late 2026</td><td style="padding:8px;">PRS Database launches</td></tr>
</table>

<h2>Stay Ahead With LandlordShield</h2>
<p>LandlordShield's Renters' Rights compliance checklist tracks every action you need to take before 1 May 2026. Get automated reminders, template documents, and a compliance score across all three regulatory pillars. <a href="/signup">Start free today</a>.</p>
`,
  },
  {
    slug: 'making-tax-digital-landlords-2026',
    title: 'Making Tax Digital for Landlords: Complete 2026 Guide',
    description: 'MTD for Income Tax launches April 2026. Who is affected, what you need to do, and how to prepare — the complete landlord guide.',
    author: 'LandlordShield Team',
    publishedAt: '2026-03-03',
    category: 'tax',
    tags: ['making tax digital', 'MTD', 'HMRC', 'quarterly returns', 'landlord tax'],
    readTime: '9 min read',
    featured: true,
    content: `
<p>Making Tax Digital for Income Tax Self Assessment (MTD ITSA) is HMRC's initiative to digitise the UK tax system. For landlords, this means a fundamental change to how you report rental income — shifting from annual Self Assessment tax returns to <strong>quarterly digital submissions</strong>. The first cohort launches <strong>6 April 2026</strong>.</p>

<h2>Who Is Affected and When?</h2>
<p>MTD ITSA applies to individuals with qualifying income (including self-employment and property income) above certain thresholds:</p>
<table style="width:100%;border-collapse:collapse;">
<tr style="border-bottom:1px solid #e5e7eb;"><th style="text-align:left;padding:8px;">Start Date</th><th style="text-align:left;padding:8px;">Threshold</th><th style="text-align:left;padding:8px;">Estimated Landlords Affected</th></tr>
<tr style="border-bottom:1px solid #e5e7eb;"><td style="padding:8px;">6 April 2026</td><td style="padding:8px;">Gross income over £50,000</td><td style="padding:8px;">~780,000</td></tr>
<tr style="border-bottom:1px solid #e5e7eb;"><td style="padding:8px;">6 April 2027</td><td style="padding:8px;">Gross income over £30,000</td><td style="padding:8px;">~970,000 additional</td></tr>
<tr><td style="padding:8px;">6 April 2028</td><td style="padding:8px;">Gross income over £20,000</td><td style="padding:8px;">Further expansion</td></tr>
</table>
<p><strong>Important:</strong> The threshold is based on <strong>gross income</strong> (total rental income before expenses), not profit. If you receive £50,000 or more in combined rental and self-employment income, you are in the first wave even if your net profit is much lower.</p>

<h2>What Does MTD Require?</h2>
<h3>Quarterly Updates</h3>
<p>Instead of one annual Self Assessment, you must submit <strong>four quarterly updates</strong> to HMRC through compatible software:</p>
<ul>
<li><strong>Q1:</strong> 6 April – 5 July (due by 7 August)</li>
<li><strong>Q2:</strong> 6 July – 5 October (due by 7 November)</li>
<li><strong>Q3:</strong> 6 October – 5 January (due by 7 February)</li>
<li><strong>Q4:</strong> 6 January – 5 April (due by 7 May)</li>
</ul>
<p>Each quarterly update summarises your rental income and expenses for that period.</p>

<h3>End of Period Statement (EOPS)</h3>
<p>After the fourth quarter, you submit an End of Period Statement confirming the figures for the full tax year. This replaces the property pages of your Self Assessment return.</p>

<h3>Final Declaration</h3>
<p>A Final Declaration (replacing the Self Assessment tax return) confirms your total income across all sources and calculates your tax liability. Deadline: 31 January following the tax year.</p>

<h2>Compatible Software</h2>
<p>You <strong>must</strong> use HMRC-recognised MTD-compatible software to keep digital records and submit quarterly updates. You cannot use spreadsheets alone (though some software can import from spreadsheets).</p>
<p>HMRC maintains a list of compatible software. Popular options for landlords include:</p>
<ul>
<li>Landlord Vision</li>
<li>FreeAgent</li>
<li>Xero</li>
<li>QuickBooks</li>
<li>Hammock</li>
<li>GoSimpleTax</li>
</ul>
<p><strong>Note:</strong> LandlordShield helps you track MTD deadlines, prepare your records, and monitor your threshold — but it is not MTD submission software. We recommend using LandlordShield alongside a compatible submission tool.</p>

<h2>What Records Must You Keep Digitally?</h2>
<ul>
<li>Rental income amounts and dates</li>
<li>Allowable expenses (repairs, insurance, management fees, mortgage interest etc.)</li>
<li>Details of each property (address, ownership)</li>
<li>Receipts and invoices (digital copies accepted)</li>
</ul>
<p>Records must be kept for at least <strong>5 years</strong> after the 31 January submission deadline.</p>

<h2>Penalties for Non-Compliance</h2>
<p>HMRC's new points-based penalty system applies:</p>
<ul>
<li><strong>Late submission:</strong> You receive a penalty point for each late quarterly update. After reaching a threshold (currently 4 points for quarterly obligations), you receive a £200 penalty for each subsequent late submission.</li>
<li><strong>Late payment:</strong> Interest charges from day one. Additional penalties at 30 days (2% of tax owed), 6 months (additional 2%), and 12 months (additional 2%).</li>
<li><strong>Inaccurate returns:</strong> Penalties of 0–100% of the understated tax, depending on whether the error was careless, deliberate, or concealed.</li>
</ul>

<h2>How to Prepare NOW</h2>
<ol>
<li><strong>Calculate your gross income:</strong> Add up all your rental income across all properties. If it exceeds £50,000 (or will by April 2026), you are in the first wave.</li>
<li><strong>Choose compatible software:</strong> Research and sign up for an HMRC-recognised tool. Start using it now to build familiarity before April 2026.</li>
<li><strong>Digitise your records:</strong> Move from paper receipts and spreadsheets to digital record-keeping.</li>
<li><strong>Set up quarterly reminders:</strong> Mark the four quarterly deadlines in your calendar.</li>
<li><strong>Speak to your accountant:</strong> Discuss your MTD obligations and how your accountant can access your software.</li>
<li><strong>Register for MTD:</strong> You will be able to register through your Government Gateway account. HMRC will send letters to those in the first cohort.</li>
</ol>

<h2>Track Your MTD Readiness</h2>
<p>LandlordShield's MTD tracker monitors your income against the threshold, tracks quarterly deadlines, and gives you a readiness score. Combined with certificate tracking and Renters' Rights compliance, it is the only dashboard covering all three 2026 regulatory pillars. <a href="/signup">Start free with 1 property</a>.</p>
`,
  },
];

export function getBlogPost(slug: string): BlogPost | undefined {
  return blogPosts.find((p) => p.slug === slug);
}

export function getAllBlogPosts(): BlogPost[] {
  return [...blogPosts].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
}
