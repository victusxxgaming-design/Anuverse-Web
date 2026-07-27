import { Server, Zap, Shield, Activity, Cpu, HardDrive, Network, Globe } from 'lucide-react'

const locations = [
  {
    flag: '🇮🇳',
    city: 'Mumbai',
    country: 'India',
    tier: 'Tier 3',
    provider: 'Tata / Jio Network',
    specs: ['10 Gbps uplink', 'AMD EPYC processors', 'NVMe Gen4 SSD storage', 'Sub-5ms ping to major Indian cities'],
    status: 'Online',
  },
  {
    flag: '🇮🇳',
    city: 'Delhi NCR',
    country: 'India',
    tier: 'Tier 3',
    provider: 'Airtel / BSNL Peering',
    specs: ['10 Gbps uplink', 'Intel Xeon scalable', 'NVMe Gen4 SSD storage', 'Low latency to North India'],
    status: 'Online',
  },
  {
    flag: '🇸🇬',
    city: 'Singapore',
    country: 'Singapore',
    tier: 'Tier 4',
    provider: 'Equinix SG1',
    specs: ['25 Gbps uplink', 'AMD EPYC Gen3', 'NVMe Gen5 SSD storage', 'Global peering hub — low latency to SEA, AU, EU'],
    status: 'Online',
  },
  {
    flag: '🇮🇳',
    city: 'Bangalore',
    country: 'India',
    tier: 'Tier 3',
    provider: 'Airtel / Tata Network',
    specs: ['10 Gbps uplink', 'AMD EPYC processors', 'NVMe SSD storage', 'Ideal for South India players'],
    status: 'Online',
  },
]

const techStack = [
  { icon: <Cpu size={20} />, name: 'Processors', detail: 'AMD EPYC & Intel Xeon Scalable' },
  { icon: <HardDrive size={20} />, name: 'Storage', detail: 'NVMe Gen4/Gen5 SSDs — no spinning rust' },
  { icon: <Network size={20} />, name: 'Networking', detail: '10–25 Gbps uplinks with redundant paths' },
  { icon: <Shield size={20} />, name: 'DDoS Mitigation', detail: 'Multi-layer scrubbing up to 1 Tbps' },
  { icon: <Activity size={20} />, name: 'Monitoring', detail: '24/7 NOC + automated alerts' },
  { icon: <Zap size={20} />, name: 'Power', detail: 'Redundant UPS + diesel generators' },
  { icon: <Server size={20} />, name: 'Virtualization', detail: 'KVM (VPS) + Pterodactyl (Game servers)' },
  { icon: <Globe size={20} />, name: 'Uptime SLA', detail: '99.9% guaranteed across all nodes' },
]

export default function InfrastructurePage() {
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
          <div className="section-tag" style={{ margin: '0 auto 20px' }}><span className="dot" />Infrastructure</div>
          <h1 className="section-title" style={{ fontSize: 'clamp(32px, 5vw, 56px)', marginBottom: 20 }}>
            Enterprise Hardware,<br />
            <span style={{ color: 'var(--blue)' }}>Across Every Region</span>
          </h1>
          <p className="section-desc" style={{ maxWidth: 580, margin: '0 auto' }}>
            Our network spans India and Singapore — powered by AMD EPYC processors, NVMe SSDs, and enterprise-grade
            DDoS mitigation built for gaming workloads.
          </p>
        </div>
      </section>

      {/* Locations */}
      <section style={{ padding: '90px 0', borderBottom: '1px solid var(--bg-border)' }}>
        <div className="container">
          <div className="section-header">
            <div className="section-tag"><span className="dot" />Data Centers</div>
            <h2 className="section-title">Our Locations</h2>
            <p className="section-desc">All nodes are in carrier-neutral facilities with redundant power and connectivity.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
            {locations.map(({ flag, city, country, tier, provider, specs, status }) => (
              <div key={city} style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--bg-border)',
                borderRadius: 'var(--radius-xl)',
                padding: 28,
                transition: 'border-color 0.25s',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20 }}>
                  <div style={{ fontSize: 36 }}>{flag}</div>
                  <div>
                    <div style={{ fontFamily: 'var(--font-heading)', fontSize: 18, fontWeight: 700, color: '#fff' }}>{city}</div>
                    <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{country}</div>
                  </div>
                  <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: '#4ade80', fontWeight: 600 }}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#4ade80', boxShadow: '0 0 6px #4ade80', display: 'inline-block' }} />
                    {status}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 8, marginBottom: 18, flexWrap: 'wrap' }}>
                  <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 'var(--radius-full)', background: 'rgba(37,99,235,0.12)', color: 'var(--blue-light)' }}>{tier}</span>
                  <span style={{ fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 'var(--radius-full)', background: 'rgba(255,255,255,0.05)', color: 'var(--text-secondary)' }}>{provider}</span>
                </div>
                <ul style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {specs.map(s => (
                    <li key={s} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--text-secondary)' }}>
                      <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--blue)', flexShrink: 0 }} />
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech stack */}
      <section style={{ padding: '90px 0', background: 'var(--bg-secondary)', borderBottom: '1px solid var(--bg-border)' }}>
        <div className="container">
          <div className="section-header">
            <div className="section-tag"><span className="dot" />Technology</div>
            <h2 className="section-title">What Powers Our Network</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
            {techStack.map(({ icon, name, detail }) => (
              <div key={name} style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--bg-border)',
                borderRadius: 'var(--radius-lg)',
                padding: 24,
                transition: 'border-color 0.25s',
              }}>
                <div className="feature-icon" style={{ marginBottom: 14 }}>{icon}</div>
                <div style={{ fontFamily: 'var(--font-heading)', fontSize: 14, fontWeight: 600, color: '#fff', marginBottom: 6 }}>{name}</div>
                <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>{detail}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-box">
            <div className="cta-title">Experience It Yourself</div>
            <p className="cta-desc">All that hardware power is available starting at ₹79/month. No lock-ins.</p>
            <div className="cta-btns">
              <a href="https://client.anuvverse.com/" target="_blank" rel="noreferrer" className="btn-primary">Get Started</a>
              <a href="https://discord.anuvverse.com/" target="_blank" rel="noreferrer" className="btn-secondary">Ask Questions</a>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
