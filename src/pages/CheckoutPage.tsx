import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from 'react'
import { ArrowLeft, ArrowRight, CheckCircle2, Copy, ExternalLink, FileImage, ShieldCheck, Smartphone } from 'lucide-react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { BillingCycle, createOrder, flattenPlans, getApiError, getMinecraftPlans, getVpsPlans, Plan, submitPayment } from '../api'
import { useAuth } from '../context/AuthContext'

const cycleLabels: Record<BillingCycle, string> = { monthly: 'Monthly', quarterly: 'Quarterly', annually: 'Annual' }

export default function CheckoutPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const category = params.get('category') === 'vps' ? 'vps' : 'minecraft'
  const planId = params.get('plan') || ''
  const [plans, setPlans] = useState<Plan[]>([])
  const [cycle, setCycle] = useState<BillingCycle>('monthly')
  const [name, setName] = useState(user ? user.name : '')
  const [email, setEmail] = useState(user ? user.email : '')
  const [discord, setDiscord] = useState('')
  const [utr, setUtr] = useState('')
  const [screenshot, setScreenshot] = useState<File | null>(null)
  const [order, setOrder] = useState<{ order_ref: string; upi_uri: string; amount: number; plan_name: string } | null>(null)
  const [copied, setCopied] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (user === false) navigate(`/auth?next=${encodeURIComponent(location.pathname + location.search)}`)
  }, [user, navigate])

  useEffect(() => {
    Promise.all([category === 'vps' ? getVpsPlans() : getMinecraftPlans()])
      .then(([categories]) => setPlans(flattenPlans(categories)))
      .catch((err) => setError(getApiError(err)))
  }, [category])

  const selectedPlan = useMemo(() => plans.find((plan) => plan.id === planId) || plans[0], [plans, planId])
  const amount = selectedPlan?.price[cycle] || 0

  async function startOrder(event: FormEvent) {
    event.preventDefault()
    if (!selectedPlan) return
    setError('')
    setBusy(true)
    try {
      const created = await createOrder({ plan_id: selectedPlan.id, plan_category: category, billing_cycle: cycle, customer_name: name, email, discord })
      setOrder(created)
    } catch (err) {
      setError(getApiError(err))
    } finally {
      setBusy(false)
    }
  }

  async function finishPayment(event: FormEvent) {
    event.preventDefault()
    if (!order || !screenshot) return
    setError('')
    setBusy(true)
    try {
      await submitPayment(order.order_ref, utr, screenshot)
      navigate('/dashboard?payment=submitted')
    } catch (err) {
      setError(getApiError(err))
    } finally {
      setBusy(false)
    }
  }

  function pickFile(event: ChangeEvent<HTMLInputElement>) {
    setScreenshot(event.target.files?.[0] || null)
  }

  if (user === null || user === false) return <div className="page-loading"><div className="spinner" />Loading checkout…</div>

  return (
    <main className="checkout-page">
      <div className="container">
        <Link to={category === 'vps' ? '/vps' : '/minecraft'} className="back-link checkout-back"><ArrowLeft size={15} /> Back to plans</Link>
        <div className="checkout-heading"><div className="eyebrow">Secure checkout</div><h1>Get your <span>{selectedPlan?.name || 'hosting plan'}</span> online.</h1><p>Complete your details, pay securely via UPI, and send us your payment proof.</p></div>
        <div className="checkout-layout">
          {!order ? (
            <form className="checkout-card checkout-form" onSubmit={startOrder}>
              <div className="checkout-card-title"><span className="step-number">01</span><div><h2>Service details</h2><p>Tell us where to send your access details.</p></div></div>
              <div className="selected-plan-summary"><div><span className="summary-label">{category === 'vps' ? 'VPS hosting' : 'Minecraft hosting'}</span><strong>{selectedPlan?.name || 'Loading plan…'}</strong></div><span className="summary-price">₹{amount.toLocaleString('en-IN')} <small>/ {cycle === 'annually' ? 'yr' : cycle === 'quarterly' ? 'qtr' : 'mo'}</small></span></div>
              <div className="cycle-picker">{(Object.keys(cycleLabels) as BillingCycle[]).map((key) => <button type="button" key={key} className={cycle === key ? 'active' : ''} onClick={() => setCycle(key)}><span>{cycleLabels[key]}</span><small>₹{selectedPlan?.price[key]?.toLocaleString('en-IN') || '—'}</small></button>)}</div>
              <div className="form-grid">
                <label className="field"><span>Name</span><input required minLength={2} value={name} onChange={(e) => setName(e.target.value)} placeholder="Your full name" /></label>
                <label className="field"><span>Email</span><input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" /></label>
                <label className="field full"><span>Discord username</span><input required value={discord} onChange={(e) => setDiscord(e.target.value)} placeholder="username or username#0000" /></label>
              </div>
              {error && <div className="form-error">{error}</div>}
              <button className="btn-primary checkout-submit" disabled={busy || !selectedPlan}>{busy ? 'Preparing order…' : 'Continue to payment'} <ArrowRight size={16} /></button>
            </form>
          ) : (
            <form className="checkout-card checkout-form" onSubmit={finishPayment}>
              <div className="checkout-card-title"><span className="step-number">02</span><div><h2>Send payment proof</h2><p>Order <strong>{order.order_ref}</strong> is ready for payment.</p></div></div>
              <div className="upi-panel"><div className="upi-icon"><Smartphone size={22} /></div><div><span>Pay securely using any UPI app</span><strong>₹{order.amount.toLocaleString('en-IN')}</strong><small>Tap the button or copy the payment link below.</small></div></div>
              <div className="payment-actions"><a className="btn-primary" href={order.upi_uri}>Open UPI app <ExternalLink size={15} /></a><button type="button" className="btn-secondary" onClick={() => { navigator.clipboard?.writeText(order.upi_uri); setCopied(true); setTimeout(() => setCopied(false), 1800) }}>{copied ? <CheckCircle2 size={15} /> : <Copy size={15} />} {copied ? 'Copied' : 'Copy UPI link'}</button></div>
              <div className="form-grid"><label className="field full"><span>UTR / transaction ID</span><input required value={utr} onChange={(e) => setUtr(e.target.value)} placeholder="Enter the 12-digit reference number" /></label><label className="upload-field full"><span>Payment screenshot</span><input required type="file" accept="image/png,image/jpeg,image/webp,image/gif" onChange={pickFile} /><div className="upload-box"><FileImage size={20} /><strong>{screenshot?.name || 'Upload payment screenshot'}</strong><small>PNG, JPG, WebP or GIF · max 5 MB</small></div></label></div>
              {error && <div className="form-error">{error}</div>}
              <button className="btn-primary checkout-submit" disabled={busy || !screenshot || !utr}>{busy ? 'Submitting proof…' : 'Submit payment proof'} <CheckCircle2 size={16} /></button>
            </form>
          )}
          <aside className="checkout-aside"><div className="aside-card"><div className="aside-top"><span className="eyebrow">Your order</span><span className="secure-chip"><ShieldCheck size={13} /> Secure</span></div><h3>{selectedPlan?.name || 'Selected plan'}</h3><p>{category === 'vps' ? 'Virtual private server' : 'Minecraft game server'} · {cycleLabels[cycle]}</p><div className="aside-line"><span>Plan</span><strong>₹{amount.toLocaleString('en-IN')}</strong></div><div className="aside-line"><span>Setup fee</span><strong>₹0</strong></div><div className="aside-total"><span>Total today</span><strong>₹{amount.toLocaleString('en-IN')}</strong></div></div><div className="checkout-note"><CheckCircle2 size={16} /><p>Payment is reviewed by our team. Your server is provisioned as soon as it is confirmed.</p></div></aside>
        </div>
      </div>
    </main>
  )
}