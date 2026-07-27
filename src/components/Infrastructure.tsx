import { CheckCircle, Cpu, Network, Shield, Zap } from 'lucide-react'

const points = [
  {
    icon: <Cpu />,
    title: 'AMD EPYC Processors',
    desc: 'Latest-gen EPYC CPUs delivering industry-leading IPC and core density for demanding workloads.',
  },
  {
    icon: <Network />,
    title: 'Multi-Gbps Uplinks',
    desc: 'Redundant multi-gigabit fiber connections with BGP peering at Tier-1 carriers.',
  },
  {
    icon: <Shield />,
    title: 'Enterprise DDoS Mitigation',
    desc: 'Tbps-scale scrubbing capacity with automatic traffic rerouting on attack detection.',
  },
  {
    icon: <Zap />,
    title: 'NVMe-Only Storage',
    desc: 'Pure NVMe SSD arrays across all nodes — no spinning rust, no bottlenecks.',
  },
  {
    icon: <CheckCircle />,
    title: 'MSME Registered',
    desc: 'Officially registered under India\'s MSME framework — a trusted, compliant Indian business.',
  },
]

const locations = [
  { flag: '🇮🇳', city: 'Delhi', country: 'India' },
  { flag: '🇮🇳', city: 'Mumbai', country: 'India' },
  { flag: '🇸🇬', city: 'Singapore', country: 'Singapore' },
  { flag: '🌐', city: 'More Soon', country: 'Expanding' },
]

export default function Infrastructure() {
  return (
    <section className="infra-section" id="infrastructure">
      <div className="container">
        <div className="infra-grid">
          <div className="infra-content">
            <div className="section-tag"><span className="dot" />Infrastructure</div>
            <h2 className="section-title">Premium Indian Metal</h2>
            <p className="section-desc">
              Our infrastructure is purpose-built for gaming and high-demand applications — located where your players are.
            </p>
            <div className="infra-list">
              {points.map((p) => (
                <div className="infra-item" key={p.title}>
                  <div className="infra-item-icon">{p.icon}</div>
                  <div className="infra-item-text">
                    <strong>{p.title}</strong>
                    <span>{p.desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="infra-visual">
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 12, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Data Center Locations</div>
            </div>
            <div className="infra-map">
              {locations.map((l) => (
                <div className="infra-location" key={l.city}>
                  <div className="flag">{l.flag}</div>
                  <div className="city">{l.city}</div>
                  <div className="country">{l.country}</div>
                  {l.city !== 'More Soon' && (
                    <div className="status">Online</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
