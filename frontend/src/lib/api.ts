import type { Event, Attendee, CreateEventData, CreateAttendeeData } from "./types"

const API_BASE_URL = "http://localhost:8000"

export async function fetchEvents(): Promise<Event[]> {
  const response = await fetch(`${API_BASE_URL}/events`)
  if (!response.ok) {
    throw new Error("Failed to fetch events")
  }
  return response.json()
}

export async function createEvent(data: CreateEventData): Promise<Event> {
  const response = await fetch(`${API_BASE_URL}/events`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.detail || "Failed to create event")
  }
  return response.json()
}

export async function fetchEventAttendees(eventId: number): Promise<Attendee[]> {
  const response = await fetch(`${API_BASE_URL}/events/${eventId}/attendees`)
  if (!response.ok) {
    throw new Error("Failed to fetch attendees")
  }
  return response.json()
}

export async function registerAttendee(eventId: number, data: CreateAttendeeData): Promise<Attendee> {
  const response = await fetch(`${API_BASE_URL}/events/${eventId}/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.detail || "Failed to register attendee")
  }
  return response.json()
}
