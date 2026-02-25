import mongoose, { Schema, Document, Types, model, models } from "mongoose";

export interface IJob extends Document {
  recruiterId: Types.ObjectId; // Links the job to the recruiter who posted it
  title: string;
  description: string;
  skills: string[];
  location: string;
  applicants: Types.ObjectId[]; // Array to hold IDs of candidates who apply later
  createdAt: Date;
  updatedAt: Date;
}

const jobSchema = new Schema<IJob>(
  {
    recruiterId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    skills: { type: [String], required: true },
    location: { type: String, required: true },
    // Starts as an empty array when the job is first created
    applicants: [{ type: Schema.Types.ObjectId, ref: "Candidate" }], 
  },
  { timestamps: true }
);

const Job = models.Job || model<IJob>("Job", jobSchema);

export default Job;