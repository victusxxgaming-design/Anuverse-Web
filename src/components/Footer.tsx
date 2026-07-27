import { Link } from 'react-router-dom'

const DiscordIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: 16, height: 16 }}>
    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057.1 18.08.114 18.1.133 18.11a19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
  </svg>
)

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-top">
          {/* Brand */}
          <div className="footer-brand">
            <div className="logo-row">
              <img src="/images/logo.png" alt="Anuverse" />
              <span>Anuverse</span>
            </div>
            <p className="footer-tagline">
              Premium Minecraft & VPS Hosting from India and Singapore.
              High-performance infrastructure built for gamers.
            </p>
            <div className="msme-badge">✓ MSME Registered</div>
            <br />
            <div className="footer-socials">
              <a href="https://discord.anuvverse.com/" target="_blank" rel="noreferrer" className="footer-social-btn" title="Discord">
                <DiscordIcon />
              </a>
            </div>
          </div>

          {/* Minecraft Hosting */}
          <div>
            <div className="footer-col-title">Minecraft Hosting</div>
            <div className="footer-links">
              <Link to="/minecraft">Minecraft Plans</Link>
            </div>
          </div>

          {/* VPS Hosting */}
          <div>
            <div className="footer-col-title">VPS Hosting</div>
            <div className="footer-links">
              <Link to="/vps">VPS Plans</Link>
              <Link to="/rdp-hosting">RDP Hosting</Link>
              <Link to="/dedicated-machines">Dedicated Machines</Link>
              <Link to="/storage-servers">Storage Servers</Link>
            </div>
          </div>

          {/* Company */}
          <div>
            <div className="footer-col-title">Company</div>
            <div className="footer-links">
              <Link to="/about">About Us</Link>
              <Link to="/team">Meet Our Team</Link>
              <Link to="/infrastructure">Infrastructure</Link>
              <Link to="/webhosting">Web Hosting</Link>
              <Link to="/bothosting">Bot Hosting</Link>
              <Link to="/domain-plans">Domain Plans</Link>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="footer-bottom">
          <div className="footer-copy">
            © {new Date().getFullYear()} <span>Anuverse</span>. All rights reserved.
          </div>
          <div className="footer-bottom-links">
            <Link to="/terms">Terms</Link>
            <Link to="/refund">Refund Policy</Link>
            <Link to="/payment-methods">Payment Methods</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
