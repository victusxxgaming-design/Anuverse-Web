import ServicePage from './ServicePage'

const plans = [
  {
    name: 'Starter RDP',
    price: '₹499',
    popular: false,
    specs: [
      ['RAM', '4 GB'],
      ['CPU', '2 vCores'],
      ['Disk', '60 GB NVMe'],
      ['OS', 'Windows 10'],
      ['Bandwidth', '1 TB'],
    ] as [string, string][],
  },
  {
    name: 'Standard RDP',
    price: '₹899',
    popular: true,
    specs: [
      ['RAM', '8 GB'],
      ['CPU', '4 vCores'],
      ['Disk', '120 GB NVMe'],
      ['OS', 'Windows 10/11'],
      ['Bandwidth', 'Unlimited'],
    ] as [string, string][],
  },
  {
    name: 'Pro RDP',
    price: '₹1,599',
    popular: false,
    specs: [
      ['RAM', '16 GB'],
      ['CPU', '6 vCores'],
      ['Disk', '250 GB NVMe'],
      ['OS', 'Windows 10/11'],
      ['Bandwidth', 'Unlimited'],
    ] as [string, string][],
  },
]

export default function RDPPage() {
  return (
    <ServicePage
      tag="RDP Hosting"
      title="Windows Remote Desktop Hosting"
      description="Full Windows RDP access with NVMe storage and dedicated vCores. Perfect for automation, bots, and remote work."
      features={['Full Admin Access', 'Windows 10/11', 'NVMe Storage', 'DDoS Protection', '24/7 Uptime', 'Instant Delivery', 'India & Singapore']}
      plans={plans}
    />
  )
}
