// app/api/send-reminders/route.ts
import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { convertToJakartaTime, formatDateIndonesian } from "@/lib/timezone-utils"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabase = createClient(supabaseUrl, supabaseServiceKey)

const FONNTE_TOKEN = process.env.FONNTE_API_TOKEN!
const FONNTE_API_URL = process.env.FONNTE_API_URL!

export async function GET(request: NextRequest) {
  try {
    // Get current Jakarta time
    const nowJakarta = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Jakarta" }))

    // Get tasks that need reminders
    const { data: tasks, error } = await supabase
      .from("tasks")
      .select(`
        *,
        users (
          name,
          phone_number
        )
      `)
      .eq("status", "pending")

    if (error) throw error

    const results = []

    for (const task of tasks || []) {
      const deadlineJakarta = convertToJakartaTime(task.deadline)
      const user = task.users

      if (!user?.phone_number) continue

      let reminderType = ""
      const diffHours = (deadlineJakarta.getTime() - nowJakarta.getTime()) / (1000 * 60 * 60)

      // Determine reminder type
      if (task.remind_h1 && diffHours >= 20 && diffHours <= 28) {
        reminderType = "H-1"
      } else if (task.remind_h0 && diffHours >= -2 && diffHours <= 2) {
        reminderType = "Hari-H"
      } else if (task.remind_h5h && diffHours >= 4.5 && diffHours <= 5.5) {
        reminderType = "5 jam sebelum"
      }

      if (!reminderType) continue

      const message = `Hai ${user.name}! 📚

🎯 Reminder Tugas: "${task.title}"

⏰ Deadline: ${formatDateIndonesian(task.deadline)} WIB
📅 Reminder: ${reminderType}

${task.description ? `📝 Deskripsi: ${task.description}` : ''}

Jangan lupa dikerjakan ya! Semangat! 💪

- Task Reminder Bot 🤖`

      try {
        const response = await fetch(FONNTE_API_URL, {
          method: "POST",
          headers: {
            Authorization: FONNTE_TOKEN,
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({
            target: user.phone_number,
            message: message,
            countryCode: "62",
          }),
        })

        const result = await response.json()
        results.push({
          task_id: task.id,
          user_name: user.name,
          phone: user.phone_number,
          reminder_type: reminderType,
          deadline_wib: formatDateIndonesian(task.deadline),
          status: response.ok ? "sent" : "failed",
          response: result,
        })
      } catch (error) {
        results.push({
          task_id: task.id,
          user_name: user.name,
          phone: user.phone_number,
          reminder_type: reminderType,
          deadline_wib: formatDateIndonesian(task.deadline),
          status: "error",
          error: error instanceof Error ? error.message : "Unknown error",
        })
      }
    }

    return NextResponse.json({
      success: true,
      processed_at: nowJakarta.toISOString(),
      timezone: "Asia/Jakarta (WIB)",
      results,
      total_processed: results.length,
    })
  } catch (error) {
    console.error("Error sending reminders:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    )
  }
}