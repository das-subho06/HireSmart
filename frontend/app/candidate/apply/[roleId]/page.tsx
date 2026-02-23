"use client"
import { use, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { companies, roles } from "@/lib/mock-data"
import { ArrowLeft, Upload, CheckCircle2, FileText } from "lucide-react"

export default function ApplyPage({
  params,
}: {
  params: Promise<{ roleId: string }>
}) {
  const unwrappedParams = use(params)
const { roleId } = unwrappedParams
  const router = useRouter()
  const [submitted, setSubmitted] = useState(false)
  const [fileName, setFileName] = useState("")



console.log("Unwrapped Params:", unwrappedParams) // Check what keys actually exist
console.log("Extracted roleId:", roleId)





  const role = roles.find((r) => String(r.id) === roleId)
  console.log("Found Role:", role)
  const company = role ? companies.find((c) => c.id === role.companyId) : null
  console.log("Found Company:", company)
  const companyRoles = role ? roles.filter((r) => r.companyId === role.companyId) : []

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) {
      setFileName(file.name)
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitted(true)
  }

  if (!role || !company) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="mx-auto max-w-7xl px-6 py-20 text-center">
          <p className="text-lg text-muted-foreground">Role not found</p>
          <Button variant="outline" className="mt-4" asChild>
            <Link href="/candidate/dashboard">Back to Companies</Link>
          </Button>
        </main>
      </div>
    )
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="flex items-center justify-center px-6 py-20">
          <Card className="w-full max-w-md text-center">
            <CardHeader>
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-accent/20">
                <CheckCircle2 className="h-8 w-8 text-accent-foreground" />
              </div>
              <CardTitle className="font-mono text-2xl">Application Submitted</CardTitle>
              <CardDescription className="text-base">
                Your application for {role.title} at {company.name} has been sent successfully.
                The recruiter will review your profile shortly.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              <Button asChild>
                <Link href="/candidate/dashboard">Browse More Companies</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href={`/candidate/company/${company.id}`}>
                  View More Roles at {company.name}
                </Link>
              </Button>
            </CardContent>
          </Card>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="mx-auto max-w-3xl px-6 py-8">
        {/* Breadcrumb */}
        <Link
          href={`/candidate/company/${company.id}`}
          className="inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to {company.name}
        </Link>

        {/* Header */}
        <div className="mt-6 rounded-xl border border-border bg-card p-6">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 font-mono text-lg font-bold text-primary">
              {company.logo}
            </div>
            <div>
              <h1 className="font-mono text-2xl font-bold tracking-tight text-foreground">
                Apply for {role.title}
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                {company.name} &middot; {role.department} &middot; {role.location}
              </p>
            </div>
          </div>
        </div>

        {/* Application Form */}
        <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-8">
          {/* Personal Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Personal Information</CardTitle>
              <CardDescription>Tell us about yourself</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input id="fullName" placeholder="John Doe" required />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" type="email" placeholder="john@example.com" required />
                </div>
              </div>
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" type="tel" placeholder="(555) 123-4567" required />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="location">Current Location</Label>
                  <Input id="location" placeholder="City, State" required />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Job Details */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Job Details</CardTitle>
              <CardDescription>Confirm the role you are applying for</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-5">
              <div className="flex flex-col gap-2">
                <Label htmlFor="role">Job Role</Label>
                <Select defaultValue={role.id}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    {companyRoles.map((r) => (
                      <SelectItem key={r.id} value={r.id}>
                        {r.title} - {r.department}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="experience">Years of Experience</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select experience" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0-1">0 - 1 years</SelectItem>
                    <SelectItem value="1-3">1 - 3 years</SelectItem>
                    <SelectItem value="3-5">3 - 5 years</SelectItem>
                    <SelectItem value="5-8">5 - 8 years</SelectItem>
                    <SelectItem value="8+">8+ years</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Questions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Questions</CardTitle>
              <CardDescription>Help us understand you better</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-5">
              <div className="flex flex-col gap-2">
                <Label htmlFor="whyRole">
                  Why are you interested in this role?
                </Label>
                <Textarea
                  id="whyRole"
                  placeholder="Share what excites you about this opportunity..."
                  rows={3}
                  required
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="strengths">
                  What are your key strengths for this position?
                </Label>
                <Textarea
                  id="strengths"
                  placeholder="Describe the skills and experiences that make you a great fit..."
                  rows={3}
                  required
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="availability">When can you start?</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select availability" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="immediately">Immediately</SelectItem>
                    <SelectItem value="2weeks">Within 2 weeks</SelectItem>
                    <SelectItem value="1month">Within 1 month</SelectItem>
                    <SelectItem value="2months">Within 2 months</SelectItem>
                    <SelectItem value="negotiable">Negotiable</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Resume Upload */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Resume Upload</CardTitle>
              <CardDescription>Upload your resume in PDF or DOC format</CardDescription>
            </CardHeader>
            <CardContent>
              <label
                htmlFor="resume"
                className="flex cursor-pointer flex-col items-center gap-3 rounded-xl border-2 border-dashed border-border p-8 transition-colors hover:border-primary/40 hover:bg-primary/5"
              >
                {fileName ? (
                  <>
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/20">
                      <FileText className="h-6 w-6 text-accent-foreground" />
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-medium text-foreground">{fileName}</p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        Click to replace
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                      <Upload className="h-6 w-6 text-primary" />
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-medium text-foreground">
                        Click to upload your resume
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        PDF or DOC, max 10MB
                      </p>
                    </div>
                  </>
                )}
                <input
                  id="resume"
                  type="file"
                  accept=".pdf,.doc,.docx"
                  className="sr-only"
                  onChange={handleFileChange}
                  required
                />
              </label>
            </CardContent>
          </Card>

          {/* Submit */}
          <div className="flex items-center justify-end gap-3 pb-10">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
            >
              Cancel
            </Button>
            <Button type="submit" className="px-8">
              Submit Application
            </Button>
          </div>
        </form>
      </main>
    </div>
  )
}
