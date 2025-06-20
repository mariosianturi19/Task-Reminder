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
import { User, Phone, Mail, Save, Loader2, Bell, Clock } from "lucide-react"

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
          <div className="w-10 h-10 border-2 border-emerald-400/30 border-t-emerald-400 rounded-full animate-spin" />
        </div>
      </AppLayout>
    )
  }

  return (
    <AppLayout>
      <div className="space-y-6 max-w-2xl mx-auto">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">
            Pengaturan
          </h1>
          <p className="text-slate-300 text-sm md:text-base">Kelola profil dan preferensi akun Anda</p>
        </div>

        {/* Profile Card */}
        <Card className="backdrop-blur-xl bg-white/5 border border-white/10">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3 text-slate-50 text-lg">
              <div className="p-2 rounded-lg bg-gradient-to-br from-emerald-500/20 to-blue-500/20">
                <User className="w-5 h-5 text-emerald-400" />
              </div>
              Profil Pengguna
            </CardTitle>
            <CardDescription className="text-slate-300 text-sm">Perbarui informasi profil Anda</CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <form onSubmit={handleSave} className="space-y-6">
              {/* Avatar Section */}
              <div className="flex items-center gap-4 p-4 rounded-lg bg-slate-700/30 border border-slate-600/30">
                <Avatar className="w-12 h-12 md:w-16 md:h-16">
                  <AvatarFallback className="bg-gradient-to-br from-slate-600 to-slate-700 text-slate-200 text-sm md:text-lg font-semibold">
                    {userProfile?.name ? getInitials(userProfile.name) : <User className="w-6 h-6 md:w-8 md:h-8" />}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <h3 className="font-semibold text-slate-50 truncate">{userProfile?.name || "User"}</h3>
                  <p className="text-sm text-slate-400 truncate">{userProfile?.email}</p>
                </div>
              </div>

              {/* Form Fields */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-slate-200 font-medium">
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
                  <Label htmlFor="phone" className="text-slate-200 font-medium">
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
                  <p className="text-xs text-slate-400">Nomor ini akan digunakan untuk pengingat WhatsApp</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-slate-200 font-medium">
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
                  <p className="text-xs text-slate-400">Email tidak dapat diubah</p>
                </div>
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
      </div>
    </AppLayout>
  )
}
