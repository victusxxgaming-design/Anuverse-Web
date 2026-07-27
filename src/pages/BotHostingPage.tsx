import ServicePage from './ServicePage'

const plans = [
  {
    name: 'Basic Bot',
    price: '₹79',
    popular: false,
    specs: [
      ['RAM', '512 MB'],
      ['CPU', '0.5 vCores'],
      ['Storage', '5 GB'],
      ['Uptime', '24/7'],
      ['Bots', '1'],
    ] as [string, string][],
  },
  {
    name: 'Standard Bot',
    price: '₹149',
    popular: true,
    specs: [
      ['RAM', '1 GB'],
      ['CPU', '1 vCore'],
      ['Storage', '10 GB'],
      ['Uptime', '24/7'],
      ['Bots', '3'],
    ] as [string, string][],
  },
  {
    name: 'Pro Bot',
    price: '₹299',
    popular: false,
    specs: [
      ['RAM', '2 GB'],
      ['CPU', '2 vCores'],
      ['Storage', '20 GB'],
      ['Uptime', '24/7'],
      ['Bots', 'Unlimited'],
    ] as [string, string][],
  },
]

export default function BotHostingPage() {
  return (
    <ServicePage
      tag="Bot Hosting"
      title="Discord & Telegram Bot Hosting"
      description="Keep your bots running 24/7 with low-latency hosting in India. Supports Node.js, Python, Java, and more."
      features={['24/7 Uptime', 'Node.js / Python / Java', 'Discord & Telegram', 'Auto-Restart', 'India Servers', 'Low Latency', 'Pterodactyl Panel']}
      plans={plans}
    />
  )
}
