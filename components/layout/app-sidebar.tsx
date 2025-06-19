"use client"

import { useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import type { User } from "@supabase/supabase-js"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { LayoutDashboard, CheckSquare, Settings, LogOut, UserIcon } from "lucide-react"
import { signOut } from "@/lib/auth"
import { getUserProfile } from "@/lib/auth"
import { useToast } from "@/hooks/use-toast"

interface AppSidebarProps {
  user: User
}

export function AppSidebar({ user }: AppSidebarProps) {
  const [userProfile, setUserProfile] = useState<any>(null)
  const router = useRouter()
  const pathname = usePathname()
  const { toast } = useToast()

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profile = await getUserProfile(user.id)
        setUserProfile(profile)
      } catch (error) {
        console.error("Error fetching profile:", error)
      }
    }

    fetchProfile()
  }, [user.id])

  const handleSignOut = async () => {
    try {
      await signOut()
      toast({
        title: "Logout berhasil",
        description: "Sampai jumpa lagi!",
      })
      router.push("/")
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal logout",
        variant: "destructive",
      })
    }
  }

  const menuItems = [
    {
      title: "Dashboard",
      icon: LayoutDashboard,
      href: "/dashboard",
    },
    {
      title: "Tugas",
      icon: CheckSquare,
      href: "/tasks",
    },
    {
      title: "Pengaturan",
      icon: Settings,
      href: "/settings",
    },
  ]

  return (
    <Sidebar className="hidden md:flex">
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-emerald-400 to-blue-400 flex items-center justify-center">
            <CheckSquare className="w-4 h-4 text-white" />
          </div>
          <div>
            <h2 className="font-semibold text-slate-50">Task Reminder</h2>
            <p className="text-xs text-slate-400">Personal Assistant</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarSeparator />

      <SidebarContent className="p-2">
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                asChild
                isActive={pathname === item.href}
                className="w-full justify-start gap-3 px-3 py-2 rounded-xl hover:bg-slate-700/50 data-[active=true]:bg-gradient-to-r data-[active=true]:from-emerald-500/20 data-[active=true]:to-blue-500/20 data-[active=true]:border data-[active=true]:border-emerald-500/30"
              >
                <a href={item.href}>
                  <item.icon className="w-4 h-4" />
                  <span>{item.title}</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>

      <SidebarSeparator />

      <SidebarFooter className="p-4">
        <div className="flex items-center gap-3 mb-3">
          <Avatar className="w-8 h-8">
            <AvatarFallback className="bg-slate-700 text-slate-300">
              {userProfile?.name?.charAt(0)?.toUpperCase() || <UserIcon className="w-4 h-4" />}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-slate-50 truncate">{userProfile?.name || "User"}</p>
            <p className="text-xs text-slate-400 truncate">{user.email}</p>
          </div>
        </div>
        <Button
          onClick={handleSignOut}
          variant="outline"
          size="sm"
          className="w-full justify-start gap-2 bg-slate-700/50 border-slate-600 hover:bg-slate-600 text-slate-300"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </Button>
      </SidebarFooter>
    </Sidebar>
  )
}
