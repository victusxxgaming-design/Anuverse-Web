import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ShoppingCart, ChevronDown, LogIn, IndianRupee, Server, LogOut, User, LayoutDashboard, Shield } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const DiscordIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057.1 18.08.114 18.1.133 18.11a19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
  </svg>
)

const navItems = [
  { label: 'Home', href: '/' },
  {
    label: 'VPS Plans',
    href: '/vps',
    children: [
      { label: 'Intel Xeon', href: '/vps/intel-xeon' },
      { label: 'AMD Ryzen', href: '/vps/amd-ryzen' },
      { label: 'AMD EPYC', href: '/vps/amd-epyc' },
    ],
  },
  {
    label: 'Servers',
    href: '#',
    children: [
      { label: 'Basic', href: '/servers/basic' },
      { label: 'Premium', href: '/servers/premium' },
    ],
  },
  { label: 'Why Us', href: '/about' },
  { label: 'Discord', href: 'https://discord.anuvverse.com/', external: true },
]

function UserAvatar({ name }: { name: string }) {
  const initials = name.split(' ').map(p => p[0]).join('').slice(0, 2).toUpperCase()
  return <span className="nav-avatar">{initials}</span>
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close user menu on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  async function handleLogout() {
    setUserMenuOpen(false)
    await logout()
    navigate('/')
  }

  const isLoggedIn = user && user !== null

  return (
    <nav className={`navbar${scrolled ? ' scrolled' : ''}`}>
      <div className="container navbar-inner">
        {/* Logo */}
        <Link to="/" className="navbar-logo">
          <img src="/images/logo.png" alt="Anuverse" />
          <div className="navbar-logo-text">
            <div className="brand">Anuverse</div>
            <div className="sub">MSME Registered</div>
          </div>
        </Link>

        {/* Nav links */}
        <div className="navbar-nav">
          {navItems.map((item) => (
            <div className="nav-item" key={item.label}>
              {item.external ? (
                <a href={item.href} target="_blank" rel="noreferrer" className="nav-trigger">
                  {item.label}
                </a>
              ) : (
                <Link to={item.href} className="nav-trigger">
                  {item.label}
                  {item.children && <ChevronDown size={14} />}
                </Link>
              )}
              {item.children && (
                <div className="nav-dropdown">
                  {item.children.map((child) => (
                    <Link key={child.label} to={child.href}>
                      {child.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Right side */}
        <div className="navbar-right">
          <button className="nav-currency">
            <IndianRupee size={13} /> INR <ChevronDown size={12} />
          </button>

          <Link to="/cart" className="nav-icon-btn">
            <ShoppingCart size={16} />
            <span>Cart</span>
          </Link>

          <a href="https://discord.anuvverse.com/" target="_blank" rel="noreferrer" className="nav-icon-btn">
            <span style={{ width: 16, height: 16, display: 'flex' }}><DiscordIcon /></span>
          </a>

          {/* Auth: loading → nothing, logged out → Login btn, logged in → avatar menu */}
          {user === null ? null : isLoggedIn ? (
            <div className="nav-user-menu" ref={menuRef}>
              <button
                className="nav-user-btn"
                onClick={() => setUserMenuOpen(v => !v)}
                aria-expanded={userMenuOpen}
              >
                <UserAvatar name={(user as any).name} />
                <span className="nav-user-name">{(user as any).name.split(' ')[0]}</span>
                <ChevronDown size={13} className={userMenuOpen ? 'rotated' : ''} />
              </button>

              {userMenuOpen && (
                <div className="nav-user-dropdown">
                  <div className="nav-user-info">
                    <div className="nav-user-full">{(user as any).name}</div>
                    <div className="nav-user-email">{(user as any).email}</div>
                  </div>
                  <div className="nav-user-divider" />
                  <Link to="/my-servers" className="nav-user-item" onClick={() => setUserMenuOpen(false)}>
                    <Server size={14} /> My Servers
                  </Link>
                  <Link to="/dashboard" className="nav-user-item" onClick={() => setUserMenuOpen(false)}>
                    <LayoutDashboard size={14} /> Dashboard
                  </Link>
                  {(user as any).role === 'admin' && (
                    <Link to="/admin" className="nav-user-item" onClick={() => setUserMenuOpen(false)}>
                      <Shield size={14} /> Admin Panel
                    </Link>
                  )}
                  <div className="nav-user-divider" />
                  <button className="nav-user-item nav-user-logout" onClick={handleLogout}>
                    <LogOut size={14} /> Sign out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/auth" className="btn-login">
              <LogIn size={15} />
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  )
}
