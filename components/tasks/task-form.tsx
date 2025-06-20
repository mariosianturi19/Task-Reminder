// components/tasks/task-form.tsx
"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { supabase } from "@/lib/supabase"
import { useToast } from "@/hooks/use-toast"
import { formatForDateTimeInput, convertToUTC, getCurrentJakartaTime } from "@/lib/timezone-utils"

interface TaskFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  task?: any
  onSuccess: () => void
}

export function TaskForm({ open, onOpenChange, task, onSuccess }: TaskFormProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    deadline: "",
    priority: "medium" as "high" | "medium" | "low",
    remind_h1: false,
    remind_h0: false,
    remind_h5h: false,
  })
  const { toast } = useToast()

  useEffect(() => {
    if (open) {
      if (task) {
        // Edit mode - convert UTC to Jakarta time for display
        setFormData({
          title: task.title || "",
          description: task.description || "",
          deadline: formatForDateTimeInput(task.deadline),
          priority: task.priority || "medium",
          remind_h1: task.remind_h1 || false,
          remind_h0: task.remind_h0 || false,
          remind_h5h: task.remind_h5h || false,
        })
      } else {
        // Create mode - set default to current Jakarta time + 1 day
        const tomorrow = new Date(getCurrentJakartaTime().getTime() + 24 * 60 * 60 * 1000);
        setFormData({
          title: "",
          description: "",
          deadline: formatForDateTimeInput(tomorrow),
          priority: "medium",
          remind_h1: false,
          remind_h0: false,
          remind_h5h: false,
        })
      }
    }
  }, [task, open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error("User not authenticated")

      // Convert Jakarta time to UTC for storage
      const deadlineUTC = convertToUTC(formData.deadline).toISOString()

      const taskData = {
        title: formData.title,
        description: formData.description || null,
        deadline: deadlineUTC,
        priority: formData.priority,
        remind_h1: formData.remind_h1,
        remind_h0: formData.remind_h0,
        remind_h5h: formData.remind_h5h,
        user_id: user.id,
      }

      if (task) {
        const { error } = await supabase
          .from("tasks")
          .update(taskData)
          .eq("id", task.id)

        if (error) throw error

        toast({
          title: "Tugas berhasil diperbarui!",
          description: "Perubahan telah disimpan dengan waktu WIB.",
        })
      } else {
        const { error } = await supabase
          .from("tasks")
          .insert(taskData)

        if (error) throw error

        toast({
          title: "Tugas berhasil dibuat!",
          description: "Tugas baru telah ditambahkan dengan waktu WIB.",
        })
      }

      onSuccess()
      onOpenChange(false)
    } catch (error) {
      console.error("Error saving task:", error)
      toast({
        title: "Error",
        description: "Gagal menyimpan tugas. Silakan coba lagi.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-slate-800 border-slate-700 text-slate-50 max-w-md">
        <DialogHeader>
          <DialogTitle className="text-emerald-400">
            {task ? "Edit Tugas" : "Tambah Tugas Baru"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Judul Tugas</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="bg-slate-700 border-slate-600 text-slate-50"
              placeholder="Masukkan judul tugas..."
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Deskripsi (Opsional)</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="bg-slate-700 border-slate-600 text-slate-50 min-h-20"
              placeholder="Masukkan deskripsi tugas..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="deadline">Deadline (Waktu Indonesia Barat - WIB)</Label>
            <Input
              id="deadline"
              type="datetime-local"
              value={formData.deadline}
              onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
              className="bg-slate-700 border-slate-600 text-slate-50"
              required
            />
            <p className="text-xs text-slate-400">
              * Waktu akan disimpan dalam zona waktu WIB (UTC+7)
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="priority">Prioritas</Label>
            <Select value={formData.priority} onValueChange={(value) => setFormData({ ...formData, priority: value as any })}>
              <SelectTrigger className="bg-slate-700 border-slate-600 text-slate-50">
                <SelectValue placeholder="Pilih prioritas" />
              </SelectTrigger>
              <SelectContent className="bg-slate-700 border-slate-600">
                <SelectItem value="low" className="text-slate-50">Rendah</SelectItem>
                <SelectItem value="medium" className="text-slate-50">Sedang</SelectItem>
                <SelectItem value="high" className="text-slate-50">Tinggi</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <Label>Pengingat WhatsApp</Label>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="remind_h1"
                checked={formData.remind_h1}
                onCheckedChange={(checked) => setFormData({ ...formData, remind_h1: !!checked })}
              />
              <Label htmlFor="remind_h1" className="text-sm">
                H-1 (1 hari sebelum deadline)
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="remind_h0"
                checked={formData.remind_h0}
                onCheckedChange={(checked) => setFormData({ ...formData, remind_h0: !!checked })}
              />
              <Label htmlFor="remind_h0" className="text-sm">
                Hari-H (pada hari deadline)
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="remind_h5h"
                checked={formData.remind_h5h}
                onCheckedChange={(checked) => setFormData({ ...formData, remind_h5h: !!checked })}
              />
              <Label htmlFor="remind_h5h" className="text-sm">
                5 jam sebelum deadline
              </Label>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1 border-slate-600 text-slate-300 hover:bg-slate-700"
            >
              Batal
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600"
            >
              {loading ? "Menyimpan..." : task ? "Perbarui" : "Simpan"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}