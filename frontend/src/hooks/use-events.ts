"use client"

import { useState, useEffect } from "react"
import type { Event, CreateEventData, ApiResponse } from "@/lib/types"

export function useEvents() {
  const [events, setEvents] = useState<Event[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchEvents = async () => {
    try {
      setIsLoading(true)
      setError(null)

      const response = await fetch("/api/events")
      const result: ApiResponse<Event[]> = await response.json()

      if (!result.error && result.data) {
        setEvents(result.data)
      } else {
        setError(result.error || "Failed to fetch events")
      }
    } catch (err) {
      setError("Network error occurred")
      console.error("Error fetching events:", err)
    } finally {
      setIsLoading(false)
    }
  }

  const createEvent = async (data: CreateEventData): Promise<boolean> => {
    try {
      const response = await fetch("/api/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      const result: ApiResponse<Event> = await response.json()

      if (!result.error && result.data) {
        setEvents((prev) => [result.data!, ...prev])
        return true
      } else {
        setError(result.error || "Failed to create event")
        return false
      }
    } catch (err) {
      setError("Network error occurred")
      console.error("Error creating event:", err)
      return false
    }
  }

  useEffect(() => {
    fetchEvents()
  }, [])

  return {
    events,
    isLoading,
    error,
    createEvent,
    refetch: fetchEvents,
  }
}
