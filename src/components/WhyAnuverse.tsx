const cards = [
  {
    num: '01',
    title: 'Gamer-First Philosophy',
    desc: 'Built by gamers, for gamers. Every hardware choice, network decision, and support process is designed around the needs of online gaming communities.',
  },
  {
    num: '02',
    title: 'Transparent Pricing',
    desc: 'No hidden fees, no surprise charges. What you see is what you pay — in INR, with convenience fees shown upfront before checkout.',
  },
  {
    num: '03',
    title: 'Instant Provisioning',
    desc: 'Your server is deployed within seconds of payment confirmation. No waiting, no manual setup — automated provisioning on our Pterodactyl panel.',
  },
  {
    num: '04',
    title: 'Indian-Rooted Support',
    desc: 'Our support team is based in India and responds in your timezone, in your language — fast, human responses on Discord and our ticket system.',
  },
  {
    num: '05',
    title: 'MSME Compliant',
    desc: 'Anuverse is an officially MSME-registered business, giving you the assurance of dealing with a legitimate, government-recognized Indian company.',
  },
  {
    num: '06',
    title: 'Constantly Evolving',
    desc: 'New services, new locations, and new features ship regularly. We listen to our community on Discord and roadmap features they actually want.',
  },
]

export default function WhyAnuverse() {
  return (
    <section className="why-section" id="why">
      <div className="container">
        <div className="section-header">
          <div className="section-tag"><span className="dot" />Our Promise</div>
          <h2 className="section-title">The Anuverse Difference</h2>
          <p className="section-desc">
            We're not just another hosting company — we're a community-driven infrastructure provider
            that puts performance and trust first.
          </p>
        </div>
        <div className="why-grid">
          {cards.map((c) => (
            <div className="why-card" key={c.num}>
              <div className="why-card-num">{c.num}</div>
              <div className="why-card-title">{c.title}</div>
              <div className="why-card-desc">{c.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
