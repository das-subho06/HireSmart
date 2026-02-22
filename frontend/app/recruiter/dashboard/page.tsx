"use client"

import { useState } from "react"
import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { CandidateCard } from "@/components/candidate-card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { candidates } from "@/lib/mock-data"
import { Search, Users, FileCheck, Star, Clock, LogOut } from "lucide-react"

const statuses = ["All", "New", "Reviewed", "Shortlisted", "Rejected"] as const

export default function RecruiterDashboard() {
  const [search, setSearch] = useState("")
  const [activeStatus, setActiveStatus] = useState<string>("All")

  const filtered = candidates.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.appliedRole.toLowerCase().includes(search.toLowerCase()) ||
      c.skills.some((s) => s.toLowerCase().includes(search.toLowerCase()))
    const matchesStatus = activeStatus === "All" || c.status === activeStatus
    return matchesSearch && matchesStatus
  })

  const stats = [
    { label: "Total Applicants", value: candidates.length, icon: Users, color: "text-primary" },
    {
      label: "New",
      value: candidates.filter((c) => c.status === "New").length,
      icon: Clock,
      color: "text-primary",
    },
    {
      label: "Reviewed",
      value: candidates.filter((c) => c.status === "Reviewed").length,
      icon: FileCheck,
      color: "text-accent-foreground",
    },
    {
      label: "Shortlisted",
      value: candidates.filter((c) => c.status === "Shortlisted").length,
      icon: Star,
      color: "text-accent-foreground",
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="mx-auto max-w-7xl px-6 py-8">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="font-mono text-3xl font-bold tracking-tight text-foreground">
              Recruiter Dashboard
            </h1>
            <p className="mt-1 text-muted-foreground">
              Manage and review candidate applications
            </p>
          </div>
          <Button variant="outline" className="mt-4 gap-2 sm:mt-0" asChild>
            <Link href="/">
              <LogOut className="h-4 w-4" />
              Sign Out
            </Link>
          </Button>
        </div>

        {/* Stats */}
        <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl border border-border bg-card p-5 transition-all hover:shadow-md"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </div>
                <div>
                  <p className="font-mono text-2xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Search & Filters */}
        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by name, role, or skill..."
              className="pl-10"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {statuses.map((status) => (
              <Button
                key={status}
                variant={activeStatus === status ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveStatus(status)}
              >
                {status}
                {status !== "All" && (
                  <Badge
                    variant="secondary"
                    className="ml-1.5 h-5 min-w-5 px-1 text-xs"
                  >
                    {status === "All"
                      ? candidates.length
                      : candidates.filter((c) => c.status === status).length}
                  </Badge>
                )}
              </Button>
            ))}
          </div>
        </div>

        {/* Candidates Grid */}
        <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((candidate) => (
            <CandidateCard key={candidate.id} candidate={candidate} />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="mt-16 text-center">
            <p className="text-lg font-medium text-muted-foreground">No candidates found</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Try adjusting your search or filters
            </p>
          </div>
        )}
      </main>
    </div>
  )
}
