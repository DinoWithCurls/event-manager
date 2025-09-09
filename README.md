# Mini Event Management System

This is a full stack assignment provided by Omnify. It is to be a simplified event management system, where the user can create events, register attendees, and view all the records.

### Frontend
Next JS + ShadCN

### Backend
FastAPI + PostgreSQL + SQLAlchemy

## Setup

1. Install Docker Desktop
2. Run ```docker-compose up --build```
3. Get creating events!

## APIs

```GET /events``` - Will return all the events
```GET /events/{id}/attendees``` - Will return all the attendees for a particular event
```POST /events``` - Create a new event
```POST /events/{id}/register``` - Add a new attendee for the event

To test out the APIs, import the ```Event Management System - Backend.postman_collection.json``` into Postman. 