-- LandlordShield Database Schema
-- Run this in Supabase SQL Editor

-- Drop existing tables if any (clean slate)
DROP TABLE IF EXISTS public.reminders CASCADE;
DROP TABLE IF EXISTS public.transactions CASCADE;
DROP TABLE IF EXISTS public.mtd_records CASCADE;
DROP TABLE IF EXISTS public.checklist_items CASCADE;
DROP TABLE IF EXISTS public.certificates CASCADE;
DROP TABLE IF EXISTS public.epc_improvements CASCADE;
DROP TABLE IF EXISTS public.epc_records CASCADE;
DROP TABLE IF EXISTS public.tenancies CASCADE;
DROP TABLE IF EXISTS public.properties CASCADE;
DROP TABLE IF EXISTS public.users CASCADE;

-- Drop existing trigger/function
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Users (extends Supabase auth.users)
CREATE TABLE public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  business_name TEXT,
  phone TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  plan TEXT DEFAULT 'free',
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  subscription_status TEXT DEFAULT 'inactive',
  settings JSONB DEFAULT '{}'
);

-- Properties
CREATE TABLE public.properties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  address_line1 TEXT NOT NULL,
  address_line2 TEXT,
  city TEXT NOT NULL,
  county TEXT,
  postcode TEXT NOT NULL,
  property_type TEXT,
  bedrooms INT,
  monthly_rent DECIMAL,
  ownership_type TEXT,
  joint_ownership_percentage DECIMAL,
  is_furnished TEXT,
  has_mortgage BOOLEAN DEFAULT FALSE,
  mortgage_monthly DECIMAL,
  managing_agent TEXT,
  hmo_licence_required BOOLEAN DEFAULT FALSE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tenancies
CREATE TABLE public.tenancies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID REFERENCES public.properties(id) ON DELETE CASCADE,
  tenant_name TEXT NOT NULL,
  tenant_email TEXT,
  tenant_phone TEXT,
  tenancy_type TEXT,
  start_date DATE,
  end_date DATE,
  current_rent DECIMAL,
  deposit_amount DECIMAL,
  deposit_scheme TEXT,
  right_to_rent_checked BOOLEAN DEFAULT FALSE,
  right_to_rent_date DATE,
  pets_allowed BOOLEAN DEFAULT FALSE,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- EPC Records
CREATE TABLE public.epc_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID REFERENCES public.properties(id) ON DELETE CASCADE,
  current_rating TEXT,
  current_score INT,
  potential_rating TEXT,
  potential_score INT,
  certificate_number TEXT,
  issue_date DATE,
  expiry_date DATE,
  status TEXT DEFAULT 'valid',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- EPC Improvements
CREATE TABLE public.epc_improvements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID REFERENCES public.properties(id) ON DELETE CASCADE,
  improvement_type TEXT,
  description TEXT,
  estimated_cost DECIMAL,
  actual_cost DECIMAL,
  estimated_points_gain INT,
  status TEXT DEFAULT 'planned',
  completed_date DATE,
  counts_toward_cap BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Compliance Certificates
CREATE TABLE public.certificates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID REFERENCES public.properties(id) ON DELETE CASCADE,
  cert_type TEXT NOT NULL,
  issued_date DATE,
  expiry_date DATE,
  provider TEXT,
  reference_number TEXT,
  document_url TEXT,
  status TEXT DEFAULT 'valid',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Compliance Checklist Items
CREATE TABLE public.checklist_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  property_id UUID REFERENCES public.properties(id) ON DELETE SET NULL,
  pillar TEXT NOT NULL,
  item_key TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  is_completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMPTZ,
  due_date DATE,
  priority TEXT DEFAULT 'medium',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- MTD Records
CREATE TABLE public.mtd_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  tax_year TEXT,
  quarter INT,
  period_start DATE,
  period_end DATE,
  submission_deadline DATE,
  total_income DECIMAL,
  total_expenses DECIMAL,
  status TEXT DEFAULT 'not_started',
  submitted_at TIMESTAMPTZ,
  penalty_points INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Transactions
CREATE TABLE public.transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  property_id UUID REFERENCES public.properties(id) ON DELETE SET NULL,
  type TEXT NOT NULL,
  category TEXT NOT NULL,
  amount DECIMAL NOT NULL,
  description TEXT,
  date DATE NOT NULL,
  receipt_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Reminders
CREATE TABLE public.reminders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  property_id UUID REFERENCES public.properties(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  message TEXT,
  due_date DATE NOT NULL,
  pillar TEXT,
  is_sent BOOLEAN DEFAULT FALSE,
  is_dismissed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tenancies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.epc_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.epc_improvements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.checklist_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mtd_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reminders ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Users can only access their own data
CREATE POLICY "Users can view own profile" ON public.users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.users FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.users FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can manage own properties" ON public.properties FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage tenancies" ON public.tenancies FOR ALL
  USING (property_id IN (SELECT id FROM public.properties WHERE user_id = auth.uid()));

CREATE POLICY "Users can manage epc_records" ON public.epc_records FOR ALL
  USING (property_id IN (SELECT id FROM public.properties WHERE user_id = auth.uid()));

CREATE POLICY "Users can manage epc_improvements" ON public.epc_improvements FOR ALL
  USING (property_id IN (SELECT id FROM public.properties WHERE user_id = auth.uid()));

CREATE POLICY "Users can manage certificates" ON public.certificates FOR ALL
  USING (property_id IN (SELECT id FROM public.properties WHERE user_id = auth.uid()));

CREATE POLICY "Users can manage checklist_items" ON public.checklist_items FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage mtd_records" ON public.mtd_records FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage transactions" ON public.transactions FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage reminders" ON public.reminders FOR ALL USING (auth.uid() = user_id);

-- Function to create user profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
