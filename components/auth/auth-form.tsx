"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { signIn, signUp } from "@/lib/auth"
import { useToast } from "@/hooks/use-toast"
import { Loader2, Mail, Lock, User, Phone } from "lucide-react"

export function AuthForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [loginData, setLoginData] = useState({ email: "", password: "" })
  const [registerData, setRegisterData] = useState({
    email: "",
    password: "",
    name: "",
    phoneNumber: "",
  })
  const router = useRouter()
  const { toast } = useToast()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      await signIn(loginData.email, loginData.password)
      toast({
        title: "Login berhasil!",
        description: "Selamat datang kembali.",
      })
      router.push("/dashboard")
    } catch (error: any) {
      toast({
        title: "Login gagal",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      await signUp(registerData.email, registerData.password, registerData.name, registerData.phoneNumber)
      toast({
        title: "Registrasi berhasil!",
        description: "Silakan cek email untuk verifikasi.",
      })
    } catch (error: any) {
      toast({
        title: "Registrasi gagal",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-3 sm:p-4 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(16,185,129,0.1),transparent_50%)]" />
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000" />

      <Card className="w-full max-w-md backdrop-blur-xl bg-white/5 border border-white/10 shadow-2xl relative z-10 transition-all duration-300 hover:shadow-emerald-500/10 hover:shadow-2xl">
        <CardHeader className="text-center space-y-3 pb-6">
          <div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-br from-emerald-400 to-blue-400 flex items-center justify-center mb-2">
            <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <div className="w-4 h-4 rounded-full bg-gradient-to-br from-emerald-300 to-blue-300" />
            </div>
          </div>
          <CardTitle className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">
            Task Reminder
          </CardTitle>
          <CardDescription className="text-slate-300 text-sm sm:text-base">
            Kelola tugas dengan pengingat WhatsApp
          </CardDescription>
        </CardHeader>

        <CardContent className="px-4 sm:px-6 pb-6">
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 p-1 mb-6">
              <TabsTrigger
                value="login"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-600 data-[state=active]:to-blue-600 data-[state=active]:text-white transition-all duration-200 text-slate-300 hover:text-white"
              >
                Login
              </TabsTrigger>
              <TabsTrigger
                value="register"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-600 data-[state=active]:to-blue-600 data-[state=active]:text-white transition-all duration-200 text-slate-300 hover:text-white"
              >
                Register
              </TabsTrigger>
            </TabsList>

            <TabsContent value="login" className="space-y-5">
              <form onSubmit={handleLogin} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="login-email" className="text-slate-200 font-medium">
                    Email
                  </Label>
                  <div className="relative group">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-emerald-400 transition-colors" />
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="nama@email.com"
                      className="pl-10 pr-4 py-3 bg-slate-800/50 backdrop-blur-sm border border-slate-600/50 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 text-white placeholder:text-slate-400 rounded-lg transition-all duration-200"
                      value={loginData.email}
                      onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="login-password" className="text-slate-200 font-medium">
                    Password
                  </Label>
                  <div className="relative group">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-emerald-400 transition-colors" />
                    <Input
                      id="login-password"
                      type="password"
                      placeholder="••••••••"
                      className="pl-10 pr-4 py-3 bg-slate-800/50 backdrop-blur-sm border border-slate-600/50 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 text-white placeholder:text-slate-400 rounded-lg transition-all duration-200"
                      value={loginData.password}
                      onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <Button
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white font-medium rounded-lg shadow-lg hover:shadow-emerald-500/25 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
                  disabled={isLoading}
                >
                  {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  Login
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="register" className="space-y-4">
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="register-name" className="text-slate-200 font-medium">
                    Nama Lengkap
                  </Label>
                  <div className="relative group">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-emerald-400 transition-colors" />
                    <Input
                      id="register-name"
                      type="text"
                      placeholder="Nama lengkap"
                      className="pl-10 pr-4 py-3 bg-slate-800/50 backdrop-blur-sm border border-slate-600/50 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 text-white placeholder:text-slate-400 rounded-lg transition-all duration-200"
                      value={registerData.name}
                      onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="register-phone" className="text-slate-200 font-medium">
                    Nomor WhatsApp
                  </Label>
                  <div className="relative group">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-emerald-400 transition-colors" />
                    <Input
                      id="register-phone"
                      type="tel"
                      placeholder="08123456789"
                      className="pl-10 pr-4 py-3 bg-slate-800/50 backdrop-blur-sm border border-slate-600/50 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 text-white placeholder:text-slate-400 rounded-lg transition-all duration-200"
                      value={registerData.phoneNumber}
                      onChange={(e) => setRegisterData({ ...registerData, phoneNumber: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="register-email" className="text-slate-200 font-medium">
                    Email
                  </Label>
                  <div className="relative group">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-emerald-400 transition-colors" />
                    <Input
                      id="register-email"
                      type="email"
                      placeholder="nama@email.com"
                      className="pl-10 pr-4 py-3 bg-slate-800/50 backdrop-blur-sm border border-slate-600/50 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 text-white placeholder:text-slate-400 rounded-lg transition-all duration-200"
                      value={registerData.email}
                      onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="register-password" className="text-slate-200 font-medium">
                    Password
                  </Label>
                  <div className="relative group">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-emerald-400 transition-colors" />
                    <Input
                      id="register-password"
                      type="password"
                      placeholder="••••••••"
                      className="pl-10 pr-4 py-3 bg-slate-800/50 backdrop-blur-sm border border-slate-600/50 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 text-white placeholder:text-slate-400 rounded-lg transition-all duration-200"
                      value={registerData.password}
                      onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <Button
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white font-medium rounded-lg shadow-lg hover:shadow-emerald-500/25 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] mt-6"
                  disabled={isLoading}
                >
                  {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  Register
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
