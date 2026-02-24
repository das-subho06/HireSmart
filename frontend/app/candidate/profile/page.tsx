"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import axios from "axios";
import {
  ArrowLeft,
  Edit2,
  MapPin,
  MessageCircle,
  Phone,
} from "lucide-react"; 
import { set } from "mongoose";

interface Service {
  name: string;
}

interface WorkExperience {
  role: string;
  company: string;
  startDate: string;
  endDate: string;
}
const TECHNICAL_SKILLS = [
  'JavaScript',
  'TypeScript',
  'Python',
  'Java',
  'C++',
  'C#',
  'Go',
  'Rust',
  'Ruby',
  'PHP',
  'SQL',
  'NoSQL',
  'React',
  'Next.js',
  'Node.js',
  'Express.js',
  'Django',
  'Flask',
  'Spring Boot',
  'Angular',
  'Vue.js',
  'HTML',
  'CSS',
  'Tailwind CSS',
  'SASS/SCSS',
  'GraphQL',
  'REST API Development',
  'Docker',
  'Kubernetes',
  'AWS',
  'Azure',
  'GCP',
  'CI/CD',
  'Git & GitHub',
  'Unit Testing / Jest',
  'Selenium',
  'Machine Learning',
  'Deep Learning',
  'Data Analysis / Pandas',
  'Data Visualization / D3.js',
  'TensorFlow',
  'PyTorch',
  'MongoDB',
  'PostgreSQL',
  'MySQL',
  'Redis',
  'ElasticSearch',
  'Blockchain',
];
export default function Profile() {
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [profileName, setProfileName] = useState("");
  const [profileDescription, setProfileDescription] = useState("");
  const [location, setLocation] = useState("");
  const [contact, setContact] = useState("");
  const [services, setServices] = useState<string[]>([]);
const [originalServices, setOriginalServices] = useState<string[]>([]);
  const [experience, setExperience] = useState<WorkExperience[]>([]);
  const [resumeHeadline, setResumeHeadline] = useState("");
const [githubLink, setGithubLink] = useState("");
const [resumeFileUrl, setResumeFileUrl] = useState("");
const [yearsOfExperience, setYearsOfExperience] = useState("");
const [email, setEmail] = useState("");
  // Fetch candidate data
  useEffect(() => {
    const fetchCandidate = async () => {
      try {
        const res = await axios.get("/api/auth/profile", {
          withCredentials: true,
        });
        const data = res.data.candidate;
        if (data) {
          const skills = data.technicalSkills || [];
          setServices([...skills]); 
  setOriginalServices([...skills]); // separate copy
          setProfileName(data.name || "");
          setProfileDescription(data.profileSummary || "");
          setLocation(data.location || "");
          setContact(data.phone || "");
          setExperience(data.workExperience || []);
          setYearsOfExperience(data.experience || "");
  setResumeHeadline(data.resumeHeadline || "");
  setGithubLink(data.githubLink || "");
  setResumeFileUrl(data.resumeFileUrl || "");
  setEmail(data.email || "");
          // setServices(
          //   data.technicalSkills?.map((skill: string) => ({ name: skill })) || []
          // );
        }
      } catch (err) {
        console.error("Error fetching candidate:", err);
      }
    };

    fetchCandidate();
  }, []);

  const handleEdit = (section: string) => {
    if (section === "services" && isEditing !== "services") {
    setServices([...originalServices]); // restore original values
  }
    setIsEditing(isEditing === section ? null : section);
  };

  const handleExperienceChange = (
    index: number,
    field: keyof WorkExperience,
    value: string
  ) => {
    const newExp = [...experience];
    newExp[index][field] = value;
    setExperience(newExp);
  };
const handleSave = async (section: string) => {
  try {
    await axios.patch(
      "/api/auth/profile",
      
        {
  name: profileName,
  profileSummary: profileDescription,
  resumeHeadline,
  experience: yearsOfExperience,     // string
  workExperience: experience,        // array
  technicalSkills: services,
  location,
  email,
  contact,
},
      { withCredentials: true }
    );

    setIsEditing(null); // close edit mode
    alert("Profile updated successfully!");
  } catch (error) {
    console.error("Error updating profile:", error);
  }
};
  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-6 py-12">
        <Link
          href="/candidate/dashboard"
          className="flex items-center text-blue-600 hover:text-blue-700 mb-12"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          BACK TO DASHBOARD
        </Link>

        {/* Profile Top Section */}
        <div className="grid grid-cols-2 lg:grid-cols-2 gap-8 mb-12">
          <div className="bg-gradient-to-br from-blue-50 to-white border border-blue-100 rounded-3xl p-8 relative">
            <button
              onClick={() => handleEdit("profile")}
              className="absolute top-6 right-6 p-2 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <Edit2 className="w-4 h-4 text-blue-600" />
            </button>

            {isEditing === "profile" ? (
              <div className="space-y-4">
                <input
                  type="text"
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  className="w-full px-4 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Name"
                />
                <textarea
                  value={profileDescription}
                  onChange={(e) => setProfileDescription(e.target.value)}
                  className="w-full px-4 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[120px]"
                  placeholder="Profile Summary"
                />
                  <button
      onClick={() => handleSave("profile")}
      className="bg-blue-600 text-white px-4 py-2 rounded-lg"
    >
      Save
    </button>
              </div>
            ) : (
              <>
                <h2 className="text-gray-600 text-lg mb-4">Hello,</h2>
                <h1 className="text-4xl font-bold text-gray-900 mb-6">
                  I'm {profileName}.
                </h1>
                <p className="text-gray-600 leading-relaxed">
                  {profileDescription}
                </p>
              </>
            )}
          </div>

          <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-3xl p-8 flex items-center justify-center">
            <div className="w-64 h-64 bg-white rounded-full flex items-center justify-center">
              <div className="text-gray-400 text-center">
                <div className="text-6xl mb-2">👤</div>
                <p className="text-sm">Profile Image</p>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-blue-50 to-white border border-blue-100 rounded-3xl p-8 relative">
    <button
              onClick={() => handleEdit("resume")}
              className="absolute top-6 right-6 p-2 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <Edit2 className="w-4 h-4 text-blue-600" />
            </button>

            {isEditing === "resume" ? (
              <div className="space-y-4">
                <textarea
                  value={resumeHeadline}
                  onChange={(e) => setResumeHeadline(e.target.value)}
                  className="w-full px-4 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[120px]"
                  placeholder="Resume Headline"
                />
                  <button
      onClick={() => handleSave("resume")}
      className="bg-blue-600 text-white px-4 py-2 rounded-lg"
    >
      Save
    </button>
              </div>
            ) : (
              <>
                <h3 className="text-xl font-bold mb-2">Resume Headline</h3>
                <p className="text-gray-600 leading-relaxed">
                  {resumeHeadline}
                </p>
              </>
            )}
</div>
<div className="bg-gradient-to-br from-blue-50 to-white border border-blue-100 rounded-3xl p-8 relative">
  <h3 className="text-xl font-bold mb-2">Resume Document</h3>
  {resumeFileUrl ? (
    <a
      href={resumeFileUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
    >
      View / Download Resume
    </a>
  ) : (
    <p className="text-gray-500">No resume uploaded</p>
  )}
</div>
        </div>

        {/* Experience & Services */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Experience */}
          <div className="bg-gradient-to-br from-blue-50 to-white border border-blue-100 rounded-3xl p-8 relative">
            <button
              onClick={() => handleEdit("experience")}
              className="absolute top-6 right-6 p-2 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <Edit2 className="w-4 h-4 text-blue-600" />
            </button>

            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              My Experience
            </h3>

            {isEditing === "experience" ? (
              <div className="space-y-4">
                {experience.map((exp, index) => (
                  <div key={index} className="space-y-2">
                    <input
                      type="text"
                      value={exp.role}
                      onChange={(e) =>
                        handleExperienceChange(index, "role", e.target.value)
                      }
                      className="w-full px-4 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Role"
                    />
                    <input
                      type="text"
                      value={exp.company}
                      onChange={(e) =>
                        handleExperienceChange(index, "company", e.target.value)
                      }
                      className="w-full px-4 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Company"
                    />
                    <input
                      type="date"
                      value={exp.startDate}
                      onChange={(e) =>
                        handleExperienceChange(index, "startDate", e.target.value)
                      }
                      className="w-full px-4 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="date"
                      value={exp.endDate}
                      onChange={(e) =>
                        handleExperienceChange(index, "endDate", e.target.value)
                      }
                      className="w-full px-4 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                      <button
      onClick={() => handleSave("experience")}
      className="bg-blue-600 text-white px-4 py-2 rounded-lg"
    >
      Save
    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {yearsOfExperience === "Fresher" ? (
  <div className="text-blue-600 font-semibold text-lg">
    🚀 Ready to get a job!
  </div>
) : experience.length === 0 ? (
  <div className="text-gray-500">No experience added</div>
) : (
  experience.map((exp, index) => (
    <div key={index} className="flex items-start">
      <span className="text-blue-600 mr-3 mt-1">»</span>
      <div>
        <span className="text-gray-600">
          {new Date(exp.startDate).toLocaleDateString("en-IN")} -{" "}
{new Date(exp.endDate).toLocaleDateString("en-IN")}
        </span>
        <span className="text-gray-400 mx-2">—</span>
        <span className="text-gray-900 font-medium">{exp.role}</span>
        <span className="text-gray-400 mx-2">—</span>
        <span className="text-gray-600">{exp.company}</span>
      </div>
    </div>
  ))
)}
              </div>
            )}
          </div>

          {/* Services */}
          <div className="bg-gradient-to-br from-blue-50 to-white border border-blue-100 rounded-3xl p-8 relative">
            <button
              onClick={() => handleEdit("services")}
              className="absolute top-6 right-6 p-2 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <Edit2 className="w-4 h-4 text-blue-600" />
            </button>

            <h3 className="text-2xl font-bold text-gray-900 mb-6">What I know</h3>

            {isEditing === "services" ? (
              <div className="space-y-3">
                {TECHNICAL_SKILLS.map((skill) => (
  <label key={skill} className="flex items-center space-x-2">
    <input
      type="checkbox"
      checked={services.includes(skill)}
      onChange={(e) => {
        if (e.target.checked) {
          setServices([...services, skill]);
        } else {
          setServices(services.filter((s) => s !== skill));
        }
      }}
      className="accent-blue-600"
    />
    <span>{skill}</span>
  </label>
))}
                  <button
      onClick={() => handleSave("services")}
      className="bg-blue-600 text-white px-4 py-2 rounded-lg"
    >
      Save
    </button>
              </div>
            ) : (
              <div className="space-y-4">
                {services.map((skill) => (
  <div key={skill} className="flex items-center">
    <span className="text-blue-600 mr-3">✦</span>
    <span className="text-gray-900">{skill}</span>
  </div>
))}
              </div>
            )}
          </div>
        </div>

        {/* Stats: Contact & Location */}
        <div className="grid grid-cols-4 md:grid-cols-4 lg:grid-cols-4 gap-6">
          <div className="bg-gradient-to-br from-blue-50 to-white border border-blue-100 rounded-3xl p-8">
  <h3 className="text-gray-900 font-medium mb-1">GitHub</h3>
  {githubLink ? (
    <a
      href={githubLink}
      target="_blank"
      rel="noopener noreferrer"
      className="text-blue-600 underline items-center overflow-x-auto"
    >
      {githubLink}
    </a>
  ) : (
    <p className="text-gray-600 text-sm uppercase tracking-wider">No GitHub link added</p>
  )}
</div>
          <div className="relative bg-gradient-to-br from-blue-50 to-white border border-blue-100 rounded-3xl p-8">
             <button
              onClick={() => handleEdit("location")}
              className="absolute top-6 right-6 p-2 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <Edit2 className="w-4 h-4 text-blue-600" />
            </button>

            <h3 className="text-2xl font-bold text-gray-900 mb-6">Location</h3>

            {isEditing === "location" ? (
              <div className="space-y-3">
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-4 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Location"
                />
                  <button
      onClick={() => handleSave("location")}
      className="bg-blue-600 text-white px-4 py-2 rounded-lg"
    >
      Save
    </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center">
                  <MapPin className="w-5 h-5 text-blue-600 mr-3" />
                  <span className="text-gray-900">{location}</span>
                </div>
              </div>
            )}
          </div>     
          <div className="relative bg-gradient-to-br from-blue-50 to-white border border-blue-100 rounded-3xl p-8">
             <button
              onClick={() => handleEdit("contact")}
              className="absolute top-6 right-6 p-2 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <Edit2 className="w-4 h-4 text-blue-600" />
            </button>

            <h3 className="text-2xl font-bold text-gray-900 mb-6">Contact</h3>

            {isEditing === "contact" ? (
              <div className="space-y-3">
                <input
                  type="text"
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  className="w-full px-4 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Contact"
                />
                  <button
      onClick={() => handleSave("contact")}
      className="bg-blue-600 text-white px-4 py-2 rounded-lg"
    >
      Save
    </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center">
                  <Phone className="w-5 h-5 text-blue-600 mr-3" />
                  <span className="text-gray-900">{contact}</span>
                </div>
              </div>
            )}
          </div>
<div className="relative bg-gradient-to-br from-blue-50 to-white border border-blue-100 rounded-3xl p-8">
            <button
              onClick={() => handleEdit("email")}
              className="absolute top-6 right-6 p-2 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <Edit2 className="w-4 h-4 text-blue-600" />
            </button>

            <h3 className="text-2xl font-bold text-gray-900 mb-6">Email</h3>

            {isEditing === "email" ? (
              <div className="space-y-3">
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Email"
                />
                  <button
      onClick={() => handleSave("email")}
      className="bg-blue-600 text-white px-4 py-2 rounded-lg"
    >
      Save
    </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center">
                  <MessageCircle className="w-5 h-5 text-blue-600 mr-3" />
                  <span className="text-gray-900">{email}</span>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}