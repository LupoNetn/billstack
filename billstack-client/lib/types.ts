// ── Plan Types ───────────────────────────────────────────────────────────────

export type PlanType = 'flat' | 'per_unit' | 'metered';
export type PlanStatus = 'active' | 'archived';
export type PlanIntervalUnit = 'day' | 'week' | 'month' | 'year';

export interface PlanTier {
  id: string;
  up_to: number | null;
  unit_price: number;
  flat_fee: number;
  tier_order: number;
}

export interface Plan {
  id: string;
  merchant_id: string;
  name: string;
  description: string | null;
  plan_type: PlanType;
  amount: number;
  currency: string;
  unit_name: string | null;
  max_units: number | null;
  interval_unit: PlanIntervalUnit;
  interval_count: number;
  trial_days: number;
  status: PlanStatus;
  metadata: Record<string, string> | null;
  tiers: PlanTier[];
  created_at: string;
  updated_at: string;
  active_subscribers?: number;
}

export interface CreatePlanRequest {
  name: string;
  description?: string;
  plan_type: PlanType;
  amount?: number;
  currency: string;
  unit_name?: string;
  interval_unit: PlanIntervalUnit;
  interval_count: number;
  trial_days: number;
  tiers?: { up_to: number | null; unit_price: number; flat_fee: number }[];
  metadata?: Record<string, string>;
}

export interface UpdatePlanRequest {
  name?: string;
  description?: string;
  amount?: number;
  currency?: string;
  unit_name?: string;
  interval_unit?: PlanIntervalUnit;
  interval_count?: number;
  trial_days?: number;
  metadata?: Record<string, string>;
}

// ── Merchant Types ────────────────────────────────────────────────────────────

export interface Merchant {
  id: string;
  personal_name: string;
  email: string;
  phone_number?: string;
  business_name?: string;
  business_type?: string;
  website_url?: string;
  status: string;
  kyb_tier: string;
  email_verified: boolean;
  created_at: string;
}

export interface MerchantMe extends Merchant {
  onboarding: {
    email_verified: boolean;
    has_settlement_account: boolean;
    has_webhook: boolean;
  };
}

export interface PortalConfig {
  id: string;
  merchant_id: string;
  logo_url?: string;
  primary_color?: string;
  secondary_color?: string;
  support_email?: string;
  return_url?: string;
  smart_retry_enabled: boolean;
  created_at: string;
  updated_at: string;
}

export interface WebhookConfig {
  id: string;
  merchant_id: string;
  webhook_url: string;
  webhook_secret: string;
  created_at: string;
  updated_at: string;
}

export interface SplitConfig {
  id: string;
  merchant_id: string;
  label: string;
  recepient_type: string;
  nomba_account_id?: string;
  split_type: 'percentage' | 'fixed';
  value: number;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface SettlementAccount {
  id: string;
  merchant_id: string;
  bank_name: string;
  account_number: string;
  account_name: string;
  bank_code: string;
  verified: boolean;
  is_primary: boolean;
  created_at: string;
}

// ── API Response wrapper ──────────────────────────────────────────────────────
export interface ApiResponse<T> {
  status: string;
  message: string;
  data: T;
}
