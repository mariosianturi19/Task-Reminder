"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { signOut, getUserProfile } from "@/lib/auth"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"
import { LayoutDashboard, CheckSquare, Settings, LogOut, User, Bell } from "lucide-react"

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Tugas", href: "/tasks", icon: CheckSquare },
  { name: "Pengaturan", href: "/settings", icon: Settings },
]

export function AppSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [userProfile, setUserProfile] = useState<any>(null)

  useEffect(() => {
    const fetchUserProfile = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (user) {
        try {
          const profile = await getUserProfile(user.id)
          setUserProfile(profile)
        } catch (error) {
          console.error("Error fetching user profile:", error)
        }
      }
    }

    fetchUserProfile()
  }, [])

  const handleSignOut = async () => {
    await signOut()
    router.push("/")
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <div className="w-64 h-screen backdrop-blur-xl bg-slate-800/60 border-r border-slate-700/50 flex flex-col relative">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-800/20 to-slate-900/20 pointer-events-none" />
      
      {/* Header */}
      <div className="relative p-6 border-b border-slate-700/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-blue-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/25 relative">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 to-blue-400 rounded-xl blur opacity-50" />
            <Bell className="w-5 h-5 text-white relative z-10" />
          </div>
          <div>
            <h1 className="font-bold text-lg bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">
              Task Reminder
            </h1>
            <p className="text-xs text-slate-400 font-medium">Kelola tugas Anda</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 relative">
        <ul className="space-y-2">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={`group relative flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                    isActive
                      ? "bg-gradient-to-r from-emerald-500/20 to-blue-500/20 text-emerald-400 border border-emerald-500/30 shadow-lg shadow-emerald-500/10"
                      : "text-slate-300 hover:text-slate-50 hover:bg-slate-700/40 hover:scale-[1.02] active:scale-[0.98]"
                  }`}
                >
                  {isActive && (
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-blue-500/10 rounded-xl blur-sm" />
                  )}
                  <item.icon className={`w-5 h-5 relative z-10 transition-all duration-300 ${
                    isActive ? 'drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'group-hover:scale-110'
                  }`} />
                  <span className="relative z-10">{item.name}</span>
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* User Profile */}
      <div className="relative p-4 border-t border-slate-700/50 bg-slate-800/30">
        <div className="flex items-center gap-3 mb-4 p-3 rounded-xl bg-slate-700/30 backdrop-blur-sm border border-slate-600/30">
          <Avatar className="w-10 h-10 ring-2 ring-emerald-400/30">
            <AvatarFallback className="bg-gradient-to-br from-slate-600 to-slate-700 text-slate-200 text-sm font-semibold">
              {userProfile?.name ? getInitials(userProfile.name) : <User className="w-5 h-5" />}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-slate-50 truncate">{userProfile?.name || "User"}</p>
            <p className="text-xs text-slate-400 truncate">{userProfile?.email || ""}</p>
          </div>
        </div>
        <Button
          onClick={handleSignOut}
          variant="outline"
          size="sm"
          className="w-full bg-slate-700/50 backdrop-blur-sm border-slate-600/50 hover:bg-slate-600/60 text-slate-300 hover:text-white transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] py-2.5"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Keluar
        </Button>
      </div>
    </div>
  )
}
