"use client";

import type React from "react";

import { useMemo, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GradientButton } from "@/components/ui/gradient-button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Video, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface InterviewSetupProps {
  onStart: (jobDescription: string, totalQuestions: number) => void;
}

const PRESETS = [
  {
    label: "Frontend (React)",
    text: "We’re hiring a Senior Frontend Engineer with deep React, TypeScript, and modern tooling experience. Responsibilities include building accessible UI, performance optimization, state management, and collaborating with design/product on component libraries. Experience with testing and CI/CD is preferred.",
  },
  {
    label: "Backend (Node)",
    text: "Seeking a Backend Engineer proficient in Node.js and TypeScript. Work includes designing REST/GraphQL APIs, database design, observability, scalability, and security best practices. Experience with cloud platforms and containerization is a plus.",
  },
  {
    label: "Data Science",
    text: "Looking for a Data Scientist with strong Python, SQL, and ML fundamentals. Responsibilities include feature engineering, model development and evaluation, A/B testing, and partnering with product to define metrics and success criteria.",
  },
  {
    label: "Product Manager",
    text: "Hiring a Product Manager to lead cross-functional teams, define product strategy and roadmaps, write clear PRDs, and drive outcomes. Strong user research and communication skills required.",
  },
];

const QUESTION_OPTIONS = [3, 5, 7, 10];
const RECOMMENDED_MIN = 60;

export default function InterviewSetup({ onStart }: InterviewSetupProps) {
  const [jobDescription, setJobDescription] = useState("");
  const [totalQuestions, setTotalQuestions] = useState(5);

  const charCount = jobDescription.trim().length;
  const isTooShort = charCount > 0 && charCount < RECOMMENDED_MIN;

  const tip = useMemo(() => {
    if (!jobDescription.trim())
      return "Paste a job description to get tailored questions.";
    if (isTooShort)
      return "Tip: include the role, core skills, and scope for more relevant questions.";
    return "Looks good! You can start the interview when ready.";
  }, [jobDescription, isTooShort]);

  const handleStart = () => {
    if (!jobDescription.trim()) {
      alert("Please enter a job description");
      return;
    }
    onStart(jobDescription, totalQuestions);
  };

  const handleKeyDown: React.KeyboardEventHandler<HTMLTextAreaElement> = (
    e
  ) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
      e.preventDefault();
      handleStart();
    }
  };

  return (
    <div className="w-full mt-3 max-w-4xl mx-auto px-4 md:px-6">
      <Card className="border border-black/10 [background:linear-gradient(180deg,#FFFFFF_0%,#FFFFFF_60%,#F7F7F8_80%,#F2F3F5_100%)]">
        <CardHeader className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-full bg-primary/10">
                <Video className="w-6 h-6 text-primary" aria-hidden="true" />
              </div>
              <div>
                <CardTitle className="text-2xl text-card-foreground text-balance">
                  AI Interview Practice
                </CardTitle>
                <CardDescription className="text-base mt-1 text-pretty">
                  Practice your interview skills with AI-powered, role‑specific
                  questions.
                </CardDescription>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-2 text-xs text-muted-foreground">
              <span className="rounded-md border border-border bg-muted px-2 py-1">
                Ctrl / ⌘ + Enter
              </span>
              <span>to start</span>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-8">
          {/* Responsive layout: description left, settings right on md+ */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            <div className="md:col-span-3 space-y-3">
              <div className="flex items-center justify-between">
                <Label
                  htmlFor="jobDescription"
                  className="text-sm font-medium text-foreground"
                >
                  Job Description
                </Label>
                <span
                  className={cn(
                    "text-xs",
                    isTooShort
                      ? "text-destructive-foreground"
                      : "text-muted-foreground"
                  )}
                  aria-live="polite"
                >
                  {charCount} chars
                </span>
              </div>
              <Textarea
                id="jobDescription"
                placeholder="Paste the job description here... (e.g., Senior Full‑Stack Developer with expertise in React, Node.js, and TypeScript...)"
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                onKeyDown={handleKeyDown}
                aria-invalid={isTooShort ? true : undefined}
                aria-describedby="jd-help"
                className={cn(
                  "min-h-[160px] max-h-[360px] bg-background border-border text-foreground resize-none",
                  "focus-visible:ring-2 focus-visible:ring-primary/30"
                )}
                style={{ overflowY: "auto" }}
              />
              <div id="jd-help" className="text-xs text-muted-foreground">
                {tip}
              </div>

              {/* Quick presets */}
              <div className="space-y-2">
                <div className="text-xs font-medium text-muted-foreground">
                  Or start from a template
                </div>
                <div className="flex flex-wrap gap-2">
                  {PRESETS.map((p) => (
                    <Button
                      key={p.label}
                      type="button"
                      size="sm"
                      variant="secondary"
                      className="rounded-full"
                      onClick={() => setJobDescription(p.text)}
                      aria-label={`Use ${p.label} preset`}
                    >
                      {p.label}
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            {/* Settings column */}
            <div className="md:col-span-2 space-y-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-foreground">
                  Number of Questions
                </Label>
                <fieldset>
                  <legend className="sr-only">
                    Select number of questions
                  </legend>
                  <div role="group" className="grid grid-cols-4 gap-2">
                    {QUESTION_OPTIONS.map((n) => {
                      const selected = n === totalQuestions;
                      return (
                        <Button
                          key={n}
                          type="button"
                          onClick={() => setTotalQuestions(n)}
                          variant={selected ? "default" : "outline"}
                          className={cn(
                            "h-10",
                            selected && "ring-1 ring-primary/30"
                          )}
                          aria-pressed={selected}
                          aria-label={`${n} questions`}
                        >
                          {n}
                        </Button>
                      );
                    })}
                  </div>
                </fieldset>
                <p className="text-xs text-muted-foreground">
                  Choose a length that fits your practice session.
                </p>
              </div>

              {/* Features Info */}
              <div className="bg-muted/50 rounded-lg p-4 space-y-3">
                <Feature
                  title="Automatic Flow"
                  desc="Just speak naturally and pause ~2 seconds when done."
                />
                <Feature
                  title="Real‑time Feedback"
                  desc="See your answer transcribed as you speak."
                />
                <Feature
                  title="Instant Transitions"
                  desc="Questions are pre‑generated for a seamless flow."
                />
              </div>
            </div>
          </div>

          {/* Start Button */}
          <div className="pt-2">
            <GradientButton
              onClick={handleStart}
              variant="new"
              className="w-full h-12 text-base min-w-0 px-6 py-2"
              disabled={!jobDescription.trim()}
            >
              <Video className="w-5 h-5 mr-2" aria-hidden="true" />
              Start AI Interview
            </GradientButton>
            <div className="mt-2 text-center text-xs text-muted-foreground md:hidden">
              Tip: Press Ctrl / ⌘ + Enter to start
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function Feature({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="flex items-start gap-2">
      <Sparkles className="w-4 h-4 text-primary mt-0.5" aria-hidden="true" />
      <div>
        <p className="text-sm font-medium text-card-foreground">{title}</p>
        <p className="text-xs text-muted-foreground">{desc}</p>
      </div>
    </div>
  );
}
