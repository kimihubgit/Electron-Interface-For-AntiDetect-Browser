/**
 * Plans & Billing REST API Service
 */
import { apiClient } from '../core/apiClient';

export const DEFAULT_PLANS = [
  {
    id: "plan_free",
    name: "Free Starter",
    max_profiles: 5,
    max_seats: 1,
    price_month: 0,
    price_year: 0,
    features: [
      "5 Profiles",
      "Local Storage",
      "Standard Fingerprints"
    ],
    is_popular: false
  },
  {
    id: "plan_basic",
    name: "Base",
    max_profiles: 50,
    max_seats: 2,
    price_month: 19,
    price_year: 180,
    features: [
      "50 Profiles",
      "2 Team Seats",
      "Cloud Session Sync",
      "Proxy Manager",
      "RPA Automation"
    ],
    is_popular: false
  },
  {
    id: "plan_pro",
    name: "Team Pro",
    max_profiles: 200,
    max_seats: 5,
    price_month: 49,
    price_year: 470,
    features: [
      "200 Profiles",
      "5 Team Seats",
      "Cloud Session Sync",
      "Priority Proxy Checker",
      "Advanced Fingerprint Engine",
      "DCOM 4G Auto-rotate"
    ],
    is_popular: true
  },
  {
    id: "plan_enterprise",
    name: "Enterprise Scale",
    max_profiles: 1000,
    max_seats: 20,
    price_month: 149,
    price_year: 1430,
    features: [
      "1,000 Profiles",
      "20 Team Seats",
      "Unlimited Automation",
      "Dedicated Support",
      "Custom Fingerprint Seeds"
    ],
    is_popular: false
  }
];

export const PLANS_STORAGE_KEY = 'antidetect_plans_cache';

export function getStoredPlans() {
  try {
    const raw = localStorage.getItem(PLANS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch {}
  return DEFAULT_PLANS;
}

export async function getPlansApi() {
  const res = await apiClient.get('/api/v1/plans');
  if (res.ok) {
    const plans = res.data?.data || res.data?.plans || res.data || [];
    if (Array.isArray(plans) && plans.length > 0) {
      localStorage.setItem(PLANS_STORAGE_KEY, JSON.stringify(plans));
      return {
        success: true,
        message: res.message || 'Plans retrieved',
        data: plans
      };
    }
  }
  return {
    success: true,
    data: getStoredPlans(),
    message: 'Plans retrieved (cached)'
  };
}
