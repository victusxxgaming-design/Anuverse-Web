import { CheckCircle, ArrowRight } from 'lucide-react'

const plans = [
  { name: 'Nano', ram: '2 GB', cpu: '2 vCores', disk: '40 GB NVMe', price: '₹299', per: '/mo', popular: false },
  { name: 'Micro', ram: '4 GB', cpu: '4 vCores', disk: '80 GB NVMe', price: '₹549', per: '/mo', popular: true },
  { name: 'Standard', ram: '8 GB', cpu: '6 vCores', disk: '160 GB NVMe', price: '₹999', per: '/mo', popular: false },
  { name: 'Pro', ram: '16 GB', cpu: '8 vCores', disk: '320 GB NVMe', price: '₹1,849', per: '/mo', popular: false },
]

const features = ['AMD EPYC Cores', 'Root Access', 'NVMe SSDs', 'KVM Virtualization', 'DDoS Protection', 'Instant Deploy', '24/7 Support', 'Linux/Windows']

export default function VPSPage() {
  return (
    <main style={{ paddingTop: 'var(--nav-h)' }}>
      <section style={{
        padding: '80px 0 60px',
        textAlign: 'center',
        background: 'radial-gradient(ellipse 70% 50% at 50% 0%, rgba(29,78,216,0.14) 0%, transparent 60%)',
        borderBottom: '1px solid var(--bg-border)',
      }}>
        <div className="container">
          <div className="section-tag" style={{ margin: '0 auto 20px' }}><span className="dot" />VPS Hosting</div>
          <h1 className="section-title" style={{ fontSize: 'clamp(32px, 5vw, 56px)', marginBottom: 16 }}>
            Xeon-Powered VPS Across Every Region
          </h1>
          <p className="section-desc" style={{ marginBottom: 0 }}>
            AMD EPYC cores, high core density, large networks — perfect for any demanding application.
          </p>
        </div>
      </section>

      <section style={{ padding: '28px 0', background: 'var(--bg-secondary)', borderBottom: '1px solid var(--bg-border)' }}>
        <div className="container">
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'center' }}>
            {features.map(f => (
              <div key={f} className="hero-pill"><CheckCircle size={13} />{f}</div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: '80px 0' }}>
        <div className="container">
          <div className="section-header">
            <div className="section-tag"><span className="dot" />Plans</div>
            <h2 className="section-title">VPS Plans</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
            {plans.map((p) => (
              <div key={p.name} style={{
                background: p.popular ? 'rgba(37,99,235,0.08)' : 'var(--bg-card)',
                border: `1px solid ${p.popular ? 'rgba(37,99,235,0.4)' : 'var(--bg-border)'}`,
                borderRadius: 'var(--radius-lg)',
                padding: 28,
                position: 'relative',
              }}>
                {p.popular && (
                  <div style={{ position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)', background: 'var(--blue)', color: '#fff', fontSize: 11, fontWeight: 700, padding: '3px 14px', borderRadius: 'var(--radius-full)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Most Popular</div>
                )}
                <div style={{ fontSize: 18, fontWeight: 700, color: '#fff', marginBottom: 8 }}>{p.name}</div>
                <div style={{ fontSize: 32, fontWeight: 800, color: p.popular ? 'var(--blue-light)' : '#fff', fontFamily: 'var(--font-heading)', marginBottom: 4 }}>
                  {p.price}<span style={{ fontSize: 14, color: 'var(--text-secondary)', fontWeight: 400 }}>{p.per}</span>
                </div>
                <div style={{ borderTop: '1px solid var(--bg-border)', margin: '18px 0', paddingTop: 18, display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {[['RAM', p.ram], ['CPU', p.cpu], ['Disk', p.disk]].map(([k, v]) => (
                    <div key={k} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13.5 }}>
                      <span style={{ color: 'var(--text-secondary)' }}>{k}</span>
                      <span style={{ color: '#fff', fontWeight: 600 }}>{v}</span>
                    </div>
                  ))}
                </div>
                <a href="https://client.anuvverse.com/" target="_blank" rel="noreferrer"
                  className={p.popular ? 'btn-primary' : 'btn-secondary'}
                  style={{ width: '100%', justifyContent: 'center', fontSize: 14, padding: '11px 0' }}>
                  Order Now <ArrowRight size={14} />
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
