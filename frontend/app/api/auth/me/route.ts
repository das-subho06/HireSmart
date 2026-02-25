import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import User from "@/models/user";
import { connectDb } from "@/lib/connectDb";

export async function GET(req: NextRequest) {
  await connectDb();
  const token = req.cookies.get("token")?.value;
  if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
  console.log("Decoded JWT:", decoded); // Debugging line
  const user = await User.findById(decoded.userId).select("name email role company");

  if (!user) return NextResponse.json({ message: "User not found" }, { status: 404 });
  console.log("2. Data straight from MongoDB:", user);
  return NextResponse.json({ user });
}
export async function PATCH(req: NextRequest) {
  try {
    await connectDb();
    const token = req.cookies.get("token")?.value;
    if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
    const { company } = await req.json();

    const user = await User.findByIdAndUpdate(decoded.userId, { company }, { new: true });
    if (!user) return NextResponse.json({ message: "User not found" }, { status: 404 });

    return NextResponse.json({ user });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}