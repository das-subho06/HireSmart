"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import axios from "axios";
import {
  ArrowLeft,
  Edit2,
  MapPin,
  Phone,
} from "lucide-react"; // or your icons

interface Service {
  name: string;
}

interface WorkExperience {
  role: string;
  company: string;
  startDate: string;
  endDate: string;
}

export default function Profile() {
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [profileName, setProfileName] = useState("");
  const [profileDescription, setProfileDescription] = useState("");
  const [location, setLocation] = useState("");
  const [contact, setContact] = useState("");
  const [services, setServices] = useState<Service[]>([]);
  const [experience, setExperience] = useState<WorkExperience[]>([]);

  // Fetch candidate data
  useEffect(() => {
    const fetchCandidate = async () => {
      try {
        const res = await axios.get("/api/auth/profile", {
          withCredentials: true,
        });
        const data = res.data.candidate;

        if (data) {
          setProfileName(data.name || "");
          setProfileDescription(data.profileSummary || "");
          setLocation(data.location || "");
          setContact(data.phone || "");
          setExperience(data.workExperience || []);
          setServices(
            data.technicalSkills?.map((skill: string) => ({ name: skill })) || []
          );
        }
      } catch (err) {
        console.error("Error fetching candidate:", err);
      }
    };

    fetchCandidate();
  }, []);

  const handleEdit = (section: string) => {
    setIsEditing(isEditing === section ? null : section);
  };

  const handleServiceChange = (index: number, value: string) => {
    const newServices = [...services];
    newServices[index].name = value;
    setServices(newServices);
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
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
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {experience.map((exp, index) => (
                  <div key={index} className="flex items-start">
                    <span className="text-blue-600 mr-3 mt-1">»</span>
                    <div>
                      <span className="text-gray-600">{exp.startDate} - {exp.endDate}</span>
                      <span className="text-gray-400 mx-2">—</span>
                      <span className="text-gray-900 font-medium">{exp.role}</span>
                      <span className="text-gray-400 mx-2">—</span>
                      <span className="text-gray-600">{exp.company}</span>
                    </div>
                  </div>
                ))}
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

            <h3 className="text-2xl font-bold text-gray-900 mb-6">What I do</h3>

            {isEditing === "services" ? (
              <div className="space-y-3">
                {services.map((service, index) => (
                  <input
                    key={index}
                    type="text"
                    value={service.name}
                    onChange={(e) => handleServiceChange(index, e.target.value)}
                    className="w-full px-4 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Service"
                  />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {services.map((service, index) => (
                  <div key={index} className="flex items-center">
                    <span className="text-blue-600 mr-3">✦</span>
                    <span className="text-gray-900">{service.name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Stats: Contact & Location */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-gradient-to-br from-blue-50 to-white border border-blue-100 rounded-3xl p-8">
            <MapPin className="w-8 h-8 text-blue-600 mb-3" />
            <div className="text-gray-900 font-medium mb-1">{location}</div>
            <div className="text-gray-600 text-sm uppercase tracking-wider">Location</div>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-white border border-blue-100 rounded-3xl p-8">
            <Phone className="w-8 h-8 text-blue-600 mb-3" />
            <div className="text-gray-900 font-medium mb-1">{contact}</div>
            <div className="text-gray-600 text-sm uppercase tracking-wider">Contact Info</div>
          </div>
        </div>
      </div>
    </div>
  );
}