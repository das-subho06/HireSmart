// app/api/auth/signup/route.ts
import { NextRequest, NextResponse } from "next/server";
import {connectDb} from "@/lib/connectDb";
import User from "@/models/user";
import { hashPassword } from "@/utils/hashPassword";

export async function POST(req: NextRequest) {
  try {
    await connectDb();

    const body = await req.json(); // Important in App Router
    const { name, email, password, role } = body;

    if (!name || !email || !role || (!password && !body.googleId)) {
      return NextResponse.json({ message: "All fields are required" }, { status: 400 });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ message: "User already exists" }, { status: 400 });
    }

    const hashedPassword = password ? await hashPassword(password) : undefined;

    const user = await User.create({ name, email, password: hashedPassword, role });

    return NextResponse.json({ user }, { status: 201 });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ message: err.message || "Sign up failed" }, { status: 500 });
  }
}