"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { AppSidebar } from "./app-sidebar"
import { MobileNav } from "./mobile-nav"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import type { User } from "@supabase/supabase-js"

interface AppLayoutProps {
  children: React.ReactNode
}

export function AppLayout({ children }: AppLayoutProps) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setUser(user)
      setLoading(false)

      if (!user && pathname !== "/") {
        router.push("/")
      }
    }

    getUser()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null)
      if (!session?.user && pathname !== "/") {
        router.push("/")
      }
    })

    return () => subscription.unsubscribe()
  }, [router, pathname])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-400"></div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-slate-900">
        <AppSidebar user={user} />
        <SidebarInset className="flex-1">
          <main className="flex-1 p-4 md:p-6">{children}</main>
        </SidebarInset>
        <MobileNav />
      </div>
    </SidebarProvider>
  )
}
