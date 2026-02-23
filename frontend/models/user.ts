import mongoose, { Schema, Document, model, models } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  role: "recruiter" | "candidate";
  company?: string;
  googleId?: string;
}

const userSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String }, // optional if Google signup
  role: { type: String, enum: ["recruiter", "candidate"], required: true },
  company: { type: String },
  googleId: { type: String },
});
const User = models.User || model("User", userSchema);

export default User;