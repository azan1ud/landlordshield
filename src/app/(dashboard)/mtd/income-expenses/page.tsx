'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Plus, TrendingUp, TrendingDown, PoundSterling, Filter, AlertTriangle, Loader2 } from 'lucide-react';
import { INCOME_CATEGORIES, EXPENSE_CATEGORIES } from '@/lib/constants/expense-categories';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import type { Transaction } from '@/types';

// Build a label lookup from the category constants
const CATEGORY_LABELS: Record<string, string> = {};
for (const c of INCOME_CATEGORIES) {
  CATEGORY_LABELS[c.key] = c.label;
}
for (const c of EXPENSE_CATEGORIES) {
  CATEGORY_LABELS[c.key] = c.label;
}

export default function IncomeExpensesPage() {
  const { user, loading: authLoading } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [properties, setProperties] = useState<{ id: string; address_line1: string }[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<string>('all');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  // Form state for "Add Transaction" dialog
  const [newType, setNewType] = useState<'income' | 'expense'>('income');
  const [newCategory, setNewCategory] = useState('');
  const [newAmount, setNewAmount] = useState('');
  const [newDate, setNewDate] = useState('');
  const [newPropertyId, setNewPropertyId] = useState('');
  const [newDescription, setNewDescription] = useState('');

  const fetchTransactions = useCallback(async () => {
    if (!user) return;
    const supabase = createClient();
    const { data, error: fetchErr } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', user.id)
      .order('date', { ascending: false });

    if (fetchErr) {
      setError(fetchErr.message);
    } else {
      setTransactions(data ?? []);
    }
  }, [user]);

  const fetchProperties = useCallback(async () => {
    if (!user) return;
    const supabase = createClient();
    const { data } = await supabase
      .from('properties')
      .select('id, address_line1')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    setProperties(data ?? []);
  }, [user]);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      setLoadingData(false);
      return;
    }

    setLoadingData(true);
    Promise.all([fetchTransactions(), fetchProperties()]).finally(() => {
      setLoadingData(false);
    });
  }, [user, authLoading, fetchTransactions, fetchProperties]);

  const handleAddTransaction = async () => {
    if (!user) return;
    if (!newCategory || !newAmount || !newDate) {
      setError('Please fill in type, category, amount, and date.');
      return;
    }

    setSaving(true);
    setError(null);

    const supabase = createClient();
    const { error: insertErr } = await supabase
      .from('transactions')
      .insert({
        user_id: user.id,
        property_id: (newPropertyId && newPropertyId !== 'none') ? newPropertyId : null,
        type: newType,
        category: newCategory,
        amount: parseFloat(newAmount),
        description: newDescription || null,
        date: newDate,
      });

    if (insertErr) {
      setError(insertErr.message);
      setSaving(false);
      return;
    }

    // Reset form and refetch
    setNewType('income');
    setNewCategory('');
    setNewAmount('');
    setNewDate('');
    setNewPropertyId('');
    setNewDescription('');
    setDialogOpen(false);
    setSaving(false);
    await fetchTransactions();
  };

  const filtered = filterType === 'all'
    ? transactions
    : transactions.filter((t) => t.type === filterType);

  const totalIncome = transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const netProfit = totalIncome - totalExpenses;

  // Build property lookup for display
  const propertyLookup: Record<string, string> = {};
  for (const p of properties) {
    propertyLookup[p.id] = p.address_line1;
  }

  if (authLoading || loadingData) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-[#2563EB]" />
        <span className="ml-3 text-gray-500">Loading transactions...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1E3A5F]">Income & Expenses</h1>
          <p className="text-gray-500 mt-1">Track your rental income and property expenses for MTD.</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#2563EB] hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Add Transaction
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Add Transaction</DialogTitle>
              <DialogDescription>Record an income or expense for your rental properties.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              {error && (
                <p className="text-sm text-red-600 bg-red-50 p-2 rounded">{error}</p>
              )}
              <div>
                <Label>Type</Label>
                <Select value={newType} onValueChange={(v) => { setNewType(v as 'income' | 'expense'); setNewCategory(''); }}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="income">Income</SelectItem>
                    <SelectItem value="expense">Expense</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Category</Label>
                <Select value={newCategory} onValueChange={setNewCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {newType === 'income' ? (
                      INCOME_CATEGORIES.map((c) => (
                        <SelectItem key={c.key} value={c.key}>{c.label}</SelectItem>
                      ))
                    ) : (
                      EXPENSE_CATEGORIES.map((c) => (
                        <SelectItem key={c.key} value={c.key}>{c.label}</SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Amount ({'\u00A3'})</Label>
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  value={newAmount}
                  onChange={(e) => setNewAmount(e.target.value)}
                />
              </div>
              <div>
                <Label>Date</Label>
                <Input
                  type="date"
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                />
              </div>
              <div>
                <Label>Property</Label>
                <Select value={newPropertyId} onValueChange={setNewPropertyId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select property (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No specific property</SelectItem>
                    {properties.map((p) => (
                      <SelectItem key={p.id} value={p.id}>{p.address_line1}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Description</Label>
                <Input
                  placeholder="e.g. February rent payment"
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)} disabled={saving}>Cancel</Button>
              <Button
                className="bg-[#2563EB] hover:bg-blue-700"
                onClick={handleAddTransaction}
                disabled={saving}
              >
                {saving ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Save Transaction'
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Summary cards */}
      <div className="grid sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Total Income</p>
                <p className="text-xl font-bold text-green-600">{'\u00A3'}{totalIncome.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
                <TrendingDown className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Total Expenses</p>
                <p className="text-xl font-bold text-red-600">{'\u00A3'}{totalExpenses.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                <PoundSterling className="h-5 w-5 text-[#2563EB]" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Net Profit</p>
                <p className={`text-xl font-bold ${netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {'\u00A3'}{netProfit.toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* HMRC categories info */}
      <Card className="border-blue-200 bg-blue-50/50">
        <CardContent className="p-4">
          <p className="text-sm text-blue-800">
            <strong>HMRC-aligned categories:</strong> Income and expenses are categorised to match HMRC&apos;s
            property income tax return boxes, making MTD quarterly submissions straightforward.
          </p>
        </CardContent>
      </Card>

      {/* Filter and transaction list */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Transactions</CardTitle>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-400" />
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="income">Income only</SelectItem>
                  <SelectItem value="expense">Expenses only</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filtered.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p className="text-sm">No transactions found.</p>
              <p className="text-xs mt-1">Click &quot;Add Transaction&quot; to record your first income or expense.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Property</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((t) => (
                  <TableRow key={t.id}>
                    <TableCell className="text-sm">{new Date(t.date).toLocaleDateString('en-GB')}</TableCell>
                    <TableCell>
                      <Badge variant={t.type === 'income' ? 'default' : 'destructive'} className={t.type === 'income' ? 'bg-green-100 text-green-700' : ''}>
                        {t.type === 'income' ? 'Income' : 'Expense'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm">{CATEGORY_LABELS[t.category] ?? t.category}</TableCell>
                    <TableCell className="text-sm text-gray-600">{t.description ?? '-'}</TableCell>
                    <TableCell className="text-sm text-gray-500">
                      {t.property_id ? (propertyLookup[t.property_id] ?? 'Unknown') : 'All properties'}
                    </TableCell>
                    <TableCell className={`text-right font-medium ${t.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                      {t.type === 'income' ? '+' : '-'}{'\u00A3'}{t.amount.toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Disclaimer */}
      <div className="flex items-start gap-2 p-4 bg-amber-50 rounded-lg border border-amber-200">
        <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
        <p className="text-xs text-amber-800">
          This tool provides guidance only. It is not legal, tax, or financial advice.
          Always consult a qualified professional for advice specific to your situation.
        </p>
      </div>
    </div>
  );
}
