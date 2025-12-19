import { FloatingNav } from "@/components/floating-nav"
import { GetStartedButton } from "@/components/get-started-button"
import { HeroSection } from "@/components/hero-section"
import { NeuralDashboard } from "@/components/neural-dashboard"
import { FeaturesBento } from "@/components/features-bento"
import { HowItWorks } from "@/components/how-it-works"
import { PricingSection } from "@/components/pricing-section"
import { AboutSection } from "@/components/about-section"
import { ContactSection } from "@/components/contact-section"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <main className="relative min-h-screen">
      {/* Fixed navigation elements */}
      <FloatingNav />
      <GetStartedButton />

      {/* Page sections */}
      <HeroSection />
      <NeuralDashboard />
      <FeaturesBento />
      <HowItWorks />
      <PricingSection />
      <AboutSection />
      <ContactSection />
      <Footer />
    </main>
  )
}
