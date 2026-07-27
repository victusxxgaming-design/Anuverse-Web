import Hero from '../components/Hero'
import StatsBar from '../components/StatsBar'
import Services from '../components/Services'
import Features from '../components/Features'
import Infrastructure from '../components/Infrastructure'
import WhyAnuverse from '../components/WhyAnuverse'
import CTA from '../components/CTA'

export default function Home() {
  return (
    <main>
      <Hero />
      <StatsBar />
      <Services />
      <Features />
      <Infrastructure />
      <WhyAnuverse />
      <CTA />
    </main>
  )
}
