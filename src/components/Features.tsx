import { Zap, Shield, Clock, Network, HardDrive, Headphones, BarChart, Globe } from 'lucide-react'

const features = [
  {
    icon: <Zap />,
    name: 'Ultra Low Latency',
    desc: 'Strategically placed data centers in India and Singapore minimize ping for South & Southeast Asian communities.',
  },
  {
    icon: <Shield />,
    name: 'DDoS Protection',
    desc: 'Enterprise-grade DDoS mitigation shields your servers 24/7, filtering volumetric attacks automatically.',
  },
  {
    icon: <HardDrive />,
    name: 'NVMe SSD Storage',
    desc: 'All plans use blazing-fast NVMe SSDs that deliver significantly lower I/O latency versus traditional HDDs.',
  },
  {
    icon: <Clock />,
    name: '99.9% Uptime SLA',
    desc: 'We back every service with a 99.9% uptime SLA — your communities stay online around the clock.',
  },
  {
    icon: <Headphones />,
    name: '24/7 Expert Support',
    desc: 'Real engineers, not bots. Our support team is available every hour through tickets and Discord.',
  },
  {
    icon: <Network />,
    name: 'High-Speed Network',
    desc: 'Multi-Gbps uplinks with BGP routing and intelligent traffic engineering for the lowest latency paths.',
  },
  {
    icon: <BarChart />,
    name: 'Real-Time Metrics',
    desc: 'Monitor CPU, RAM, disk and network usage in real-time directly from the client dashboard.',
    wide: true,
  },
  {
    icon: <Globe />,
    name: 'Global Reach',
    desc: 'Data centers in Delhi, Mumbai, and Singapore — with more regions being added to serve growing demand.',
    wide: true,
  },
]

export default function Features() {
  return (
    <section className="features-section" id="features">
      <div className="container">
        <div className="section-header">
          <div className="section-tag"><span className="dot" />Why Anuverse</div>
          <h2 className="section-title">Built for Performance</h2>
          <p className="section-desc">
            Every feature is designed with performance and reliability as the primary objective — no compromises.
          </p>
        </div>
        <div className="features-grid">
          {features.map((f) => (
            <div className={`feature-card${f.wide ? ' wide' : ''}`} key={f.name}>
              <div className="feature-icon">{f.icon}</div>
              <div className="feature-body">
                <div className="feature-name">{f.name}</div>
                <div className="feature-desc">{f.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
