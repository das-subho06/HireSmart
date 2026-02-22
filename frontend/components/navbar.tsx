"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Briefcase } from "lucide-react"

export function Navbar() {
  const pathname = usePathname()
  const isLanding = pathname === "/"

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-card/80 backdrop-blur-md">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <Briefcase className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-mono text-xl font-bold tracking-tight text-foreground">
            HireSmart
          </span>
        </Link>

        {isLanding && (
          <div className="flex items-center gap-3">
            <Button variant="ghost" asChild>
              <Link href="/auth/signin">Sign In</Link>
            </Button>
            <Button asChild>
              <Link href="/auth/signup">Sign Up</Link>
            </Button>
          </div>
        )}

        {!isLanding && (
          <div className="flex items-center gap-3">
            <Button variant="ghost" asChild>
              <Link href="/">Home</Link>
            </Button>
          </div>
        )}
      </nav>
    </header>
  )
}
