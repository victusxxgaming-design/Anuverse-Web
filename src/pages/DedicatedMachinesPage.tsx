import ServicePage from './ServicePage'

export default function DedicatedMachinesPage() {
  return (
    <ServicePage
      tag="Dedicated Machines"
      title="Bare-Metal Dedicated Servers"
      description="No noisy neighbors, no shared resources — an entire physical server dedicated to you. Custom configurations available."
      features={['Full Bare-Metal', 'Root / iDRAC Access', 'Custom Hardware', 'DDoS Protection', 'India & Singapore', '10 Gbps Uplink', 'Managed Options']}
      plans={[]}
      comingSoon={true}
    />
  )
}
