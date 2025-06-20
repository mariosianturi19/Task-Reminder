// app/tasks/page.tsx
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
import { formatDateIndonesian, getCurrentJakartaTime, convertToJakartaTime } from "@/lib/timezone-utils"
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
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data, error } = await supabase
        .from("tasks")
        .select("*")
        .eq("user_id", user.id)
        .order("deadline", { ascending: true })

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

      const { error } = await supabase
        .from("tasks")
        .update({ 
          status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq("id", taskId)

      if (error) throw error

      setTasks(tasks.map((task) => 
        task.id === taskId ? { ...task, status: newStatus } : task
      ))

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

    const now = getCurrentJakartaTime()
    const deadlineJakarta = convertToJakartaTime(deadline)
    const diffHours = (deadlineJakarta.getTime() - now.getTime()) / (1000 * 60 * 60)

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
            <p className="text-slate-400">Kelola semua tugas Anda (Waktu WIB)</p>
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
                <Card key={task.id} className="bg-slate-800 border-slate-700">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <Checkbox
                        checked={task.status === "done"}
                        onCheckedChange={() => toggleTaskStatus(task.id, task.status)}
                        className="mt-1"
                      />
                      
                      <div className="flex-1 space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className={`font-medium ${
                            task.status === "done" 
                              ? "line-through text-slate-400" 
                              : "text-slate-50"
                          }`}>
                            {task.title}
                          </h3>
                          
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent 
                              align="end" 
                              className="bg-slate-700 border-slate-600"
                            >
                              <DropdownMenuItem
                                onClick={() => handleEditTask(task)}
                                className="text-slate-50 hover:bg-slate-600"
                              >
                                <Edit className="h-4 w-4 mr-2" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => deleteTask(task.id)}
                                className="text-red-400 hover:bg-slate-600"
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Hapus
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>

                        {task.description && (
                          <p className="text-sm text-slate-400 line-clamp-2">
                            {task.description}
                          </p>
                        )}

                        <div className="flex items-center gap-2 flex-wrap">
                          <div className="flex items-center gap-1 text-xs text-slate-400">
                            <Calendar className="h-3 w-3" />
                            {formatDateIndonesian(task.deadline)} WIB
                          </div>

                          <Badge className={getPriorityColor(task.priority)}>
                            {task.priority === "high" && "Tinggi"}
                            {task.priority === "medium" && "Sedang"}
                            {task.priority === "low" && "Rendah"}
                          </Badge>

                          {deadlineStatus && (
                            <Badge className={`${deadlineStatus.color} bg-opacity-20`}>
                              <deadlineStatus.icon className="h-3 w-3 mr-1" />
                              {deadlineStatus.text}
                            </Badge>
                          )}

                          {(task.remind_h1 || task.remind_h0 || task.remind_h5h) && (
                            <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                              📱 Reminder
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
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-8 text-center">
              <CheckSquare className="h-12 w-12 text-slate-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-300 mb-2">
                Belum ada tugas
              </h3>
              <p className="text-slate-400 mb-4">
                Mulai dengan menambahkan tugas pertama Anda
              </p>
              <Button
                onClick={() => setShowForm(true)}
                className="bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600"
              >
                <Plus className="w-4 h-4 mr-2" />
                Tambah Tugas Pertama
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Task Form Dialog */}
        <TaskForm
          open={showForm}
          onOpenChange={handleFormClose}
          task={editingTask}
          onSuccess={() => {
            fetchTasks()
            handleFormClose()
          }}
        />
      </div>
    </AppLayout>
  )
}