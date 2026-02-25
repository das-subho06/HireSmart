"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { CandidateCard } from "@/components/candidate-card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Search, Users, FileCheck, Star, Clock, LogOut, PlusCircle, Briefcase } from "lucide-react"
import axios from "axios"

const statuses = ["All", "New", "Reviewed", "Shortlisted", "Rejected"] as const

// --- STANDARD ML LISTS ---
const JOB_ROLES = [
  'Software Engineer', 'Frontend Developer', 'Backend Developer', 'Full Stack Developer',
  'Data Scientist', 'Product Manager', 'UI/UX Designer', 'DevOps Engineer',
  'QA Engineer', 'Business Analyst', 'Project Manager', 'Marketing Manager',
];

const TECHNICAL_SKILLS = [
  'JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'C#', 'Go', 'Rust', 'Ruby', 'PHP',
  'SQL', 'NoSQL', 'React', 'Next.js', 'Node.js', 'Express.js', 'Django', 'Flask',
  'Spring Boot', 'Angular', 'Vue.js', 'HTML', 'CSS', 'Tailwind CSS', 'SASS/SCSS',
  'GraphQL', 'REST API Development', 'Docker', 'Kubernetes', 'AWS', 'Azure', 'GCP',
  'CI/CD', 'Git & GitHub', 'Unit Testing / Jest', 'Selenium', 'Machine Learning',
  'Deep Learning', 'Data Analysis / Pandas', 'Data Visualization / D3.js',
  'TensorFlow', 'PyTorch', 'MongoDB', 'PostgreSQL', 'MySQL', 'Redis',
  'ElasticSearch', 'Blockchain',
];

interface Job {
  _id: string;
  title: string;
  location: string;
  skills: string[];
  applicants: string[];
  createdAt: string;
}

