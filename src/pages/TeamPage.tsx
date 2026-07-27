import { MessageSquare } from 'lucide-react'

const team = [
  {
    name: 'Anurag',
    role: 'Founder & CEO',
    desc: 'Visionary behind Anuverse. Leads company strategy, infrastructure decisions, and community growth.',
    avatar: '🎯',
    color: '#2563eb',
  },
  {
    name: 'Dev Team',
    role: 'Platform Engineers',
    desc: 'Responsible for backend systems, automation, Pterodactyl integration, and keeping everything running smoothly.',
    avatar: '⚙️',
    color: '#7c3aed',
  },
  {
    name: 'Support Team',
    role: 'Customer Support',
    desc: 'First responders for every ticket and Discord message. Real humans who genuinely care about solving your problems.',
    avatar: '💬',
    color: '#0891b2',
  },
  {
    name: 'Network Team',
    role: 'Network & Infrastructure',
    desc: 'Manages our nodes across India and Singapore. Handles DDoS mitigation, hardware upgrades, and uptime monitoring.',
    avatar: '🌐',
    color: '#059669',
  },
]

const openRoles = [
  { title: 'Support Agent', type: 'Volunteer', desc: 'Help customers in our Discord server. Great for people who love gaming and helping others.' },
  { title: 'Community Manager', type: 'Part-time', desc: 'Grow and moderate our Discord community. Organize events and keep the vibe positive.' },
]

export default function TeamPage() {
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
          <div className="section-tag" style={{ margin: '0 auto 20px' }}><span className="dot" />The People</div>
          <h1 className="section-title" style={{ fontSize: 'clamp(32px, 5vw, 56px)', marginBottom: 20 }}>
            Meet the Team Behind<br />
            <span style={{ color: 'var(--blue)' }}>Anuverse</span>
          </h1>
          <p className="section-desc" style={{ maxWidth: 560, margin: '0 auto' }}>
            A small but passionate team of gamers and engineers working to make hosting better for everyone in Asia.
          </p>
        </div>
      </section>

      {/* Team cards */}
      <section style={{ padding: '90px 0', borderBottom: '1px solid var(--bg-border)' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 20 }}>
            {team.map(({ name, role, desc, avatar, color }) => (
              <div key={name} style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--bg-border)',
                borderRadius: 'var(--radius-xl)',
                padding: '36px 28px',
                textAlign: 'center',
                transition: 'border-color 0.25s, transform 0.25s',
                cursor: 'default',
              }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLDivElement).style.borderColor = `${color}55`
                  ;(e.currentTarget as HTMLDivElement).style.transform = 'translateY(-3px)'
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--bg-border)'
                  ;(e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)'
                }}
              >
                <div style={{
                  width: 72, height: 72,
                  borderRadius: '50%',
                  background: `${color}1a`,
                  border: `2px solid ${color}44`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 32,
                  margin: '0 auto 20px',
                }}>
                  {avatar}
                </div>
                <div style={{ fontFamily: 'var(--font-heading)', fontSize: 18, fontWeight: 700, color: '#fff', marginBottom: 6 }}>{name}</div>
                <div style={{ fontSize: 13, fontWeight: 600, color, marginBottom: 14, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{role}</div>
                <p style={{ fontSize: 13.5, color: 'var(--text-secondary)', lineHeight: 1.65 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Open roles */}
      <section style={{ padding: '90px 0', background: 'var(--bg-secondary)', borderBottom: '1px solid var(--bg-border)' }}>
        <div className="container">
          <div className="section-header">
            <div className="section-tag"><span className="dot" />Join Us</div>
            <h2 className="section-title">Open Positions</h2>
            <p className="section-desc">We're always looking for passionate people to join the Anuverse team.</p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, maxWidth: 700, margin: '0 auto' }}>
            {openRoles.map(({ title, type, desc }) => (
              <div key={title} style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--bg-border)',
                borderRadius: 'var(--radius-lg)',
                padding: '22px 28px',
                display: 'flex',
                alignItems: 'center',
                gap: 20,
              }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
                    <span style={{ fontFamily: 'var(--font-heading)', fontSize: 16, fontWeight: 600, color: '#fff' }}>{title}</span>
                    <span style={{ fontSize: 11, fontWeight: 700, padding: '2px 10px', borderRadius: 'var(--radius-full)', background: 'rgba(37,99,235,0.12)', color: 'var(--blue-light)', letterSpacing: '0.04em' }}>{type}</span>
                  </div>
                  <p style={{ fontSize: 13.5, color: 'var(--text-secondary)', lineHeight: 1.5 }}>{desc}</p>
                </div>
                <a href="https://discord.anuvverse.com/" target="_blank" rel="noreferrer" className="btn-primary" style={{ whiteSpace: 'nowrap', fontSize: 13 }}>
                  <MessageSquare size={13} /> Apply
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-box">
            <div className="cta-title">Want to Work With Us?</div>
            <p className="cta-desc">Reach out on Discord and introduce yourself. We love hearing from motivated people.</p>
            <div className="cta-btns">
              <a href="https://discord.anuvverse.com/" target="_blank" rel="noreferrer" className="btn-primary">
                Join Our Discord
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
