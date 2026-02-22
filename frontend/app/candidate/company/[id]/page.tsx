"use client"

import { use } from "react"
import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { companies, roles } from "@/lib/mock-data"
import {
  MapPin,
  Briefcase,
  DollarSign,
  Building2,
  ArrowLeft,
  ChevronRight,
} from "lucide-react"

export default function CompanyRolesPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const company = companies.find((c) => c.id === id)
  const companyRoles = roles.filter((r) => r.companyId === id)

  if (!company) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="mx-auto max-w-7xl px-6 py-20 text-center">
          <p className="text-lg text-muted-foreground">Company not found</p>
          <Button variant="outline" className="mt-4" asChild>
            <Link href="/candidate/dashboard">Back to Companies</Link>
          </Button>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="mx-auto max-w-7xl px-6 py-8">
        {/* Breadcrumb */}
        <Link
          href="/candidate/dashboard"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Companies
        </Link>

        {/* Company Header */}
        <div className="mt-6 rounded-xl border border-border bg-card p-6 md:p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-primary/10 font-mono text-2xl font-bold text-primary">
              {company.logo}
            </div>
            <div>
              <h1 className="font-mono text-3xl font-bold tracking-tight text-foreground">
                {company.name}
              </h1>
              <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Building2 className="h-4 w-4" />
                  {company.industry}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {company.location}
                </span>
                <span className="flex items-center gap-1">
                  <Briefcase className="h-4 w-4" />
                  {companyRoles.length} open roles
                </span>
              </div>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                {company.description}
              </p>
            </div>
          </div>
        </div>

        {/* Roles List */}
        <h2 className="mt-10 font-mono text-xl font-bold text-foreground">Open Positions</h2>
        <div className="mt-4 flex flex-col gap-4">
          {companyRoles.map((role) => (
            <div
              key={role.id}
              className="group rounded-xl border border-border bg-card p-5 transition-all hover:border-primary/30 hover:shadow-md"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex-1">
                  <h3 className="font-mono text-lg font-semibold text-foreground">
                    {role.title}
                  </h3>
                  <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Building2 className="h-3.5 w-3.5" />
                      {role.department}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5" />
                      {role.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <DollarSign className="h-3.5 w-3.5" />
                      {role.salary}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">{role.description}</p>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {role.requirements.map((req) => (
                      <Badge key={req} variant="secondary" className="text-xs font-normal">
                        {req}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge
                    variant="outline"
                    className="border-primary/20 bg-primary/5 text-primary"
                  >
                    {role.type}
                  </Badge>
                  <Button className="gap-1" asChild>
                    <Link href={`/candidate/apply/${role.id}`}>
                      Apply
                      <ChevronRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {companyRoles.length === 0 && (
          <div className="mt-16 text-center">
            <p className="text-lg font-medium text-muted-foreground">
              No open positions at this time
            </p>
          </div>
        )}
      </main>
    </div>
  )
}
