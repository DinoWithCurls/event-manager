"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { PlusIcon, UsersIcon, MapPinIcon } from "lucide-react"
import { toast } from "sonner"
import { fetchEvents, createEvent } from "@/lib/api"
import type { Event, CreateEventData } from "@/lib/types"
import { EventForm } from "@/components/event-form"
import { AttendeesView } from "@/components/attendees-view"

export default function HomePage() {
  const [events, setEvents] = useState<Event[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [selectedEventId, setSelectedEventId] = useState<number | null>(null)

  const loadEvents = async () => {
    try {
      setIsLoading(true)
      const data = await fetchEvents()
      setEvents(data as Event[])
    } catch (error) {
      console.error(error);
      toast.error("Failed to load events")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadEvents()
  }, [])

  const handleCreateEvent = async (data: CreateEventData) => {
    try {
      await createEvent(data)
      setShowCreateDialog(false)
      loadEvents() // Refresh the events list
      toast.success("Event created successfully")
    } catch (error) {
      console.error(error);
      toast.error("Failed to create event")
    }
  }

  const formatDateTime = (dateTime: string) => {
    return new Date(dateTime).toLocaleString()
  }

  if (selectedEventId) {
    return <AttendeesView eventId={selectedEventId} onBack={() => setSelectedEventId(null)} />
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-primary">Event Manager</h1>
              <p className="text-muted-foreground mt-1">Manage your events</p>
            </div>
            <Button onClick={() => setShowCreateDialog(true)}>
              <PlusIcon className="h-4 w-4 mr-2" />
              Create Event
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Card className="bg-muted">
          <CardHeader>
            <CardTitle>Events</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8">Loading events...</div>
            ) : events.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">No events found. Create your first event!</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Start Time</TableHead>
                    <TableHead>End Time</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Capacity</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {events.map((event) => (
                    <TableRow key={event.id}>
                      <TableCell className="font-medium">{event.name}</TableCell>
                      <TableCell>{formatDateTime(event.start_time)}</TableCell>
                      <TableCell>{formatDateTime(event.end_time)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <MapPinIcon className="h-4 w-4" />
                          {event.location}
                        </div>
                      </TableCell>
                      <TableCell>{event.max_capacity}</TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm" onClick={() => setSelectedEventId(event.id)}>
                          <UsersIcon className="h-4 w-4 mr-1" />
                          View Attendees
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </main>

      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Event</DialogTitle>
          </DialogHeader>
          <EventForm onSubmit={handleCreateEvent} onCancel={() => setShowCreateDialog(false)} />
        </DialogContent>
      </Dialog>
    </div>
  )
}
