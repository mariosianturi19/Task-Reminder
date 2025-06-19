"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, CheckSquare, Settings } from "lucide-react"

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Tugas", href: "/tasks", icon: CheckSquare },
  { name: "Pengaturan", href: "/settings", icon: Settings },
]

export function MobileNav() {
  const pathname = usePathname()

  return (
    <div className="fixed bottom-0 left-0 right-0 glass-nav">
      <nav className="flex items-center justify-around py-2">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-colors ${
                isActive ? "text-emerald-400" : "text-slate-400 hover:text-slate-300"
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-xs font-medium">{item.name}</span>
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
