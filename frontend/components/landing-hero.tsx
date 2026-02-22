import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Users, FileSearch, Zap, Shield } from "lucide-react"

export function LandingHero() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,var(--color-primary)/0.08,transparent_60%)]" />
      <div className="relative mx-auto max-w-7xl px-6 pb-20 pt-24 md:pt-32">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-sm text-muted-foreground">
            <Zap className="h-4 w-4 text-primary" />
            AI-Powered Recruitment Platform
          </div>
          <h1 className="text-balance font-mono text-4xl font-bold tracking-tight text-foreground md:text-6xl lg:text-7xl">
            Hire smarter, not harder
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground md:text-xl">
            Streamline your recruitment process with intelligent resume analysis.
            Connect the right candidates with the right opportunities, effortlessly.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button size="lg" className="gap-2 px-8" asChild>
              <Link href="/auth/signup">
                Get Started
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="px-8" asChild>
              <Link href="/auth/signin">Sign In</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

export function LandingFeatures() {
  const features = [
    {
      icon: FileSearch,
      title: "Smart Resume Parsing",
      description:
        "Upload resumes in PDF or DOC format. Our AI extracts key skills, experience, and qualifications instantly.",
    },
    {
      icon: Users,
      title: "Candidate Management",
      description:
        "View, filter, and manage all applicants in one centralized dashboard built for recruiters.",
    },
    {
      icon: Zap,
      title: "Instant Matching",
      description:
        "Automatically match candidates to open roles based on skills, experience, and cultural fit.",
    },
    {
      icon: Shield,
      title: "Secure & Private",
      description:
        "All candidate data is encrypted and handled with enterprise-grade security and compliance.",
    },
  ]

  return (
    <section className="border-t border-border bg-card py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-mono text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Everything you need to hire
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
            A complete platform for modern recruitment teams and ambitious candidates.
          </p>
        </div>
        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group rounded-xl border border-border bg-background p-6 transition-all hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <feature.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-mono text-lg font-semibold text-foreground">
                {feature.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export function LandingCTA() {
  return (
    <section className="border-t border-border py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-mono text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Ready to transform your hiring?
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
            Join thousands of companies and candidates already using HireSmart.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button size="lg" className="gap-2 px-8" asChild>
              <Link href="/auth/signup">
                Start Recruiting
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="px-8" asChild>
              <Link href="/auth/signup">Find Jobs</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

export function LandingFooter() {
  return (
    <footer className="border-t border-border bg-card py-10">
      <div className="mx-auto max-w-7xl px-6 text-center text-sm text-muted-foreground">
        2026 HireSmart. All rights reserved. Built for smarter hiring.
      </div>
    </footer>
  )
}
