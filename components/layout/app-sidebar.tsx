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
    <div className="w-64 h-screen bg-slate-800/50 backdrop-blur-sm border-r border-slate-700/50 flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-slate-700/50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-lg flex items-center justify-center">
            <Bell className="w-4 h-4 text-white" />
          </div>
          <div>
            <h1 className="font-semibold text-slate-50">Task Reminder</h1>
            <p className="text-xs text-slate-400">Kelola tugas Anda</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                      : "text-slate-300 hover:text-slate-50 hover:bg-slate-700/50"
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  {item.name}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-slate-700/50">
        <div className="flex items-center gap-3 mb-3">
          <Avatar className="w-8 h-8">
            <AvatarFallback className="bg-slate-600 text-slate-200 text-xs">
              {userProfile?.name ? getInitials(userProfile.name) : <User className="w-4 h-4" />}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-slate-50 truncate">{userProfile?.name || "User"}</p>
            <p className="text-xs text-slate-400 truncate">{userProfile?.email || ""}</p>
          </div>
        </div>
        <Button
          onClick={handleSignOut}
          variant="outline"
          size="sm"
          className="w-full bg-slate-700/50 border-slate-600 hover:bg-slate-600 text-slate-300"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Keluar
        </Button>
      </div>
    </div>
  )
}
