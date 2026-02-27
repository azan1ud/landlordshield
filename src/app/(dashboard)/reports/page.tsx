'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileText, Download, Loader2, Lock, AlertTriangle, Building2, BarChart3, PoundSterling } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import jsPDF from 'jspdf';

// ── PDF helper utilities ──────────────────────────────────────────────
const BRAND_COLOR: [number, number, number] = [30, 58, 95]; // #1E3A5F
const ACCENT_LIGHT: [number, number, number] = [235, 241, 248]; // light blue-grey for alternate rows
const WHITE: [number, number, number] = [255, 255, 255];
const BLACK: [number, number, number] = [0, 0, 0];
const RED: [number, number, number] = [220, 53, 69];
const GREEN: [number, number, number] = [40, 167, 69];
const GRAY: [number, number, number] = [100, 100, 100];
const PAGE_WIDTH = 210; // A4 mm
const MARGIN = 20;
const CONTENT_WIDTH = PAGE_WIDTH - 2 * MARGIN;

/** Add a branded header to the current page */
function addHeader(doc: jsPDF, title: string, subtitle?: string) {
  // Header bar
  doc.setFillColor(...BRAND_COLOR);
  doc.rect(0, 0, PAGE_WIDTH, 36, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.setTextColor(...WHITE);
  doc.text('LandlordShield', MARGIN, 16);

  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.text(title, MARGIN, 26);

  if (subtitle) {
    doc.setFontSize(9);
    doc.text(subtitle, MARGIN, 32);
  }

  // Reset text color
  doc.setTextColor(...BLACK);
}

/** Add page footer with page number and generation date */
function addFooter(doc: jsPDF, dateStr: string) {
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(...GRAY);
    doc.text(`Generated ${dateStr} | LandlordShield`, MARGIN, 287);
    doc.text(`Page ${i} of ${pageCount}`, PAGE_WIDTH - MARGIN, 287, { align: 'right' });
  }
}

/**
 * Draw a simple table. Returns the Y position after the table.
 * Automatically adds new pages when content exceeds page height.
 */
