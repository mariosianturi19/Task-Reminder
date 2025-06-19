"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { AppLayout } from "@/components/layout/app-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useToast } from "@/hooks/use-toast"
import { getUserProfile, updateUserProfile } from "@/lib/auth"
import { supabase } from "@/lib/supabase"
import { User, Phone, Mail, Save, Loader2, Bell } from "lucide-react"

export default function SettingsPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [userProfile, setUserProfile] = useState<any>(null)
  const [formData, setFormData] = useState({
    name: "",
    phone_number: "",
    email: "",
  })
  const { toast } = useToast()

  useEffect(() => {
    fetchUserProfile()
  }, [])

  const fetchUserProfile = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (user) {
        const profile = await getUserProfile(user.id)
        setUserProfile(profile)
        setFormData({
          name: profile.name || "",
          phone_number: profile.phone_number || "",
          email: profile.email || "",
        })
      }
    } catch (error) {
      console.error("Error fetching user profile:", error)
      toast({
        title: "Error",
        description: "Gagal memuat profil pengguna",
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
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) throw new Error("User not authenticated")

      await updateUserProfile(user.id, {
        name: formData.name,
        phone_number: formData.phone_number,
      })

      setUserProfile({ ...userProfile, ...formData })

      toast({
        title: "Profil berhasil diperbarui!",
        description: "Perubahan telah disimpan",
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Gagal memperbarui profil",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
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
          <h1 className="text-2xl font-bold text-slate-50">Pengaturan</h1>
          <p className="text-slate-400">Kelola profil dan preferensi akun Anda</p>
        </div>

        {/* Profile Card */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-slate-50">
              <User className="w-5 h-5 text-emerald-400" />
              Profil Pengguna
            </CardTitle>
            <CardDescription className="text-slate-400">Perbarui informasi profil Anda</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSave} className="space-y-6">
              {/* Avatar Section */}
              <div className="flex items-center gap-4">
                <Avatar className="w-16 h-16">
                  <AvatarFallback className="bg-slate-600 text-slate-200 text-lg">
                    {userProfile?.name ? getInitials(userProfile.name) : <User className="w-8 h-8" />}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-medium text-slate-50">{userProfile?.name || "User"}</h3>
                  <p className="text-sm text-slate-400">{userProfile?.email}</p>
                </div>
              </div>

              {/* Form Fields */}
              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-slate-300">
                    Nama Lengkap
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <Input
                      id="name"
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="pl-10 bg-slate-700/50 border-slate-600 focus:border-emerald-400 text-slate-50"
                      placeholder="Masukkan nama lengkap"
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
                      value={formData.phone_number}
                      onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
                      className="pl-10 bg-slate-700/50 border-slate-600 focus:border-emerald-400 text-slate-50"
                      placeholder="08xxxxxxxxxx"
                      required
                    />
                  </div>
                  <p className="text-xs text-slate-500">Nomor ini akan digunakan untuk pengingat WhatsApp</p>
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
                      value={formData.email}
                      className="pl-10 bg-slate-700/50 border-slate-600 text-slate-400"
                      disabled
                    />
                  </div>
                  <p className="text-xs text-slate-500">Email tidak dapat diubah</p>
                </div>
              </div>

              <Button
                type="submit"
                disabled={saving}
                className="bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600"
              >
                {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                Simpan Perubahan
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Reminder Settings */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-slate-50">
              <Bell className="w-5 h-5 text-emerald-400" />
              Pengaturan Pengingat
            </CardTitle>
            <CardDescription className="text-slate-400">Informasi tentang sistem pengingat WhatsApp</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 rounded-lg bg-slate-700/30 border border-slate-600/50">
              <h4 className="font-medium text-slate-50 mb-2">Cara Kerja Pengingat</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li>• Pengingat H-1: Dikirim 1 hari sebelum deadline</li>
                <li>• Pengingat Hari-H: Dikirim pada hari deadline</li>
                <li>• Pengingat 5 jam: Dikirim 5 jam sebelum deadline</li>
              </ul>
            </div>
            <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/30">
              <p className="text-sm text-emerald-400">
                💡 Pastikan nomor WhatsApp Anda benar untuk menerima pengingat otomatis
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  )
}
