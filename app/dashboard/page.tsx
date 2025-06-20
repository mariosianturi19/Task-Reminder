// app/dashboard/page.tsx
"use client"

import { useState, useEffect } from "react"
import { AppLayout } from "@/components/layout/app-layout"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { supabase } from "@/lib/supabase"
import { useToast } from "@/hooks/use-toast"
import { formatDateIndonesian, getCurrentJakartaTime, convertToJakartaTime } from "@/lib/timezone-utils"
import { Calendar, Clock, CheckSquare, AlertTriangle, Bell, Plus } from "lucide-react"
import Link from "next/link"

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [tasks, setTasks] = useState<any[]>([])
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    done: 0,
    overdue: 0,
    today: 0
  })
  const [loading, setLoading] = useState(true)
  const [currentTime, setCurrentTime] = useState(getCurrentJakartaTime())
  const { toast } = useToast()

  useEffect(() => {
    fetchUserAndTasks()
    
    // Update current time every minute
    const timer = setInterval(() => {
      setCurrentTime(getCurrentJakartaTime())
    }, 60000)

    return () => clearInterval(timer)
  }, [])

  const fetchUserAndTasks = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      // Get user profile
      const { data: profile } = await supabase
        .from("users")
        .select("*")
        .eq("id", user.id)
        .single()

      setUser(profile)

      // Get user tasks
      const { data: tasksData, error } = await supabase
        .from("tasks")
        .select("*")
        .eq("user_id", user.id)
        .order("deadline", { ascending: true })

      if (error) throw error

      setTasks(tasksData || [])
      calculateStats(tasksData || [])
    } catch (error) {
      console.error("Error fetching data:", error)
      toast({
        title: "Error",
        description: "Gagal memuat data dashboard",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const calculateStats = (tasksData: any[]) => {
    const now = getCurrentJakartaTime()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000)

    const stats = {
      total: tasksData.length,
      pending: tasksData.filter(task => task.status === "pending").length,
      done: tasksData.filter(task => task.status === "done").length,
      overdue: tasksData.filter(task => {
        const deadline = convertToJakartaTime(task.deadline)
        return task.status === "pending" && deadline < now
      }).length,
      today: tasksData.filter(task => {
        const deadline = convertToJakartaTime(task.deadline)
        return task.status === "pending" && deadline >= today && deadline < tomorrow
      }).length
    }

    setStats(stats)
  }

  const getUpcomingTasks = () => {
    const now = getCurrentJakartaTime()
    return tasks
      .filter(task => task.status === "pending")
      .filter(task => convertToJakartaTime(task.deadline) > now)
      .slice(0, 5)
  }

  const getOverdueTasks = () => {
    const now = getCurrentJakartaTime()
    return tasks
      .filter(task => task.status === "pending")
      .filter(task => convertToJakartaTime(task.deadline) < now)
      .slice(0, 3)
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
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-slate-50">
            Selamat datang, {user?.name || "User"}! 👋
          </h1>
          <div className="flex items-center gap-2 text-slate-400">
            <Clock className="w-4 h-4" />
            <span className="text-sm">
              {formatDateIndonesian(currentTime)} WIB
            </span>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Total Tugas</p>
                  <p className="text-2xl font-bold text-slate-50">{stats.total}</p>
                </div>
                <CheckSquare className="w-8 h-8 text-slate-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Pending</p>
                  <p className="text-2xl font-bold text-yellow-400">{stats.pending}</p>
                </div>
                <Clock className="w-8 h-8 text-yellow-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Selesai</p>
                  <p className="text-2xl font-bold text-green-400">{stats.done}</p>
                </div>
                <CheckSquare className="w-8 h-8 text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Terlambat</p>
                  <p className="text-2xl font-bold text-red-400">{stats.overdue}</p>
                </div>
                <AlertTriangle className="w-8 h-8 text-red-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Today's Tasks Alert */}
        {stats.today > 0 && (
          <Card className="bg-gradient-to-r from-orange-500/10 to-red-500/10 border-orange-500/30">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Bell className="w-5 h-5 text-orange-400" />
                <div>
                  <p className="text-orange-400 font-medium">
                    Anda memiliki {stats.today} tugas dengan deadline hari ini!
                  </p>
                  <p className="text-slate-300 text-sm">
                    Jangan lupa untuk menyelesaikannya sebelum deadline berakhir.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Upcoming Tasks */}
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-slate-50">
                  Tugas Mendatang
                </h2>
                <Link href="/tasks">
                  <Button variant="ghost" size="sm" className="text-emerald-400 hover:text-emerald-300">
                    Lihat Semua
                  </Button>
                </Link>
              </div>

              <div className="space-y-3">
                {getUpcomingTasks().length > 0 ? (
                  getUpcomingTasks().map((task) => (
                    <div key={task.id} className="p-3 rounded-lg bg-slate-700/50 border border-slate-600">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <h3 className="font-medium text-slate-50 mb-1">
                            {task.title}
                          </h3>
                          <div className="flex items-center gap-2 text-xs text-slate-400">
                            <Calendar className="w-3 h-3" />
                            {formatDateIndonesian(task.deadline)} WIB
                          </div>
                        </div>
                        <Badge 
                          className={
                            task.priority === "high" 
                              ? "bg-red-500/20 text-red-400 border-red-500/30"
                              : task.priority === "medium"
                              ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
                              : "bg-green-500/20 text-green-400 border-green-500/30"
                          }
                        >
                          {task.priority === "high" && "Tinggi"}
                          {task.priority === "medium" && "Sedang"}
                          {task.priority === "low" && "Rendah"}
                        </Badge>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <CheckSquare className="w-12 h-12 text-slate-600 mx-auto mb-2" />
                    <p className="text-slate-400">Tidak ada tugas mendatang</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Overdue Tasks */}
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-slate-50">
                  Tugas Terlambat
                </h2>
                {getOverdueTasks().length > 0 && (
                  <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
                    {stats.overdue} Tugas
                  </Badge>
                )}
              </div>

              <div className="space-y-3">
                {getOverdueTasks().length > 0 ? (
                  getOverdueTasks().map((task) => (
                    <div key={task.id} className="p-3 rounded-lg bg-red-500/10 border border-red-500/30">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <h3 className="font-medium text-slate-50 mb-1">
                            {task.title}
                          </h3>
                          <div className="flex items-center gap-2 text-xs text-red-400">
                            <AlertTriangle className="w-3 h-3" />
                            Deadline: {formatDateIndonesian(task.deadline)} WIB
                          </div>
                        </div>
                        <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
                          Terlambat
                        </Badge>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <CheckSquare className="w-12 h-12 text-slate-600 mx-auto mb-2" />
                    <p className="text-slate-400">Tidak ada tugas terlambat</p>
                    <p className="text-xs text-slate-500 mt-1">Kerja bagus! 🎉</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold text-slate-50 mb-4">
              Aksi Cepat
            </h2>
            <div className="flex gap-3">
              <Link href="/tasks">
                <Button className="bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600">
                  <Plus className="w-4 h-4 mr-2" />
                  Tambah Tugas Baru
                </Button>
              </Link>
              <Link href="/tasks">
                <Button variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-700">
                  <CheckSquare className="w-4 h-4 mr-2" />
                  Lihat Semua Tugas
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  )
}