function drawTable(
  doc: jsPDF,
  startY: number,
  headers: string[],
  rows: string[][],
  colWidths: number[],
): number {
  const ROW_HEIGHT = 7;
  const CELL_PADDING = 2;
  const MAX_Y = 275; // leave room for footer
  let y = startY;

  // Draw header row
  doc.setFillColor(...BRAND_COLOR);
  doc.rect(MARGIN, y, CONTENT_WIDTH, ROW_HEIGHT, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(...WHITE);
  let x = MARGIN;
  headers.forEach((header, i) => {
    doc.text(header, x + CELL_PADDING, y + 5);
    x += colWidths[i];
  });
  y += ROW_HEIGHT;

  // Draw data rows
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  rows.forEach((row, rowIdx) => {
    if (y + ROW_HEIGHT > MAX_Y) {
      doc.addPage();
      addHeader(doc, '(continued)');
      y = 44;
      // Redraw header on new page
      doc.setFillColor(...BRAND_COLOR);
      doc.rect(MARGIN, y, CONTENT_WIDTH, ROW_HEIGHT, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(...WHITE);
      let hx = MARGIN;
      headers.forEach((header, i) => {
        doc.text(header, hx + CELL_PADDING, y + 5);
        hx += colWidths[i];
      });
      y += ROW_HEIGHT;
      doc.setFont('helvetica', 'normal');
    }

    // Alternate row background
    if (rowIdx % 2 === 0) {
      doc.setFillColor(...ACCENT_LIGHT);
      doc.rect(MARGIN, y, CONTENT_WIDTH, ROW_HEIGHT, 'F');
    }

    doc.setTextColor(...BLACK);
    let rx = MARGIN;
    row.forEach((cell, i) => {
      // Truncate text to fit column width
      const maxChars = Math.floor((colWidths[i] - 2 * CELL_PADDING) / 1.8);
      const text = cell.length > maxChars ? cell.substring(0, maxChars - 1) + '\u2026' : cell;
      doc.text(text, rx + CELL_PADDING, y + 5);
      rx += colWidths[i];
    });
    y += ROW_HEIGHT;
  });

  // Bottom border
  doc.setDrawColor(...BRAND_COLOR);
  doc.setLineWidth(0.3);
  doc.line(MARGIN, y, MARGIN + CONTENT_WIDTH, y);

  return y + 4;
}

/** Draw a section title. Returns Y after title. */
function sectionTitle(doc: jsPDF, y: number, text: string): number {
  if (y > 265) {
    doc.addPage();
    addHeader(doc, '(continued)');
    y = 44;
  }
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(...BRAND_COLOR);
  doc.text(text, MARGIN, y);
  doc.setDrawColor(...BRAND_COLOR);
  doc.setLineWidth(0.5);
  doc.line(MARGIN, y + 1.5, MARGIN + CONTENT_WIDTH, y + 1.5);
  return y + 8;
}

/** Draw a key-value stat line. Returns Y after line. */
function statLine(doc: jsPDF, y: number, label: string, value: string, valueColor?: [number, number, number]): number {
  if (y > 275) {
    doc.addPage();
    addHeader(doc, '(continued)');
    y = 44;
  }
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(...GRAY);
  doc.text(label, MARGIN, y);
  doc.setTextColor(...(valueColor || BLACK));
  doc.setFont('helvetica', 'bold');
  doc.text(value, MARGIN + 65, y);
  return y + 6;
}

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
    const dateLabel = new Date().toLocaleDateString('en-GB');

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

    // ── Build PDF ──
    const doc = new jsPDF();
    addHeader(doc, 'Portfolio Compliance Report', `Generated: ${dateLabel}`);

    // Summary section
    let y = sectionTitle(doc, 46, 'Summary');
    y = statLine(doc, y, 'Total Properties:', String(props.length));
    y = statLine(doc, y, 'Compliance Score:', `${complianceScore}%  (${completedChecklist}/${totalChecklist} items)`, complianceScore >= 80 ? GREEN : complianceScore >= 50 ? [200, 150, 0] : RED);
    y = statLine(doc, y, 'Valid Certificates:', String(validCerts), GREEN);
    y = statLine(doc, y, 'Expired Certificates:', String(expiredCerts), expiredCerts > 0 ? RED : GREEN);
    y += 4;

    // Property breakdown table
    y = sectionTitle(doc, y, 'Property Breakdown');
    const propHeaders = ['Property', 'City', 'Postcode', 'Compliance', 'Certs', 'Expired'];
    const propColWidths = [55, 30, 25, 25, 20, 15];
    const propRows: string[][] = [];
    for (const prop of props) {
      const p = prop as Record<string, unknown>;
      const propCerts = certs.filter((c: Record<string, unknown>) => c.property_id === p.id);
      const propChecklist = checklist.filter((c: Record<string, unknown>) => c.property_id === p.id);
      const propCompleted = propChecklist.filter((c: Record<string, unknown>) => c.is_completed).length;
      const propScore = propChecklist.length > 0 ? Math.round((propCompleted / propChecklist.length) * 100) : 0;
      const propExpired = propCerts.filter((c: Record<string, unknown>) => c.expiry_date && String(c.expiry_date) < today).length;
      propRows.push([
        String(p.address_line1 || ''),
        String(p.city || ''),
        String(p.postcode || ''),
        `${propScore}%`,
        String(propCerts.length),
        String(propExpired),
      ]);
    }
    y = drawTable(doc, y, propHeaders, propRows, propColWidths);
    y += 4;

    // Outstanding actions
    y = sectionTitle(doc, y, 'Outstanding Actions');
    const outstanding = checklist.filter((c: Record<string, unknown>) => !c.is_completed);
    if (outstanding.length === 0) {
      doc.setFont('helvetica', 'italic');
      doc.setFontSize(10);
      doc.setTextColor(...GREEN);
      doc.text('All checklist items completed.', MARGIN, y);
      y += 6;
    } else {
      const actionHeaders = ['Pillar', 'Action Item', 'Due Date'];
      const actionColWidths = [35, 100, 35];
      const actionRows: string[][] = outstanding.map((item) => {
        const i = item as Record<string, unknown>;
        return [
          String(i.pillar || 'N/A'),
          String(i.title || ''),
          i.due_date ? String(i.due_date) : 'No date',
        ];
      });
      y = drawTable(doc, y, actionHeaders, actionRows, actionColWidths);
      y += 4;
    }

    // Upcoming deadlines (certificates expiring in next 90 days)
    const in90Days = new Date();
    in90Days.setDate(in90Days.getDate() + 90);
    const upcoming = certs.filter((c: Record<string, unknown>) => {
      const exp = String(c.expiry_date || '');
      return exp >= today && exp <= in90Days.toISOString().slice(0, 10);
    });
    if (upcoming.length > 0) {
      y = sectionTitle(doc, y, 'Upcoming Deadlines (Next 90 Days)');
      const dlHeaders = ['Certificate', 'Property', 'Expiry Date'];
      const dlColWidths = [45, 85, 40];
      const dlRows: string[][] = upcoming.map((c) => {
        const cert = c as Record<string, unknown>;
        const propInfo = cert.properties as Record<string, unknown> | undefined;
        return [
          String(cert.cert_type || 'N/A'),
          propInfo ? `${propInfo.address_line1}, ${propInfo.city}` : 'N/A',
          String(cert.expiry_date || 'N/A'),
        ];
      });
      y = drawTable(doc, y, dlHeaders, dlRows, dlColWidths);
    }

    addFooter(doc, dateLabel);
    doc.save(`portfolio-compliance-${today}.pdf`);
  };

  const generatePropertyCompliance = async () => {
    if (!user) return;
    const supabase = createClient();
    const today = new Date().toISOString().slice(0, 10);
    const dateLabel = new Date().toLocaleDateString('en-GB');

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

    // ── Build PDF ──
    const doc = new jsPDF();
    const propLabel = selectedProperty === 'all' ? 'All Properties' : `${(props[0] as Record<string, unknown>).address_line1}`;
    addHeader(doc, 'Property Compliance Report', `Generated: ${dateLabel} | ${propLabel}`);

    let y = 46;
    let isFirstProp = true;

    for (const prop of props) {
      const p = prop as Record<string, unknown>;

      if (!isFirstProp) {
        doc.addPage();
        addHeader(doc, 'Property Compliance Report', `Generated: ${dateLabel}`);
        y = 46;
      }
      isFirstProp = false;

      // Property details
      y = sectionTitle(doc, y, `${p.address_line1}, ${p.city} ${p.postcode}`);
      y = statLine(doc, y, 'Property Type:', String(p.property_type || 'N/A'));
      y = statLine(doc, y, 'Bedrooms:', String(p.bedrooms || 'N/A'));
      y = statLine(doc, y, 'Monthly Rent:', p.monthly_rent ? `\u00A3${p.monthly_rent}` : 'N/A');
      y += 2;

      // Compliance pillars summary
      const propChecklist = checklist.filter((c: Record<string, unknown>) => c.property_id === p.id);
      const pillarNames = ['MTD', "Renters' Rights", 'EPC'];
      const pillarMap: Record<string, { total: number; completed: number }> = {};
      for (const item of propChecklist) {
        const i = item as Record<string, unknown>;
        const pillar = String(i.pillar || 'Other');
        if (!pillarMap[pillar]) pillarMap[pillar] = { total: 0, completed: 0 };
        pillarMap[pillar].total++;
        if (i.is_completed) pillarMap[pillar].completed++;
      }

      y = sectionTitle(doc, y, 'Compliance by Pillar');
      const pillarHeaders = ['Pillar', 'Completed', 'Total', 'Score'];
      const pillarColWidths = [55, 35, 35, 45];
      const pillarRows: string[][] = pillarNames.map((name) => {
        const data = pillarMap[name] || { total: 0, completed: 0 };
        const score = data.total > 0 ? Math.round((data.completed / data.total) * 100) : 0;
        return [name, String(data.completed), String(data.total), `${score}%`];
      });
      // Add "Other" pillars not in the standard list
      for (const [pillar, data] of Object.entries(pillarMap)) {
        if (!pillarNames.includes(pillar)) {
          const score = data.total > 0 ? Math.round((data.completed / data.total) * 100) : 0;
          pillarRows.push([pillar, String(data.completed), String(data.total), `${score}%`]);
        }
      }
      y = drawTable(doc, y, pillarHeaders, pillarRows, pillarColWidths);
      y += 4;

      // Certificates table
      const propCerts = certs.filter((c: Record<string, unknown>) => c.property_id === p.id);
      y = sectionTitle(doc, y, `Certificates (${propCerts.length})`);
      if (propCerts.length === 0) {
        doc.setFont('helvetica', 'italic');
        doc.setFontSize(10);
        doc.setTextColor(...GRAY);
        doc.text('No certificates recorded.', MARGIN, y);
        y += 6;
      } else {
        const certHeaders = ['Type', 'Status', 'Expiry Date'];
        const certColWidths = [60, 50, 60];
        const certRows: string[][] = propCerts.map((cert) => {
          const c = cert as Record<string, unknown>;
          const expired = c.expiry_date && String(c.expiry_date) < today;
          return [
            String(c.cert_type || 'N/A'),
            expired ? 'EXPIRED' : 'Valid',
            String(c.expiry_date || 'N/A'),
          ];
        });
        y = drawTable(doc, y, certHeaders, certRows, certColWidths);
        y += 4;
      }

      // EPC Records
      const propEpcs = epcs.filter((e: Record<string, unknown>) => e.property_id === p.id);
      if (propEpcs.length > 0) {
        y = sectionTitle(doc, y, `EPC Records (${propEpcs.length})`);
        const epcHeaders = ['Current Rating', 'Score', 'Potential', 'Expiry'];
        const epcColWidths = [45, 35, 45, 45];
        const epcRows: string[][] = propEpcs.map((epc) => {
          const e = epc as Record<string, unknown>;
          return [
            String(e.current_rating || 'N/A'),
            String(e.current_score || 'N/A'),
            String(e.potential_rating || 'N/A'),
            String(e.expiry_date || 'N/A'),
          ];
        });
        y = drawTable(doc, y, epcHeaders, epcRows, epcColWidths);
        y += 4;
      }

      // Tenancies
      const propTenancies = tenancies.filter((t: Record<string, unknown>) => t.property_id === p.id);
      if (propTenancies.length > 0) {
        y = sectionTitle(doc, y, `Tenancies (${propTenancies.length})`);
        const tenHeaders = ['Tenant', 'Type', 'Start', 'End', 'Status'];
        const tenColWidths = [40, 30, 30, 30, 40];
        const tenRows: string[][] = propTenancies.map((ten) => {
          const t = ten as Record<string, unknown>;
          return [
            String(t.tenant_name || 'N/A'),
            String(t.tenancy_type || 'N/A'),
            String(t.start_date || '?'),
            String(t.end_date || 'Rolling'),
            String(t.status || 'N/A'),
          ];
        });
        y = drawTable(doc, y, tenHeaders, tenRows, tenColWidths);
        y += 4;
      }

      // Pending checklist items
      const pending = propChecklist.filter((c: Record<string, unknown>) => !c.is_completed);
      if (pending.length > 0) {
        y = sectionTitle(doc, y, `Outstanding Actions (${pending.length})`);
        const pendHeaders = ['Pillar', 'Action', 'Due Date'];
        const pendColWidths = [35, 100, 35];
        const pendRows: string[][] = pending.map((item) => {
          const i = item as Record<string, unknown>;
          return [
            String(i.pillar || 'N/A'),
            String(i.title || ''),
            i.due_date ? String(i.due_date) : 'No date',
          ];
        });
        y = drawTable(doc, y, pendHeaders, pendRows, pendColWidths);
      }
    }

    addFooter(doc, dateLabel);
    const fileLabel = selectedProperty === 'all' ? 'all-properties' : 'property';
    doc.save(`property-compliance-${fileLabel}-${today}.pdf`);
  };

  const generateAnnualSummary = async () => {
    if (!user) return;
    const supabase = createClient();
    const today = new Date().toISOString().slice(0, 10);
    const dateLabel = new Date().toLocaleDateString('en-GB');
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

    // ── Build PDF ──
    const doc = new jsPDF();
    addHeader(doc, `Annual Landlord Summary - ${currentYear}`, `Generated: ${dateLabel} | Tax Year ${currentYear}/${currentYear + 1}`);

    // Portfolio overview
    let y = sectionTitle(doc, 46, 'Portfolio Overview');
    y = statLine(doc, y, 'Total Properties:', String(props.length));
    y = statLine(doc, y, 'Total Transactions:', String(transactions.length));
    y = statLine(doc, y, 'Tax Year:', `${currentYear}/${currentYear + 1}`);
    y += 4;

    // Financial summary
    y = sectionTitle(doc, y, 'Financial Summary');
    y = statLine(doc, y, 'Total Income:', `\u00A3${income.toFixed(2)}`, GREEN);
    y = statLine(doc, y, 'Total Expenses:', `\u00A3${expenses.toFixed(2)}`, RED);
    y = statLine(doc, y, 'Net Profit / Loss:', `\u00A3${netProfit.toFixed(2)}`, netProfit >= 0 ? GREEN : RED);
    y += 4;

    // Expenses by category table
    y = sectionTitle(doc, y, 'Expenses by Category');
    const catEntries = Object.entries(expensesByCategory);
    if (catEntries.length === 0) {
      doc.setFont('helvetica', 'italic');
      doc.setFontSize(10);
      doc.setTextColor(...GRAY);
      doc.text('No expenses recorded.', MARGIN, y);
      y += 6;
    } else {
      const catHeaders = ['Category', 'Amount', '% of Total'];
      const catColWidths = [70, 50, 50];
      const catRows: string[][] = catEntries.map(([cat, amount]) => [
        cat,
        `\u00A3${amount.toFixed(2)}`,
        expenses > 0 ? `${Math.round((amount / expenses) * 100)}%` : '0%',
      ]);
      // Add totals row
      catRows.push(['TOTAL', `\u00A3${expenses.toFixed(2)}`, '100%']);
      y = drawTable(doc, y, catHeaders, catRows, catColWidths);
      y += 4;
    }

    // Property income breakdown table
    y = sectionTitle(doc, y, 'Property Income Breakdown');
    const propHeaders = ['Property', 'Income', 'Expenses', 'Net'];
    const propColWidths = [70, 30, 35, 35];
    const propRows: string[][] = props.map((prop) => {
      const p = prop as Record<string, unknown>;
      const propIncome = transactions
        .filter((t: Record<string, unknown>) => t.property_id === p.id && t.type === 'income')
        .reduce((sum: number, t: Record<string, unknown>) => sum + Number(t.amount || 0), 0);
      const propExpenses = transactions
        .filter((t: Record<string, unknown>) => t.property_id === p.id && t.type === 'expense')
        .reduce((sum: number, t: Record<string, unknown>) => sum + Number(t.amount || 0), 0);
      return [
        `${p.address_line1}, ${p.city}`,
        `\u00A3${propIncome.toFixed(2)}`,
        `\u00A3${propExpenses.toFixed(2)}`,
        `\u00A3${(propIncome - propExpenses).toFixed(2)}`,
      ];
    });
    // Add totals row
    propRows.push(['TOTAL', `\u00A3${income.toFixed(2)}`, `\u00A3${expenses.toFixed(2)}`, `\u00A3${netProfit.toFixed(2)}`]);
    y = drawTable(doc, y, propHeaders, propRows, propColWidths);
    y += 4;

    // MTD status
    y = sectionTitle(doc, y, 'MTD Status');
    if (mtdRecords.length === 0) {
      doc.setFont('helvetica', 'italic');
      doc.setFontSize(10);
      doc.setTextColor(...GRAY);
      doc.text('No MTD records for this tax year.', MARGIN, y);
      y += 6;
    } else {
      const mtdHeaders = ['Quarter', 'Status', 'Income', 'Expenses', 'Deadline'];
      const mtdColWidths = [25, 35, 35, 35, 40];
      const mtdRows: string[][] = mtdRecords.map((rec) => {
        const r = rec as Record<string, unknown>;
        return [
          `Q${r.quarter}`,
          String(r.status || 'N/A'),
          `\u00A3${Number(r.total_income || 0).toFixed(2)}`,
          `\u00A3${Number(r.total_expenses || 0).toFixed(2)}`,
          String(r.submission_deadline || 'N/A'),
        ];
      });
      y = drawTable(doc, y, mtdHeaders, mtdRows, mtdColWidths);
    }

    addFooter(doc, dateLabel);
    doc.save(`annual-summary-${currentYear}-${today}.pdf`);
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
