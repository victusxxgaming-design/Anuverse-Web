export default function TermsPage() {
  const updated = 'July 1, 2025'

  return (
    <main style={{ paddingTop: 'var(--nav-h)', minHeight: '100vh' }}>
      <section style={{
        padding: '70px 0 50px',
        borderBottom: '1px solid var(--bg-border)',
        background: 'radial-gradient(ellipse 60% 40% at 50% 0%, rgba(29,78,216,0.10) 0%, transparent 60%)',
      }}>
        <div className="container">
          <div className="section-tag" style={{ marginBottom: 20 }}><span className="dot" />Legal</div>
          <h1 className="section-title" style={{ textAlign: 'left', marginBottom: 10 }}>Terms of Service</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 13.5 }}>Last updated: {updated}</p>
        </div>
      </section>

      <section style={{ padding: '60px 0' }}>
        <div className="container">
          <div style={{
            maxWidth: 760,
            display: 'flex',
            flexDirection: 'column',
            gap: 36,
            color: 'var(--text-secondary)',
            fontSize: 15,
            lineHeight: 1.8,
          }}>
            {[
              {
                heading: '1. Acceptance of Terms',
                body: `By accessing or using any service offered by Anuverse ("we", "us", "our"), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.`,
              },
              {
                heading: '2. Services',
                body: `Anuverse provides game server hosting (primarily Minecraft), VPS hosting, and related services. We reserve the right to modify, suspend, or discontinue any service at any time with reasonable notice.`,
              },
              {
                heading: '3. Account Responsibilities',
                body: `You are responsible for maintaining the confidentiality of your account credentials. You agree not to share your login details with others. Any activity under your account is your responsibility. You must provide accurate registration information and keep it updated.`,
              },
              {
                heading: '4. Acceptable Use',
                body: `You agree not to use our services for: (a) any illegal activity under Indian or international law; (b) sending spam or unsolicited communications; (c) distributing malware, viruses, or harmful code; (d) launching DDoS attacks or other network abuse; (e) hosting pirated content or infringing on intellectual property rights; (f) mining cryptocurrency without prior written approval.`,
              },
              {
                heading: '5. Payment & Billing',
                body: `Services are billed on a monthly basis unless otherwise stated. Payment must be received before service activation. Anuverse accepts UPI, net banking, and other approved methods. Late payments may result in service suspension. All prices are in Indian Rupees (INR) unless otherwise specified.`,
              },
              {
                heading: '6. Service Level Agreement (SLA)',
                body: `We target 99.9% uptime across all nodes. Scheduled maintenance will be communicated at least 24 hours in advance via Discord or email. Outages caused by circumstances beyond our control (natural disasters, upstream provider outages) are excluded from SLA calculations.`,
              },
              {
                heading: '7. Suspension & Termination',
                body: `We reserve the right to suspend or terminate your service immediately for violations of these Terms, non-payment, or actions that threaten the integrity of our network. We will attempt to notify you before any suspension except in urgent cases.`,
              },
              {
                heading: '8. Data & Backups',
                body: `While we strive to maintain reliable storage, you are ultimately responsible for backing up your own data. Anuverse shall not be held liable for data loss due to hardware failure, accidental deletion, or other unforeseen circumstances.`,
              },
              {
                heading: '9. Limitation of Liability',
                body: `To the maximum extent permitted by law, Anuverse shall not be liable for any indirect, incidental, or consequential damages arising from your use of our services. Our total liability shall not exceed the amount you paid in the last 30 days.`,
              },
              {
                heading: '10. Changes to Terms',
                body: `We may update these Terms at any time. Continued use of our services after changes constitutes acceptance of the new Terms. We will notify customers of significant changes via Discord announcements or email.`,
              },
              {
                heading: '11. Governing Law',
                body: `These Terms are governed by the laws of India. Any disputes shall be resolved under the jurisdiction of the courts in India. For informal dispute resolution, contact us on Discord first.`,
              },
              {
                heading: '12. Contact',
                body: `For questions about these Terms, reach us on Discord at discord.anuvverse.com or through our client portal at client.anuvverse.com.`,
              },
            ].map(({ heading, body }) => (
              <div key={heading}>
                <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 17, fontWeight: 700, color: '#fff', marginBottom: 10 }}>{heading}</h2>
                <p>{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
