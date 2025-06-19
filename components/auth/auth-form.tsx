"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { signIn, signUp } from "@/lib/auth"
import { useRouter } from "next/navigation"
import { Loader2, Mail, Lock, User, Phone } from "lucide-react"

export function AuthForm() {
  const [loading, setLoading] = useState(false)
  const [loginData, setLoginData] = useState({ email: "", password: "" })
  const [registerData, setRegisterData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
    phoneNumber: "",
  })
  const { toast } = useToast()
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      await signIn(loginData.email, loginData.password)
      toast({
        title: "Login berhasil!",
        description: "Selamat datang kembali",
      })
      router.push("/dashboard")
    } catch (error: any) {
      toast({
        title: "Login gagal",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    if (registerData.password !== registerData.confirmPassword) {
      toast({
        title: "Password tidak cocok",
        description: "Pastikan password dan konfirmasi password sama",
        variant: "destructive",
      })
      setLoading(false)
      return
    }

    if (registerData.password.length < 6) {
      toast({
        title: "Password terlalu pendek",
        description: "Password minimal 6 karakter",
        variant: "destructive",
      })
      setLoading(false)
      return
    }

    try {
      await signUp(registerData.email, registerData.password, registerData.name, registerData.phoneNumber)
      toast({
        title: "Registrasi berhasil!",
        description: "Silakan cek email untuk verifikasi akun",
      })
    } catch (error: any) {
      toast({
        title: "Registrasi gagal",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-50 mb-2">Task Reminder</h1>
          <p className="text-slate-400">Kelola tugas dengan pengingat WhatsApp</p>
        </div>

        <Card className="glass-card">
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-slate-700/50">
              <TabsTrigger value="login" className="data-[state=active]:bg-slate-600">
                Login
              </TabsTrigger>
              <TabsTrigger value="register" className="data-[state=active]:bg-slate-600">
                Register
              </TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <CardHeader>
                <CardTitle className="text-slate-50">Masuk ke Akun</CardTitle>
                <CardDescription className="text-slate-400">
                  Masukkan email dan password untuk melanjutkan
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email" className="text-slate-300">
                      Email
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                      <Input
                        id="login-email"
                        type="email"
                        placeholder="nama@email.com"
                        value={loginData.email}
                        onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                        className="pl-10 bg-slate-700/50 border-slate-600 focus:border-emerald-400 text-slate-50"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="login-password" className="text-slate-300">
                      Password
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                      <Input
                        id="login-password"
                        type="password"
                        placeholder="••••••••"
                        value={loginData.password}
                        onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                        className="pl-10 bg-slate-700/50 border-slate-600 focus:border-emerald-400 text-slate-50"
                        required
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600"
                  >
                    {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    Masuk
                  </Button>
                </form>
              </CardContent>
            </TabsContent>

            <TabsContent value="register">
              <CardHeader>
                <CardTitle className="text-slate-50">Buat Akun Baru</CardTitle>
                <CardDescription className="text-slate-400">
                  Daftar untuk mulai menggunakan Task Reminder
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="register-name" className="text-slate-300">
                      Nama Lengkap
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                      <Input
                        id="register-name"
                        type="text"
                        placeholder="Nama lengkap"
                        value={registerData.name}
                        onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
                        className="pl-10 bg-slate-700/50 border-slate-600 focus:border-emerald-400 text-slate-50"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="register-phone" className="text-slate-300">
                      Nomor WhatsApp
                    </Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                      <Input
                        id="register-phone"
                        type="tel"
                        placeholder="08xxxxxxxxxx"
                        value={registerData.phoneNumber}
                        onChange={(e) => setRegisterData({ ...registerData, phoneNumber: e.target.value })}
                        className="pl-10 bg-slate-700/50 border-slate-600 focus:border-emerald-400 text-slate-50"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="register-email" className="text-slate-300">
                      Email
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                      <Input
                        id="register-email"
                        type="email"
                        placeholder="nama@email.com"
                        value={registerData.email}
                        onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                        className="pl-10 bg-slate-700/50 border-slate-600 focus:border-emerald-400 text-slate-50"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="register-password" className="text-slate-300">
                      Password
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                      <Input
                        id="register-password"
                        type="password"
                        placeholder="••••••••"
                        value={registerData.password}
                        onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                        className="pl-10 bg-slate-700/50 border-slate-600 focus:border-emerald-400 text-slate-50"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="register-confirm-password" className="text-slate-300">
                      Konfirmasi Password
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                      <Input
                        id="register-confirm-password"
                        type="password"
                        placeholder="••••••••"
                        value={registerData.confirmPassword}
                        onChange={(e) => setRegisterData({ ...registerData, confirmPassword: e.target.value })}
                        className="pl-10 bg-slate-700/50 border-slate-600 focus:border-emerald-400 text-slate-50"
                        required
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600"
                  >
                    {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    Daftar
                  </Button>
                </form>
              </CardContent>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  )
}
