import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Server, CreditCard, RefreshCw, Clock, CheckCircle,
  XCircle, AlertCircle, ExternalLink, ChevronRight, Package,
  Cpu, HardDrive, MemoryStick, Calendar, ArrowLeft
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'

interface MyOrder {
  order_ref: string
  plan_name: string
  plan_category: string
  billing_cycle: string
  price: string
  ram: string
  vcores: string
  disk: string
  status: string
  provision_status: string
  panel_url: string | null
  server_password: string | null
  server: string | null
  provision_error: string | null
  created_at: string
  renewal_date: string | null
}

function fmtDate(iso: string | null) {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
}

function daysUntil(iso: string | null): number | null {
  if (!iso) return null
  const diff = new Date(iso).getTime() - Date.now()
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; cls: string }> = {
    pending:      { label: 'Pending',      cls: 'badge-pending' },
    paid:         { label: 'Paid',         cls: 'badge-paid' },
    rejected:     { label: 'Rejected',     cls: 'badge-rejected' },
    unpaid:       { label: 'Unpaid',       cls: 'badge-pending' },
    provisioning: { label: 'Provisioning', cls: 'badge-provisioning' },
    provisioned:  { label: 'Active',       cls: 'badge-active' },
    failed:       { label: 'Failed',       cls: 'badge-rejected' },
  }
  const s = map[status] ?? { label: status, cls: 'badge-pending' }
  return <span className={`ms-badge ${s.cls}`}>{s.label}</span>
}

function ProvisionIcon({ status }: { status: string }) {
  if (status === 'provisioned') return <CheckCircle size={16} className="text-green" />
  if (status === 'failed')      return <XCircle size={16} className="text-red" />
  if (status === 'provisioning') return <RefreshCw size={16} className="text-blue spin" />
  return <AlertCircle size={16} className="text-muted" />
}

