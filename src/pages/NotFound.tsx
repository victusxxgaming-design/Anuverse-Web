import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

export default function NotFound() {
  return (
    <main style={{
      paddingTop: 'var(--nav-h)',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
    }}>
      <div>
        <div style={{ fontSize: 96, fontWeight: 800, color: 'var(--blue)', fontFamily: 'var(--font-heading)', lineHeight: 1, marginBottom: 16 }}>404</div>
        <h1 style={{ fontSize: 28, fontWeight: 700, color: '#fff', marginBottom: 12 }}>Page Not Found</h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: 32 }}>The page you're looking for doesn't exist or has been moved.</p>
        <Link to="/" className="btn-primary">Back to Home <ArrowRight size={16} /></Link>
      </div>
    </main>
  )
}
