import ServicePage from './ServicePage'

const plans = [
  {
    name: 'Starter',
    price: '₹149',
    popular: false,
    specs: [
      ['Storage', '5 GB SSD'],
      ['Bandwidth', '50 GB'],
      ['Websites', '1'],
      ['SSL', 'Free Let\'s Encrypt'],
      ['Email', '2 accounts'],
    ] as [string, string][],
  },
  {
    name: 'Business',
    price: '₹299',
    popular: true,
    specs: [
      ['Storage', '20 GB SSD'],
      ['Bandwidth', 'Unlimited'],
      ['Websites', '5'],
      ['SSL', 'Free Let\'s Encrypt'],
      ['Email', '10 accounts'],
    ] as [string, string][],
  },
  {
    name: 'Pro',
    price: '₹599',
    popular: false,
    specs: [
      ['Storage', '50 GB NVMe'],
      ['Bandwidth', 'Unlimited'],
      ['Websites', 'Unlimited'],
      ['SSL', 'Free Let\'s Encrypt'],
      ['Email', 'Unlimited'],
    ] as [string, string][],
  },
]

export default function WebHostingPage() {
  return (
    <ServicePage
      tag="Web Hosting"
      title="Fast & Reliable Web Hosting"
      description="cPanel-based web hosting with NVMe SSD storage, free SSL, and one-click WordPress install. Powered from India."
      features={['cPanel Included', 'Free SSL', 'One-Click WordPress', 'NVMe SSD', '99.9% Uptime', 'Daily Backups', 'India Servers']}
      plans={plans}
    />
  )
}
