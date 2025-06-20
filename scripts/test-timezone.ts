// scripts/test-timezone.ts
import { convertToJakartaTime, convertToUTC, formatDateIndonesian, getCurrentJakartaTime } from '../lib/timezone-utils'

console.log('=== TESTING TIMEZONE UTILITIES ===')

// Test current Jakarta time
const now = getCurrentJakartaTime()
console.log('Current Jakarta Time:', now.toISOString())
console.log('Formatted Indonesian:', formatDateIndonesian(now))

// Test conversion from UTC to Jakarta
const utcDate = new Date().toISOString()
console.log('\nUTC Date:', utcDate)
console.log('Converted to Jakarta:', convertToJakartaTime(utcDate).toISOString())

// Test conversion from Jakarta to UTC
const jakartaDateTime = '2025-06-21T10:30'
console.log('\nJakarta DateTime Input:', jakartaDateTime)
console.log('Converted to UTC:', convertToUTC(jakartaDateTime).toISOString())

// Test formatting
const testDate = '2025-06-21T15:30:00.000Z'
console.log('\nTest Date (UTC):', testDate)
console.log('Formatted Indonesian:', formatDateIndonesian(testDate))