import { NextRequest, NextResponse } from "next/server";
import { connectDb } from "@/lib/connectDb";
import jwt from "jsonwebtoken";
import Job from "@/models/job"; // We will create this model in Step 2!

// Force Next.js to fetch fresh data every time so the dashboard is always up to date
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    await connectDb();

    // 1. Verify who is making the request
    const token = req.cookies.get("token")?.value;
    if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string, id?: string, role: string };
    const targetUserId = decoded.userId || decoded.id;

    // Optional: Ensure only recruiters can fetch their posted jobs
    if (decoded.role !== "recruiter") {
      return NextResponse.json({ message: "Forbidden: Only recruiters can view posted jobs" }, { status: 403 });
    }

    // 2. Fetch all jobs posted by this specific recruiter
    // We sort by createdAt: -1 to show the newest jobs first
    const jobs = await Job.find({ recruiterId: targetUserId }).sort({ createdAt: -1 });

    // 3. Send the jobs back to the frontend
    return NextResponse.json({ jobs }, { status: 200 });

  } catch (error: any) {
    console.error("GET /api/jobs/me Error:", error);
    return NextResponse.json(
      { message: "Internal Server Error", error: error.message }, 
      { status: 500 }
    );
  }
}