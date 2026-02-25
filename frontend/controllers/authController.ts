import { NextApiRequest,  NextApiResponse } from "next";
import User from "../models/user";
import { hashPassword, comparePassword } from "../utils/hashPassword";
import jwt from "jsonwebtoken";
import { connectDb } from "@/lib/connectDb";
import { OAuth2Client } from "google-auth-library";

export async function googleSignIn({ token, role }: { token: string; role: string }) {
  await connectDb();

  if (!token || !role) throw new Error("Missing data");

  const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: process.env.GOOGLE_CLIENT_ID,
  });

  const payload = ticket.getPayload();
  if (!payload) throw new Error("Invalid Google token");

  const email = payload.email!;
  const name = payload.name!;
  const googleId = payload.sub!;

  // 1️⃣ Find existing user by googleId OR email
  let user = await User.findOne({ $or: [{ googleId }, { email }] });

  if (user) {
    // Existing user: update name, role, reset company
    user.name = name;
    user.role = role;
    user.googleId = googleId; // in case it was missing
   // user.company = ""; // force modal
    await user.save(); // ensures correct _id
  } else {
    // New user
    user = new User({ name, email, googleId, role, company: "" });
    await user.save(); // generate proper _id
  }

  // 2️⃣ Create JWT with correct _id
  const jwtToken = jwt.sign(
    { userId: user._id.toString(), role: user.role },
    process.env.JWT_SECRET!,
    { expiresIn: "7d" }
  );

  return { user, token: jwtToken };
}
export async function signup(req: NextApiRequest, res: NextApiResponse) {
  await connectDb();
  const { name, email, password, role } = req.body;

  if (!name || !email || !role || (!password && !req.body.googleId)) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) return res.status(400).json({ message: "User already exists" });

  const hashedPassword = password ? await hashPassword(password) : undefined;

  const user = await User.create({ name, email, password: hashedPassword, role });

  return res.status(201).json({ user });
}

// SIGNIN
export async function signin(req: NextApiRequest, res: NextApiResponse) {
  await connectDb();
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user || !user.password) return res.status(400).json({ message: "Invalid credentials" });

  const isMatch = await comparePassword(password, user.password);
  if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

  return res.status(200).json({ user });
}

