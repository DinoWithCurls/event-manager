import type { CreateEventData, CreateAttendeeData, ValidationError } from "./types"

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function validatePhone(phone: string): boolean {
  const phoneRegex = /^[+]?[1-9][\d]{0,15}$/
  return phoneRegex.test(phone.replace(/[\s\-$$$$]/g, ""))
}

export function validateEventData(data: CreateEventData): ValidationError[] {
  const errors: ValidationError[] = []

  if (!data.name?.trim()) {
    errors.push({ field: "name", message: "Event name is required" })
  } else if (data.name.length > 200) {
    errors.push({ field: "name", message: "Event name must be less than 200 characters" })
  }

  if (!data.start_time) {
    errors.push({ field: "start_time", message: "Event date is required" })
  } else {
    const eventDate = new Date(data.start_time)
    if (isNaN(eventDate.getTime())) {
      errors.push({ field: "start_time", message: "Invalid start date format" })
    } else if (eventDate <= new Date()) {
      errors.push({ field: "start_time", message: "Event start must be in the future" })
    }
  }
  if (!data.end_time) {
    errors.push({ field: "end_time", message: "End date is required" })
  } else {
    const eventDate = new Date(data.end_time)
    if (isNaN(eventDate.getTime())) {
      errors.push({ field: "end_time", message: "Invalid event date format" })
    } else if (eventDate <= new Date()) {
      errors.push({ field: "end_time", message: "Event date must be in the future" })
    }
  }

  if (!data.location?.trim()) {
    errors.push({ field: "location", message: "Event location is required" })
  } else if (data.location.length > 300) {
    errors.push({ field: "location", message: "Location must be less than 300 characters" })
  }

  if (!data.max_capacity || data.max_capacity <= 0) {
    errors.push({ field: "max_capacity", message: "Maximum attendees must be a positive number" })
  } else if (data.max_capacity > 10000) {
    errors.push({ field: "max_capacity", message: "Maximum attendees cannot exceed 10,000" })
  }

  return errors
}

export function validateAttendeeData(data: CreateAttendeeData): ValidationError[] {
  const errors: ValidationError[] = []

  if (!data.name?.trim()) {
    errors.push({ field: "name", message: "Attendee name is required" })
  } else if (data.name.length > 100) {
    errors.push({ field: "name", message: "Name must be less than 100 characters" })
  }

  if (!data.email?.trim()) {
    errors.push({ field: "email", message: "Email address is required" })
  } else if (!validateEmail(data.email)) {
    errors.push({ field: "email", message: "Please enter a valid email address" })
  }

  if (!data.event_id || data.event_id <= 0) {
    errors.push({ field: "event_id", message: "Valid event ID is required" })
  }

  return errors
}
