"use client"

import { useState, useEffect } from "react"
import { AppLayout } from "@/components/layout/app-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { supabase } from "@/lib/supabase"
import { CheckSquare, Clock, AlertTriangle, Target, Calendar, TrendingUp, Plus } from "lucide-react"
import Link from "next/link"

interface TaskStats {
  total: number
  completed: number
  pending: number
  urgent: number
}

export default function DashboardPage() {
  const [stats, setStats] = useState<TaskStats>({
    total: 0,
    completed: 0,
    pending: 0,
    urgent: 0,
  })
  const [recentTasks, setRecentTasks] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) return

      // Fetch task statistics
      const { data: tasks } = await supabase.from("tasks").select("*").eq("user_id", user.id)

      if (tasks) {
        const now = new Date()
        const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000)

        const stats = {
          total: tasks.length,
          completed: tasks.filter((task) => task.status === "done").length,
          pending: tasks.filter((task) => task.status === "pending").length,
          urgent: tasks.filter((task) => {
            const deadline = new Date(task.deadline)
            return task.status === "pending" && deadline <= tomorrow
          }).length,
        }

        setStats(stats)

        // Get recent tasks (last 5)
        const recent = tasks
          .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
          .slice(0, 5)

        setRecentTasks(recent)
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "text-red-400 bg-red-400/10"
      case "medium":
        return "text-yellow-400 bg-yellow-400/10"
      case "low":
        return "text-green-400 bg-green-400/10"
      default:
        return "text-slate-400 bg-slate-400/10"
    }
  }

  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-400"></div>
        </div>
      </AppLayout>
    )
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold text-slate-50">Dashboard</h1>
          <p className="text-slate-400">Ringkasan tugas dan aktivitas Anda</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="glass-card">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-400/10">
                  <Target className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-50">{stats.total}</p>
                  <p className="text-xs text-slate-400">Total Tugas</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-green-400/10">
                  <CheckSquare className="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-50">{stats.completed}</p>
                  <p className="text-xs text-slate-400">Selesai</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-yellow-400/10">
                  <Clock className="w-5 h-5 text-yellow-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-50">{stats.pending}</p>
                  <p className="text-xs text-slate-400">Pending</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-red-400/10">
                  <AlertTriangle className="w-5 h-5 text-red-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-50">{stats.urgent}</p>
                  <p className="text-xs text-slate-400">Mendesak</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Progress Card */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-slate-50">
              <TrendingUp className="w-5 h-5 text-emerald-400" />
              Progress Tugas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Selesai</span>
                <span className="text-slate-300">
                  {stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0}%
                </span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-emerald-400 to-blue-400 h-2 rounded-full transition-all duration-500"
                  style={{
                    width: `${stats.total > 0 ? (stats.completed / stats.total) * 100 : 0}%`,
                  }}
                ></div>
              </div>
              <div className="flex justify-between text-xs text-slate-400">
                <span>{stats.completed} selesai</span>
                <span>{stats.pending} tersisa</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Tasks */}
        <Card className="glass-card">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-slate-50">
                <Calendar className="w-5 h-5 text-emerald-400" />
                Tugas Terbaru
              </CardTitle>
              <Link href="/tasks">
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-slate-700/50 border-slate-600 hover:bg-slate-600 text-slate-300"
                >
                  Lihat Semua
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {recentTasks.length > 0 ? (
              <div className="space-y-3">
                {recentTasks.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center gap-3 p-3 rounded-lg bg-slate-700/30 hover:bg-slate-700/50 transition-colors"
                  >
                    <div
                      className={`w-2 h-2 rounded-full ${task.status === "done" ? "bg-green-400" : "bg-yellow-400"}`}
                    ></div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-slate-50 truncate">{task.title}</p>
                      <p className="text-xs text-slate-400">Deadline: {formatDate(task.deadline)}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                      {task.priority}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Calendar className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                <p className="text-slate-400 mb-2">Belum ada tugas</p>
                <p className="text-xs text-slate-500 mb-4">Buat tugas pertama Anda!</p>
                <Link href="/tasks">
                  <Button className="bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600">
                    <Plus className="w-4 h-4 mr-2" />
                    Buat Tugas
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  )
}
