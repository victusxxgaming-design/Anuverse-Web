import ServicePage from './ServicePage'

const plans = [
  {
    name: 'Basic S',
    price: '₹199',
    popular: false,
    specs: [
      ['RAM', '2 GB'],
      ['CPU', '2 vCores'],
      ['Disk', '30 GB NVMe'],
      ['Bandwidth', '1 TB'],
      ['Support', 'Community'],
    ] as [string, string][],
  },
  {
    name: 'Basic M',
    price: '₹399',
    popular: true,
    specs: [
      ['RAM', '4 GB'],
      ['CPU', '4 vCores'],
      ['Disk', '60 GB NVMe'],
      ['Bandwidth', '3 TB'],
      ['Support', 'Ticket'],
    ] as [string, string][],
  },
  {
    name: 'Basic L',
    price: '₹699',
    popular: false,
    specs: [
      ['RAM', '8 GB'],
      ['CPU', '6 vCores'],
      ['Disk', '120 GB NVMe'],
      ['Bandwidth', 'Unlimited'],
      ['Support', 'Ticket'],
    ] as [string, string][],
  },
]

export default function ServersBasicPage() {
  return (
    <ServicePage
      tag="Basic Servers"
      title="Basic Server Plans"
      description="Affordable, reliable servers for personal projects, development environments, and small communities. No frills — just solid performance."
      features={['Shared Resources', 'NVMe Storage', 'DDoS Protection', 'Linux / Windows', '99.9% Uptime', 'Instant Deploy', 'India & Singapore']}
      plans={plans}
    />
  )
}
