import { AlertTriangle, CheckCircle, XCircle } from 'lucide-react'

export default function RefundPage() {
  const updated = 'July 1, 2025'

  return (
    <main style={{ paddingTop: 'var(--nav-h)', minHeight: '100vh' }}>
      <section style={{
        padding: '70px 0 50px',
        borderBottom: '1px solid var(--bg-border)',
        background: 'radial-gradient(ellipse 60% 40% at 50% 0%, rgba(29,78,216,0.10) 0%, transparent 60%)',
      }}>
        <div className="container">
          <div className="section-tag" style={{ marginBottom: 20 }}><span className="dot" />Legal</div>
          <h1 className="section-title" style={{ textAlign: 'left', marginBottom: 10 }}>Refund Policy</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 13.5 }}>Last updated: {updated}</p>
        </div>
      </section>

      <section style={{ padding: '60px 0' }}>
        <div className="container">
          <div style={{ maxWidth: 760 }}>

            {/* Notice */}
            <div style={{
              background: 'rgba(37,99,235,0.08)',
              border: '1px solid rgba(37,99,235,0.25)',
              borderRadius: 'var(--radius-lg)',
              padding: '20px 24px',
              display: 'flex',
              gap: 14,
              alignItems: 'flex-start',
              marginBottom: 48,
            }}>
              <AlertTriangle size={20} style={{ color: 'var(--blue-light)', flexShrink: 0, marginTop: 2 }} />
              <div>
                <div style={{ fontWeight: 600, color: '#fff', marginBottom: 6, fontSize: 15 }}>Please Read Before Purchasing</div>
                <p style={{ color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.65 }}>
                  Anuverse operates on a limited refund policy. We strongly encourage you to join our Discord
                  and ask questions before purchasing if you're unsure about a plan.
                </p>
              </div>
            </div>

            {/* Eligible */}
            <div style={{ marginBottom: 48 }}>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 19, fontWeight: 700, color: '#fff', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10 }}>
                <CheckCircle size={20} style={{ color: '#4ade80' }} /> When Refunds Are Eligible
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {[
                  { title: '24-Hour Money-Back', desc: 'New customers may request a full refund within 24 hours of their first purchase if the service has not been significantly used (less than 10% resource usage).' },
                  { title: 'Service Failure', desc: 'If we are unable to provision your service within 48 hours of payment, you are entitled to a full refund.' },
                  { title: 'Extended Downtime', desc: 'If your service experiences downtime exceeding 72 consecutive hours due to our infrastructure (not your actions), you may request a pro-rated refund for the affected period.' },
                  { title: 'Billing Errors', desc: 'If you were charged incorrectly or charged for a service you did not order, we will issue a full refund immediately upon verification.' },
                ].map(({ title, desc }) => (
                  <div key={title} style={{
                    background: 'var(--bg-card)',
                    border: '1px solid var(--bg-border)',
                    borderRadius: 'var(--radius-lg)',
                    padding: '18px 22px',
                  }}>
                    <div style={{ fontSize: 15, fontWeight: 600, color: '#fff', marginBottom: 6 }}>{title}</div>
                    <p style={{ fontSize: 13.5, color: 'var(--text-secondary)', lineHeight: 1.65 }}>{desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Not eligible */}
            <div style={{ marginBottom: 48 }}>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 19, fontWeight: 700, color: '#fff', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10 }}>
                <XCircle size={20} style={{ color: 'var(--blue-light)' }} /> When Refunds Are Not Applicable
              </h2>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[
                  'Refund requests made after 24 hours of purchase (unless service failure)',
                  'Services that have been suspended due to Terms of Service violations',
                  'Partial month cancellations after the billing cycle has started',
                  'Add-ons, domain registrations, or setup fees',
                  'Services affected by issues caused by the customer (misconfiguration, abuse, etc.)',
                  'Change-of-mind cancellations after 24 hours',
                  'Prepaid discounted plans or promotional offers (unless otherwise stated)',
                ].map(item => (
                  <li key={item} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                    <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--blue)', flexShrink: 0, marginTop: 8 }} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Process */}
            <div>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 19, fontWeight: 700, color: '#fff', marginBottom: 20 }}>
                How to Request a Refund
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {[
                  { step: '1', text: 'Open a support ticket in our Discord server (discord.anuvverse.com) or via the client portal.' },
                  { step: '2', text: 'Provide your order ID, registered email address, and reason for the refund request.' },
                  { step: '3', text: 'Our team will review your request within 24–48 hours and notify you of the outcome.' },
                  { step: '4', text: 'Approved refunds are processed within 3–7 business days to the original payment method.' },
                ].map(({ step, text }) => (
                  <div key={step} style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                    <div style={{
                      width: 32, height: 32, borderRadius: '50%',
                      background: 'rgba(37,99,235,0.12)',
                      border: '1px solid rgba(37,99,235,0.3)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 14, color: 'var(--blue-light)',
                      flexShrink: 0,
                    }}>{step}</div>
                    <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.65, paddingTop: 6 }}>{text}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>
    </main>
  )
}
