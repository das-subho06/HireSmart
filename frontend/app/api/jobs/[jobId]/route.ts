import { NextRequest, NextResponse } from "next/server";
import { connectDb } from "@/lib/connectDb";

import Job from "@/models/job";



export async function GET(req: NextRequest, context: { params: Promise<{ jobId: string }> | { jobId: string } }) {
  try {
    await connectDb();
    const params = await context.params;
    const job = await Job.findById(params.jobId);
    if (!job) return NextResponse.json({ message: "Job not found" }, { status: 404 });
    return NextResponse.json({ job }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Error fetching job" }, { status: 500 });
  }
}