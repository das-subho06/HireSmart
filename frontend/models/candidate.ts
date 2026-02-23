import mongoose, { Schema, Document, Types, model, models  } from 'mongoose';
import { IUser } from "./user";
interface WorkExperience {
  role: string;
  company: string;
  startDate: Date;
  endDate: Date;
}

export interface ICandidate extends Document {
  userId: Types.ObjectId;
  name: string;
  email: string;
  phone: string;
  location: string;
  profileSummary: string;
  resumeHeadline: string;
  jobRoles: string[];
  technicalSkills: string[];
  githubLink?: string;
  experience: string;
  startDate: string;
  resumeFileUrl: string; // Assuming you store file in S3 or server and save URL
  workExperience: WorkExperience[];
  createdAt: Date;
  updatedAt: Date;
}

const WorkExperienceSchema = new Schema<WorkExperience>(
  {
    role: { type: String, required: true },
    company: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
  },
  { _id: false } // Prevents auto-generating _id for each work experience
);

const CandidateSchema = new Schema<ICandidate>(
  {
    userId: { type: Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, unique: true },
    phone: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
    profileSummary: { type: String, required: true, maxlength: 3000 }, // 300 words ~ 3000 chars
    resumeHeadline: { type: String, required: true, maxlength: 500 }, // 50 words ~ 500 chars
    jobRoles: { type: [String], required: true },
    technicalSkills: { type: [String], required: true },
    githubLink: { type: String },
    experience: { type: String, required: true },
    startDate: { type: String, required: true },
    resumeFileUrl: { type: String, required: true },
    workExperience: { type: [WorkExperienceSchema], default: [] },
  },
  { timestamps: true }
);

 const Candidate = models.Candidate || model('Candidate', CandidateSchema);

 export default Candidate;