export default function MyServersPage() {
  const { user } = useAuth()
  const [orders, setOrders] = useState<MyOrder[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch('/api/my/orders', { credentials: 'include' })
      .then(r => {
        if (!r.ok) throw new Error('Failed to load orders')
        return r.json()
      })
      .then(data => { setOrders(data); setLoading(false) })
      .catch(err => { setError(err.message); setLoading(false) })
  }, [])

  const activeServers = orders.filter(o => o.provision_status === 'provisioned')
  const totalSpent = orders
    .filter(o => o.status === 'paid')
    .reduce((sum, o) => sum + parseFloat(o.price || '0'), 0)

  return (
    <main className="ms-page">
      <div className="ms-hero">
        <div className="ms-hero-bg" />
        <div className="container">
          <Link to="/" className="ms-back"><ArrowLeft size={15} /> Back to home</Link>
          <div className="ms-hero-content">
            <div className="section-tag"><span className="dot" /> Client Area</div>
            <h1 className="ms-title">My Servers</h1>
            <p className="ms-subtitle">Welcome back, <strong>{user ? (user as import('../context/AuthContext').AuthUser).name : ''}</strong>. Manage your services and billing below.</p>
          </div>
        </div>
      </div>

      <div className="container ms-body">
        {/* Summary cards */}
        <div className="ms-summary">
          <div className="ms-stat-card">
            <div className="ms-stat-icon"><Server size={20} /></div>
            <div className="ms-stat-info">
              <div className="ms-stat-value">{loading ? '—' : activeServers.length}</div>
              <div className="ms-stat-label">Active Servers</div>
            </div>
          </div>
          <div className="ms-stat-card">
            <div className="ms-stat-icon"><Package size={20} /></div>
            <div className="ms-stat-info">
              <div className="ms-stat-value">{loading ? '—' : orders.length}</div>
              <div className="ms-stat-label">Total Orders</div>
            </div>
          </div>
          <div className="ms-stat-card">
            <div className="ms-stat-icon"><CreditCard size={20} /></div>
            <div className="ms-stat-info">
              <div className="ms-stat-value">₹{loading ? '—' : totalSpent.toLocaleString('en-IN')}</div>
              <div className="ms-stat-label">Total Spent</div>
            </div>
          </div>
          <div className="ms-stat-card">
            <div className="ms-stat-icon"><Calendar size={20} /></div>
            <div className="ms-stat-info">
              <div className="ms-stat-value">
                {loading ? '—' : (() => {
                  const next = activeServers
                    .map(o => o.renewal_date)
                    .filter(Boolean)
                    .map(d => new Date(d!).getTime())
                    .sort((a, b) => a - b)[0]
                  if (!next) return '—'
                  const days = Math.ceil((next - Date.now()) / 86400000)
                  return days <= 0 ? 'Today' : `${days}d`
                })()}
              </div>
              <div className="ms-stat-label">Next Renewal</div>
            </div>
          </div>
        </div>

        {loading && (
          <div className="ms-loading">
            <RefreshCw size={24} className="spin" />
            <span>Loading your services…</span>
          </div>
        )}

        {error && (
          <div className="ms-error">
            <XCircle size={18} /> {error}
          </div>
        )}

        {!loading && !error && (
          <>
            {/* Active Servers */}
            <section className="ms-section">
              <h2 className="ms-section-title"><Server size={18} /> Active Servers</h2>
              {activeServers.length === 0 ? (
                <div className="ms-empty">
                  <Server size={32} />
                  <p>No active servers yet.</p>
                  <Link to="/vps" className="btn-primary">Browse Plans <ChevronRight size={15} /></Link>
                </div>
              ) : (
                <div className="ms-servers-grid">
                  {activeServers.map(order => {
                    const days = daysUntil(order.renewal_date)
                    const urgent = days !== null && days <= 7
                    return (
                      <div key={order.order_ref} className={`ms-server-card${urgent ? ' urgent' : ''}`}>
                        <div className="ms-server-header">
                          <div className="ms-server-name">
                            <ProvisionIcon status={order.provision_status} />
                            <span>{order.plan_name}</span>
                          </div>
                          <StatusBadge status={order.provision_status} />
                        </div>

                        <div className="ms-server-specs">
                          <div className="ms-spec"><MemoryStick size={13} />{order.ram || '—'} RAM</div>
                          <div className="ms-spec"><Cpu size={13} />{order.vcores || '—'} vCores</div>
                          <div className="ms-spec"><HardDrive size={13} />{order.disk || '—'}</div>
                        </div>

                        <div className="ms-server-meta">
                          <div className="ms-meta-row">
                            <span>Order Ref</span>
                            <code>{order.order_ref}</code>
                          </div>
                          <div className="ms-meta-row">
                            <span>Billing</span>
                            <span className="capitalize">{order.billing_cycle} · ₹{order.price}</span>
                          </div>
                          <div className={`ms-meta-row${urgent ? ' urgent-text' : ''}`}>
                            <span><Clock size={12} /> Next Renewal</span>
                            <span>{fmtDate(order.renewal_date)}{urgent && days !== null && ` (${days}d)`}</span>
                          </div>
                        </div>

                        {order.panel_url && (
                          <a href={order.panel_url} target="_blank" rel="noreferrer" className="ms-panel-btn">
                            Open Panel <ExternalLink size={13} />
                          </a>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
            </section>

            {/* Payment History */}
            <section className="ms-section">
              <h2 className="ms-section-title"><CreditCard size={18} /> Payment History</h2>
              {orders.length === 0 ? (
                <div className="ms-empty">
                  <CreditCard size={32} />
                  <p>No orders found.</p>
                </div>
              ) : (
                <div className="ms-table-wrap">
                  <table className="ms-table">
                    <thead>
                      <tr>
                        <th>Order Ref</th>
                        <th>Plan</th>
                        <th>Cycle</th>
                        <th>Amount</th>
                        <th>Payment</th>
                        <th>Server</th>
                        <th>Date</th>
                        <th>Renewal</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map(order => (
                        <tr key={order.order_ref}>
                          <td><code className="ms-ref">{order.order_ref}</code></td>
                          <td>
                            <div className="ms-plan-cell">
                              <span>{order.plan_name}</span>
                              <span className="ms-category">{order.plan_category}</span>
                            </div>
                          </td>
                          <td className="capitalize">{order.billing_cycle}</td>
                          <td className="ms-amount">₹{order.price}</td>
                          <td><StatusBadge status={order.status} /></td>
                          <td><StatusBadge status={order.provision_status} /></td>
                          <td className="ms-date">{fmtDate(order.created_at)}</td>
                          <td className="ms-date">{fmtDate(order.renewal_date)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          </>
        )}
      </div>
    </main>
  )
}
