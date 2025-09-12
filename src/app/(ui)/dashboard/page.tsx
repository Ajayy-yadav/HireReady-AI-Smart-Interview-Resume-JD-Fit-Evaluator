"use client"

import { useState, useEffect } from "react"
import { useUser, useAuth } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, Calendar, FileText, Target, Clock, CheckCircle, ArrowRight, Plus, BarChart3 } from "lucide-react"

export default function DashboardPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const { isLoaded, isSignedIn, user } = useUser()
  const { isLoaded: authLoaded, userId } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (authLoaded && !userId) {
      window.location.href = "/sign-in"
    }
  }, [authLoaded, userId])

  if (!authLoaded) {
    return (
      <div className="w-full bg-background flex flex-col items-center justify-center min-h-screen">
        <div className="text-foreground text-xl">Loading session...</div>
      </div>
    )
  }

  if (!userId) {
    return (
      <div className="w-full bg-background flex flex-col items-center justify-center min-h-screen">
        <div className="text-foreground text-xl">Redirecting to sign-in...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground text-balance">
              Welcome back, {user?.firstName || "there"}!
            </h1>
            <p className="text-muted-foreground mt-1">Track your career progress and stay on top of your job search</p>
          </div>
          <Button className="w-fit">
            <Plus className="w-4 h-4 mr-2" />
            Quick Action
          </Button>
        </div>

        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-card-foreground">Resume Score</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-card-foreground">85%</div>
              <div className="flex items-center gap-2 mt-2">
                <Progress value={85} className="flex-1" />
                <Badge variant="secondary" className="text-xs">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +5%
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-card-foreground">Applications</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-card-foreground">24</div>
              <p className="text-xs text-muted-foreground mt-1">8 pending responses</p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-card-foreground">Interviews</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-card-foreground">3</div>
              <p className="text-xs text-muted-foreground mt-1">2 scheduled this week</p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-card-foreground">Goal Progress</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-card-foreground">67%</div>
              <Progress value={67} className="mt-2" />
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Activity */}
          <Card className="lg:col-span-2 bg-card border-border">
            <CardHeader>
              <CardTitle className="text-card-foreground">Recent Activity</CardTitle>
              <CardDescription>Your latest career development actions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                {
                  action: "Resume updated",
                  time: "2 hours ago",
                  status: "completed",
                  icon: CheckCircle,
                },
                {
                  action: "Mock interview completed",
                  time: "1 day ago",
                  status: "completed",
                  icon: CheckCircle,
                },
                {
                  action: "Application submitted to TechCorp",
                  time: "2 days ago",
                  status: "pending",
                  icon: Clock,
                },
                {
                  action: "Interview scheduled with StartupXYZ",
                  time: "3 days ago",
                  status: "upcoming",
                  icon: Calendar,
                },
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                  <item.icon
                    className={`w-5 h-5 ${
                      item.status === "completed"
                        ? "text-chart-1"
                        : item.status === "pending"
                          ? "text-chart-2"
                          : "text-chart-3"
                    }`}
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-card-foreground">{item.action}</p>
                    <p className="text-xs text-muted-foreground">{item.time}</p>
                  </div>
                  <Badge variant={item.status === "completed" ? "default" : "secondary"}>{item.status}</Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-card-foreground">Quick Actions</CardTitle>
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

        {/* Upcoming Events */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-card-foreground">Upcoming This Week</CardTitle>
            <CardDescription>Stay on track with your scheduled activities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                {
                  title: "Technical Interview",
                  company: "TechCorp",
                  date: "Tomorrow, 2:00 PM",
                  type: "interview",
                  priority: "high",
                },
                {
                  title: "Resume Review Session",
                  company: "Career Coach",
                  date: "Friday, 10:00 AM",
                  type: "session",
                  priority: "medium",
                },
                {
                  title: "Follow-up Email",
                  company: "StartupXYZ",
                  date: "Monday, 9:00 AM",
                  type: "task",
                  priority: "low",
                },
              ].map((event, index) => (
                <div key={index} className="p-4 rounded-lg border border-border bg-muted/30">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium text-card-foreground text-sm">{event.title}</h4>
                    <Badge
                      variant={
                        event.priority === "high"
                          ? "destructive"
                          : event.priority === "medium"
                            ? "default"
                            : "secondary"
                      }
                      className="text-xs"
                    >
                      {event.priority}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-1">{event.company}</p>
                  <p className="text-xs text-muted-foreground">{event.date}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
