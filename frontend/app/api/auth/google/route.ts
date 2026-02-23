import { NextRequest, NextResponse } from "next/server";
import { googleSignIn } from "@/controllers/authController";
import { connectDb } from "@/lib/connectDb";
import jwt from "jsonwebtoken";
import User from "@/models/user";

export async function POST(req: NextRequest) {
  try {
    await connectDb();
    const { token, role } = await req.json();

    if (!token || !role) {
      return NextResponse.json(
        { message: "Missing token or role" },
        { status: 400 }
      );
    }

    const result = await googleSignIn({ token, role });

    // ✅ Set JWT in cookie so future requests use this new user
    const res = NextResponse.json(result, { status: 200 });
    res.cookies.set("token", result.token, {
      httpOnly: true,
      path: "/",      // available across the app
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return res;

  } catch (err: any) {
    console.error("Google sign-in error:", err);
    return NextResponse.json(
      { message: err.message || "Google sign-in failed" },
      { status: 500 }
    );
  }
}