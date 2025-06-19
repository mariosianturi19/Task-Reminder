"use client"

import { useState, useEffect } from "react"
import { AppLayout } from "@/components/layout/app-layout"
import { TaskForm } from "@/components/tasks/task-form"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { supabase } from "@/lib/supabase"
import { useToast } from "@/hooks/use-toast"
import { Plus, MoreVertical, Edit, Trash2, Clock, CheckSquare, AlertTriangle, Calendar } from "lucide-react"

export default function TasksPage() {
  const [tasks, setTasks] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingTask, setEditingTask] = useState<any>(null)
  const { toast } = useToast()

  useEffect(() => {
    fetchTasks()
  }, [])

  const fetchTasks = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) return

      const { data, error } = await supabase
        .from("tasks")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })

      if (error) throw error
      setTasks(data || [])
    } catch (error) {
      console.error("Error fetching tasks:", error)
      toast({
        title: "Error",
        description: "Gagal memuat tugas",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const toggleTaskStatus = async (taskId: string, currentStatus: string) => {
    try {
      const newStatus = currentStatus === "done" ? "pending" : "done"

      const { error } = await supabase.from("tasks").update({ status: newStatus }).eq("id", taskId)

      if (error) throw error

      setTasks(tasks.map((task) => (task.id === taskId ? { ...task, status: newStatus } : task)))

      toast({
        title: "Status berhasil diubah!",
        description: `Tugas ${newStatus === "done" ? "selesai" : "belum selesai"}`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal mengubah status tugas",
        variant: "destructive",
      })
    }
  }

  const deleteTask = async (taskId: string) => {
    try {
      const { error } = await supabase.from("tasks").delete().eq("id", taskId)

      if (error) throw error

      setTasks(tasks.filter((task) => task.id !== taskId))
      toast({
        title: "Tugas berhasil dihapus!",
        description: "Tugas telah dihapus dari daftar",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal menghapus tugas",
        variant: "destructive",
      })
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
        return "bg-red-500/20 text-red-400 border-red-500/30"
      case "medium":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
      case "low":
        return "bg-green-500/20 text-green-400 border-green-500/30"
      default:
        return "bg-slate-500/20 text-slate-400 border-slate-500/30"
    }
  }

  const getDeadlineStatus = (deadline: string, status: string) => {
    if (status === "done") return null

    const now = new Date()
    const deadlineDate = new Date(deadline)
    const diffHours = (deadlineDate.getTime() - now.getTime()) / (1000 * 60 * 60)

    if (diffHours < 0) return { text: "Terlambat", color: "text-red-400", icon: AlertTriangle }
    if (diffHours < 5) return { text: "Segera", color: "text-red-400", icon: AlertTriangle }
    if (diffHours < 24) return { text: "Hari ini", color: "text-yellow-400", icon: Clock }

    return null
  }

  const handleEditTask = (task: any) => {
    setEditingTask(task)
    setShowForm(true)
  }

  const handleFormClose = () => {
    setShowForm(false)
    setEditingTask(null)
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
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-50">Daftar Tugas</h1>
            <p className="text-slate-400">Kelola semua tugas Anda</p>
          </div>
          <Button
            onClick={() => setShowForm(true)}
            className="bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600"
          >
            <Plus className="w-4 h-4 mr-2" />
            Tambah Tugas
          </Button>
        </div>

        {/* Tasks List */}
        {tasks.length > 0 ? (
          <div className="grid gap-4">
            {tasks.map((task) => {
              const deadlineStatus = getDeadlineStatus(task.deadline, task.status)

              return (
                <Card key={task.id} className="glass-card">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <Checkbox
                        checked={task.status === "done"}
                        onCheckedChange={() => toggleTaskStatus(task.id, task.status)}
                        className="mt-1 border-slate-600 data-[state=checked]:bg-emerald-500"
                      />

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <h3
                              className={`font-medium ${task.status === "done" ? "line-through text-slate-400" : "text-slate-50"}`}
                            >
                              {task.title}
                            </h3>
                            {task.description && (
                              <p className="text-sm text-slate-400 mt-1 line-clamp-2">{task.description}</p>
                            )}
                          </div>

                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 text-slate-400 hover:text-slate-300"
                              >
                                <MoreVertical className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="bg-slate-800 border-slate-700">
                              <DropdownMenuItem
                                onClick={() => handleEditTask(task)}
                                className="text-slate-300 hover:bg-slate-700"
                              >
                                <Edit className="w-4 h-4 mr-2" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => deleteTask(task.id)}
                                className="text-red-400 hover:bg-red-500/10"
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Hapus
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>

                        <div className="flex items-center gap-2 mt-3 flex-wrap">
                          <Badge className={getPriorityColor(task.priority)}>{task.priority}</Badge>

                          <div className="flex items-center gap-1 text-xs text-slate-400">
                            <Calendar className="w-3 h-3" />
                            {formatDate(task.deadline)}
                          </div>

                          {deadlineStatus && (
                            <div className={`flex items-center gap-1 text-xs ${deadlineStatus.color}`}>
                              <deadlineStatus.icon className="w-3 h-3" />
                              {deadlineStatus.text}
                            </div>
                          )}

                          {(task.remind_h1 || task.remind_h0 || task.remind_h5h) && (
                            <Badge variant="outline" className="text-xs border-emerald-500/30 text-emerald-400">
                              Pengingat aktif
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        ) : (
          <Card className="glass-card">
            <CardContent className="p-8 text-center">
              <CheckSquare className="w-16 h-16 text-slate-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-300 mb-2">Belum ada tugas</h3>
              <p className="text-slate-400 mb-4">Mulai dengan membuat tugas pertama Anda</p>
              <Button
                onClick={() => setShowForm(true)}
                className="bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600"
              >
                <Plus className="w-4 h-4 mr-2" />
                Tambah Tugas
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Task Form Modal */}
        <TaskForm open={showForm} onOpenChange={handleFormClose} task={editingTask} onSuccess={fetchTasks} />
      </div>
    </AppLayout>
  )
}
