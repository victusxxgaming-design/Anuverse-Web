import { Link } from 'react-router-dom'
import { ArrowRight, Server, Monitor, Globe, Bot, Database, Cpu, HardDrive, Gamepad2 } from 'lucide-react'

const services = [
  {
    icon: <Gamepad2 />,
    name: 'Minecraft Hosting',
    desc: 'High-performance Minecraft servers with premium Indian metal in Delhi & Mumbai and Singapore nodes. Anti-DDoS included.',
    href: '/minecraft',
  },
  {
    icon: <Server />,
    name: 'VPS Hosting',
    desc: 'AMD EPYC-powered virtual private servers. High core density, large networks — ideal for demanding workloads.',
    href: '/vps',
  },
  {
    icon: <Monitor />,
    name: 'RDP Hosting',
    desc: 'Windows Remote Desktop hosting with dedicated resources. Perfect for remote work and software development.',
    href: '/rdp-hosting',
  },
  {
    icon: <Globe />,
    name: 'Web Hosting',
    desc: 'Fast, reliable web hosting with NVMe SSDs, free SSL, and one-click deployments for your websites and apps.',
    href: '/webhosting',
  },
  {
    icon: <Bot />,
    name: 'Bot Hosting',
    desc: 'Always-on hosting for Discord and Telegram bots. Low latency, instant setup, and 99.9% uptime SLA.',
    href: '/bothosting',
  },
  {
    icon: <Database />,
    name: 'Domain Plans',
    desc: 'Register and manage your domain with competitive pricing, DNS management, and WHOIS privacy protection.',
    href: '/domain-plans',
  },
  {
    icon: <HardDrive />,
    name: 'Storage Servers',
    desc: 'Large-capacity storage servers for backups, media libraries, and data archiving with high transfer speeds.',
    href: '/storage-servers',
  },
  {
    icon: <Cpu />,
    name: 'Dedicated Machines',
    desc: 'Bare-metal dedicated machines for maximum performance. Full hardware isolation with root-level access.',
    href: '/dedicated-machines',
  },
]

export default function Services() {
  return (
    <section className="services-section" id="services">
      <div className="container">
        <div className="section-header">
          <div className="section-tag"><span className="dot" />Our Services</div>
          <h2 className="section-title">Everything You Need to Host</h2>
          <p className="section-desc">
            From Minecraft to bare-metal, we offer a complete suite of hosting solutions
            with enterprise-grade infrastructure.
          </p>
        </div>
        <div className="services-grid">
          {services.map((s) => (
            <Link to={s.href} className="service-card" key={s.name}>
              <div className="service-icon">{s.icon}</div>
              <div className="service-name">{s.name}</div>
              <div className="service-desc">{s.desc}</div>
              <span className="service-link">
                View Plans <ArrowRight size={13} />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
