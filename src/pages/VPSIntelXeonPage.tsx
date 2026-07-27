import ServicePage from './ServicePage'

const plans = [
  {
    name: 'Xeon S',
    price: '₹349',
    popular: false,
    specs: [
      ['RAM', '2 GB'],
      ['CPU', '2 vCores (Xeon)'],
      ['Disk', '40 GB NVMe'],
      ['Bandwidth', '2 TB'],
    ] as [string, string][],
  },
  {
    name: 'Xeon M',
    price: '₹649',
    popular: true,
    specs: [
      ['RAM', '4 GB'],
      ['CPU', '4 vCores (Xeon)'],
      ['Disk', '80 GB NVMe'],
      ['Bandwidth', '5 TB'],
    ] as [string, string][],
  },
  {
    name: 'Xeon L',
    price: '₹1,149',
    popular: false,
    specs: [
      ['RAM', '8 GB'],
      ['CPU', '6 vCores (Xeon)'],
      ['Disk', '160 GB NVMe'],
      ['Bandwidth', 'Unlimited'],
    ] as [string, string][],
  },
  {
    name: 'Xeon XL',
    price: '₹2,099',
    popular: false,
    specs: [
      ['RAM', '16 GB'],
      ['CPU', '8 vCores (Xeon)'],
      ['Disk', '320 GB NVMe'],
      ['Bandwidth', 'Unlimited'],
    ] as [string, string][],
  },
]

export default function VPSIntelXeonPage() {
  return (
    <ServicePage
      tag="Intel Xeon VPS"
      title="Intel Xeon-Powered VPS"
      description="Reliable multi-threaded performance with Intel Xeon scalable processors. Ideal for web apps, game servers, and workloads that need consistent clock speeds."
      features={['Intel Xeon Scalable', 'KVM Virtualization', 'NVMe SSDs', 'Root Access', 'DDoS Protection', '99.9% Uptime', 'Instant Deploy']}
      plans={plans}
    />
  )
}
