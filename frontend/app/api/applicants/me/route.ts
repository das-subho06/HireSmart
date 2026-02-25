import { NextRequest, NextResponse } from "next/server";
import { connectDb } from "@/lib/connectDb";
import jwt from "jsonwebtoken";
import Job from "@/models/job";
import Candidate from "@/models/candidate";

// Force fresh data
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    await connectDb();

    // 1. Authenticate the Recruiter
    const token = req.cookies.get("token")?.value;
    if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string; id?: string };
    const targetUserId = decoded.userId || decoded.id;

    // 2. Find all jobs posted by this specific recruiter
    const jobs = await Job.find({ recruiterId: targetUserId });

    // 3. Extract all candidates and attach the jobId so the frontend can filter them
    let allApplicants: any[] = [];

    for (const job of jobs) {
      // Find the full candidate profiles for the IDs stored in this job's applicants array
      const candidates = await Candidate.find({ _id: { $in: job.applicants } }).lean();
      
      // Inject the jobId and a default "New" status so the UI cards render perfectly
      const candidatesWithJobId = candidates.map((c) => ({
        ...c,
        id: c._id.toString(), // Ensure id is mapped correctly for React keys
        jobId: job._id.toString(),
        appliedRole: job.title, // Add the job title so the recruiter knows what they applied for
        status: "New", 
      }));

      allApplicants = [...allApplicants, ...candidatesWithJobId];
    }

    return NextResponse.json({ applicants: allApplicants }, { status: 200 });

  } catch (error: any) {
    console.error("GET /api/applicants/me Error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}