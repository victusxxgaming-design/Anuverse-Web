const stats = [
  { number: '5000', suffix: '+', label: 'Servers Deployed' },
  { number: '99.9', suffix: '%', label: 'Uptime Guarantee' },
  { number: '24/7', suffix: '', label: 'Expert Support' },
  { number: '3', suffix: ' DCs', label: 'Data Centers' },
]

export default function StatsBar() {
  return (
    <div className="stats-bar">
      <div className="container">
        <div className="stats-bar-inner">
          {stats.map((s) => (
            <div className="stat-item" key={s.label}>
              <div className="stat-number">
                {s.number}<span>{s.suffix}</span>
              </div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
