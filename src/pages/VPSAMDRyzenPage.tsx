import ServicePage from './ServicePage'

const plans = [
  {
    name: 'Ryzen S',
    price: '₹399',
    popular: false,
    specs: [
      ['RAM', '2 GB'],
      ['CPU', '2 vCores (Ryzen)'],
      ['Disk', '40 GB NVMe'],
      ['Bandwidth', '2 TB'],
    ] as [string, string][],
  },
  {
    name: 'Ryzen M',
    price: '₹749',
    popular: true,
    specs: [
      ['RAM', '4 GB'],
      ['CPU', '4 vCores (Ryzen)'],
      ['Disk', '80 GB NVMe'],
      ['Bandwidth', '5 TB'],
    ] as [string, string][],
  },
  {
    name: 'Ryzen L',
    price: '₹1,299',
    popular: false,
    specs: [
      ['RAM', '8 GB'],
      ['CPU', '6 vCores (Ryzen)'],
      ['Disk', '160 GB NVMe'],
      ['Bandwidth', 'Unlimited'],
    ] as [string, string][],
  },
  {
    name: 'Ryzen XL',
    price: '₹2,399',
    popular: false,
    specs: [
      ['RAM', '16 GB'],
      ['CPU', '8 vCores (Ryzen)'],
      ['Disk', '320 GB NVMe'],
      ['Bandwidth', 'Unlimited'],
    ] as [string, string][],
  },
]

export default function VPSAMDRyzenPage() {
  return (
    <ServicePage
      tag="AMD Ryzen VPS"
      title="AMD Ryzen-Powered VPS"
      description="High single-core performance with AMD Ryzen processors. Perfect for gaming panels, Discord bots, and latency-sensitive applications."
      features={['AMD Ryzen High-Clock', 'KVM Virtualization', 'NVMe Gen4 SSDs', 'Root Access', 'DDoS Protection', '99.9% Uptime', 'Instant Deploy']}
      plans={plans}
    />
  )
}
