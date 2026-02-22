import { Navbar } from "@/components/navbar"
import {
  LandingHero,
  LandingFeatures,
  LandingCTA,
  LandingFooter,
} from "@/components/landing-hero"

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <LandingHero />
        <LandingFeatures />
        <LandingCTA />
      </main>
      <LandingFooter />
    </div>
  )
}
