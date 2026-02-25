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
import { Mail, Phone, Calendar, FileText, Clock, MapPin } from "lucide-react"

// 1. Define the REAL interface based on your MongoDB schema
export interface RealCandidate {
  id?: string;
  _id?: string;
  name: string;
  email: string;
  phone: string;
  experience: string;
  technicalSkills: string[]; // Replacing "skills"
  resumeFileUrl: string;     // Replacing "resumeFile"
  createdAt: string;         // Used for "appliedDate"
  status: string;
  appliedRole?: string;
  location?: string;         // Replacing "education" which wasn't in DB
  jobId?: string;
}

function statusColor(status: string) {
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
      return "bg-gray-100 text-gray-800 border-gray-200"
  }
}

export function CandidateCard({ candidate }: { candidate: RealCandidate }) {
  const [open, setOpen] = useState(false)

  // Safely format the date
  const appliedDate = candidate.createdAt 
    ? new Date(candidate.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : "Recently";

  // Safely extract just the filename from the URL for the UI
  const fileName = candidate.resumeFileUrl ? candidate.resumeFileUrl.split('/').pop() : "No resume attached";

  // Safely extract initials
  const initials = candidate.name
    ? candidate.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "?";

  // Safely grab technical skills
  const skills = candidate.technicalSkills || [];

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
                {initials}
              </div>
              <div>
                <CardTitle className="text-base font-semibold capitalize">{candidate.name}</CardTitle>
                <p className="text-sm text-muted-foreground">{candidate.appliedRole || "Candidate"}</p>
              </div>
            </div>
            <Badge variant="outline" className={statusColor(candidate.status)}>
              {candidate.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-1.5">
            {skills.slice(0, 3).map((skill, i) => (
              <Badge key={i} variant="secondary" className="text-xs font-normal">
                {skill}
              </Badge>
            ))}
            {skills.length > 3 && (
              <Badge variant="secondary" className="text-xs font-normal">
                +{skills.length - 3}
              </Badge>
            )}
          </div>
          <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {candidate.experience || "Not specified"}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {appliedDate}
            </span>
          </div>
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-primary/10 font-mono text-lg font-bold text-primary">
                {initials}
              </div>
              <div>
                <DialogTitle className="text-xl capitalize">{candidate.name}</DialogTitle>
                <DialogDescription className="text-sm">
                  Applied for {candidate.appliedRole || "a position"}
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
                Applied on {appliedDate}
              </span>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="flex items-center gap-2 text-sm">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-foreground">{candidate.email}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span className="text-foreground">{candidate.phone || "No phone"}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-foreground">{candidate.experience || "No experience listed"}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                {/* Changed from Education to Location since Location is in your DB */}
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="text-foreground">{candidate.location || "Location not provided"}</span>
              </div>
            </div>

            <div>
              <h4 className="mb-2 text-sm font-medium text-foreground">Technical Skills</h4>
              <div className="flex flex-wrap gap-1.5">
                {skills.length > 0 ? skills.map((skill, i) => (
                  <Badge key={i} variant="secondary" className="text-xs">
                    {skill}
                  </Badge>
                )) : <span className="text-sm text-muted-foreground">No skills listed</span>}
              </div>
            </div>

            <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/50 p-3">
              <FileText className="h-5 w-5 text-primary" />
              <div className="flex-1 overflow-hidden">
                <p className="text-sm font-medium text-foreground truncate">{fileName}</p>
                <p className="text-xs text-muted-foreground">Resume document</p>
              </div>
              <Button 
                size="sm" 
                variant="outline"
                disabled={!candidate.resumeFileUrl}
                onClick={() => {
                  if (candidate.resumeFileUrl) {
                    // Opens the PDF in a new browser tab!
                    window.open(candidate.resumeFileUrl, "_blank");
                  }
                }}
              >
                View
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}