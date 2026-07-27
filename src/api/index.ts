import axios from 'axios'

// ── Shared types ──────────────────────────────────────────────────────────────

export type BillingCycle = 'monthly' | 'quarterly' | 'annually'

export interface Plan {
  id: string
  name: string
  ram?: string
  vcores?: number
  nvme?: string
  price: Record<BillingCycle, number>
}

export interface PlanCategory {
  id: string
  name: string
  plans: Plan[]
}

// ── Plan fetchers ─────────────────────────────────────────────────────────────

export async function getVpsPlans(): Promise<PlanCategory[]> {
  const res = await axios.get<PlanCategory[]>('/api/vps-plans')
  return res.data
}

export async function getMinecraftPlans(): Promise<PlanCategory[]> {
  const res = await axios.get<PlanCategory[]>('/api/plans')
  return res.data
}

/** Flatten plan categories into a single array of Plans. */
export function flattenPlans(categories: PlanCategory[]): Plan[] {
  return categories.flatMap((cat) => cat.plans)
}

// ── Order helpers ─────────────────────────────────────────────────────────────

export interface CreateOrderPayload {
  plan_id: string
  plan_category: string
  billing_cycle: BillingCycle
  customer_name: string
  email: string
  discord: string
}

export interface CreatedOrder {
  order_ref: string
  upi_uri: string
  amount: number
  plan_name: string
}

export async function createOrder(payload: CreateOrderPayload): Promise<CreatedOrder> {
  const res = await axios.post<CreatedOrder>('/api/orders', payload, { withCredentials: true })
  return res.data
}

export async function submitPayment(orderRef: string, utr: string, screenshot: File): Promise<void> {
  const form = new FormData()
  form.append('utr', utr)
  form.append('screenshot', screenshot)
  await axios.post(`/api/orders/${orderRef}/payment`, form, {
    withCredentials: true,
    headers: { 'Content-Type': 'multipart/form-data' },
  })
}

/**
 * Shared Axios instance.
 *
 * baseURL resolves in priority order:
 *   1. VITE_BACKEND_URL env var (set in .env for a remote backend)
 *   2. Empty string — falls back to relative URLs, which Vite's dev proxy
 *      forwards to localhost:8000, and same-origin works in production.
 */
export const api = axios.create({
  baseURL: (import.meta.env.VITE_BACKEND_URL ?? '') + '/api',
  withCredentials: true,   // send HttpOnly cookie on every request
  headers: {
    'Content-Type': 'application/json',
  },
})

/**
 * formatApiErrorDetail
 *
 * Normalises the `detail` field from FastAPI error responses into a
 * human-readable string.
 *
 * FastAPI produces two shapes:
 *   • String  — e.g. "Order not found"
 *   • Array   — validation errors: [{ loc, msg, type }, …]
 *
 * @param detail  The raw value of `error.response.data.detail`
 * @returns       A single display string
 */
export function formatApiErrorDetail(detail: unknown): string {
  if (typeof detail === 'string') {
    return detail
  }

  if (Array.isArray(detail)) {
    return detail
      .map((item) => {
        if (typeof item === 'string') return item
        if (item && typeof item === 'object' && 'msg' in item) {
          const loc = Array.isArray(item.loc)
            ? item.loc.filter((s: unknown) => s !== 'body').join(' → ')
            : ''
          return loc ? `${loc}: ${item.msg}` : String(item.msg)
        }
        return JSON.stringify(item)
      })
      .join(', ')
  }

  return 'An unexpected error occurred'
}

/**
 * getApiError
 *
 * Convenience helper — extracts a display string from any thrown value.
 * Use in catch blocks: `catch (err) { setError(getApiError(err)) }`
 */
export function getApiError(err: unknown): string {
  if (axios.isAxiosError(err)) {
    const detail = err.response?.data?.detail
    if (detail !== undefined) return formatApiErrorDetail(detail)
    return err.message
  }
  if (err instanceof Error) return err.message
  return 'An unexpected error occurred'
}
