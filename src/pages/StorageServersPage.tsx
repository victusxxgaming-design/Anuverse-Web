import ServicePage from './ServicePage'

const plans = [
  {
    name: 'Storage S',
    price: '₹699',
    popular: false,
    specs: [
      ['Storage', '1 TB HDD'],
      ['RAM', '2 GB'],
      ['CPU', '2 vCores'],
      ['Bandwidth', '10 TB'],
      ['Access', 'SFTP / FTP'],
    ] as [string, string][],
  },
  {
    name: 'Storage M',
    price: '₹1,299',
    popular: true,
    specs: [
      ['Storage', '2 TB HDD'],
      ['RAM', '4 GB'],
      ['CPU', '2 vCores'],
      ['Bandwidth', '20 TB'],
      ['Access', 'SFTP / FTP / S3'],
    ] as [string, string][],
  },
  {
    name: 'Storage L',
    price: '₹2,199',
    popular: false,
    specs: [
      ['Storage', '4 TB HDD'],
      ['RAM', '8 GB'],
      ['CPU', '4 vCores'],
      ['Bandwidth', 'Unlimited'],
      ['Access', 'SFTP / FTP / S3'],
    ] as [string, string][],
  },
]

export default function StorageServersPage() {
  return (
    <ServicePage
      tag="Storage Servers"
      title="Large-Capacity Storage Servers"
      description="High-capacity storage solutions for backups, archives, and large datasets. Available in India and Singapore with S3-compatible APIs."
      features={['Up to 4 TB Storage', 'S3 Compatible', 'SFTP / FTP Access', 'Redundant Drives', 'India & Singapore', '24/7 Uptime', 'Scalable Plans']}
      plans={plans}
    />
  )
}
