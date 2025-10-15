"use client";
import axios from "axios";
import type React from "react";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GradientButton } from "@/components/ui/gradient-button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Upload,
  FileText,
  Target,
  AlertCircle,
  CheckCircle2,
  TrendingUp,
  Sparkles,
} from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { GradientBackground } from "@/components/GradientBackground";

export default function ResumeAnalysis() {
  const [file, setFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState("");
  const [result, setResult] = useState<ResumeAnalysisResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const { user } = useUser();
  const user_id = user?.id;
  interface ResumeAnalysisResult {
    compatibilityScore: number;
    candidateName: string;
    missingSkills: string[];
    motivationalDescription: string;
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFile(e.target.files?.[0] ?? null);
  };

  interface ResumeAnalysisResponse {
    compatibilityScore: number;
    candidateName: string;
    missingSkills: string[];
    motivationalDescription: string;
    message?: string;
  }

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();

    if (!file || !jobDescription) {
      alert("Please select a file and enter job description");
      return;
    }

    setLoading(true);
    setShowResults(false);

    try {
      const formData = new FormData();
      formData.append("resume", file);
      formData.append("jobDescription", jobDescription);

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/resume-analysis/analyze/${user_id}`,
        formData
      );

      const data: ResumeAnalysisResponse = response.data;

      if (response.status === 201) {
        setResult(data);
        setTimeout(() => setShowResults(true), 500);
      } else {
        alert(`Error: ${data.message}`);
      }
    } catch (error: any) {
      alert(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const CircularProgress = ({ score }: { score: number }) => {
    const radius = 40;
    const strokeWidth = 5;
    const normalizedRadius = radius - strokeWidth * 2;
    const circumference = normalizedRadius * 2 * Math.PI;
    const strokeDasharray = `${(score / 100) * circumference} ${circumference}`;

    const getScoreColor = (score: number) => {
      if (score >= 80) return "#10b981"; // green
      if (score >= 60) return "#f59e0b"; // yellow
      if (score >= 40) return "#f97316"; // orange
      return "#ef4444"; // red
    };

    const getScoreGradient = (score: number) => {
      if (score >= 80) return "from-green-400 to-emerald-600";
      if (score >= 60) return "from-yellow-400 to-amber-600";
      if (score >= 40) return "from-orange-400 to-red-500";
      return "from-red-400 to-red-600";
    };

    return (
      <div className="relative w-20 h-20 mx-auto">
        <svg
          height={radius * 2}
          width={radius * 2}
          className="transform -rotate-90"
        >
          <defs>
            <linearGradient
              id={`gradient-${score}`}
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop
                offset="0%"
                stopColor={getScoreColor(score)}
                stopOpacity="0.8"
              />
              <stop
                offset="100%"
                stopColor={getScoreColor(score)}
                stopOpacity="1"
              />
            </linearGradient>
          </defs>
          <circle
            stroke="#e5e7eb"
            fill="transparent"
            strokeWidth={strokeWidth}
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />
          <circle
            stroke={`url(#gradient-${score})`}
            fill="transparent"
            strokeWidth={strokeWidth}
            strokeDasharray={strokeDasharray}
            strokeLinecap="round"
            r={normalizedRadius}
            cx={radius}
            cy={radius}
            className="transition-all duration-2000 ease-out"
            style={{
              filter: "drop-shadow(0 0 8px rgba(59, 130, 246, 0.3))",
            }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div
              className={`text-lg font-bold bg-gradient-to-br ${getScoreGradient(
                score
              )} bg-clip-text text-transparent`}
            >
              {score}
            </div>
            <div className="text-xs text-gray-500 font-medium">/ 100</div>
          </div>
        </div>
      </div>
    );
  };

  const getSkillColor = (index: number) => {
    const colors = [
      "bg-red-50 text-red-700 border-red-200 hover:bg-red-100",
      "bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-100",
      "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100",
      "bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100",
      "bg-pink-50 text-pink-700 border-pink-200 hover:bg-pink-100",
      "bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100",
    ];
    return colors[index % colors.length];
  };

  return (
    <div className="min-h-screen p-4 md:p-6 lg:p-8 relative overflow-hidden">
      <GradientBackground />
      <div className="max-w-5xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-foreground">
            Resume Analysis
          </h1>
          <p className="text-muted-foreground mt-2">
            Upload your resume and job description to get AI-powered
            compatibility insights
          </p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 lg:gap-6">
          <div className="animate-in slide-in-from-left duration-500">
            <Card className="shadow-md border border-black/10 [background:linear-gradient(180deg,#FFFFFF_0%,#FFFFFF_60%,#F7F7F8_80%,#F2F3F5_100%)] hover:shadow-lg transition-all duration-300">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <div className="p-1 bg-blue-100 rounded-lg">
                    <Upload className="w-4 h-4 text-blue-600" />
                  </div>
                  Upload & Analyze
                </CardTitle>
                <CardDescription className="text-sm text-gray-600">
                  Provide your resume and job description for analysis
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor="resume"
                      className="flex items-center gap-2 text-sm font-medium"
                    >
                      <FileText className="w-4 h-4 text-gray-600" />
                      Resume File
                    </Label>
                    <div className="relative">
                      <Input
                        id="resume"
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={handleFileChange}
                        className="cursor-pointer h-9 text-sm border-2 border-dashed border-gray-300 hover:border-blue-400 transition-colors duration-200 file:mr-3 file:py-1 file:px-2 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                        required
                      />
                    </div>
                    <p className="text-xs text-gray-500 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      Supported: PDF, DOC, DOCX (Max 10MB)
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="jobDescription"
                      className="flex items-center gap-2 text-sm font-medium"
                    >
                      <Target className="w-4 h-4 text-gray-600" />
                      Job Description
                    </Label>
                    <Textarea
                      id="jobDescription"
                      value={jobDescription}
                      onChange={(e) => setJobDescription(e.target.value)}
                      placeholder="Paste the job description here..."
                      className="min-h-[120px] text-sm border-2 hover:border-blue-400 focus:border-blue-500 transition-colors duration-200 resize-none"
                      required
                    />
                    <p className="text-xs text-gray-500">
                      {jobDescription.length} characters
                    </p>
                  </div>

                  <GradientButton
                    type="submit"
                    variant="new"
                    disabled={loading}
                    className="w-full h-9 text-sm font-semibold min-w-0 px-6 py-2"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <TrendingUp className="w-4 h-4 mr-2" />
                        Analyze Resume
                      </>
                    )}
                  </GradientButton>
                </form>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-3 animate-in slide-in-from-right duration-500">
            {result && showResults ? (
              <>
                <Card className="shadow-md border border-black/10 [background:linear-gradient(180deg,#FFFFFF_0%,#FFFFFF_60%,#F7F7F8_80%,#F2F3F5_100%)] hover:shadow-lg transition-all animate-in fade-in slide-in-from-bottom duration-700">
                  <CardHeader className="text-center pb-2">
                    <CardTitle className="text-base flex items-center justify-center gap-2">
                      <TrendingUp className="w-4 h-4 text-blue-600" />
                      Compatibility Score
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-center pb-4">
                    <CircularProgress score={result.compatibilityScore} />
                    <div className="mt-3 p-2 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50">
                      <p className="text-sm font-semibold text-gray-800">
                        {result.compatibilityScore >= 80
                          ? "🎉 Excellent Match!"
                          : result.compatibilityScore >= 60
                          ? "✨ Good Match"
                          : result.compatibilityScore >= 40
                          ? "⚡ Fair Match"
                          : "🔧 Needs Improvement"}
                      </p>
                      <p className="text-xs text-gray-600 mt-1">
                        {result.candidateName &&
                          `Analysis for ${result.candidateName}`}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Missing Skills Card */}
                <Card className="shadow-md border border-black/10 [background:linear-gradient(180deg,#FFFFFF_0%,#FFFFFF_60%,#F7F7F8_80%,#F2F3F5_100%)] hover:shadow-lg transition-all duration-300 animate-in fade-in slide-in-from-bottom delay-100">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                      <div className="p-1 bg-orange-100 rounded-lg">
                        <AlertCircle className="w-4 h-4 text-orange-600" />
                      </div>
                      Skills to Develop
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {result.missingSkills.length > 0 ? (
                      <div className="space-y-2">
                        <p className="text-gray-600 text-xs">
                          Focus on these {result.missingSkills.length} skills to
                          improve your match:
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {result.missingSkills.map((skill, index) => (
                            <span
                              key={index}
                              className={`px-2 py-1 rounded-full text-xs font-medium border transition-all duration-200 cursor-default ${getSkillColor(
                                index
                              )}`}
                              style={{
                                animationDelay: `${index * 100}ms`,
                              }}
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-3">
                        <CheckCircle2 className="w-6 h-6 text-green-500 mx-auto mb-2" />
                        <p className="text-green-600 font-semibold text-sm">
                          Perfect Skills Match!
                        </p>
                        <p className="text-gray-600 text-xs mt-1">
                          No missing skills identified
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Detailed Feedback Card */}
                <Card className="shadow-md border border-black/10 [background:linear-gradient(180deg,#FFFFFF_0%,#FFFFFF_60%,#F7F7F8_80%,#F2F3F5_100%)] hover:shadow-lg transition-all duration-300 animate-in fade-in slide-in-from-bottom  delay-200">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                      <div className="p-1 bg-green-100 rounded-lg">
                        <Sparkles className="w-4 h-4 text-green-600" />
                      </div>
                      AI Feedback
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="prose prose-gray max-w-none">
                      <p className="text-gray-700 leading-relaxed text-sm whitespace-pre-line">
                        {result.motivationalDescription}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </>
            ) : loading ? (
              /* Loading state */
              <Card className="shadow-md border border-black/10 [background:linear-gradient(180deg,#FFFFFF_0%,#FFFFFF_60%,#F7F7F8_80%,#F2F3F5_100%)]">
                <CardContent className="text-center py-8">
                  <div className="animate-pulse space-y-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-200 to-indigo-200 rounded-full mx-auto animate-spin"></div>
                    <div className="space-y-2">
                      <h3 className="text-base font-semibold text-gray-700">
                        Analyzing Your Resume
                      </h3>
                      <p className="text-gray-500 text-sm">
                        Processing your resume and comparing with job
                        requirements...
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              /* Empty state */
              <Card className="shadow-md border-2 border-dashed border-gray-300 [background:linear-gradient(180deg,#FFFFFF_0%,#FFFFFF_60%,#F7F7F8_80%,#F2F3F5_100%)] hover:border-blue-400 transition-all duration-300">
                <CardContent className="text-center py-8">
                  <div className="animate-bounce mb-3">
                    <Target className="w-12 h-12 mx-auto text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-600 mb-2">
                    Ready for Analysis
                  </h3>
                  <p className="text-gray-500 text-sm max-w-sm mx-auto leading-relaxed">
                    Upload your resume and job description to receive detailed
                    compatibility insights
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
