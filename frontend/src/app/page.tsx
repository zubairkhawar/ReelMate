import Hero from '@/components/Hero'
import Features from '@/components/Features'
import DemoVideo from '@/components/DemoVideo'
import HowItWorks from '@/components/HowItWorks'
import Testimonials from '@/components/Testimonials'
import Pricing from '@/components/Pricing'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <main className="min-h-screen bg-[#FAFAFA]">
      <Hero />
      <Features />
      <DemoVideo />
      <HowItWorks />
      <Testimonials />
      <Pricing />
      <Footer />
    </main>
  )
}
