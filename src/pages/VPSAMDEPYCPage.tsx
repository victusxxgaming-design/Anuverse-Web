import ServicePage from './ServicePage'

const plans = [
  {
    name: 'EPYC S',
    price: '₹299',
    popular: false,
    specs: [
      ['RAM', '2 GB'],
      ['CPU', '2 vCores (EPYC)'],
      ['Disk', '40 GB NVMe'],
      ['Bandwidth', '2 TB'],
    ] as [string, string][],
  },
  {
    name: 'EPYC M',
    price: '₹549',
    popular: true,
    specs: [
      ['RAM', '4 GB'],
      ['CPU', '4 vCores (EPYC)'],
      ['Disk', '80 GB NVMe'],
      ['Bandwidth', '5 TB'],
    ] as [string, string][],
  },
  {
    name: 'EPYC L',
    price: '₹999',
    popular: false,
    specs: [
      ['RAM', '8 GB'],
      ['CPU', '6 vCores (EPYC)'],
      ['Disk', '160 GB NVMe'],
      ['Bandwidth', 'Unlimited'],
    ] as [string, string][],
  },
  {
    name: 'EPYC XL',
    price: '₹1,849',
    popular: false,
    specs: [
      ['RAM', '16 GB'],
      ['CPU', '8 vCores (EPYC)'],
      ['Disk', '320 GB NVMe'],
      ['Bandwidth', 'Unlimited'],
    ] as [string, string][],
  },
]

export default function VPSAMDEPYCPage() {
  return (
    <ServicePage
      tag="AMD EPYC VPS"
      title="AMD EPYC-Powered VPS"
      description="Enterprise-grade core density with AMD EPYC processors. Best value for high-core-count workloads, databases, and production applications."
      features={['AMD EPYC Enterprise', 'KVM Virtualization', 'NVMe Gen4 SSDs', 'Root Access', 'DDoS Protection', '99.9% Uptime', 'Instant Deploy']}
      plans={plans}
    />
  )
}
