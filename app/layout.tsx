import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Task Reminder - Kelola Tugas dengan Pengingat WhatsApp",
  description: "Aplikasi personal task reminder dengan notifikasi WhatsApp otomatis",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id" className="dark">
      <body className={inter.className}>
        {children}
        <Toaster />
      </body>
    </html>
  )
}
