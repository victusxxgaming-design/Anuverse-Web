import { CheckCircle, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

const plans = [
  {
    name: 'Creeper',
    ram: '2 GB',
    cpu: '200%',
    disk: '15 GB',
    price: '₹199',
    per: '/mo',
    popular: false,
  },
  {
    name: 'Skeleton',
    ram: '4 GB',
    cpu: '300%',
    disk: '25 GB',
    price: '₹349',
    per: '/mo',
    popular: true,
  },
  {
    name: 'Enderman',
    ram: '8 GB',
    cpu: '400%',
    disk: '40 GB',
    price: '₹649',
    per: '/mo',
    popular: false,
  },
  {
    name: 'Warden',
    ram: '16 GB',
    cpu: '600%',
    disk: '80 GB',
    price: '₹1,199',
    per: '/mo',
    popular: false,
  },
]

const features = [
  'Instant Setup',
  'DDoS Protection',
  'NVMe SSDs',
  'Daily Backups',
  'Custom JARs',
  '24/7 Support',
  'Pterodactyl Panel',
  'Mod Support',
]

export default function MinecraftPage() {
  return (
    <main style={{ paddingTop: 'var(--nav-h)' }}>
      {/* Hero */}
      <section style={{
        padding: '80px 0 60px',
        textAlign: 'center',
        background: 'radial-gradient(ellipse 70% 50% at 50% 0%, rgba(29,78,216,0.14) 0%, transparent 60%)',
        borderBottom: '1px solid var(--bg-border)',
      }}>
        <div className="container">
          <div className="section-tag" style={{ margin: '0 auto 20px' }}><span className="dot" />Minecraft Hosting</div>
          <h1 className="section-title" style={{ fontSize: 'clamp(32px, 5vw, 56px)', marginBottom: 16 }}>
            Power Your Minecraft Server
          </h1>
          <p className="section-desc" style={{ marginBottom: 0 }}>
            Premium Indian metal in Delhi & Mumbai plus Singapore nodes.
            Sub-10ms ping for South & Southeast Asian players.
          </p>
        </div>
      </section>

      {/* Features strip */}
      <section style={{ padding: '28px 0', background: 'var(--bg-secondary)', borderBottom: '1px solid var(--bg-border)' }}>
        <div className="container">
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'center' }}>
            {features.map(f => (
              <div key={f} className="hero-pill">
                <CheckCircle size={13} />{f}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Plans */}
      <section style={{ padding: '80px 0' }}>
        <div className="container">
          <div className="section-header">
            <div className="section-tag"><span className="dot" />Plans</div>
            <h2 className="section-title">Choose Your Plan</h2>
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
                  <div style={{
                    position: 'absolute',
                    top: -12,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: 'var(--blue)',
                    color: '#fff',
                    fontSize: 11,
                    fontWeight: 700,
                    padding: '3px 14px',
                    borderRadius: 'var(--radius-full)',
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                  }}>Most Popular</div>
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

      {/* CTA */}
      <section style={{ padding: '0 0 80px' }}>
        <div className="container">
          <div className="cta-box">
            <h2 className="cta-title">Need a Custom Plan?</h2>
            <p className="cta-desc">Contact us on Discord for custom RAM, CPU, and disk configurations.</p>
            <div className="cta-btns">
              <a href="https://discord.anuvverse.com/" target="_blank" rel="noreferrer" className="btn-primary">
                Open a Ticket <ArrowRight size={16} />
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
