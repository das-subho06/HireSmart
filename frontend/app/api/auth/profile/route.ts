import { NextRequest, NextResponse } from "next/server";
import {connectDb} from "@/lib/connectDb";
import jwt from "jsonwebtoken";
import User from "@/models/user";
import Candidate  from "@/models/candidate";

export async function GET(request: NextRequest) {
    await connectDb();
    const token = request.cookies.get("token")?.value;
    if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
    console.log(decoded);
    const user = await User.findById(decoded.userId).select("name email role company");
    if (!user) return NextResponse.json({ message: "User not found" }, { status: 404 });

    const candidate = await Candidate.findOne({ userId: user._id });
    if (!candidate) return NextResponse.json({ message: "Candidate not found" }, { status: 404 });

    return NextResponse.json({ user, candidate });
    ;
}
export async function PATCH(request: NextRequest) {
    await connectDb();
    const token = request.cookies.get("token")?.value;
    if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
    console.log(decoded);
    const user = await User.findById(decoded.userId).select("name email role company");
    if (!user) return NextResponse.json({ message: "User not found" }, { status: 404 });

    const candidate = await Candidate.findOne({ userId: user._id });
    if (!candidate) return NextResponse.json({ message: "Candidate not found" }, { status: 404 });

     const { 
  name, 
  profileSummary, 
  resumeHeadline, 
  workExperience,
  experience,   // this is yearsOfExperience
  startDate, 
  technicalSkills, 
  location, 
  email, 
  contact 
} = await request.json();
    if (name !== undefined) user.name = name;
if (email !== undefined) user.email = email;
if (profileSummary !== undefined) candidate.profileSummary = profileSummary;
if (resumeHeadline !== undefined) candidate.resumeHeadline = resumeHeadline;
if (experience !== undefined) candidate.experience = experience;
if (workExperience !== undefined) candidate.workExperience = workExperience;

if (startDate !== undefined) candidate.startDate = startDate;
if (technicalSkills !== undefined) candidate.technicalSkills = technicalSkills;
if (location !== undefined) candidate.location = location;
if (contact !== undefined) candidate.phone = contact;
    await user.save();
    await candidate.save();

     return NextResponse.json({ user, candidate });

}
