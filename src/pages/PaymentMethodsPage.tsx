import { Shield, Clock, IndianRupee } from 'lucide-react'

const methods = [
  {
    emoji: '📱',
    name: 'UPI',
    desc: 'Pay instantly with any UPI app — PhonePe, Google Pay, Paytm, BHIM, and more. Payments reflect within seconds.',
    tags: ['Instant', 'Free', 'Recommended'],
    color: '#4ade80',
  },
  {
    emoji: '🏦',
    name: 'Net Banking',
    desc: 'Transfer directly from your bank account. Supported across all major Indian banks. NEFT/RTGS/IMPS accepted.',
    tags: ['Same day', 'All banks'],
    color: '#60a5fa',
  },
  {
    emoji: '💳',
    name: 'Debit / Credit Card',
    desc: 'Visa, Mastercard, and RuPay cards are accepted through our secure payment gateway. 3D Secure enabled.',
    tags: ['Instant', 'Secure'],
    color: '#a78bfa',
  },
  {
    emoji: '🪙',
    name: 'Wallet Balance',
    desc: 'Pre-load your Anuverse client account with wallet credits and use them for instant plan renewals or upgrades.',
    tags: ['Instant', 'Portal only'],
    color: '#fb923c',
  },
]

const faqs = [
  {
    q: 'Is my payment information secure?',
    a: 'Yes. We do not store card details on our servers. All payment data is processed through PCI-DSS compliant gateways. UPI payments are end-to-end encrypted by your UPI provider.',
  },
  {
    q: 'What currencies do you accept?',
    a: 'All payments are processed in Indian Rupees (INR). We do not currently accept foreign currencies directly, but international customers can use cards that support INR conversion.',
  },
  {
    q: 'How long does it take for payments to reflect?',
    a: 'UPI payments reflect instantly. Net banking transfers (NEFT) may take up to 30 minutes. Card payments typically reflect within 5 minutes. If your payment hasn\'t reflected in 2 hours, open a support ticket.',
  },
  {
    q: 'Do you offer GST invoices?',
    a: 'Yes. GST invoices are automatically generated and available in your client portal for every payment. As an MSME-registered business, we comply with Indian GST regulations.',
  },
  {
    q: 'Can I pay for multiple months at once?',
    a: 'Yes. We offer discounts for quarterly and annual prepayments. Contact us on Discord or check the client portal for current prepayment offers.',
  },
]

export default function PaymentMethodsPage() {
  return (
    <main style={{ paddingTop: 'var(--nav-h)', minHeight: '100vh' }}>
      {/* Hero */}
      <section style={{
        padding: '80px 0 60px',
        textAlign: 'center',
        background: 'radial-gradient(ellipse 60% 40% at 50% 0%, rgba(29,78,216,0.12) 0%, transparent 60%)',
        borderBottom: '1px solid var(--bg-border)',
      }}>
        <div className="container">
          <div className="section-tag" style={{ margin: '0 auto 20px' }}><span className="dot" />Payments</div>
          <h1 className="section-title" style={{ fontSize: 'clamp(30px, 5vw, 52px)', marginBottom: 16 }}>
            Simple, Secure Payments
          </h1>
          <p className="section-desc">
            Multiple payment options built for Indian customers — no international cards required.
          </p>
        </div>
      </section>

      {/* Trust badges */}
      <section style={{ padding: '24px 0', background: 'var(--bg-secondary)', borderBottom: '1px solid var(--bg-border)' }}>
        <div className="container">
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'center' }}>
            {[
              [<Shield size={13} />, 'PCI-DSS Compliant'],
              [<IndianRupee size={13} />, 'INR Pricing'],
              [<Clock size={13} />, 'Instant Activation'],
              ['🇮🇳', 'Indian Business — MSME Registered'],
            ].map(([icon, label], i) => (
              <div key={i} className="hero-pill">{icon as React.ReactNode}{label as string}</div>
            ))}
          </div>
        </div>
      </section>

      {/* Payment methods */}
      <section style={{ padding: '80px 0', borderBottom: '1px solid var(--bg-border)' }}>
        <div className="container">
          <div className="section-header">
            <div className="section-tag"><span className="dot" />Accepted Methods</div>
            <h2 className="section-title">How to Pay</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16 }}>
            {methods.map(({ emoji, name, desc, tags, color }) => (
              <div key={name} style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--bg-border)',
                borderRadius: 'var(--radius-xl)',
                padding: 28,
                transition: 'border-color 0.25s, transform 0.25s',
              }}>
                <div style={{ fontSize: 40, marginBottom: 16 }}>{emoji}</div>
                <div style={{ fontFamily: 'var(--font-heading)', fontSize: 18, fontWeight: 700, color: '#fff', marginBottom: 10 }}>{name}</div>
                <p style={{ fontSize: 13.5, color: 'var(--text-secondary)', lineHeight: 1.65, marginBottom: 16 }}>{desc}</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {tags.map(tag => (
                    <span key={tag} style={{
                      fontSize: 11,
                      fontWeight: 600,
                      padding: '3px 10px',
                      borderRadius: 'var(--radius-full)',
                      background: `${color}18`,
                      color,
                      border: `1px solid ${color}33`,
                    }}>{tag}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ padding: '80px 0', background: 'var(--bg-secondary)', borderBottom: '1px solid var(--bg-border)' }}>
        <div className="container">
          <div className="section-header">
            <div className="section-tag"><span className="dot" />FAQ</div>
            <h2 className="section-title">Payment Questions</h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, maxWidth: 720, margin: '0 auto' }}>
            {faqs.map(({ q, a }) => (
              <div key={q} style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--bg-border)',
                borderRadius: 'var(--radius-lg)',
                padding: '22px 24px',
              }}>
                <div style={{ fontFamily: 'var(--font-heading)', fontSize: 15, fontWeight: 600, color: '#fff', marginBottom: 10 }}>{q}</div>
                <p style={{ fontSize: 13.5, color: 'var(--text-secondary)', lineHeight: 1.65 }}>{a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-box">
            <div className="cta-title">Ready to Get Started?</div>
            <p className="cta-desc">Browse plans, pick one, and be online in minutes — no complex setup.</p>
            <div className="cta-btns">
              <a href="https://client.anuvverse.com/" target="_blank" rel="noreferrer" className="btn-primary">Order Now</a>
              <a href="https://discord.anuvverse.com/" target="_blank" rel="noreferrer" className="btn-secondary">Need Help?</a>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
