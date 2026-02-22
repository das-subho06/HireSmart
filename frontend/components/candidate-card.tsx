"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Mail, Phone, Calendar, FileText, GraduationCap, Clock } from "lucide-react"
import type { Candidate } from "@/lib/mock-data"

function statusColor(status: Candidate["status"]) {
  switch (status) {
    case "New":
      return "bg-primary/10 text-primary border-primary/20"
    case "Reviewed":
      return "bg-accent/10 text-accent-foreground border-accent/20"
    case "Shortlisted":
      return "bg-accent/20 text-accent-foreground border-accent/30"
    case "Rejected":
      return "bg-destructive/10 text-destructive border-destructive/20"
    default:
      return ""
  }
}

export function CandidateCard({ candidate }: { candidate: Candidate }) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Card
        className="cursor-pointer transition-all hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5"
        onClick={() => setOpen(true)}
      >
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 font-mono text-sm font-bold text-primary">
                {candidate.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </div>
              <div>
                <CardTitle className="text-base font-semibold">{candidate.name}</CardTitle>
                <p className="text-sm text-muted-foreground">{candidate.appliedRole}</p>
              </div>
            </div>
            <Badge variant="outline" className={statusColor(candidate.status)}>
              {candidate.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-1.5">
            {candidate.skills.slice(0, 3).map((skill) => (
              <Badge key={skill} variant="secondary" className="text-xs font-normal">
                {skill}
              </Badge>
            ))}
            {candidate.skills.length > 3 && (
              <Badge variant="secondary" className="text-xs font-normal">
                +{candidate.skills.length - 3}
              </Badge>
            )}
          </div>
          <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {candidate.experience}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {candidate.appliedDate}
            </span>
          </div>
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-primary/10 font-mono text-lg font-bold text-primary">
                {candidate.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </div>
              <div>
                <DialogTitle className="text-xl">{candidate.name}</DialogTitle>
                <DialogDescription className="text-sm">
                  Applied for {candidate.appliedRole} at {candidate.company}
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="flex flex-col gap-5 pt-2">
            <div className="flex items-center justify-between">
              <Badge variant="outline" className={`${statusColor(candidate.status)} text-sm`}>
                {candidate.status}
              </Badge>
              <span className="text-sm text-muted-foreground">
                Applied {candidate.appliedDate}
              </span>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="flex items-center gap-2 text-sm">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-foreground">{candidate.email}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span className="text-foreground">{candidate.phone}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-foreground">{candidate.experience} experience</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <GraduationCap className="h-4 w-4 text-muted-foreground" />
                <span className="text-foreground">{candidate.education}</span>
              </div>
            </div>

            <div>
              <h4 className="mb-2 text-sm font-medium text-foreground">Skills</h4>
              <div className="flex flex-wrap gap-1.5">
                {candidate.skills.map((skill) => (
                  <Badge key={skill} variant="secondary" className="text-xs">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/50 p-3">
              <FileText className="h-5 w-5 text-primary" />
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">{candidate.resumeFile}</p>
                <p className="text-xs text-muted-foreground">Resume uploaded</p>
              </div>
              <Button size="sm" variant="outline">
                View
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
