"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeftIcon, PlusIcon, CalendarIcon, MapPinIcon, UsersIcon } from "lucide-react"
import { toast } from "sonner"
import { fetchEvents, fetchEventAttendees, registerAttendee } from "@/lib/api"
import type { Event, Attendee, CreateAttendeeData } from "@/lib/types"

interface AttendeesViewProps {
  eventId: number
  onBack: () => void
}

export function AttendeesView({ eventId, onBack }: AttendeesViewProps) {
  const [event, setEvent] = useState<Event | null>(null)
  const [attendees, setAttendees] = useState<Attendee[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showRegisterDialog, setShowRegisterDialog] = useState(false)
  const [registrationData, setRegistrationData] = useState<CreateAttendeeData>({
    name: "",
    email: "",
    event_id: 0
  })
  const [isRegistering, setIsRegistering] = useState(false)

  const loadData = async () => {
    try {
      setIsLoading(true)
      const [eventsData, attendeesData] = await Promise.all([fetchEvents(), fetchEventAttendees(eventId)])
      const eventData = eventsData.find((e) => e.id === eventId)
      setEvent(eventData || null)
      setAttendees(attendeesData as Attendee[])
    } catch (error) {
      console.error(error)
      toast.error("Failed to load event data")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [eventId])

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsRegistering(true)
    try {
      await registerAttendee(eventId, registrationData)
      setShowRegisterDialog(false)
      setRegistrationData({ name: "", email: "", event_id: eventId })
      loadData() // Refresh attendees list
      toast.success("Attendee registered successfully")
    } catch (error: any) {
      toast.error(error.message || "Registration failed")
    } finally {
      setIsRegistering(false)
    }
  }

  const formatDateTime = (dateTime: string) => {
    return new Date(dateTime).toLocaleString()
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div>Loading event data...</div>
      </div>
    )
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Event not found</p>
          <Button onClick={onBack}>
            <ArrowLeftIcon className="h-4 w-4 mr-2" />
            Back to Events
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={onBack}>
              <ArrowLeftIcon className="h-4 w-4 mr-2" />
              Back to Events
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-primary">Event Attendees</h1>
              <p className="text-muted-foreground mt-1">Manage attendees for this event</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-6">
        {/* Event Overview Card */}
        <Card className="bg-muted">
          <CardHeader>
            <CardTitle>{event.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="font-medium">Start</p>
                  <p className="text-muted-foreground">{formatDateTime(event.start_time)}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="font-medium">End</p>
                  <p className="text-muted-foreground">{formatDateTime(event.end_time)}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <MapPinIcon className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="font-medium">Location</p>
                  <p className="text-muted-foreground">{event.location}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <UsersIcon className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="font-medium">Capacity</p>
                  <p className="text-muted-foreground">
                    {attendees.length} / {event.max_capacity}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Attendees Table */}
        <Card className="bg-muted">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Attendees ({attendees.length})</CardTitle>
              <Button onClick={() => setShowRegisterDialog(true)}>
                <PlusIcon className="h-4 w-4 mr-2" />
                Register Attendee
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {attendees.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">No attendees registered yet.</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {attendees.map((attendee) => (
                    <TableRow key={attendee.id}>
                      <TableCell className="font-medium">{attendee.name}</TableCell>
                      <TableCell>{attendee.email}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </main>

      {/* Registration Dialog */}
      <Dialog open={showRegisterDialog} onOpenChange={setShowRegisterDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Register New Attendee</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                type="text"
                placeholder="Enter attendee name"
                value={registrationData.name}
                onChange={(e) => setRegistrationData((prev) => ({ ...prev, name: e.target.value }))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter attendee email"
                value={registrationData.email}
                onChange={(e) => setRegistrationData((prev) => ({ ...prev, email: e.target.value }))}
                required
              />
            </div>
            <div className="flex gap-2 pt-4">
              <Button type="submit" disabled={isRegistering} className="flex-1">
                {isRegistering ? "Registering..." : "Register"}
              </Button>
              <Button type="button" variant="outline" onClick={() => setShowRegisterDialog(false)}>
                Cancel
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
