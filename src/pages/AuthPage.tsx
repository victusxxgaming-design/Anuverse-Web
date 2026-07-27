import { FormEvent, useEffect, useState } from 'react'
import { ArrowLeft, ArrowRight, Check, Eye, EyeOff, LockKeyhole, Mail, UserRound } from 'lucide-react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

// Discord logo SVG
function DiscordIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
    </svg>
  )
}

// Google "G" logo SVG
function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
    </svg>
  )
}

export default function AuthPage() {
  const { user, login, register, loginWithGoogle, loginWithDiscord } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [mode, setMode] = useState<'login' | 'register'>(
    new URLSearchParams(location.search).get('mode') === 'register' ? 'register' : 'login',
  )
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  // Show OAuth errors passed back in the URL
  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const oauthError = params.get('error')
    if (oauthError) {
      const messages: Record<string, string> = {
        google_denied:         'Google sign-in was cancelled.',
        discord_denied:        'Discord sign-in was cancelled.',
        invalid_state:         'Security check failed. Please try again.',
        google_token_failed:   'Google sign-in failed. Please try again.',
        discord_token_failed:  'Discord sign-in failed. Please try again.',
        google_profile_failed: 'Could not retrieve your Google profile.',
        discord_profile_failed:'Could not retrieve your Discord profile.',
        google_unreachable:    'Google is unreachable. Please try again.',
        discord_unreachable:   'Discord is unreachable. Please try again.',
        google_no_email:       'Google did not provide an email address.',
      }
      setError(messages[oauthError] ?? 'Sign-in failed. Please try again.')
      // Clean the query string
      navigate('/auth', { replace: true })
    }
  }, [location.search, navigate])

  useEffect(() => {
    if (user) navigate('/login-success', { replace: true })
  }, [user, navigate])

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setError('')
    setBusy(true)
    try {
      if (mode === 'login') await login(email, password)
      else await register(name, email, password)
      navigate('/login-success')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to continue. Please try again.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <main className="auth-page">
      <div className="auth-orbit auth-orbit-one" />
      <div className="auth-orbit auth-orbit-two" />
      <div className="auth-layout container">
        <div className="auth-story">
          <Link to="/" className="back-link"><ArrowLeft size={15} /> Back to home</Link>
          <div className="auth-kicker"><span className="live-dot" /> Infrastructure that stays out of your way</div>
          <h1>Build your next<br /><span>online world.</span></h1>
          <p>One account for your game servers, VPS deployments, billing, and support. Provisioned fast from infrastructure built for the region.</p>
          <div className="auth-benefits">
            {['Instant provisioning after payment', 'Indian & Singapore locations', 'Real humans on support'].map((item) => (
              <div key={item}><span><Check size={14} /></span>{item}</div>
            ))}
          </div>
        </div>

        <div className="auth-card">
          <div className="auth-card-heading">
            <div className="eyebrow">Anuverse client area</div>
            <h2>{mode === 'login' ? 'Welcome back' : 'Create your account'}</h2>
            <p>{mode === 'login' ? 'Sign in to manage your services and orders.' : 'Get started with premium infrastructure today.'}</p>
          </div>

          {/* OAuth buttons */}
          <div className="oauth-buttons">
            <button type="button" className="oauth-btn oauth-btn--google" onClick={loginWithGoogle}>
              <GoogleIcon /> Continue with Google
            </button>
            <button type="button" className="oauth-btn oauth-btn--discord" onClick={loginWithDiscord}>
              <DiscordIcon /> Continue with Discord
            </button>
          </div>

          <div className="form-divider"><span>or continue with email</span></div>

          <form onSubmit={handleSubmit} className="auth-form">
            {mode === 'register' && (
              <label className="field">
                <span>Full name</span>
                <div className="field-control"><UserRound size={17} /><input required minLength={2} value={name} onChange={(e) => setName(e.target.value)} placeholder="Alex Morgan" /></div>
              </label>
            )}
            <label className="field">
              <span>Email address</span>
              <div className="field-control"><Mail size={17} /><input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" /></div>
            </label>
            <label className="field">
              <span>Password</span>
              <div className="field-control">
                <LockKeyhole size={17} />
                <input
                  required
                  minLength={mode === 'register' ? 8 : 1}
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={mode === 'register' ? 'At least 8 characters' : 'Your password'}
                />
                <button type="button" aria-label="Toggle password visibility" onClick={() => setShowPassword((v) => !v)}>
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </label>
            {error && <div className="form-error">{error}</div>}
            <button className="btn-primary auth-submit" disabled={busy}>
              {busy ? 'Please wait…' : mode === 'login' ? 'Sign in' : 'Create account'} <ArrowRight size={16} />
            </button>
          </form>

          <p className="auth-switch">
            {mode === 'login' ? 'New to Anuverse?' : 'Already have an account?'}{' '}
            <button type="button" onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError('') }}>
              {mode === 'login' ? 'Create an account' : 'Sign in'}
            </button>
          </p>
          <p className="auth-legal">By continuing, you agree to our terms of service and privacy policy.</p>
        </div>
      </div>
    </main>
  )
}
