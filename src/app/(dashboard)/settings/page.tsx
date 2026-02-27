'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { User, Bell, CreditCard, Download, Trash2, Save, Loader2, AlertTriangle, ExternalLink, LogOut, CheckCircle2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import type { PlanType, SubscriptionStatus } from '@/types';
import Link from 'next/link';

interface NotificationPrefs {
  emailReminders: boolean;
  thirtyDayReminder: boolean;
  sevenDayReminder: boolean;
  onDayReminder: boolean;
  overdueAlert: boolean;
}

const DEFAULT_NOTIFICATIONS: NotificationPrefs = {
  emailReminders: true,
  thirtyDayReminder: true,
  sevenDayReminder: true,
  onDayReminder: true,
  overdueAlert: true,
};

export default function SettingsPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savingNotifications, setSavingNotifications] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [billingLoading, setBillingLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [subscription, setSubscription] = useState<{
    plan: PlanType;
    status: SubscriptionStatus;
    stripeCustomerId: string | null;
  }>({
    plan: 'free',
    status: 'inactive',
    stripeCustomerId: null,
  });

  const [profile, setProfile] = useState({
    name: '',
    email: '',
    businessName: '',
    phone: '',
  });

  const [notifications, setNotifications] = useState<NotificationPrefs>(DEFAULT_NOTIFICATIONS);

  const fetchProfile = useCallback(async () => {
    if (!user) return;
    const supabase = createClient();
    const { data, error: fetchErr } = await supabase
      .from('users')
      .select('name, email, business_name, phone, settings, plan, subscription_status, stripe_customer_id')
      .eq('id', user.id)
      .single();

    if (fetchErr) {
      // If user row doesn't exist yet, populate from auth metadata
      setProfile({
        name: user.user_metadata?.full_name ?? '',
        email: user.email ?? '',
        businessName: '',
        phone: '',
      });
    } else if (data) {
      setProfile({
        name: data.name ?? '',
        email: data.email ?? user.email ?? '',
        businessName: data.business_name ?? '',
        phone: data.phone ?? '',
      });

      setSubscription({
        plan: (data.plan as PlanType) ?? 'free',
        status: (data.subscription_status as SubscriptionStatus) ?? 'inactive',
        stripeCustomerId: data.stripe_customer_id ?? null,
      });

      // Load notification preferences from settings JSONB
      if (data.settings && typeof data.settings === 'object' && 'notifications' in data.settings) {
        const savedNotifs = (data.settings as Record<string, unknown>).notifications as Partial<NotificationPrefs> | undefined;
        if (savedNotifs) {
          setNotifications({
            ...DEFAULT_NOTIFICATIONS,
            ...savedNotifs,
          });
        }
      }
    }
  }, [user]);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      setLoadingProfile(false);
      return;
    }

    setLoadingProfile(true);
    fetchProfile().finally(() => setLoadingProfile(false));
  }, [user, authLoading, fetchProfile]);

  const handleSaveProfile = async () => {
    if (!user) return;
    setSaving(true);
    setError(null);
    setSuccessMessage(null);

    const supabase = createClient();
    const { error: updateErr } = await supabase
      .from('users')
      .update({
        name: profile.name,
        business_name: profile.businessName,
        phone: profile.phone,
      })
      .eq('id', user.id);

    if (updateErr) {
      setError(updateErr.message);
    } else {
      setSuccessMessage('Profile saved successfully.');
      // Clear the success message after 3 seconds
      setTimeout(() => setSuccessMessage(null), 3000);
    }

    setSaving(false);
  };

  const handleSaveNotifications = async () => {
    if (!user) return;
    setSavingNotifications(true);
    setError(null);
    setSuccessMessage(null);

    const supabase = createClient();

    // First fetch current settings to merge
    const { data: currentUser } = await supabase
      .from('users')
      .select('settings')
      .eq('id', user.id)
      .single();

    const currentSettings = (currentUser?.settings as Record<string, unknown>) ?? {};

    const { error: updateErr } = await supabase
      .from('users')
      .update({
        settings: {
          ...currentSettings,
          notifications,
        },
      })
      .eq('id', user.id);

    if (updateErr) {
      setError(updateErr.message);
    } else {
      setSuccessMessage('Notification preferences saved.');
      setTimeout(() => setSuccessMessage(null), 3000);
    }

    setSavingNotifications(false);
  };

  const handleLogout = async () => {
    setLoggingOut(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/');
  };

  const handleManageBilling = async () => {
    setBillingLoading(true);
    try {
      const res = await fetch('/api/stripe/portal', { method: 'POST' });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        setError(data.error || 'Failed to open billing portal');
      }
    } catch {
      setError('Failed to open billing portal');
    } finally {
      setBillingLoading(false);
    }
  };

  const handleExportData = async () => {
    if (!user) return;
    setExporting(true);
    setError(null);

    try {
      const supabase = createClient();

      // Fetch all user data in parallel
      const [propertiesRes, tenanciesRes, certificatesRes, transactionsRes] = await Promise.all([
        supabase
          .from('properties')
          .select('*')
          .eq('user_id', user.id),
        supabase
          .from('tenancies')
          .select('*, properties!inner(user_id)')
          .eq('properties.user_id', user.id),
        supabase
          .from('certificates')
          .select('*, properties!inner(user_id)')
          .eq('properties.user_id', user.id),
        supabase
          .from('transactions')
          .select('*')
          .eq('user_id', user.id),
      ]);

      // Helper to convert array of objects to CSV string
      const toCsv = (label: string, rows: Record<string, unknown>[] | null): string => {
        if (!rows || rows.length === 0) return `--- ${label} ---\nNo data\n\n`;
        // Filter out nested join objects
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
                // Escape commas and quotes
                if (str.includes(',') || str.includes('"') || str.includes('\n')) {
                  return `"${str.replace(/"/g, '""')}"`;
                }
                return str;
              })
              .join(',')
          )
          .join('\n');
        return `--- ${label} ---\n${header}\n${body}\n\n`;
      };

      const csvContent = [
        toCsv('Properties', propertiesRes.data as Record<string, unknown>[] | null),
        toCsv('Tenancies', tenanciesRes.data as Record<string, unknown>[] | null),
        toCsv('Certificates', certificatesRes.data as Record<string, unknown>[] | null),
        toCsv('Transactions', transactionsRes.data as Record<string, unknown>[] | null),
      ].join('');

      // Trigger browser download
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `landlordshield-export-${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setSuccessMessage('Data exported successfully.');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch {
      setError('Failed to export data. Please try again.');
    } finally {
      setExporting(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!user) return;

    const confirmed = window.confirm(
      'Are you sure you want to delete your account? This will permanently remove all your data including properties, tenancies, certificates, and transactions. This action cannot be undone.'
    );

    if (!confirmed) return;

    setDeleting(true);
    setError(null);

    try {
      const supabase = createClient();

      // Delete the user row from the users table.
      // Due to ON DELETE CASCADE on all child tables, this removes all associated data.
      const { error: deleteErr } = await supabase
        .from('users')
        .delete()
        .eq('id', user.id);

      if (deleteErr) {
        setError('Failed to delete account data: ' + deleteErr.message);
        setDeleting(false);
        return;
      }

      // Sign out and redirect to home
      await supabase.auth.signOut();
      router.push('/');
    } catch {
      setError('An unexpected error occurred while deleting your account.');
      setDeleting(false);
    }
  };

  if (authLoading || loadingProfile) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-[#1E3A5F]" />
        <span className="ml-3 text-gray-500">Loading settings...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-[#1E3A5F]">Settings</h1>
        <p className="text-gray-500 mt-1">Manage your account, notifications, and subscription.</p>
      </div>

      {/* Success / Error alerts */}
      {successMessage && (
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">{successMessage}</AlertDescription>
        </Alert>
      )}
      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Profile */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <User className="h-5 w-5 text-[#1E3A5F]" />
            Profile
          </CardTitle>
          <CardDescription>Your personal and business details.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Full name</Label>
              <Input
                id="name"
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="email">Email address</Label>
              <Input id="email" type="email" value={profile.email} disabled className="bg-gray-50" />
              <p className="text-xs text-gray-400 mt-1">Contact support to change your email.</p>
            </div>
            <div>
              <Label htmlFor="business">Business name (optional)</Label>
              <Input
                id="business"
                value={profile.businessName}
                onChange={(e) => setProfile({ ...profile, businessName: e.target.value })}
                placeholder="e.g. Smith Properties Ltd"
              />
            </div>
            <div>
              <Label htmlFor="phone">Phone number (optional)</Label>
              <Input
                id="phone"
                type="tel"
                value={profile.phone}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
              />
            </div>
          </div>
          <Button onClick={handleSaveProfile} disabled={saving} className="bg-[#1E3A5F] hover:bg-[#2D4F7A]">
            {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
            Save Changes
          </Button>
        </CardContent>
      </Card>

      {/* Notification preferences */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Bell className="h-5 w-5 text-[#1E3A5F]" />
            Notification Preferences
          </CardTitle>
          <CardDescription>Choose which email reminders you receive for deadlines.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-sm">Email reminders</p>
              <p className="text-xs text-gray-500">Receive email reminders for upcoming deadlines.</p>
            </div>
            <Switch
              checked={notifications.emailReminders}
              onCheckedChange={(v) => setNotifications({ ...notifications, emailReminders: v })}
            />
          </div>
          <Separator />
          <div className="space-y-3 pl-4">
            {[
              { key: 'thirtyDayReminder', label: '30 days before deadline' },
              { key: 'sevenDayReminder', label: '7 days before deadline' },
              { key: 'onDayReminder', label: 'On the day' },
              { key: 'overdueAlert', label: 'Overdue alert' },
            ].map((item) => (
              <div key={item.key} className="flex items-center justify-between">
                <p className="text-sm text-gray-600">{item.label}</p>
                <Switch
                  checked={notifications[item.key as keyof typeof notifications]}
                  onCheckedChange={(v) => setNotifications({ ...notifications, [item.key]: v })}
                  disabled={!notifications.emailReminders}
                />
              </div>
            ))}
          </div>
          <Button onClick={handleSaveNotifications} disabled={savingNotifications} variant="outline" size="sm">
            {savingNotifications ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
            Save Preferences
          </Button>
        </CardContent>
      </Card>

      {/* Subscription */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-[#1E3A5F]" />
            Subscription
          </CardTitle>
          <CardDescription>Manage your subscription and billing.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <div className="flex items-center gap-2">
                <p className="font-semibold">
                  {subscription.plan === 'free' && 'Free Plan'}
                  {subscription.plan === 'pro' && 'Pro Plan'}
                  {subscription.plan === 'portfolio' && 'Portfolio Plan'}
                </p>
                {(() => {
                  const s = subscription.status;
                  if (s === 'active' || s === 'trialing') {
                    return (
                      <Badge className="bg-green-600 hover:bg-green-600 text-white">
                        {s === 'trialing' ? 'Trialing' : 'Active'}
                      </Badge>
                    );
                  }
                  if (s === 'past_due') {
                    return (
                      <Badge className="bg-amber-500 hover:bg-amber-500 text-white">
                        Past Due
                      </Badge>
                    );
                  }
                  // canceled or inactive
                  return (
                    <Badge className="bg-gray-400 hover:bg-gray-400 text-white">
                      {s === 'canceled' ? 'Canceled' : 'Inactive'}
                    </Badge>
                  );
                })()}
              </div>
              <p className="text-sm text-gray-500 mt-1">
                {subscription.plan === 'free' && `${'\u00A3'}0/month \u2022 1 property`}
                {subscription.plan === 'pro' && `${'\u00A3'}9.99/month \u2022 Up to 10 properties`}
                {subscription.plan === 'portfolio' && `${'\u00A3'}24.99/month \u2022 Unlimited properties`}
              </p>
            </div>
            {subscription.plan === 'free' ? (
              <Link href="/pricing">
                <Button size="sm" className="bg-[#1E3A5F] hover:bg-[#2D4F7A]">
                  Upgrade
                </Button>
              </Link>
            ) : subscription.stripeCustomerId ? (
              <Button variant="outline" size="sm" onClick={handleManageBilling} disabled={billingLoading}>
                {billingLoading ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <ExternalLink className="h-4 w-4 mr-2" />
                )}
                Manage Billing
              </Button>
            ) : null}
          </div>
          {subscription.plan !== 'free' && (
            <p className="text-xs text-gray-500">
              Billing is managed through Stripe. Click &quot;Manage Billing&quot; to update your payment method, view invoices, or cancel your subscription.
            </p>
          )}
          {subscription.plan === 'free' && (
            <p className="text-xs text-gray-500">
              You are on the Free plan. Upgrade to Pro or Portfolio to unlock more properties, compliance reports, and email reminders.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Data Export */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Download className="h-5 w-5 text-[#1E3A5F]" />
            Data Export
          </CardTitle>
          <CardDescription>Export your data in CSV format for your accountant.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="outline" onClick={handleExportData} disabled={exporting}>
            {exporting ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Download className="h-4 w-4 mr-2" />}
            {exporting ? 'Exporting...' : 'Export All Data (CSV)'}
          </Button>
        </CardContent>
      </Card>

      {/* Log out */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <LogOut className="h-5 w-5 text-[#1E3A5F]" />
            Session
          </CardTitle>
          <CardDescription>Sign out of your LandlordShield account.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            variant="outline"
            onClick={handleLogout}
            disabled={loggingOut}
          >
            {loggingOut ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Logging out...
              </>
            ) : (
              <>
                <LogOut className="h-4 w-4 mr-2" />
                Log Out
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Danger zone */}
      <Card className="border-red-200">
        <CardHeader>
          <CardTitle className="text-lg text-red-600 flex items-center gap-2">
            <Trash2 className="h-5 w-5" />
            Delete Account
          </CardTitle>
          <CardDescription>Permanently delete your account and all associated data. This action cannot be undone.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="destructive" size="sm" onClick={handleDeleteAccount} disabled={deleting}>
            {deleting ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Trash2 className="h-4 w-4 mr-2" />}
            {deleting ? 'Deleting...' : 'Delete My Account'}
          </Button>
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
