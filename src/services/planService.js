import { getApiServerUrl } from '../config/apiConfig';

/**
 * Default fallback plans matching backend API
 */
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

const PLANS_STORAGE_KEY = 'antidetect_plans_cache';

/**
 * Get cached plans from localStorage
 */
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

/**
 * 1. API Lấy Danh Sách Gói Cước (Get Plans)
 * Endpoint: GET /api/v1/plans
 * Xác thực: Public / Optional
 */
export async function getPlansApi() {
  const serverUrl = getApiServerUrl();
  const endpoint = `${serverUrl}/api/v1/plans`;

  try {
    const res = await fetch(endpoint, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    });

    if (res.ok) {
      const data = await res.json();
      const plans = data.data || data.plans || [];
      if (Array.isArray(plans) && plans.length > 0) {
        localStorage.setItem(PLANS_STORAGE_KEY, JSON.stringify(plans));
        return {
          success: true,
          message: data.message || 'Plans retrieved',
          data: plans
        };
      }
    }
  } catch (err) {
    console.warn('GET /api/v1/plans fetch error, using fallback:', err.message);
  }

  // Return stored or default plans
  const fallback = getStoredPlans();
  return {
    success: true,
    data: fallback,
    message: 'Plans retrieved (cached)'
  };
}
