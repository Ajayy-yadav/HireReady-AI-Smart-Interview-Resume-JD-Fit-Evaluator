"use client"
import axios from "axios"
import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Upload, FileText, Target, AlertCircle } from "lucide-react"

export default function ResumeAnalysis() {
  const [file, setFile] = useState<File | null>(null)
  const [jobDescription, setJobDescription] = useState("")
  const [result, setResult] = useState<ResumeAnalysisResponse | null>(null)
  const [loading, setLoading] = useState(false)

  interface ResumeAnalysisResult {
    compatibilityScore: number
    candidateName: string
    missingSkills: string[]
    motivationalDescription: string
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFile(e.target.files?.[0] ?? null)
  }

  interface ResumeAnalysisResponse {
    compatibilityScore: number
    candidateName: string
    missingSkills: string[]
    motivationalDescription: string
    message?: string
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault()

    if (!file || !jobDescription) {
      alert("Please select a file and enter job description")
      return
    }

    setLoading(true)

    try {
      const formData = new FormData()
      formData.append("resume", file)
      formData.append("jobDescription", jobDescription)

      const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/resume-analysis/analyze`, formData)

      const data: ResumeAnalysisResponse = response.data

      if (response.status === 201) {
        setResult(data)
      } else {
        alert(`Error: ${data.message}`)
      }
    } catch (error: any) {
      alert(`Error: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const CircularProgress = ({ score }: { score: number }) => {
    const radius = 60
    const strokeWidth = 8
    const normalizedRadius = radius - strokeWidth * 2
    const circumference = normalizedRadius * 2 * Math.PI
    const strokeDasharray = `${(score / 100) * circumference} ${circumference}`

    const getScoreColor = (score: number) => {
      if (score >= 80) return "#10b981" // green
      if (score >= 60) return "#f59e0b" // yellow
      if (score >= 40) return "#f97316" // orange
      return "#ef4444" // red
    }

    return (
      <div className="relative w-32 h-32 mx-auto">
        <svg height={radius * 2} width={radius * 2} className="transform -rotate-90">
          <circle
            stroke="#e5e7eb"
            fill="transparent"
            strokeWidth={strokeWidth}
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />
          <circle
            stroke={getScoreColor(score)}
            fill="transparent"
            strokeWidth={strokeWidth}
            strokeDasharray={strokeDasharray}
            strokeLinecap="round"
            r={normalizedRadius}
            cx={radius}
            cy={radius}
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{score}</div>
            <div className="text-xs text-gray-500">/ 100</div>
          </div>
        </div>
      </div>
    )
  }

  const getSkillColor = (index: number) => {
    const colors = [
      "bg-red-100 text-red-800 border-red-200",
      "bg-orange-100 text-orange-800 border-orange-200",
      "bg-yellow-100 text-yellow-800 border-yellow-200",
      "bg-purple-100 text-purple-800 border-purple-200",
      "bg-pink-100 text-pink-800 border-pink-200",
      "bg-indigo-100 text-indigo-800 border-indigo-200",
    ]
    return colors[index % colors.length]
  }

  return (
    <div className="min-h-screen  p-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent mb-2">Resume Analysis</h1>
          <p className="text-gray-600">Upload your resume and job description to get compatibility insights</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Side - Input Form */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="w-5 h-5" />
                Upload & Analyze
              </CardTitle>
              <CardDescription>Provide your resume and job description for analysis</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="resume" className="flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Resume File
                  </Label>
                  <Input
                    id="resume"
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileChange}
                    className="cursor-pointer"
                    required
                  />
                  <p className="text-xs text-gray-500">Supported formats: PDF, DOC, DOCX</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="jobDescription" className="flex items-center gap-2">
                    <Target className="w-4 h-4" />
                    Job Description
                  </Label>
                  <Textarea
                    id="jobDescription"
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    placeholder="Paste the complete job description here..."
                    className="max-h-[300px] resize-none overflow-y-auto"
                    required
                  />
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                  size="lg"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Analyzing...
                    </>
                  ) : (
                    "Analyze Resume"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Right Side - Results */}
          <div className="space-y-6">
            {result ? (
              <>
                <Card className="shadow-lg">
                  <CardHeader className="text-center">
                    <CardTitle className="text-xl">Compatibility Score</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <CircularProgress score={result.compatibilityScore} />
                    <p className="mt-4 text-sm text-gray-600">
                      {result.compatibilityScore >= 80
                        ? "Excellent Match!"
                        : result.compatibilityScore >= 60
                          ? "Good Match"
                          : result.compatibilityScore >= 40
                            ? "Fair Match"
                            : "Needs Improvement"}
                    </p>
                  </CardContent>
                </Card>

                <Card className="shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <AlertCircle className="w-5 h-5 text-orange-500" />
                      Missing Skills
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {result.missingSkills.length > 0 ? (
                      <div className="flex flex-wrap gap-3">
                        {result.missingSkills.map((skill, index) => (
                          <span
                            key={index}
                            className={`px-4 py-2 rounded-full text-sm font-medium border ${getSkillColor(index)}`}
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-green-600 font-medium">No missing skills identified!</p>
                    )}
                  </CardContent>
                </Card>

                <Card className="shadow-lg">
                  <CardHeader>
                    <CardTitle>Detailed Feedback</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 leading-relaxed">{result.motivationalDescription}</p>
                  </CardContent>
                </Card>
              </>
            ) : (
              <Card className="shadow-lg border-dashed border-2 border-gray-300">
                <CardContent className="text-center py-12">
                  <div className="text-gray-400 mb-4">
                    <Target className="w-16 h-16 mx-auto" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-500 mb-2">No Analysis Yet</h3>
                  <p className="text-gray-400">Upload your resume and job description to see results here</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
