import { NextRequest, NextResponse } from "next/server";
import { connectDb } from "@/lib/connectDb";
import Candidate from "@/models/candidate";

export async function GET(req: NextRequest, context: { params: Promise<{ candidateId: string }> | { candidateId: string } }) {
  try {
    await connectDb();
    const params = await context.params;
    const candidate = await Candidate.findById(params.candidateId);
    if (!candidate) return NextResponse.json({ message: "Candidate not found" }, { status: 404 });
    return NextResponse.json({ candidate }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Error fetching candidate" }, { status: 500 });
  }
}