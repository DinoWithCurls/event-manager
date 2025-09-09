# Mini Event Management System

This is a simplified version of an event management system, where the user can create events, register attendees, and view all the records.

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

## Database schema
The database looks like this:

Table: ```events```
| field       | type           |
|-------------|----------------|
|id           |int, primary key|
|name         |str             |
|location     |str             |
|start_time   |datetime        |
|end_time     |datetime        |
|max_capacity |int             |


Table: ```attendees```
| field       | type           |
|-------------|----------------|
|id           |int, primary key|
|name         |str             |
|email        |str             |
|event_id     |int, foreign key|

The dummy data seeder SQL files are in ```backend/seeds```, but they get used automatically when the ```docker-compose``` command is run.
There is no migration file, as the tables are generated and seeded everytime the docker is hard-restarted. This can be updated to persist the records, but it is not possible at the moment. 