'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileText, Download, Loader2, Lock, AlertTriangle, Building2, BarChart3, PoundSterling } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/hooks/useAuth';

const reports = [
  {
    id: 'portfolio-compliance',
    title: 'Portfolio Compliance Report',
    description: 'Overall compliance score, per-property breakdown, outstanding actions, upcoming deadlines, EPC overview.',
    icon: BarChart3,
    plan: 'pro',
    format: 'PDF',
  },
  {
    id: 'property-compliance',
    title: 'Property Compliance Report',
    description: 'Detailed compliance status for a single property across all three pillars with certificate status.',
    icon: Building2,
    plan: 'pro',
    format: 'PDF',
  },
  {
    id: 'annual-summary',
    title: 'Annual Landlord Summary',
    description: 'Total rental income, expenses by category, net profit/loss, MTD status, EPC improvements, compliance year-on-year.',
    icon: PoundSterling,
    plan: 'portfolio',
    format: 'PDF',
  },
  {
    id: 'data-export',
    title: 'Data Export',
    description: 'Export all your property, tenancy, financial, and compliance data in CSV format for your accountant.',
    icon: FileText,
    plan: 'pro',
    format: 'CSV',
  },
];

interface Property {
  id: string;
  address_line1: string;
  city: string;
  postcode: string;
  [key: string]: unknown;
}