export default function RecruiterDashboard() {
  const [company, setCompany] = useState("");
  const [companySet, setCompanySet] = useState(false);
  const [recruiterName, setRecruiterName] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const [jobs, setJobs] = useState<Job[]>([]);
  const [applicants, setApplicants] = useState<any[]>([]); 

  const [search, setSearch] = useState("");
  const [activeStatus, setActiveStatus] = useState<string>("All");
  const [selectedJobId, setSelectedJobId] = useState<string>("All");

  const [isJobModalOpen, setIsJobModalOpen] = useState(false);
  
  // Updated Job Form State to hold an array of skills
  const [jobForm, setJobForm] = useState({
    title: "",
    description: "",
    skills: [] as string[],
    location: "",
  });

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        const userRes = await axios.get("/api/auth/me");
        setCompany(userRes.data.user.company);
        setRecruiterName(userRes.data.user.name);
        if (userRes.data.user.company) setCompanySet(true);

        const jobsRes = await axios.get("/api/jobs/me").catch(() => ({ data: { jobs: [] } }));
        setJobs(jobsRes.data.jobs || []);

        const applicantsRes = await axios.get("/api/applicants/me").catch(() => ({ data: { applicants: [] } }));
        setApplicants(applicantsRes.data.applicants || []);

      } catch (err) {
        console.error("Error fetching dashboard data:", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchDashboardData();
  }, []);

  const handlePostJob = async (e: React.FormEvent) => {
    e.preventDefault();
    if (jobForm.skills.length === 0) {
      return alert("Please select at least one technical skill.");
    }
    
    try {
      const res = await axios.post("/api/jobs", jobForm);
      
      alert("Job posted successfully!");
      setIsJobModalOpen(false);
      setJobForm({ title: "", description: "", skills: [], location: "" });
      
      setJobs([res.data.job, ...jobs]); 
    } catch (err) {
      console.error(err);
      alert("Failed to post job");
    }
  };

  const handleSkillToggle = (skill: string) => {
    setJobForm(prev => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter(s => s !== skill)
        : [...prev.skills, skill]
    }));
  };

  const filteredApplicants = applicants.filter((c) => {
    const matchesSearch =
      c.name?.toLowerCase().includes(search.toLowerCase()) ||
      c.technicalSkills?.some((s: string) => s.toLowerCase().includes(search.toLowerCase()));
    const matchesStatus = activeStatus === "All" || c.status === activeStatus;
    const matchesJob = selectedJobId === "All" || c.jobId === selectedJobId;
    return matchesSearch && matchesStatus && matchesJob;
  });

  const stats = [
    { label: "Total Applicants", value: applicants.length, icon: Users, color: "text-primary" },
    { label: "New", value: applicants.filter((c) => c.status === "New").length, icon: Clock, color: "text-primary" },
    { label: "Reviewed", value: applicants.filter((c) => c.status === "Reviewed").length, icon: FileCheck, color: "text-accent-foreground" },
    { label: "Shortlisted", value: applicants.filter((c) => c.status === "Shortlisted").length, icon: Star, color: "text-accent-foreground" },
  ];

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="text-lg font-medium text-muted-foreground animate-pulse">
          Loading your real dashboard...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background relative">
      <div className={(companySet && !isJobModalOpen) ? "" : "filter blur-sm pointer-events-none"}>
        <Navbar />
        
        <div className="flex gap-2 font-serif text-3xl font-bold tracking-tight text-foreground h-20 items-center justify-center rounded-lg bg-primary/10 mt-2 mx-6">
          <h1>Welcome, {recruiterName}!</h1>
          <p className="text-muted-foreground text-xl ml-4">| {company}</p>
        </div>

        <main className="mx-auto max-w-7xl px-6 py-8">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between mb-8">
            <div>
              <h1 className="font-mono text-3xl font-bold tracking-tight text-foreground">
                Recruiter Dashboard
              </h1>
              <p className="mt-1 text-muted-foreground">
                Manage your job postings and review candidate applications.
              </p>
            </div>
            
            <div className="flex gap-4 mt-4 sm:mt-0">
              <Button onClick={() => setIsJobModalOpen(true)} className="gap-2">
                <PlusCircle className="h-4 w-4" />
                Post New Job
              </Button>
              <Button variant="outline" className="gap-2" asChild>
                <Link href="/">
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </Link>
              </Button>
            </div>
          </div>

          <section className="mb-12">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Briefcase className="h-5 w-5" />
              Active Job Postings
            </h2>
            
            {jobs.length === 0 ? (
              <div className="rounded-xl border border-dashed border-border p-8 text-center bg-muted/20">
                <p className="text-muted-foreground mb-4">You haven't posted any jobs yet.</p>
                <Button onClick={() => setIsJobModalOpen(true)} variant="outline">
                  Create your first job
                </Button>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {jobs.map((job) => (
                  <div key={job._id} className="rounded-xl border border-border bg-card p-5 transition-all hover:shadow-md flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-bold text-lg leading-tight">{job.title}</h3>
                        <Badge variant="secondary" className="bg-primary/10 text-primary">
                          {job.applicants?.length || 0} Applicants
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-4">{job.location}</p>
                      <div className="flex flex-wrap gap-1 mb-4">
                        {job.skills?.slice(0, 3).map((skill, i) => (
                          <span key={i} className="text-xs bg-muted px-2 py-1 rounded-md">{skill}</span>
                        ))}
                        {job.skills?.length > 3 && <span className="text-xs text-muted-foreground px-1 py-1">+{job.skills.length - 3}</span>}
                      </div>
                    </div>
                    <Button 
                      variant={selectedJobId === job._id ? "default" : "outline"} 
                      className="w-full text-sm mt-4"
                      onClick={() => setSelectedJobId(selectedJobId === job._id ? "All" : job._id)}
                    >
                      {selectedJobId === job._id ? "Viewing Applicants..." : "View Applicants"}
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </section>

          <hr className="my-8 border-border" />

          <h2 className="text-xl font-bold mb-4">Applicant Overview {selectedJobId !== "All" && "(Filtered by Job)"}</h2>
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="rounded-xl border border-border bg-card p-5">
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

          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search applicants by name or skill..."
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
                    <Badge variant="secondary" className="ml-1.5 h-5 min-w-5 px-1 text-xs">
                      {status === "All" ? applicants.length : applicants.filter((c) => c.status === status).length}
                    </Badge>
                  )}
                </Button>
              ))}
            </div>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredApplicants.map((candidate) => (
              <CandidateCard 
                key={`${candidate.id || candidate._id}-${candidate.jobId}`} 
                candidate={candidate} 
              />
            ))}
          </div>

          {filteredApplicants.length === 0 && (
            <div className="mt-16 text-center">
              <p className="text-lg font-medium text-muted-foreground">No applicants found</p>
              <p className="mt-1 text-sm text-muted-foreground">
                {jobs.length === 0 ? "Post a job to start receiving applications." : "Try adjusting your search or filters."}
              </p>
            </div>
          )}
        </main>
      </div>

      {!companySet && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="rounded-xl bg-card p-8 shadow-lg w-96 backdrop-blur-md">
            <h2 className="text-xl font-bold mb-4">Heyyy recruiter! Do not forget to enter the company you belong to</h2>
            <Input
              placeholder="Company Name"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
            />
            <button
              className="mt-4 w-full bg-primary text-white p-2 rounded"
              onClick={async () => {
                if (!company.trim()) return alert("Please enter a company name");
                try {
                  await axios.patch("/api/auth/me", { company });
                  setCompanySet(true);
                } catch (err) {
                  console.error(err);
                  alert("Failed to update company");
                }
              }}
            >
              Continue
            </button>
          </div>
        </div>
      )}

      {/* UPDATED Job Posting Modal */}
      {isJobModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 p-4">
          <div className="rounded-xl bg-card p-8 shadow-lg w-full max-w-2xl bg-white max-h-[90vh] flex flex-col">
            <h2 className="text-2xl font-bold mb-6 shrink-0">Post a New Job</h2>
            
            <form onSubmit={handlePostJob} className="flex flex-col gap-4 overflow-y-auto pr-2 pb-4">
              
              {/* Dropdown for Job Role */}
              <div>
                <label className="text-sm font-medium mb-1 block">Job Title / Role</label>
                <select
                  required
                  value={jobForm.title}
                  onChange={(e) => setJobForm({...jobForm, title: e.target.value})}
                  className="w-full px-3 py-2 border border-input rounded-md bg-background focus:ring-1 focus:ring-ring"
                >
                  <option value="" disabled>Select a predefined role...</option>
                  {JOB_ROLES.map(role => (
                    <option key={role} value={role}>{role}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">Job Description / Specifications</label>
                <textarea 
                  required
                  className="w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  placeholder="Describe the responsibilities and requirements..."
                  value={jobForm.description}
                  onChange={(e) => setJobForm({...jobForm, description: e.target.value})}
                />
              </div>

              {/* Scrollable Checkbox Grid for Technical Skills */}
              <div>
                <label className="text-sm font-medium mb-1 block">Required Technical Skills <span className="text-xs text-muted-foreground">(Select all that apply)</span></label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 border border-input rounded-md p-4 max-h-48 overflow-y-auto bg-muted/10">
                  {TECHNICAL_SKILLS.map((skill) => (
                    <label key={skill} className="flex items-center gap-2 cursor-pointer hover:bg-muted/30 p-1 rounded transition-colors">
                      <input
                        type="checkbox"
                        className="accent-primary"
                        checked={jobForm.skills.includes(skill)}
                        onChange={() => handleSkillToggle(skill)}
                      />
                      <span className="text-sm text-foreground">{skill}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">Location</label>
                <Input 
                  required 
                  placeholder="e.g. Remote, New York, Bangalore" 
                  value={jobForm.location}
                  onChange={(e) => setJobForm({...jobForm, location: e.target.value})}
                />
              </div>

              <div className="flex gap-4 mt-4 pt-4 border-t border-border shrink-0">
                <Button type="button" variant="outline" className="flex-1" onClick={() => setIsJobModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" className="flex-1">
                  Post Job
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}