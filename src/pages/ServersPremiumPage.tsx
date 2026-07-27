import ServicePage from './ServicePage'

const plans = [
  {
    name: 'Premium S',
    price: '₹799',
    popular: false,
    specs: [
      ['RAM', '4 GB DDR5'],
      ['CPU', '4 vCores (Priority)'],
      ['Disk', '80 GB NVMe Gen4'],
      ['Bandwidth', 'Unlimited'],
      ['Support', 'Priority 24/7'],
    ] as [string, string][],
  },
  {
    name: 'Premium M',
    price: '₹1,499',
    popular: true,
    specs: [
      ['RAM', '8 GB DDR5'],
      ['CPU', '6 vCores (Priority)'],
      ['Disk', '160 GB NVMe Gen4'],
      ['Bandwidth', 'Unlimited'],
      ['Support', 'Priority 24/7'],
    ] as [string, string][],
  },
  {
    name: 'Premium L',
    price: '₹2,799',
    popular: false,
    specs: [
      ['RAM', '16 GB DDR5'],
      ['CPU', '8 vCores (Priority)'],
      ['Disk', '320 GB NVMe Gen4'],
      ['Bandwidth', 'Unlimited'],
      ['Support', 'Priority 24/7'],
    ] as [string, string][],
  },
]

export default function ServersPremiumPage() {
  return (
    <ServicePage
      tag="Premium Servers"
      title="Premium Server Plans"
      description="Dedicated resources, priority support, and next-gen DDR5 memory. Built for production workloads, high-traffic applications, and serious gamers."
      features={['Dedicated Resources', 'DDR5 Memory', 'NVMe Gen4 SSDs', 'Priority CPU Scheduling', 'DDoS Protection', 'Priority 24/7 Support', 'India & Singapore']}
      plans={plans}
    />
  )
}
