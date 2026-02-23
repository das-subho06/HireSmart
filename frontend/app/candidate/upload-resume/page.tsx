"use client";
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState, ChangeEvent } from 'react';
import { Upload, FileText, Briefcase, User, Mail, Phone, MapPin, Clock, Calendar} from 'lucide-react';
import axios from 'axios';
interface CandidateData {
  name: string;
  email: string;
  phone: string;
  location: string;
  profileSummary: string;
  resumeHeadline: string;
  jobRoles: string[];
  technicalSkills: string[];
  githubLink: string;
  experience: string;
  startDate: string;
  resumeFile: File | null;
}
interface WorkExperience {
  role: string;
  company: string;
  startDate: string;
  endDate: string;
}
const JOB_ROLES = [
  'Software Engineer',
  'Frontend Developer',
  'Backend Developer',
  'Full Stack Developer',
  'Data Scientist',
  'Product Manager',
  'UI/UX Designer',
  'DevOps Engineer',
  'QA Engineer',
  'Business Analyst',
  'Project Manager',
  'Marketing Manager',
  
];

const EXPERIENCE_OPTIONS = [
  'Fresher',
  '1 year',
  '2 years',
  '3 years',
  '4 years',
  '5 years',
  '6 years',
  '7 years',
  '8 years',
  '8+ years',
];

const START_DATE_OPTIONS = [
  'Immediately',
  'Within 2 weeks',
  'Within 1 month',
  'Within 2 months',
  'Within 3 months',
];
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
export default function CandidateApplicationForm() {
  const [formData, setFormData] = useState<CandidateData>({
    name: '',
    email: '',
    phone: '',
    location: '',
    profileSummary: '',
    resumeHeadline: '',
    jobRoles: [],
    technicalSkills: [],
    githubLink: '',
    experience: '',
    startDate: '',
    resumeFile: null,
  });
  const router = useRouter()
  const [workExperience, setWorkExperience] = useState<WorkExperience[]>([]);
  const [githubLink, setGithubLink] = useState('');
  const [isFresher, setIsFresher] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const handleInputChange = (field: keyof CandidateData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const fileType = file.type;
      if (
        fileType === 'application/pdf' ||
        fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
        fileType === 'application/msword'
      ) {
        setFormData((prev) => ({ ...prev, resumeFile: file }));
        if (errors.resumeFile) {
          setErrors((prev) => {
            const newErrors = { ...prev };
            delete newErrors.resumeFile;
            return newErrors;
          });
        }
      } else {
        setErrors((prev) => ({ ...prev, resumeFile: 'Only PDF and DOCX files are allowed' }));
      }
    }
  };

  const handleJobRoleToggle = (role: string) => {
    setFormData((prev) => ({
      ...prev,
      jobRoles: prev.jobRoles.includes(role)
        ? prev.jobRoles.filter((r) => r !== role)
        : [...prev.jobRoles, role],
    }));
    if (errors.jobRoles) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.jobRoles;
        return newErrors;
      });
    }
  };
const handleTechnicalSkillToggle = (skill: string) => {
    setFormData((prev) => ({
      ...prev,
      technicalSkills: prev.technicalSkills.includes(skill)
        ? prev.technicalSkills.filter((s) => s !== skill)
        : [...prev.technicalSkills, skill],
    }));
    if (errors.technicalSkills) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.technicalSkills;
        return newErrors;
      });
    }
  };
  const handleExperienceChange = (
  index: number,
  field: keyof WorkExperience,
  value: string
) => {
  setWorkExperience((prev) => {
    const updated = [...prev];
    updated[index][field] = value;
    return updated;
  });
};

const addExperience = () => {
  setWorkExperience((prev) => [
    ...prev,
    { role: '', company: '', startDate: '', endDate: '' },
  ]);
};

