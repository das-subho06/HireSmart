// app/api/auth/signin/route.ts
import { NextRequest, NextResponse } from "next/server";
import {connectDb} from "@/lib/connectDb";
import User from "@/models/user";
import { comparePassword } from "@/utils/hashPassword";
import {sign} from "jsonwebtoken";
import { serialize } from "cookie";
import jwt from "jsonwebtoken";
export async function POST(req: NextRequest) {
  try {
    await connectDb();

    const body = await req.json(); // important in App Router
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ message: "Email and password are required" }, { status: 400 });
    }

    const user = await User.findOne({ email });
    if (!user || !user.password) {
      return NextResponse.json({ message: "Invalid credentials" }, { status: 400 });
    }

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      return NextResponse.json({ message: "Invalid credentials" }, { status: 400 });
    }
     const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET!, { expiresIn: "7d" });
        
     const res = NextResponse.json({ user });
    res.cookies.set("token", token, { httpOnly: true, path: "/" });

    return res;
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ message: err.message || "Sign in failed" }, { status: 500 });
  }
}