"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Search, MapPin, CheckCircle, LogOut, FileText } from "lucide-react"
import axios from "axios"
import { useRouter } from "next/navigation"

export default function CandidateDashboard() {
  const [search, setSearch] = useState("");
  const [candidateName, setCandidateName] = useState("");
  const [hasResume, setHasResume] = useState(false);
  
  // REAL Data States
  const [jobs, setJobs] = useState<any[]>([]);
  const [appliedJobs, setAppliedJobs] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    async function fetchData() {
      try {
        // 1. Fetch Candidate Name
        const userRes = await axios.get("/api/auth/me");
        setCandidateName(userRes.data.user.name);
        
        // 2. Safely Check Profile Status
        let resumeExists = false;
        try {
          const profileRes = await axios.get("/api/auth/profile", { withCredentials: true });
          resumeExists = !!profileRes.data.candidate?.resumeFileUrl;
          setHasResume(resumeExists);
        } catch (profileErr) {
          // If profile fetch fails (e.g. 404), they just don't have a resume yet
          setHasResume(false);
        }

        // 3. ONLY fetch jobs if they have actually uploaded a resume!
        if (resumeExists) {
          const jobsRes = await axios.get("/api/jobs");
          setJobs(jobsRes.data.jobs || []);
        }
      } catch (err) {
        console.error("Dashboard error:", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  const filteredJobs = jobs.filter(
    (job) =>
      job.title?.toLowerCase().includes(search.toLowerCase()) ||
      job.location?.toLowerCase().includes(search.toLowerCase()) ||
      job.recruiterId?.company?.toLowerCase().includes(search.toLowerCase()) ||
      job.skills?.some((s: string) => s.toLowerCase().includes(search.toLowerCase()))
  );

  const handleApplyClick = async (jobId: string) => {
    try {
      await axios.post(`/api/jobs/${jobId}/apply`);
      alert("Application submitted successfully!");
      setAppliedJobs((prev) => [...prev, jobId]); 
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to apply. You might have already applied.");
    }
  };

  // 1. LOADING STATE
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="text-lg font-medium text-muted-foreground animate-pulse">Loading...</div>
      </div>
    );
  }

  // 2. THE GATEKEEPER: If no resume, show this and HIDE the jobs!
  if (!hasResume) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
          <div className="h-20 w-20 bg-primary/10 rounded-full flex items-center justify-center mb-6">
            <FileText className="h-10 w-10 text-primary" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground mb-4">
            Hello, {candidateName}!
          </h1>
          <p className="text-muted-foreground max-w-md mb-8 text-lg">
            Before you can browse and apply to jobs, you need to complete your profile and upload your resume.
          </p>
          <Button size="lg" className="gap-2" asChild>
            <Link href="/candidate/upload-resume">
              Upload Resume & Details
            </Link>
          </Button>
          
          <Button variant="ghost" className="mt-8 gap-2" asChild>
            <Link href="/">
              <LogOut className="h-4 w-4" /> Sign Out
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  // 3. NORMAL DASHBOARD: If they have a resume, show the jobs!
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div onClick={() => { router.push("/candidate/profile") }}
        className="flex gap-2 font-serif text-3xl font-bold tracking-tight text-foreground h-20 items-center justify-center rounded-lg bg-primary/10 mt-2 mx-6 cursor-pointer hover:bg-primary/20 transition-colors">
        <h1>Welcome, {candidateName}!</h1>
      </div>

      <main className="mx-auto max-w-7xl px-6 py-8">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="font-mono text-3xl font-bold tracking-tight text-foreground">
              Explore Jobs
            </h1>
            <p className="mt-1 text-muted-foreground">
              Discover and apply to opportunities at top companies
            </p>
          </div>

          <Button variant="outline" className="mt-4 gap-2 sm:mt-0" asChild>
            <Link href="/">
              <LogOut className="h-4 w-4" /> Sign Out
            </Link>
          </Button>
        </div>

        <div className="mt-8 relative max-w-lg">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search jobs, skills, or companies..."
            className="pl-10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredJobs.map((job) => (
            <div
              key={job._id}
              className="flex h-full flex-col rounded-xl border border-border bg-card p-6 transition-all hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5"
            >
              <div className="min-w-0 flex-1">
                <h2 className="truncate font-mono text-xl font-bold text-foreground">
                  {job.title}
                </h2>
                <p className="text-primary font-medium mt-1">
                  {job.recruiterId?.company || "Confidential Company"}
                </p>
              </div>

              <div className="mt-4 flex flex-wrap gap-1">
                {job.skills?.slice(0, 3).map((skill: string, i: number) => (
                  <Badge key={i} variant="secondary" className="text-xs font-normal">
                    {skill}
                  </Badge>
                ))}
                {job.skills?.length > 3 && (
                  <Badge variant="outline" className="text-xs font-normal">+{job.skills.length - 3}</Badge>
                )}
              </div>

              <p className="mt-4 flex-1 text-sm leading-relaxed text-muted-foreground line-clamp-3">
                {job.description}
              </p>

              <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" /> {job.location}
                  </span>
                </div>
                
                {appliedJobs.includes(job._id) ? (
                  <Button disabled variant="outline" className="gap-2 h-8 text-xs bg-green-500/10 text-green-600 border-green-200">
                    <CheckCircle className="h-3 w-3" /> Applied
                  </Button>
                ) : (
                  <Button onClick={() => handleApplyClick(job._id)} className="h-8 text-xs">
                    Apply Now
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>

        {filteredJobs.length === 0 && (
          <div className="mt-16 text-center">
            <p className="text-lg font-medium text-muted-foreground">No jobs found</p>
            <p className="mt-1 text-sm text-muted-foreground">Try adjusting your search</p>
          </div>
        )}
      </main>
    </div>
  );
}