"use client"

import { usePathname } from "next/navigation"
import { LayoutDashboard, CheckSquare, Settings } from "lucide-react"
import Link from "next/link"

export function MobileNav() {
  const pathname = usePathname()

  const navItems = [
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
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-slate-800/95 backdrop-blur-sm border-t border-slate-700 z-50">
      <div className="flex items-center justify-around py-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-colors ${
                isActive ? "text-emerald-400 bg-emerald-400/10" : "text-slate-400 hover:text-slate-300"
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-xs font-medium">{item.title}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
