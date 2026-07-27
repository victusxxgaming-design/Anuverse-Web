import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CheckCircle, Server, Shield, Zap } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const REDIRECT_AFTER = 3000   // ms

export default function LoginSuccessPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [progress, setProgress] = useState(0)

  // Animate progress bar then redirect
  useEffect(() => {
    const start = Date.now()
    const tick = () => {
      const pct = Math.min(((Date.now() - start) / REDIRECT_AFTER) * 100, 100)
      setProgress(pct)
      if (pct < 100) {
        requestAnimationFrame(tick)
      }
    }
    requestAnimationFrame(tick)

    const t = setTimeout(() => navigate('/', { replace: true }), REDIRECT_AFTER)
    return () => clearTimeout(t)
  }, [navigate])

  const name = user ? (user as import('../context/AuthContext').AuthUser).name.split(' ')[0] : 'there'

  return (
    <div className="ls-page">
      {/* Animated background */}
      <div className="ls-bg" />
      <div className="ls-grid" />

      {/* Floating particles */}
      <div className="ls-particles">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="ls-particle" style={{
            left: `${Math.random() * 100}%`,
            '--dur': `${4 + Math.random() * 4}s`,
            '--delay': `${Math.random() * 3}s`,
          } as React.CSSProperties} />
        ))}
      </div>

      <div className="ls-card">
        {/* Check icon with pulse rings */}
        <div className="ls-icon-wrap">
          <div className="ls-ring ls-ring-1" />
          <div className="ls-ring ls-ring-2" />
          <div className="ls-icon-circle">
            <CheckCircle size={36} />
          </div>
        </div>

        <div className="ls-kicker">Welcome back</div>
        <h1 className="ls-title">You're in, <span>{name}!</span></h1>
        <p className="ls-subtitle">Your session is active. Redirecting you to the dashboard…</p>

        {/* Perks row */}
        <div className="ls-perks">
          <div className="ls-perk">
            <Server size={15} />
            <span>My Servers</span>
          </div>
          <div className="ls-perk">
            <Shield size={15} />
            <span>Secure Session</span>
          </div>
          <div className="ls-perk">
            <Zap size={15} />
            <span>Instant Access</span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="ls-progress-wrap">
          <div className="ls-progress-bar" style={{ width: `${progress}%` }} />
        </div>
        <p className="ls-redirect-note">Redirecting in {Math.max(0, Math.ceil((REDIRECT_AFTER - (progress / 100) * REDIRECT_AFTER) / 1000))}s</p>

        <button
          className="ls-skip"
          onClick={() => navigate('/', { replace: true })}
        >
          Go now →
        </button>
      </div>
    </div>
  )
}
