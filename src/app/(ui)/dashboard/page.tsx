"use client";

import { useState, useEffect } from "react";
import { useUser, useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  TrendingUp,
  Calendar,
  FileText,
  Target,
  Clock,
  CheckCircle,
  ArrowRight,
  Plus,
  BarChart3,
} from "lucide-react";
import { useAtom } from "jotai";
import { userDataAtom } from "@/store/atom";
import { GradientBackground } from "@/components/GradientBackground";
import { DashboardSkeleton } from "@/skeleton-loaders/dashboard-skele";

export default function DashboardPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { isLoaded, isSignedIn, user } = useUser();
  const { isLoaded: authLoaded, userId } = useAuth();
  const router = useRouter();
  const [userData] = useAtom(userDataAtom);
  useEffect(() => {
    if (authLoaded && !userId) {
      window.location.href = "/sign-in";
    }
  }, [authLoaded, userId]);
  console.log("data:", userData);
  const timeAgo = ({ date }: { date: Date }) => {
    if (!date || new Date(date).getTime() <= 0) return <span>N/A</span>;

    const now = new Date();
    const past = new Date(date);
    const diffInMs = now.getTime() - past.getTime();
    const diffInMinutes = Math.floor(diffInMs / 60000);
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);
    const diffInWeeks = Math.floor(diffInDays / 7);
    const diffInYears = Math.floor(diffInDays / 365);

    let timeAgoText = "just now";

    if (diffInYears > 0) timeAgoText = `${diffInYears}yr ago`;
    else if (diffInWeeks > 0) timeAgoText = `${diffInWeeks}wk ago`;
    else if (diffInDays > 0) timeAgoText = `${diffInDays}d ago`;
    else if (diffInHours > 0) timeAgoText = `${diffInHours}hr ago`;
    else if (diffInMinutes > 0) timeAgoText = `${diffInMinutes}min ago`;

    return <span>{timeAgoText}</span>;
  };
  if (!authLoaded || !isLoaded) {
  return <DashboardSkeleton />;
}

  if (!userId) {
    return (
      <div className="w-full bg-background flex flex-col items-center justify-center min-h-screen">
        <div className="text-foreground text-xl">Redirecting to sign-in...</div>
      </div>
    );
  }

  return (
    // <div className="min-h-screen bg-background p-4 md:p-6 lg:p-8">
    //   <div className="max-w-7xl mx-auto space-y-6">
    <div className="min-h-screen p-4 md:p-6 lg:p-8 relative overflow-hidden">
      <GradientBackground />
      <div className="max-w-7xl mx-auto space-y-6 relative z-10">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground text-balance">
              Welcome back, {user?.firstName || "there"}!
            </h1>
            <p className="text-muted-foreground mt-1">
              Track your career progress and stay on top of your job search
            </p>
          </div>
          <div></div>
        </div>

        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border border-black/10 [background:linear-gradient(180deg,#FFFFFF_0%,#FFFFFF_60%,#F7F7F8_80%,#F2F3F5_100%)]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-card-foreground">
                Resume Score
              </CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-card-foreground">
                {userData?.latestResumeScore ? userData.latestResumeScore : 0}%
              </div>
              <div className="flex items-center gap-2 mt-2">
                <Progress
                  value={
                    userData?.latestResumeScore ? userData.latestResumeScore : 0
                  }
                  className="flex-1"
                />
                <Badge variant="secondary" className="text-xs">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +5%
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-black/10 [background:linear-gradient(180deg,#FFFFFF_0%,#FFFFFF_60%,#F7F7F8_80%,#F2F3F5_100%)]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-card-foreground">
                Applications
              </CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-card-foreground">24</div>
              <p className="text-xs text-muted-foreground mt-1">
                8 pending responses
              </p>
            </CardContent>
          </Card>

          <Card className="border border-black/10 [background:linear-gradient(180deg,#FFFFFF_0%,#FFFFFF_60%,#F7F7F8_80%,#F2F3F5_100%)]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-card-foreground">
                Interviews
              </CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-card-foreground">
                {userData?.totalInterviews ? userData.totalInterviews : 0}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Attended</p>
            </CardContent>
          </Card>

          <Card className="border border-black/10 [background:linear-gradient(180deg,#FFFFFF_0%,#FFFFFF_60%,#F7F7F8_80%,#F2F3F5_100%)]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-card-foreground">
                Goal Progress
              </CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-card-foreground">
                {userData?.latestInterviewScore
                  ? userData.latestInterviewScore
                  : 0}
                %
              </div>
              <Progress
                value={
                  userData?.latestInterviewScore
                    ? userData.latestInterviewScore
                    : 0
                }
                className="mt-2"
              />
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Activity */}
          <Card className="lg:col-span-2 border border-black/10 [background:linear-gradient(180deg,#FFFFFF_0%,#FFFFFF_60%,#F7F7F8_80%,#F2F3F5_100%)]">
            <CardHeader>
              <CardTitle className="text-card-foreground">
                Recent Activity
              </CardTitle>
              <CardDescription>
                Your latest career development actions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {userData?.lastResumeAnalysisAt ? (
                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                  <CheckCircle className="w-5 h-5 text-chart-1" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-card-foreground">
                      Resume analyzed
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {timeAgo({
                        date: userData.lastResumeAnalysisAt
                          ? new Date(userData.lastResumeAnalysisAt)
                          : new Date(),
                      })}
                    </p>
                  </div>
                  <Badge variant="default">completed</Badge>
                </div>
              ) : null}
              {userData?.lastInterviewCompletedAt ? (
                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                  <CheckCircle className="w-5 h-5 text-chart-1" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-card-foreground">
                      Mock interview completed
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {timeAgo({
                        date: userData.lastInterviewCompletedAt
                          ? new Date(userData.lastInterviewCompletedAt)
                          : new Date(),
                      })}
                    </p>
                  </div>
                  <Badge variant="default">completed</Badge>
                </div>
              ) : null}
              {!userData?.lastResumeAnalysisAt &&
                !userData?.lastInterviewCompletedAt && (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-center">No recent activity found.</p>
                  </div>
                )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="border border-black/10 [background:linear-gradient(180deg,#FFFFFF_0%,#FFFFFF_60%,#F7F7F8_80%,#F2F3F5_100%)]">
            <CardHeader>
              <CardTitle className="text-card-foreground">
                Quick Actions
              </CardTitle>
              <CardDescription>Jump to key features</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                variant="outline"
                className="w-full justify-between bg-transparent"
                onClick={() => router.push("/resume-analyzer")}
              >
                Analyze Resume
                <ArrowRight className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                className="w-full justify-between bg-transparent"
                onClick={() => router.push("/mock-interview")}
              >
                Practice Interview
                <ArrowRight className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                className="w-full justify-between bg-transparent"
                onClick={() => router.push("/activity-log")}
              >
                View Activity
                <ArrowRight className="w-4 h-4" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
