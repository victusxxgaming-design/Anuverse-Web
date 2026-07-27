import { Shield, Zap, Globe, Users, Award, HeartHandshake } from 'lucide-react'

const values = [
  { icon: <Zap size={20} />, title: 'Performance First', desc: 'Every server we offer runs on enterprise-grade hardware with NVMe SSDs and high-frequency CPUs to deliver the best possible performance for our customers.' },
  { icon: <Shield size={20} />, title: 'Always Protected', desc: 'Our network is backed by multi-layer DDoS mitigation that automatically scrubs malicious traffic, keeping your services online 24/7.' },
  { icon: <Globe size={20} />, title: 'Global Infrastructure', desc: 'With nodes in India and Singapore, we\'re expanding our footprint across Asia to bring low-latency hosting closer to your players.' },
  { icon: <Users size={20} />, title: 'Community-Driven', desc: 'We started as gamers ourselves. Our pricing, plans, and support are all shaped by the community — with transparency and fairness at the core.' },
  { icon: <Award size={20} />, title: 'MSME Registered', desc: 'Anuverse is a registered Micro, Small & Medium Enterprise under the Government of India, giving our customers the confidence of a legitimate business.' },
  { icon: <HeartHandshake size={20} />, title: 'Honest Support', desc: 'No bots, no scripted replies. Our support team consists of real people who understand your stack and work to resolve issues, not just close tickets.' },
]

export default function AboutPage() {
  return (
    <main style={{ paddingTop: 'var(--nav-h)' }}>
      {/* Hero */}
      <section style={{
        padding: '90px 0 70px',
        textAlign: 'center',
        background: 'radial-gradient(ellipse 70% 50% at 50% 0%, rgba(29,78,216,0.14) 0%, transparent 60%)',
        borderBottom: '1px solid var(--bg-border)',
      }}>
        <div className="container">
          <div className="section-tag" style={{ margin: '0 auto 20px' }}><span className="dot" />Our Story</div>
          <h1 className="section-title" style={{ fontSize: 'clamp(32px, 5vw, 56px)', marginBottom: 20 }}>
            Built by Gamers,<br />
            <span style={{ color: 'var(--blue)' }}>for Gamers</span>
          </h1>
          <p className="section-desc" style={{ maxWidth: 620, margin: '0 auto' }}>
            Anuverse was founded with a single mission: provide Indian and Asian gaming communities
            with hosting that actually performs — at a price that doesn't require a second job.
          </p>
        </div>
      </section>

      {/* Story section */}
      <section style={{ padding: '90px 0', borderBottom: '1px solid var(--bg-border)' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60, alignItems: 'center' }}>
            <div>
              <div className="section-tag"><span className="dot" />Who We Are</div>
              <h2 className="section-title" style={{ textAlign: 'left', marginBottom: 16 }}>
                Affordable Hosting Without Compromise
              </h2>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.75, marginBottom: 20, fontSize: 15 }}>
                We've been in the Minecraft community long enough to know the frustration of paying premium prices
                for servers that lag, support that ghosts you, and companies that disappear overnight.
              </p>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.75, marginBottom: 20, fontSize: 15 }}>
                Anuverse was built to fix that. We run our own infrastructure across India and Singapore,
                giving us direct control over the hardware, network, and quality of service we deliver.
              </p>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.75, fontSize: 15 }}>
                Every plan we offer has been tested and benchmarked by our own team. If it doesn't pass our
                internal bar for performance, it doesn't go live.
              </p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              {[
                { label: 'Customers Served', value: '500+' },
                { label: 'Uptime SLA', value: '99.9%' },
                { label: 'Data Centers', value: '4' },
                { label: 'Support Response', value: '<2h' },
              ].map(({ label, value }) => (
                <div key={label} style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--bg-border)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '28px 20px',
                  textAlign: 'center',
                }}>
                  <div style={{ fontFamily: 'var(--font-heading)', fontSize: 36, fontWeight: 800, color: 'var(--blue-light)', marginBottom: 8 }}>{value}</div>
                  <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section style={{ padding: '90px 0', background: 'var(--bg-secondary)', borderBottom: '1px solid var(--bg-border)' }}>
        <div className="container">
          <div className="section-header">
            <div className="section-tag"><span className="dot" />Our Values</div>
            <h2 className="section-title">What We Stand For</h2>
            <p className="section-desc">These aren't marketing words. They're the commitments that drive every decision we make.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
            {values.map(({ icon, title, desc }) => (
              <div key={title} className="feature-card" style={{ flexDirection: 'column' }}>
                <div className="feature-icon">{icon}</div>
                <div className="feature-body">
                  <div className="feature-name">{title}</div>
                  <div className="feature-desc">{desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-box">
            <div className="cta-title">Ready to Join Anuverse?</div>
            <p className="cta-desc">Browse our plans and find the perfect fit for your game server or application.</p>
            <div className="cta-btns">
              <a href="https://client.anuvverse.com/" target="_blank" rel="noreferrer" className="btn-primary">
                Get Started
              </a>
              <a href="https://discord.anuvverse.com/" target="_blank" rel="noreferrer" className="btn-secondary">
                Join Discord
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
