import ServicePage from './ServicePage'

const plans = [
  {
    name: '.com Domain',
    price: '₹899',
    per: '/yr',
    popular: true,
    specs: [
      ['Extension', '.com'],
      ['WHOIS Privacy', 'Free'],
      ['DNS Management', 'Included'],
      ['Auto-Renew', 'Yes'],
    ] as [string, string][],
  },
  {
    name: '.in Domain',
    price: '₹499',
    per: '/yr',
    popular: false,
    specs: [
      ['Extension', '.in'],
      ['WHOIS Privacy', 'Free'],
      ['DNS Management', 'Included'],
      ['Auto-Renew', 'Yes'],
    ] as [string, string][],
  },
  {
    name: '.net Domain',
    price: '₹999',
    per: '/yr',
    popular: false,
    specs: [
      ['Extension', '.net'],
      ['WHOIS Privacy', 'Free'],
      ['DNS Management', 'Included'],
      ['Auto-Renew', 'Yes'],
    ] as [string, string][],
  },
]

export default function DomainPlansPage() {
  return (
    <ServicePage
      tag="Domain Plans"
      title="Register Your Domain"
      description="Get your perfect domain name with free WHOIS privacy, DNS management, and auto-renewal. Affordable pricing in INR."
      features={['Free WHOIS Privacy', 'DNS Management', 'Auto-Renew', 'INR Pricing', 'Instant Activation', 'All Popular TLDs']}
      plans={plans}
    />
  )
}
