"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { companies } from "@/lib/mock-data"
import { Search, MapPin, Briefcase, ArrowRight, LogOut } from "lucide-react"
import axios from "axios"
import { useRouter } from "next/navigation"
export default function CandidateDashboard() {
  const [search, setSearch] = useState("");
  const [candidateName, setCandidateName] = useState("");
  const [hasResume, setHasResume] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(null);
  const router = useRouter();
const fetchCandidate = async () => {
    try {
      const res = await axios.get("/api/auth/me");
      setCandidateName(res.data.user.name);
       const profileRes = await axios.get("/api/auth/profile",{
        withCredentials: true,
       });
      setHasResume(!!profileRes.data.candidate?.resumeFileUrl); // true if resume exists
    } catch (err) {
      console.error(err);
    }
  };
  // Fetch candidate data and check resume
  useEffect(() => {
    fetchCandidate();
  }, []);

  // If resume exists and user had clicked a company, redirect automatically
  useEffect(() => {
    if (hasResume && selectedCompanyId) {
      router.push(`/candidate/company/${selectedCompanyId}`);
    }
  }, [hasResume, selectedCompanyId, router]);

  const filtered = companies.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.industry.toLowerCase().includes(search.toLowerCase()) ||
      c.location.toLowerCase().includes(search.toLowerCase())
  );

  const handleCompanyClick = (companyId: string) => {
    if (!hasResume) {
      setSelectedCompanyId(companyId);
      setShowModal(true);
    } else {
      router.push(`/candidate/company/${companyId}`);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Welcome Banner */}
      <div onClick={()=>{router.push("/candidate/profile")}}
      className="flex gap-2 font-serif text-3xl font-bold tracking-tight text-foreground h-20 items-center justify-center rounded-lg bg-primary/10 mt-2">
        <h1>Welcome, {candidateName}!</h1>
      </div>

      <main className="mx-auto max-w-7xl px-6 py-8">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="font-mono text-3xl font-bold tracking-tight text-foreground">
              Explore Companies
            </h1>
            <p className="mt-1 text-muted-foreground">
              Discover opportunities at top companies hiring now
            </p>
          </div>

          <Button variant="outline" className="mt-4 gap-2 sm:mt-0" asChild>
            <Link href="/">
              <LogOut className="h-4 w-4" /> Sign Out
            </Link>
          </Button>
        </div>

        {/* Search */}
        <div className="mt-8 relative max-w-lg">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search companies, industries, or locations..."
            className="pl-10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Companies Grid */}
        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((company) => (
            <div
              key={company.id}
              onClick={() => handleCompanyClick(company.id)}
              className="cursor-pointer flex h-full flex-col rounded-xl border border-border bg-card p-6 transition-all group hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-primary/10 font-mono text-lg font-bold text-primary">
                  {company.logo}
                </div>
                <div className="min-w-0 flex-1">
                  <h2 className="truncate font-mono text-lg font-semibold text-foreground">
                    {company.name}
                  </h2>
                  <Badge variant="secondary" className="mt-1 text-xs font-normal">
                    {company.industry}
                  </Badge>
                </div>
              </div>

              <p className="mt-4 flex-1 text-sm leading-relaxed text-muted-foreground">
                {company.description}
              </p>

              <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" /> {company.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <Briefcase className="h-3 w-3" /> {company.openRoles} roles
                  </span>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" />
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="mt-16 text-center">
            <p className="text-lg font-medium text-muted-foreground">No companies found</p>
            <p className="mt-1 text-sm text-muted-foreground">Try adjusting your search</p>
          </div>
        )}
      </main>

      {/* Resume Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl p-6 max-w-sm text-center">
            <h2 className="text-lg font-bold mb-4">Upload Resume First</h2>
            <p className="text-sm text-muted-foreground mb-6">
              You need to upload your resume before viewing company details.
            </p>
            <div className="flex justify-center gap-4">
              <Button onClick={() => setShowModal(false)} variant="outline">
                Cancel
              </Button>
              <Link href="/candidate/upload-resume">
                <Button>Continue</Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}