export default function ReportsPage() {
  const { user } = useAuth();
  const [generating, setGenerating] = useState<string | null>(null);
  const [selectedProperty, setSelectedProperty] = useState<string>('all');
  const [properties, setProperties] = useState<Property[]>([]);

  // Mock user plan
  const userPlan = 'pro';

  // Fetch user properties for the property selector
  useEffect(() => {
    if (!user) return;
    const supabase = createClient();
    supabase
      .from('properties')
      .select('id, address_line1, city, postcode')
      .eq('user_id', user.id)
      .then(({ data }) => {
        if (data) setProperties(data as Property[]);
      });
  }, [user]);

  // Helper: trigger a file download in the browser
  const downloadFile = (content: string, filename: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Helper: convert array of objects to CSV
  const toCsv = (rows: Record<string, unknown>[]): string => {
    if (!rows || rows.length === 0) return 'No data\n';
    const keys = Object.keys(rows[0]).filter(
      (k) => typeof rows[0][k] !== 'object' || rows[0][k] === null
    );
    const header = keys.join(',');
    const body = rows
      .map((row) =>
        keys
          .map((k) => {
            const val = row[k];
            if (val === null || val === undefined) return '';
            const str = String(val);
            if (str.includes(',') || str.includes('"') || str.includes('\n')) {
              return `"${str.replace(/"/g, '""')}"`;
            }
            return str;
          })
          .join(',')
      )
      .join('\n');
    return `${header}\n${body}\n`;
  };

  const generatePortfolioCompliance = async () => {
    if (!user) return;
    const supabase = createClient();
    const today = new Date().toISOString().slice(0, 10);

    const [propertiesRes, certificatesRes, checklistRes] = await Promise.all([
      supabase.from('properties').select('*').eq('user_id', user.id),
      supabase.from('certificates').select('*, properties!inner(user_id, address_line1, city, postcode)').eq('properties.user_id', user.id),
      supabase.from('checklist_items').select('*').eq('user_id', user.id),
    ]);

    const props = propertiesRes.data || [];
    const certs = certificatesRes.data || [];
    const checklist = checklistRes.data || [];

    const totalChecklist = checklist.length;
    const completedChecklist = checklist.filter((c: Record<string, unknown>) => c.is_completed).length;
    const complianceScore = totalChecklist > 0 ? Math.round((completedChecklist / totalChecklist) * 100) : 0;

    const expiredCerts = certs.filter((c: Record<string, unknown>) => c.expiry_date && String(c.expiry_date) < today).length;
    const validCerts = certs.filter((c: Record<string, unknown>) => c.expiry_date && String(c.expiry_date) >= today).length;

    let report = `PORTFOLIO COMPLIANCE REPORT\n`;
    report += `Generated: ${new Date().toLocaleDateString('en-GB')}\n`;
    report += `${'='.repeat(50)}\n\n`;
    report += `SUMMARY\n`;
    report += `Total Properties: ${props.length}\n`;
    report += `Overall Compliance Score: ${complianceScore}% (${completedChecklist}/${totalChecklist} items completed)\n`;
    report += `Valid Certificates: ${validCerts}\n`;
    report += `Expired Certificates: ${expiredCerts}\n\n`;

    report += `PROPERTY BREAKDOWN\n`;
    report += `${'-'.repeat(50)}\n`;
    for (const prop of props) {
      const p = prop as Record<string, unknown>;
      const propCerts = certs.filter((c: Record<string, unknown>) => c.property_id === p.id);
      const propChecklist = checklist.filter((c: Record<string, unknown>) => c.property_id === p.id);
      const propCompleted = propChecklist.filter((c: Record<string, unknown>) => c.is_completed).length;
      const propScore = propChecklist.length > 0 ? Math.round((propCompleted / propChecklist.length) * 100) : 0;
      report += `\n${p.address_line1}, ${p.city} ${p.postcode}\n`;
      report += `  Compliance: ${propScore}% | Certificates: ${propCerts.length} | `;
      const propExpired = propCerts.filter((c: Record<string, unknown>) => c.expiry_date && String(c.expiry_date) < today).length;
      report += `Expired: ${propExpired}\n`;
    }

    report += `\n${'='.repeat(50)}\n`;
    report += `OUTSTANDING ACTIONS\n`;
    const outstanding = checklist.filter((c: Record<string, unknown>) => !c.is_completed);
    if (outstanding.length === 0) {
      report += `All checklist items completed.\n`;
    } else {
      for (const item of outstanding) {
        const i = item as Record<string, unknown>;
        report += `- [${i.pillar}] ${i.title}${i.due_date ? ' (Due: ' + i.due_date + ')' : ''}\n`;
      }
    }

    downloadFile(report, `portfolio-compliance-${today}.txt`, 'text/plain;charset=utf-8;');
  };

  const generatePropertyCompliance = async () => {
    if (!user) return;
    const supabase = createClient();
    const today = new Date().toISOString().slice(0, 10);

    // Build the property filter
    let propertyFilter = supabase.from('properties').select('*').eq('user_id', user.id);
    if (selectedProperty !== 'all') {
      propertyFilter = propertyFilter.eq('id', selectedProperty);
    }

    const { data: props } = await propertyFilter;
    if (!props || props.length === 0) {
      alert('No property found. Please select a property first.');
      return;
    }

    const propIds = props.map((p: Record<string, unknown>) => p.id as string);

    const [certificatesRes, tenanciesRes, epcRes, checklistRes] = await Promise.all([
      supabase.from('certificates').select('*').in('property_id', propIds),
      supabase.from('tenancies').select('*').in('property_id', propIds),
      supabase.from('epc_records').select('*').in('property_id', propIds),
      supabase.from('checklist_items').select('*').eq('user_id', user.id).in('property_id', propIds),
    ]);

    const certs = certificatesRes.data || [];
    const tenancies = tenanciesRes.data || [];
    const epcs = epcRes.data || [];
    const checklist = checklistRes.data || [];

    let report = `PROPERTY COMPLIANCE REPORT\n`;
    report += `Generated: ${new Date().toLocaleDateString('en-GB')}\n`;
    report += `${'='.repeat(50)}\n\n`;

    for (const prop of props) {
      const p = prop as Record<string, unknown>;
      report += `PROPERTY: ${p.address_line1}, ${p.city} ${p.postcode}\n`;
      report += `Type: ${p.property_type || 'N/A'} | Bedrooms: ${p.bedrooms || 'N/A'} | Rent: ${p.monthly_rent ? '\u00A3' + p.monthly_rent + '/mo' : 'N/A'}\n`;
      report += `${'-'.repeat(50)}\n\n`;

      // Certificates
      const propCerts = certs.filter((c: Record<string, unknown>) => c.property_id === p.id);
      report += `CERTIFICATES (${propCerts.length})\n`;
      if (propCerts.length === 0) {
        report += `  No certificates recorded.\n`;
      } else {
        for (const cert of propCerts) {
          const c = cert as Record<string, unknown>;
          const expired = c.expiry_date && String(c.expiry_date) < today;
          report += `  ${c.cert_type}: ${expired ? 'EXPIRED' : 'Valid'} (Expires: ${c.expiry_date || 'N/A'})\n`;
        }
      }

      // EPC
      const propEpcs = epcs.filter((e: Record<string, unknown>) => e.property_id === p.id);
      report += `\nEPC RECORDS (${propEpcs.length})\n`;
      for (const epc of propEpcs) {
        const e = epc as Record<string, unknown>;
        report += `  Rating: ${e.current_rating || 'N/A'} (Score: ${e.current_score || 'N/A'}) | Potential: ${e.potential_rating || 'N/A'} | Expires: ${e.expiry_date || 'N/A'}\n`;
      }

      // Tenancies
      const propTenancies = tenancies.filter((t: Record<string, unknown>) => t.property_id === p.id);
      report += `\nTENANCIES (${propTenancies.length})\n`;
      for (const ten of propTenancies) {
        const t = ten as Record<string, unknown>;
        report += `  ${t.tenant_name} | ${t.tenancy_type || 'N/A'} | ${t.start_date || '?'} to ${t.end_date || 'Rolling'} | Status: ${t.status}\n`;
      }

      // Checklist
      const propChecklist = checklist.filter((c: Record<string, unknown>) => c.property_id === p.id);
      const completed = propChecklist.filter((c: Record<string, unknown>) => c.is_completed).length;
      report += `\nCHECKLIST: ${completed}/${propChecklist.length} items completed\n`;
      const pending = propChecklist.filter((c: Record<string, unknown>) => !c.is_completed);
      for (const item of pending) {
        const i = item as Record<string, unknown>;
        report += `  [ ] ${i.title} (${i.pillar})${i.due_date ? ' - Due: ' + i.due_date : ''}\n`;
      }

      report += `\n${'='.repeat(50)}\n\n`;
    }

    const label = selectedProperty === 'all' ? 'all-properties' : 'property';
    downloadFile(report, `property-compliance-${label}-${today}.txt`, 'text/plain;charset=utf-8;');
  };

  const generateAnnualSummary = async () => {
    if (!user) return;
    const supabase = createClient();
    const today = new Date().toISOString().slice(0, 10);
    const currentYear = new Date().getFullYear();
    const yearStart = `${currentYear}-01-01`;
    const yearEnd = `${currentYear}-12-31`;

    const [transactionsRes, propertiesRes, mtdRes] = await Promise.all([
      supabase.from('transactions').select('*').eq('user_id', user.id).gte('date', yearStart).lte('date', yearEnd),
      supabase.from('properties').select('*').eq('user_id', user.id),
      supabase.from('mtd_records').select('*').eq('user_id', user.id).eq('tax_year', `${currentYear}/${currentYear + 1}`),
    ]);

    const transactions = transactionsRes.data || [];
    const props = propertiesRes.data || [];
    const mtdRecords = mtdRes.data || [];

    const income = transactions
      .filter((t: Record<string, unknown>) => t.type === 'income')
      .reduce((sum: number, t: Record<string, unknown>) => sum + Number(t.amount || 0), 0);

    const expenses = transactions
      .filter((t: Record<string, unknown>) => t.type === 'expense')
      .reduce((sum: number, t: Record<string, unknown>) => sum + Number(t.amount || 0), 0);

    const netProfit = income - expenses;

    // Group expenses by category
    const expensesByCategory: Record<string, number> = {};
    transactions
      .filter((t: Record<string, unknown>) => t.type === 'expense')
      .forEach((t: Record<string, unknown>) => {
        const cat = String(t.category || 'Uncategorised');
        expensesByCategory[cat] = (expensesByCategory[cat] || 0) + Number(t.amount || 0);
      });

    let report = `ANNUAL LANDLORD SUMMARY - ${currentYear}\n`;
    report += `Generated: ${new Date().toLocaleDateString('en-GB')}\n`;
    report += `${'='.repeat(50)}\n\n`;

    report += `PORTFOLIO OVERVIEW\n`;
    report += `Total Properties: ${props.length}\n`;
    report += `Total Transactions: ${transactions.length}\n\n`;

    report += `FINANCIAL SUMMARY\n`;
    report += `${'-'.repeat(50)}\n`;
    report += `Total Income:   \u00A3${income.toFixed(2)}\n`;
    report += `Total Expenses: \u00A3${expenses.toFixed(2)}\n`;
    report += `Net Profit:     \u00A3${netProfit.toFixed(2)}\n\n`;

    report += `EXPENSES BY CATEGORY\n`;
    report += `${'-'.repeat(50)}\n`;
    if (Object.keys(expensesByCategory).length === 0) {
      report += `No expenses recorded.\n`;
    } else {
      for (const [cat, amount] of Object.entries(expensesByCategory)) {
        report += `  ${cat}: \u00A3${amount.toFixed(2)}\n`;
      }
    }

    report += `\nMTD STATUS\n`;
    report += `${'-'.repeat(50)}\n`;
    if (mtdRecords.length === 0) {
      report += `No MTD records for this tax year.\n`;
    } else {
      for (const rec of mtdRecords) {
        const r = rec as Record<string, unknown>;
        report += `  Q${r.quarter}: ${r.status} | Income: \u00A3${Number(r.total_income || 0).toFixed(2)} | Expenses: \u00A3${Number(r.total_expenses || 0).toFixed(2)} | Deadline: ${r.submission_deadline || 'N/A'}\n`;
      }
    }

    report += `\nPROPERTY INCOME BREAKDOWN\n`;
    report += `${'-'.repeat(50)}\n`;
    for (const prop of props) {
      const p = prop as Record<string, unknown>;
      const propIncome = transactions
        .filter((t: Record<string, unknown>) => t.property_id === p.id && t.type === 'income')
        .reduce((sum: number, t: Record<string, unknown>) => sum + Number(t.amount || 0), 0);
      const propExpenses = transactions
        .filter((t: Record<string, unknown>) => t.property_id === p.id && t.type === 'expense')
        .reduce((sum: number, t: Record<string, unknown>) => sum + Number(t.amount || 0), 0);
      report += `  ${p.address_line1}, ${p.city}: Income \u00A3${propIncome.toFixed(2)} | Expenses \u00A3${propExpenses.toFixed(2)} | Net \u00A3${(propIncome - propExpenses).toFixed(2)}\n`;
    }

    downloadFile(report, `annual-summary-${currentYear}-${today}.txt`, 'text/plain;charset=utf-8;');
  };

  const generateDataExport = async () => {
    if (!user) return;
    const supabase = createClient();
    const today = new Date().toISOString().slice(0, 10);

    const [propertiesRes, tenanciesRes, certificatesRes, transactionsRes, epcRes, checklistRes] = await Promise.all([
      supabase.from('properties').select('*').eq('user_id', user.id),
      supabase.from('tenancies').select('*, properties!inner(user_id)').eq('properties.user_id', user.id),
      supabase.from('certificates').select('*, properties!inner(user_id)').eq('properties.user_id', user.id),
      supabase.from('transactions').select('*').eq('user_id', user.id),
      supabase.from('epc_records').select('*, properties!inner(user_id)').eq('properties.user_id', user.id),
      supabase.from('checklist_items').select('*').eq('user_id', user.id),
    ]);

    let csv = `--- Properties ---\n`;
    csv += toCsv(propertiesRes.data as Record<string, unknown>[] || []);
    csv += `\n--- Tenancies ---\n`;
    csv += toCsv(tenanciesRes.data as Record<string, unknown>[] || []);
    csv += `\n--- Certificates ---\n`;
    csv += toCsv(certificatesRes.data as Record<string, unknown>[] || []);
    csv += `\n--- EPC Records ---\n`;
    csv += toCsv(epcRes.data as Record<string, unknown>[] || []);
    csv += `\n--- Transactions ---\n`;
    csv += toCsv(transactionsRes.data as Record<string, unknown>[] || []);
    csv += `\n--- Checklist Items ---\n`;
    csv += toCsv(checklistRes.data as Record<string, unknown>[] || []);

    downloadFile(csv, `landlordshield-full-export-${today}.csv`, 'text/csv;charset=utf-8;');
  };

  const handleGenerate = async (reportId: string) => {
    setGenerating(reportId);
    try {
      switch (reportId) {
        case 'portfolio-compliance':
          await generatePortfolioCompliance();
          break;
        case 'property-compliance':
          await generatePropertyCompliance();
          break;
        case 'annual-summary':
          await generateAnnualSummary();
          break;
        case 'data-export':
          await generateDataExport();
          break;
        default:
          alert('Unknown report type.');
      }
    } catch (err) {
      console.error('Report generation failed:', err);
      alert('Failed to generate report. Please try again.');
    } finally {
      setGenerating(null);
    }
  };

  const canAccess = (requiredPlan: string) => {
    const planOrder = ['free', 'pro', 'portfolio'];
    return planOrder.indexOf(userPlan) >= planOrder.indexOf(requiredPlan);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#1E3A5F]">Compliance Reports</h1>
        <p className="text-gray-500 mt-1">Generate downloadable reports for your records and accountant.</p>
      </div>

      {/* Property selector for property-specific reports */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <label className="text-sm font-medium text-gray-700">Select property:</label>
            <Select value={selectedProperty} onValueChange={setSelectedProperty}>
              <SelectTrigger className="w-[300px]">
                <SelectValue placeholder="Select a property" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Properties (Portfolio)</SelectItem>
                {properties.map((prop) => (
                  <SelectItem key={prop.id} value={prop.id}>
                    {prop.address_line1}, {prop.city} {prop.postcode}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Report cards */}
      <div className="grid md:grid-cols-2 gap-6">
        {reports.map((report) => {
          const accessible = canAccess(report.plan);
          const isGenerating = generating === report.id;

          return (
            <Card key={report.id} className={!accessible ? 'opacity-75' : ''}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-[#1E3A5F]/10 flex items-center justify-center">
                      <report.icon className="h-5 w-5 text-[#1E3A5F]" />
                    </div>
                    <div>
                      <CardTitle className="text-base">{report.title}</CardTitle>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">{report.format}</Badge>
                        {report.plan !== 'free' && (
                          <Badge variant="secondary" className="text-xs capitalize">{report.plan} plan</Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <CardDescription className="mt-2">{report.description}</CardDescription>
              </CardHeader>
              <CardContent>
                {accessible ? (
                  <Button
                    onClick={() => handleGenerate(report.id)}
                    disabled={isGenerating}
                    className="w-full bg-[#1E3A5F] hover:bg-[#2D4F7A]"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Download className="h-4 w-4 mr-2" />
                        Generate Report
                      </>
                    )}
                  </Button>
                ) : (
                  <Button disabled className="w-full" variant="outline">
                    <Lock className="h-4 w-4 mr-2" />
                    Upgrade to {report.plan === 'portfolio' ? 'Portfolio' : 'Pro'} Plan
                  </Button>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Disclaimer */}
      <div className="flex items-start gap-2 p-4 bg-amber-50 rounded-lg border border-amber-200">
        <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
        <p className="text-xs text-amber-800">
          Reports are generated based on the data you have entered into LandlordShield.
          This tool provides guidance only. It is not legal, tax, or financial advice.
          Always consult a qualified professional for advice specific to your situation.
        </p>
      </div>
    </div>
  );
}
