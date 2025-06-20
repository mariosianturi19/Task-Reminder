// lib/timezone-utils.ts
export const JAKARTA_TIMEZONE = 'Asia/Jakarta';

// Convert UTC to Jakarta time
export function convertToJakartaTime(utcDate: string | Date): Date {
  const date = new Date(utcDate);
  return new Date(date.toLocaleString("en-US", { timeZone: JAKARTA_TIMEZONE }));
}

// Convert Jakarta time to UTC for storage
export function convertToUTC(jakartaTime: string): Date {
  // Parse the datetime-local input as Jakarta time
  const localDate = new Date(jakartaTime);
  // Adjust for Jakarta timezone (UTC+7)
  return new Date(localDate.getTime() - (7 * 60 * 60 * 1000));
}

// Format date for display in Indonesian format
export function formatDateIndonesian(date: string | Date): string {
  const jakartaDate = convertToJakartaTime(date);
  return jakartaDate.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long", 
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: JAKARTA_TIMEZONE
  });
}

// Format date for datetime-local input
export function formatForDateTimeInput(date: string | Date): string {
  const jakartaDate = convertToJakartaTime(date);
  return jakartaDate.toISOString().slice(0, 16);
}

// Get current Jakarta time
export function getCurrentJakartaTime(): Date {
  return new Date(new Date().toLocaleString("en-US", { timeZone: JAKARTA_TIMEZONE }));
}