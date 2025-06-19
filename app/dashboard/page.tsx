"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { signOut } from "@/lib/auth"
import { CheckSquare, Clock, AlertTriangle, Target } from "lucide-react"

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.push("/")
        return
      }

      setUser(user)
      setLoading(false)
    }

    getUser()
  }, [router])

  const handleSignOut = async () => {
    await signOut()
    router.push("/")
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-400"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-900 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-slate-50">Dashboard</h1>
            <p className="text-slate-400">Selamat datang, {user?.email}</p>
          </div>
          <Button onClick={handleSignOut} variant="outline" className="bg-slate-800 border-slate-600 text-slate-300">
            Logout
          </Button>
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
                  <p className="text-2xl font-bold text-slate-50">0</p>
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
                  <p className="text-2xl font-bold text-slate-50">0</p>
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
                  <p className="text-2xl font-bold text-slate-50">0</p>
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
                  <p className="text-2xl font-bold text-slate-50">0</p>
                  <p className="text-xs text-slate-400">Mendesak</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Welcome Card */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-slate-50">Selamat Datang!</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-slate-400 mb-4">
              Aplikasi Task Reminder Anda siap digunakan. Mulai dengan membuat tugas pertama Anda!
            </p>
            <Button className="bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600">
              Buat Tugas Baru
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
