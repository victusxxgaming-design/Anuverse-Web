import { CheckCircle, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

interface Plan {
  name: string
  price: string
  per?: string
  popular?: boolean
  specs: [string, string][]
}

interface ServicePageProps {
  tag: string
  title: string
  description: string
  features: string[]
  plans: Plan[]
  comingSoon?: boolean
}

export default function ServicePage({ tag, title, description, features, plans, comingSoon }: ServicePageProps) {
  return (
    <main style={{ paddingTop: 'var(--nav-h)' }}>
      {/* Header */}
      <section style={{
        padding: '80px 0 60px',
        textAlign: 'center',
        background: 'radial-gradient(ellipse 70% 50% at 50% 0%, rgba(29,78,216,0.14) 0%, transparent 60%)',
        borderBottom: '1px solid var(--bg-border)',
      }}>
        <div className="container">
          <div className="section-tag" style={{ margin: '0 auto 20px' }}>
            <span className="dot" />{tag}
          </div>
          <h1 className="section-title" style={{ fontSize: 'clamp(32px, 5vw, 56px)', marginBottom: 16 }}>
            {title}
          </h1>
          <p className="section-desc" style={{ marginBottom: 0 }}>{description}</p>
        </div>
      </section>

      {/* Feature pills */}
      {features.length > 0 && (
        <section style={{ padding: '28px 0', background: 'var(--bg-secondary)', borderBottom: '1px solid var(--bg-border)' }}>
          <div className="container">
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'center' }}>
              {features.map(f => (
                <div key={f} className="hero-pill"><CheckCircle size={13} />{f}</div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Plans or Coming Soon */}
      <section style={{ padding: '80px 0' }}>
        <div className="container">
          {comingSoon ? (
            <div style={{ textAlign: 'center', padding: '60px 0' }}>
              <div style={{ fontSize: 64, marginBottom: 24 }}>🚀</div>
              <h2 className="section-title" style={{ marginBottom: 16 }}>Coming Soon</h2>
              <p className="section-desc" style={{ marginBottom: 36 }}>
                We're working hard to bring you these plans. Join our Discord to be notified when they launch.
              </p>
              <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
                <a href="https://discord.anuvverse.com/" target="_blank" rel="noreferrer" className="btn-primary">
                  Join Discord <ArrowRight size={14} />
                </a>
                <Link to="/" className="btn-secondary">Back to Home</Link>
              </div>
            </div>
          ) : (
            <>
              <div className="section-header">
                <div className="section-tag"><span className="dot" />Plans</div>
                <h2 className="section-title">{tag} Plans</h2>
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
                      <div style={{ position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)', background: 'var(--blue)', color: '#fff', fontSize: 11, fontWeight: 700, padding: '3px 14px', borderRadius: 'var(--radius-full)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                        Most Popular
                      </div>
                    )}
                    <div style={{ fontSize: 18, fontWeight: 700, color: '#fff', marginBottom: 8 }}>{p.name}</div>
                    <div style={{ fontSize: 32, fontWeight: 800, color: p.popular ? 'var(--blue-light)' : '#fff', fontFamily: 'var(--font-heading)', marginBottom: 4 }}>
                      {p.price}<span style={{ fontSize: 14, color: 'var(--text-secondary)', fontWeight: 400 }}>{p.per ?? '/mo'}</span>
                    </div>
                    <div style={{ borderTop: '1px solid var(--bg-border)', margin: '18px 0', paddingTop: 18, display: 'flex', flexDirection: 'column', gap: 10 }}>
                      {p.specs.map(([k, v]) => (
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
            </>
          )}
        </div>
      </section>
    </main>
  )
}
