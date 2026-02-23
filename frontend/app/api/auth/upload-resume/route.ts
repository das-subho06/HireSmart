import { NextRequest, NextResponse } from "next/server";
import {connectDb} from "@/lib/connectDb";
import jwt from "jsonwebtoken";
import User from "@/models/user";
import Candidate  from "@/models/candidate";

export async function POST(req: NextRequest) {
  await connectDb();

  const token = req.cookies.get("token")?.value;
  if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
  const user = await User.findById(decoded.userId);
  if (!user) return NextResponse.json({ message: "User not found" }, { status: 404 });

  const formData = await req.formData();
  const name = formData.get("name")?.toString();
  const email = formData.get("email")?.toString();
  const phone = formData.get("phone")?.toString();
  const location = formData.get("location")?.toString();
  const profileSummary = formData.get("profileSummary")?.toString();
  const resumeHeadline = formData.get("resumeHeadline")?.toString();
  const experience = formData.get("experience")?.toString();
  const startDate = formData.get("startDate")?.toString();
  const githubLink = formData.get("githubLink")?.toString();
  const resumeFile = formData.get("resumeFile") as File;
  const jobRoles = formData.getAll("jobRoles[]").map((r) => r.toString());
  const technicalSkills = formData.getAll("technicalSkills[]").map((s) => s.toString());
  const workExperience = formData.get("workExperience") ? JSON.parse(formData.get("workExperience")!.toString()) : [];

  if (!resumeFile || !name || !email) {
    return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
  }

  const resumeFileUrl = `/uploads/${resumeFile.name}`; // replace with actual storage

  const candidate = await Candidate.create({
    userId: user._id,
    name,
    email,
    phone,
    location,
    profileSummary,
    resumeHeadline,
    jobRoles,
    technicalSkills,
    githubLink,
    experience,
    startDate,
    resumeFileUrl,
    workExperience
  });

  return NextResponse.json({ message: "Resume uploaded successfully", candidate });
}