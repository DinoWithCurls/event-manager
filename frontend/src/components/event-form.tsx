"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { CreateEventData, ValidationError } from "@/lib/types"
import { CalendarIcon, MapPinIcon, UsersIcon } from "lucide-react"
import { validateEventData } from "@/lib/validators"
import { getFieldError } from "@/lib/helpers"

interface EventFormProps {
  onSubmit: (data: CreateEventData) => Promise<void>
  onCancel?: () => void
}

export function EventForm({ onSubmit, onCancel }: EventFormProps) {
  const [formData, setFormData] = useState<CreateEventData>({
    name: "",
    start_time: "",
    end_time: "",
    location: "",
    max_capacity: 50,
  })
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<ValidationError[]>([])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const validationErrors = validateEventData(formData)
    if (validationErrors.length > 0) {
      setErrors(validationErrors)
      return
    }
    setErrors([])
    setIsLoading(true)
    try {
      await onSubmit(formData)
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (field: keyof CreateEventData, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => prev.filter((error) => error.field !== field))
  }

  const today = new Date().toISOString().slice(0, 16)

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Event Name *</Label>
        <Input
          id="name"
          type="text"
          placeholder="Enter event name"
          value={formData.name}
          onChange={(e) => handleChange("name", e.target.value)}
          required
        />
        {getFieldError("name", errors) && <p className="text-sm text-red-600">{getFieldError("name", errors)}</p>}
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="start_time" className="flex items-center gap-2">
            <CalendarIcon className="h-4 w-4" />
            Start Time *
          </Label>
          <Input
            id="start_time"
            type="datetime-local"
            value={formData.start_time}
            onChange={(e) => handleChange("start_time", e.target.value)}
            min={today}
            required
          />
          {getFieldError("start_time", errors) && <p className="text-sm text-red-600">{getFieldError("start_time", errors)}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="end_time" className="flex items-center gap-2">
            <CalendarIcon className="h-4 w-4" />
            End Time *
          </Label>
          <Input
            id="end_time"
            type="datetime-local"
            value={formData.end_time}
            onChange={(e) => handleChange("end_time", e.target.value)}
            min={formData.start_time || today}
            required
          />
        </div>
        {getFieldError("end_time", errors) && <p className="text-sm text-red-600">{getFieldError("end_time", errors)}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="location" className="flex items-center gap-2">
          <MapPinIcon className="h-4 w-4" />
          Location *
        </Label>
        <Input
          id="location"
          type="text"
          placeholder="Enter event location"
          value={formData.location}
          onChange={(e) => handleChange("location", e.target.value)}
          required
        />
        {getFieldError("location", errors) && <p className="text-sm text-red-600">{getFieldError("location", errors)}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="max_capacity" className="flex items-center gap-2">
          <UsersIcon className="h-4 w-4" />
          Max Capacity *
        </Label>
        <Input
          id="max_capacity"
          type="number"
          min="1"
          placeholder="50"
          value={formData.max_capacity}
          onChange={(e) => handleChange("max_capacity", Number.parseInt(e.target.value) || 0)}
          required
        />
        {getFieldError("max_capacity", errors) && <p className="text-sm text-red-600">{getFieldError("max_capacity", errors)}</p>}
      </div>

      <div className="flex gap-2 pt-4">
        <Button type="submit" disabled={isLoading} className="flex-1">
          {isLoading ? "Creating..." : "Create Event"}
        </Button>
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  )
}
