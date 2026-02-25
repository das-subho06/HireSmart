"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, BrainCircuit, Github, Code, CheckCircle2, XCircle, GitCommit } from "lucide-react"
import axios from "axios"

export default function AIAnalysisPage() {
  const params = useParams()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [analysis, setAnalysis] = useState<any>(null)
  const [candidateName, setCandidateName] = useState("")

  useEffect(() => {
    async function runAnalysis() {
      try {
        // 1. Fetch raw data from your Next.js database (You'll need to create these simple GET routes if you haven't!)
        const jobRes = await axios.get(`/api/jobs/${params.jobId}`);
        const candidateRes = await axios.get(`/api/candidates/${params.candidateId}`);
        const realJob = jobRes.data.job;
        const realCandidate = candidateRes.data.candidate;
        // FOR NOW: Let's simulate the raw data we grabbed from MongoDB
        // const mockDbData = {
        //   candidateName: "Subhashree Das",
        //   jobSkills: ["React", "Node.js", "TypeScript", "MongoDB", "AWS"],
        //   candidateSkills: ["React", "Node.js", "Python", "C++", "MongoDB"],
        //   githubUrl: "https://github.com/das-subho06"
        // }
        // setCandidateName(mockDbData.candidateName)
        setCandidateName(realCandidate.name);

        // 2. 🚨 Send the raw data to your FastAPI Microservice!
        // We assume FastAPI is running locally on port 8000
        const fastApiResponse = await axios.post("http://localhost:8000/api/analyze", {
          job_skills: realJob.skills || [], // From your Job schema
          candidate_skills: realCandidate.technicalSkills || [], // From your Candidate schema
          github_url: realCandidate.githubLink  // Fallback just in case
        })

        setAnalysis(fastApiResponse.data)
      } catch (err) {
        console.error("Analysis failed:", err)
        alert("Failed to run AI analysis. Is FastAPI running?")
      } finally {
        setLoading(false)
      }
    }
    runAnalysis()
  }, [params])

  if (loading) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-background gap-4">
        <BrainCircuit className="h-16 w-16 text-indigo-500 animate-pulse" />
        <h2 className="text-xl font-mono font-bold animate-pulse text-indigo-600">FastAPI is analyzing profile...</h2>
      </div>
    )
  }

  if (!analysis) return <div className="p-8 text-center text-red-500">Analysis failed.</div>

  return (
    <div className="min-h-screen bg-muted/20 p-6 md:p-12">
      <Button variant="ghost" className="mb-6 gap-2" onClick={() => router.back()}>
        <ArrowLeft className="h-4 w-4" /> Back to Dashboard
      </Button>

      <div className="mx-auto max-w-5xl">
        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-lg shadow-indigo-200">
            <BrainCircuit className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-3xl font-bold font-mono text-foreground">AI Profile Analysis</h1>
            <p className="text-muted-foreground">Candidate: <span className="font-semibold text-foreground">{candidateName}</span></p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {/* Match Score Card */}
          <div className="col-span-1 rounded-2xl border border-border bg-card p-6 shadow-sm flex flex-col items-center justify-center text-center">
            <h3 className="text-lg font-semibold mb-4 w-full text-left text-muted-foreground">Similarity Score</h3>
            <div className="relative flex h-40 w-40 items-center justify-center rounded-full border-8 border-indigo-50 bg-indigo-50/50">
              <svg className="absolute inset-0 h-full w-full -rotate-90 transform">
                <circle cx="50%" cy="50%" r="45%" className="stroke-indigo-600 drop-shadow-md" strokeWidth="10%" fill="none" 
                  strokeDasharray="100" strokeDashoffset={100 - analysis.match_score} strokeLinecap="round" />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-4xl font-bold text-indigo-600">{analysis.match_score}%</span>
                <span className="text-xs font-medium text-indigo-400 uppercase tracking-wider">Match</span>
              </div>
            </div>
            <p className="mt-6 text-sm text-muted-foreground leading-relaxed">
              Based on the intersection of required job skills and candidate technical skills.
            </p>
          </div>

          {/* Skills Breakdown Card */}
          <div className="col-span-2 rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
              <Code className="h-5 w-5 text-primary" /> Skill Breakdown
            </h3>
            
            <div className="mb-6">
              <h4 className="text-sm font-medium text-emerald-600 mb-3 flex items-center gap-1">
                <CheckCircle2 className="h-4 w-4" /> Matched Skills
              </h4>
              <div className="flex flex-wrap gap-2">
                {analysis.matched_skills.map((skill: string) => (
                  <Badge key={skill} className="bg-emerald-100 text-emerald-800 hover:bg-emerald-200 border-emerald-200">{skill}</Badge>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium text-red-500 mb-3 flex items-center gap-1">
                <XCircle className="h-4 w-4" /> Missing Requirements
              </h4>
              <div className="flex flex-wrap gap-2">
                {analysis.missing_skills.map((skill: string) => (
                  <Badge key={skill} variant="outline" className="border-red-200 text-red-600 bg-red-50">{skill}</Badge>
                ))}
                {analysis.missing_skills.length === 0 && <span className="text-sm text-muted-foreground">Candidate has all required skills!</span>}
              </div>
            </div>
          </div>

          {/* GitHub Insights Card */}
          <div className="col-span-1 md:col-span-3 rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
              <Github className="h-5 w-5 text-slate-800" /> Developer Consistency & GitHub Stats
            </h3>
            
            <div className="grid gap-6 sm:grid-cols-3">
              <div className="rounded-xl bg-slate-50 p-4 border border-slate-100">
                <div className="text-sm text-slate-500 mb-1 font-medium">Public Repositories</div>
                <div className="text-3xl font-bold text-slate-800">{analysis.github_stats.public_repos}</div>
              </div>
              <div className="rounded-xl bg-slate-50 p-4 border border-slate-100">
                <div className="text-sm text-slate-500 mb-1 font-medium">Account Age</div>
                <div className="text-3xl font-bold text-slate-800">{analysis.github_stats.account_age_years} <span className="text-lg font-medium text-slate-500">years</span></div>
              </div>
              <div className="rounded-xl bg-slate-50 p-4 border border-slate-100">
                <div className="text-sm text-slate-500 mb-1 font-medium">Top Language</div>
                <div className="text-3xl font-bold text-indigo-600">{analysis.github_stats.top_language || "N/A"}</div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}