const removeExperience = (index: number) => {
  setWorkExperience((prev) => prev.filter((_, i) => i !== index));
};
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!formData.location.trim()) newErrors.location = 'Location is required';
    if (!formData.profileSummary.trim()) {
      newErrors.profileSummary = 'Profile summary is required';
    } else {
      const wordCount = formData.profileSummary.trim().split(/\s+/).length;
      if (wordCount > 300) {
        newErrors.profileSummary = `Profile summary must be within 300 words (current: ${wordCount})`;
      }
    }
    if (!formData.resumeHeadline.trim()) {
      newErrors.resumeHeadline = 'Resume headline is required';
    } else {
      const wordCount = formData.resumeHeadline.trim().split(/\s+/).length;
      if (wordCount > 50) {
        newErrors.resumeHeadline = `Resume headline must be within 50 words (current: ${wordCount})`;
      }
    }
    if (formData.jobRoles.length === 0) newErrors.jobRoles = 'Select at least one job role';
    if (!formData.experience) newErrors.experience = 'Years of experience is required';
    if (!formData.startDate) newErrors.startDate = 'Start date preference is required';
    if (!formData.resumeFile) newErrors.resumeFile = 'Resume upload is required';
    if (githubLink && !/^https?:\/\/(www\.)?github\.com\/[A-Za-z0-9_-]+\/?$/.test(githubLink)) {
  newErrors.githubLink = 'Enter a valid GitHub profile URL';
}
if (!isFresher) {
  workExperience.forEach((exp, i) => {
    if (!exp.role) newErrors[`role_${i}`] = 'Role is required';
    if (!exp.company) newErrors[`company_${i}`] = 'Company is required';
    if (!exp.startDate) newErrors[`start_${i}`] = 'Start date is required';
    if (!exp.endDate) newErrors[`end_${i}`] = 'End date is required';
  });
}
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!validateForm()) return;
  try {
    // Create FormData
    const data = new FormData();
    data.append("name", formData.name);
    data.append("email", formData.email);
    data.append("phone", formData.phone);
    data.append("location", formData.location);
    data.append("profileSummary", formData.profileSummary);
    data.append("resumeHeadline", formData.resumeHeadline);
    data.append("experience", formData.experience);
    data.append("startDate", formData.startDate);
    data.append("githubLink", githubLink || "");
    data.append("resumeFile", formData.resumeFile!); // file must exist

    // Job roles and technical skills are arrays
    formData.jobRoles.forEach((role) => data.append("jobRoles[]", role));
    formData.technicalSkills.forEach((skill) => data.append("technicalSkills[]", skill));

    // Work experience as JSON string
    if (!isFresher) data.append("workExperience", JSON.stringify(workExperience));

    // Make POST request
    const response = await axios.post("/api/auth/upload-resume", data, {
       withCredentials: true,
    });

    console.log("Response:", response.data);
    setIsSubmitted(true);
    router.push("/candidate/profile");
  } catch (err: any) {
    console.error(err);
    alert(err.response?.data?.message || "Something went wrong!");
  }
};

  const wordCount = formData.profileSummary.trim() ? formData.profileSummary.trim().split(/\s+/).length : 0;
  const headlineWordCount = formData.resumeHeadline.trim() ? formData.resumeHeadline.trim().split(/\s+/).length : 0;

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Application Submitted!</h2>
          <p className="text-gray-600 mb-6">
            Your application has been successfully submitted. We'll review your profile and get back to you soon.
          </p>
          <button
            onClick={() => {
              setIsSubmitted(false);
              setFormData({
                name: '',
                email: '',
                phone: '',
                location: '',
                profileSummary: '',
                resumeHeadline: '',
                jobRoles: [],
                technicalSkills: [],
                githubLink: '',
                experience: '',
                startDate: '',
                resumeFile: null,
              });
            }}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Submit Another Application
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-6">
          <h1 className="text-3xl font-bold text-white mb-2">Candidate Application</h1>
          <p className="text-blue-100">Complete your profile and upload your resume</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          {/* Resume Upload */}
          <div>
            <label className="flex items-center text-lg font-semibold text-gray-900 mb-3">
              <Upload className="w-5 h-5 mr-2" />
              Upload Resume <span className="text-red-500 ml-1">*</span>
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 hover:border-blue-400 transition-colors">
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleFileUpload}
                className="hidden"
                id="resume-upload"
              />
              <label
                htmlFor="resume-upload"
                className="cursor-pointer flex flex-col items-center justify-center"
              >
                <FileText className="w-12 h-12 text-gray-400 mb-3" />
                <span className="text-sm font-medium text-gray-700">
                  {formData.resumeFile ? formData.resumeFile.name : 'Click to upload PDF or DOCX'}
                </span>
                <span className="text-xs text-gray-500 mt-1">Maximum file size: 10MB</span>
              </label>
            </div>
            {errors.resumeFile && <p className="text-red-500 text-sm mt-1">{errors.resumeFile}</p>}
          </div>

          {/* Personal Information */}
          <div>
            <h2 className="flex items-center text-xl font-bold text-gray-900 mb-4">
              <User className="w-5 h-5 mr-2" />
              Personal Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className={`w-full px-4 py-2 border ${
                    errors.name ? 'border-red-500' : 'border-gray-300'
                  } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                  placeholder="John Doe"
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className={`w-full px-4 py-2 border ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                  placeholder="john@example.com"
                />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className={`w-full px-4 py-2 border ${
                    errors.phone ? 'border-red-500' : 'border-gray-300'
                  } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                  placeholder="+1 (555) 123-4567"
                />
                {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Location <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  className={`w-full px-4 py-2 border ${
                    errors.location ? 'border-red-500' : 'border-gray-300'
                  } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                  placeholder="City, State"
                />
                {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location}</p>}
              </div>
            </div>
          </div>

          {/* Resume Headline */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Resume Headline <span className="text-red-500">*</span>
              <span className="text-gray-500 text-xs ml-2">({headlineWordCount}/50 words)</span>
            </label>
            <input
              type="text"
              value={formData.resumeHeadline}
              onChange={(e) => handleInputChange('resumeHeadline', e.target.value)}
              className={`w-full px-4 py-2 border ${
                errors.resumeHeadline ? 'border-red-500' : 'border-gray-300'
              } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
              placeholder="e.g., Experienced Software Engineer with 5+ years in Full Stack Development"
            />
            {errors.resumeHeadline && <p className="text-red-500 text-sm mt-1">{errors.resumeHeadline}</p>}
          </div>

          {/* Profile Summary */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Profile Summary <span className="text-red-500">*</span>
              <span className="text-gray-500 text-xs ml-2">({wordCount}/300 words)</span>
            </label>
            <textarea
              value={formData.profileSummary}
              onChange={(e) => handleInputChange('profileSummary', e.target.value)}
              rows={6}
              className={`w-full px-4 py-2 border ${
                errors.profileSummary ? 'border-red-500' : 'border-gray-300'
              } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none`}
              placeholder="Tell us about your professional background, skills, and career objectives..."
            />
            {errors.profileSummary && <p className="text-red-500 text-sm mt-1">{errors.profileSummary}</p>}
          </div>

          {/* Job Roles */}
          <div>
            <label className="flex items-center text-sm font-medium text-gray-700 mb-3">
              <Briefcase className="w-4 h-4 mr-2" />
              Job Roles <span className="text-red-500 ml-1">*</span>
              <span className="text-gray-500 text-xs ml-2">(Select one or more)</span>
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {JOB_ROLES.map((role) => (
                <label
                  key={role}
                  className={`flex items-center px-4 py-3 border rounded-lg cursor-pointer transition-all ${
                    formData.jobRoles.includes(role)
                      ? 'bg-blue-50 border-blue-500 text-blue-700'
                      : 'border-gray-300 hover:border-blue-300'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={formData.jobRoles.includes(role)}
                    onChange={() => handleJobRoleToggle(role)}
                    className="mr-2 accent-blue-600"
                  />
                  <span className="text-sm">{role}</span>
                </label>
              ))}
            </div>
            {errors.jobRoles && <p className="text-red-500 text-sm mt-1">{errors.jobRoles}</p>}
          </div>

          {/* Technical Skills */}
           <div>
            <label className="flex items-center text-sm font-medium text-gray-700 mb-3">
              <Briefcase className="w-4 h-4 mr-2" />
              Technical Skills <span className="text-red-500 ml-1">*</span>
              <span className="text-gray-500 text-xs ml-2">(Select one or more)</span>
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {TECHNICAL_SKILLS.map((role) => (
                <label
                  key={role}
                  className={`flex items-center px-4 py-3 border rounded-lg cursor-pointer transition-all ${
                    formData.technicalSkills.includes(role)
                      ? 'bg-blue-50 border-blue-500 text-blue-700'
                      : 'border-gray-300 hover:border-blue-300'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={formData.technicalSkills.includes(role)}
                    onChange={() => handleTechnicalSkillToggle(role)}
                    className="mr-2 accent-blue-600"
                  />
                  <span className="text-sm">{role}</span>
                </label>
              ))}
            </div>
            {errors.technicalSkills && <p className="text-red-500 text-sm mt-1">{errors.technicalSkills}</p>}
          </div>
              {/* GitHub Link */}
<div>
  <label className="block text-sm font-medium text-gray-700 mb-2">
    GitHub Profile <span className="text-red-500">*</span>
  </label>
  <input
    type="url"
    value={githubLink}
    onChange={(e) => setGithubLink(e.target.value)}
    placeholder="https://github.com/username"
     className={`w-full px-4 py-2 border ${
                  errors.githubLink ? 'border-red-500' : 'border-gray-300'
                } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
  />
  {errors.githubLink && (
    <p className="text-red-500 text-sm mt-1">{errors.githubLink}</p>
  )}
</div>
          {/* Experience and Start Date */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <Clock className="w-4 h-4 mr-2" />
                Years of Experience <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.experience}
                onChange={(e) => {
    handleInputChange('experience', e.target.value);
    setIsFresher(e.target.value === 'Fresher'); // <-- set fresher
  }}
                className={`w-full px-4 py-2 border ${
                  errors.experience ? 'border-red-500' : 'border-gray-300'
                } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
              >
                <option value="">Select experience</option>
                {EXPERIENCE_OPTIONS.map((exp) => (
                  <option key={exp} value={exp}>
                    {exp}
                  </option>
                ))}
              </select>
              {errors.experience && <p className="text-red-500 text-sm mt-1">{errors.experience}</p>}
            </div>

            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <Calendar className="w-4 h-4 mr-2" />
                When Can You Start? <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.startDate}
                onChange={(e) => handleInputChange('startDate', e.target.value)}
                className={`w-full px-4 py-2 border ${
                  errors.startDate ? 'border-red-500' : 'border-gray-300'
                } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
              >
                <option value="">Select availability</option>
                {START_DATE_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              {errors.startDate && <p className="text-red-500 text-sm mt-1">{errors.startDate}</p>}
            </div>
          </div>
          {!isFresher && ( 
            <div>
  <label className="block text-sm font-medium text-gray-700 mb-2">
    Work Experience (if not a fresher)
  </label>

  {workExperience.map((exp, index) => (
    <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4 border p-4 rounded-lg">
      <input
        type="text"
        placeholder="Job Role"
        value={exp.role}
        onChange={(e) => handleExperienceChange(index, 'role', e.target.value)}
        className="w-full px-3 py-2 border rounded-lg"
      />
      <input
        type="text"
        placeholder="Company"
        value={exp.company}
        onChange={(e) => handleExperienceChange(index, 'company', e.target.value)}
        className="w-full px-3 py-2 border rounded-lg"
      />
      <input
        type="date"
        placeholder="Start Date"
        value={exp.startDate}
        onChange={(e) => handleExperienceChange(index, 'startDate', e.target.value)}
        className="w-full px-3 py-2 border rounded-lg"
      />
      <input
        type="date"
        placeholder="End Date"
        value={exp.endDate}
        onChange={(e) => handleExperienceChange(index, 'endDate', e.target.value)}
        className="w-full px-3 py-2 border rounded-lg"
      />

      <button
        type="button"
        onClick={() => removeExperience(index)}
        className="px-2 py-1 bg-red-500 text-white rounded-lg mt-2 md:mt-0"
      >
        Remove
      </button>
    </div>
  ))}

  <button
    type="button"
    onClick={addExperience}
    className="px-4 py-2 bg-green-600 text-white rounded-lg"
  >
    Add More Experience
  </button>
</div>
           )}

          {/* Submit Button */}
          
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl"
            >
              Submit Application
            </button>
         
        </form>
      </div>
    </div>
  );
}
