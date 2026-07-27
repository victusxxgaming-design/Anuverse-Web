import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

interface ComingSoonPageProps {
  tag?: string
  title?: string
  description?: string
}

export default function ComingSoonPage({ tag = 'Coming Soon', title = 'This Page is Coming Soon', description = "We're working hard on this. Join our Discord to stay up to date." }: ComingSoonPageProps) {
  return (
    <main style={{ paddingTop: 'var(--nav-h)', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
      <div style={{ padding: '60px 24px' }}>
        <div style={{ fontSize: 72, marginBottom: 24 }}>🚀</div>
        <div className="section-tag" style={{ margin: '0 auto 20px' }}><span className="dot" />{tag}</div>
        <h1 className="section-title" style={{ marginBottom: 16 }}>{title}</h1>
        <p className="section-desc" style={{ marginBottom: 36 }}>{description}</p>
        <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
          <a href="https://discord.anuvverse.com/" target="_blank" rel="noreferrer" className="btn-primary">
            Join Discord <ArrowRight size={14} />
          </a>
          <Link to="/" className="btn-secondary">Back to Home</Link>
        </div>
      </div>
    </main>
  )
}
