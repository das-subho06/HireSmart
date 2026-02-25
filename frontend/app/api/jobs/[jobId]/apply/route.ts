import { NextRequest, NextResponse } from "next/server";
import { connectDb } from "@/lib/connectDb";
import jwt from "jsonwebtoken";
import Job from "@/models/job";
import Candidate from "@/models/candidate";

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ jobId: string }> | { jobId: string } }
) {
  try {
    await connectDb();

    // 🚨 FIX: Safely await params to prevent Next.js 15 crashes
    const params = await context.params;
    const { jobId } = params;

    console.log("======================================");
    console.log("1. Job ID received from URL:", jobId);

    if (!jobId || jobId === "undefined") {
      return NextResponse.json({ message: "Invalid Job ID sent from frontend" }, { status: 400 });
    }

    // 1. Authenticate the user
    const token = req.cookies.get("token")?.value;
    if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string; id?: string; role: string };
    const targetUserId = decoded.userId || decoded.id;

    console.log("2. Candidate User ID:", targetUserId);

    // 2. Find the candidate profile
    const candidate = await Candidate.findOne({ userId: targetUserId });
    
    if (!candidate) {
      console.log("3. ERROR: Candidate profile not found in DB!");
      return NextResponse.json({ message: "Please upload a resume before applying" }, { status: 400 });
    }

    console.log("3. Candidate found. Candidate _id is:", candidate._id);

    // 3. Add the candidate's _id to the job's applicants array
    const updatedJob = await Job.findByIdAndUpdate(
      jobId,
      { $addToSet: { applicants: candidate._id } },
      { new: true }
    );

    if (!updatedJob) {
      console.log("4. ERROR: Mongoose could not find a job with ID:", jobId);
      return NextResponse.json({ message: "Job not found" }, { status: 404 });
    }

    console.log("4. SUCCESS! Job updated with new applicant.");
    console.log("======================================");

    return NextResponse.json({ message: "Successfully applied to job!" }, { status: 200 });
  } catch (error: any) {
    console.error("Apply error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
