"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { supabase } from "@/lib/supabase"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"

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

  // Reset form when task changes or dialog opens
  useEffect(() => {
    if (open) {
      if (task) {
        // Edit mode - populate form with task data
        const deadlineDate = new Date(task.deadline)
        const localDateTime = new Date(deadlineDate.getTime() - deadlineDate.getTimezoneOffset() * 60000)
          .toISOString()
          .slice(0, 16)

        setFormData({
          title: task.title || "",
          description: task.description || "",
          deadline: localDateTime,
          priority: task.priority || "medium",
          remind_h1: task.remind_h1 || false,
          remind_h0: task.remind_h0 || false,
          remind_h5h: task.remind_h5h || false,
        })
      } else {
        // Create mode - reset form
        setFormData({
          title: "",
          description: "",
          deadline: "",
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
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) throw new Error("User not authenticated")

      // Convert local datetime to UTC
      const deadlineUTC = new Date(formData.deadline).toISOString()

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
        // Update existing task
        const { error } = await supabase.from("tasks").update(taskData).eq("id", task.id)

        if (error) throw error

        toast({
          title: "Tugas berhasil diperbarui!",
          description: "Perubahan telah disimpan.",
        })
      } else {
        // Create new task
        const { error } = await supabase.from("tasks").insert(taskData)

        if (error) throw error

        toast({
          title: "Tugas berhasil dibuat!",
          description: "Tugas baru telah ditambahkan.",
        })
      }

      onSuccess()
      onOpenChange(false)
    } catch (error: any) {
      console.error("Task form error:", error)
      toast({
        title: "Error",
        description: error.message || "Terjadi kesalahan saat menyimpan tugas",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-slate-800 border-slate-700">
        <DialogHeader>
          <DialogTitle className="text-slate-50">{task ? "Edit Tugas" : "Tambah Tugas Baru"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-slate-300">
              Judul Tugas
            </Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Masukkan judul tugas"
              className="bg-slate-700/50 border-slate-600 focus:border-emerald-400 text-slate-50"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-slate-300">
              Deskripsi
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Deskripsi tugas (opsional)"
              className="bg-slate-700/50 border-slate-600 focus:border-emerald-400 text-slate-50 min-h-[80px]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="deadline" className="text-slate-300">
              Deadline
            </Label>
            <Input
              id="deadline"
              type="datetime-local"
              value={formData.deadline}
              onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
              className="bg-slate-700/50 border-slate-600 focus:border-emerald-400 text-slate-50"
              required
            />
          </div>

          <div className="space-y-2">
            <Label className="text-slate-300">Prioritas</Label>
            <Select
              value={formData.priority}
              onValueChange={(value: "high" | "medium" | "low") => setFormData({ ...formData, priority: value })}
            >
              <SelectTrigger className="bg-slate-700/50 border-slate-600 focus:border-emerald-400 text-slate-50">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700">
                <SelectItem value="high" className="text-red-400">
                  High
                </SelectItem>
                <SelectItem value="medium" className="text-yellow-400">
                  Medium
                </SelectItem>
                <SelectItem value="low" className="text-green-400">
                  Low
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <Label className="text-slate-300">Pengingat WhatsApp</Label>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remind_h1"
                  checked={formData.remind_h1}
                  onCheckedChange={(checked) => setFormData({ ...formData, remind_h1: !!checked })}
                  className="border-slate-600 data-[state=checked]:bg-emerald-500"
                />
                <Label htmlFor="remind_h1" className="text-sm text-slate-400">
                  Ingatkan H-1 (1 hari sebelum deadline)
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remind_h0"
                  checked={formData.remind_h0}
                  onCheckedChange={(checked) => setFormData({ ...formData, remind_h0: !!checked })}
                  className="border-slate-600 data-[state=checked]:bg-emerald-500"
                />
                <Label htmlFor="remind_h0" className="text-sm text-slate-400">
                  Ingatkan hari-H (hari deadline)
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remind_h5h"
                  checked={formData.remind_h5h}
                  onCheckedChange={(checked) => setFormData({ ...formData, remind_h5h: !!checked })}
                  className="border-slate-600 data-[state=checked]:bg-emerald-500"
                />
                <Label htmlFor="remind_h5h" className="text-sm text-slate-400">
                  Ingatkan 5 jam sebelum deadline
                </Label>
              </div>
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1 bg-slate-700/50 border-slate-600 hover:bg-slate-600 text-slate-300"
            >
              Batal
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600"
            >
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              {task ? "Perbarui" : "Simpan"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
