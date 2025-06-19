"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { AppLayout } from "@/components/layout/app-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { supabase } from "@/lib/supabase"
import { getUserProfile } from "@/lib/auth"
import { useToast } from "@/hooks/use-toast"
import { User, Phone, Mail, Save, Loader2 } from "lucide-react"

export default function SettingsPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState({
    name: "",
    phone_number: "",
    email: "",
  })
  const { toast } = useToast()

  useEffect(() => {
    fetchUserData()
  }, [])

  const fetchUserData = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) return

      setUser(user)

      const userProfile = await getUserProfile(user.id)
      setProfile({
        name: userProfile.name || "",
        phone_number: userProfile.phone_number || "",
        email: userProfile.email || user.email || "",
      })
    } catch (error) {
      console.error("Error fetching user data:", error)
      toast({
        title: "Error",
        description: "Gagal memuat data pengguna",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      if (!user) throw new Error("User not found")

      const { error } = await supabase
        .from("users")
        .update({
          name: profile.name,
          phone_number: profile.phone_number,
        })
        .eq("id", user.id)

      if (error) throw error

      toast({
        title: "Pengaturan berhasil disimpan!",
        description: "Perubahan telah disimpan.",
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setSaving(false)
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
      <div className="space-y-6 pb-20 md:pb-6">
        {/* Header */}
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold text-slate-50">Pengaturan</h1>
          <p className="text-slate-400">Kelola informasi akun Anda</p>
        </div>

        {/* Profile Card */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-slate-50">
              <User className="w-5 h-5 text-emerald-400" />
              Profil Pengguna
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4 mb-6">
              <Avatar className="w-16 h-16">
                <AvatarFallback className="bg-gradient-to-r from-emerald-400 to-blue-400 text-white text-xl">
                  {profile.name?.charAt(0)?.toUpperCase() || <User className="w-8 h-8" />}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-lg font-medium text-slate-50">{profile.name || "Nama belum diatur"}</h3>
                <p className="text-slate-400">{profile.email}</p>
              </div>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-slate-300">
                  Nama Lengkap
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <Input
                    id="name"
                    type="text"
                    placeholder="Masukkan nama lengkap"
                    className="pl-10 bg-slate-700/50 border-slate-600 focus:border-emerald-400 text-slate-50"
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="text-slate-300">
                  Nomor WhatsApp
                </Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="08123456789"
                    className="pl-10 bg-slate-700/50 border-slate-600 focus:border-emerald-400 text-slate-50"
                    value={profile.phone_number}
                    onChange={(e) => setProfile({ ...profile, phone_number: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-300">
                  Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <Input
                    id="email"
                    type="email"
                    className="pl-10 bg-slate-700/50 border-slate-600 text-slate-400"
                    value={profile.email}
                    disabled
                  />
                </div>
                <p className="text-xs text-slate-500">Email tidak dapat diubah</p>
              </div>

              <Button
                type="submit"
                disabled={saving}
                className="w-full bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600"
              >
                {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                Simpan Perubahan
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* WhatsApp Integration Info */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-slate-50">
              <Phone className="w-5 h-5 text-emerald-400" />
              Pengingat WhatsApp
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <p className="text-slate-300">
                Sistem akan mengirim pengingat WhatsApp berdasarkan pengaturan tugas Anda.
              </p>
              <div className="bg-slate-700/30 rounded-lg p-4">
                <h4 className="font-medium text-slate-50 mb-2">Jenis Pengingat:</h4>
                <ul className="space-y-1 text-sm text-slate-400">
                  <li>• H-1: Pengingat 1 hari sebelum deadline</li>
                  <li>• Hari-H: Pengingat pada hari deadline</li>
                  <li>• 5 Jam: Pengingat 5 jam sebelum deadline</li>
                </ul>
              </div>
              <p className="text-xs text-slate-500">Pastikan nomor WhatsApp Anda aktif untuk menerima pengingat.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  )
}
