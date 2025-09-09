export interface Event {
  id: number
  name: string
  start_time: string
  end_time: string
  location: string
  max_capacity: number
}

export interface CreateEventData {
  name: string
  start_time: string
  end_time: string
  location: string
  max_capacity: number
}

export interface Attendee {
  id: number
  event_id: number
  name: string
  email: string
}

export interface CreateAttendeeData {
  name: string
  email: string
  event_id: number
}
export interface ApiResponse<T> {
  data?: T
  error?: string
  message?: string
}

export interface ValidationError {
  field: string
  message: string
}
