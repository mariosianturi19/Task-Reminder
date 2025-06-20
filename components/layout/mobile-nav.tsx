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
		<div className="fixed bottom-0 left-0 right-0 z-50 safe-area-inset-bottom">
			<div className="mx-3 mb-3 rounded-xl border border-slate-700/50 bg-slate-800/80 shadow-2xl shadow-slate-900/50 backdrop-blur-xl">
				<nav className="flex items-center justify-around px-1 py-2">
					{navigation.map((item) => {
						const isActive = pathname === item.href
						return (
							<Link
								key={item.name}
								href={item.href}
								className={`flex flex-col items-center gap-1 rounded-lg px-3 py-2 transition-all duration-200 min-w-0 ${
									isActive
										? "bg-emerald-500/20 text-emerald-400"
										: "text-slate-400 hover:text-slate-300 active:scale-95"
								}`}
							>
								<item.icon className="h-5 w-5 flex-shrink-0" />
								<span className="truncate text-xs font-medium">
									{item.name}
								</span>
							</Link>
						)
					})}
				</nav>
			</div>
		</div>
	)
}
