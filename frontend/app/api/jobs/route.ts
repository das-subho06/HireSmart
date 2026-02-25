import { NextRequest, NextResponse } from "next/server";
import { connectDb } from "@/lib/connectDb";
import jwt from "jsonwebtoken";
import Job from "@/models/job";

export async function POST(req: NextRequest) {
  try {
    await connectDb();

    // 1. Authenticate the user
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ message: "Unauthorized: Please log in" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string, id?: string, role: string };
    const targetUserId = decoded.userId || decoded.id;

    // 2. Ensure only recruiters can post jobs
    if (decoded.role !== "recruiter") {
      return NextResponse.json({ message: "Forbidden: Only recruiters can post jobs" }, { status: 403 });
    }

    // 3. Extract the job details from the frontend request
    const { title, description, skills, location } = await req.json();

    // 4. Basic Validation
    if (!title || !description || !skills || !location) {
      return NextResponse.json({ message: "All fields are required" }, { status: 400 });
    }

    // 5. Save the new job to the database
    const newJob = await Job.create({
      recruiterId: targetUserId,
      title,
      description,
      skills,
      location,
      applicants: [] // Starts with zero applicants
    });

    // 6. Send the newly created job back to the frontend
    return NextResponse.json({ message: "Job posted successfully", job: newJob }, { status: 201 });

  } catch (error: any) {
    console.error("POST /api/jobs Error:", error);
    return NextResponse.json(
      { message: "Internal Server Error", error: error.message },
      { status: 500 }
    );
  }
}