from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.config.db import get_db
from app.schemas.event import EventCreate, EventOut
from app.schemas.attendee import AttendeeCreate, AttendeeOut
from app.service import event as eventService
from app.service import attendee as attendeeService
from typing import List

router = APIRouter()

@router.post("/events", response_model=EventOut)
async def create_event(event: EventCreate, db: AsyncSession = Depends(get_db)):
    return await eventService.create_event(db, event)

@router.get("/events", response_model=List[EventOut])
async def get_events(db: AsyncSession = Depends(get_db)):
    return await eventService.get_events(db)

@router.post("/events/{event_id}/register", response_model=AttendeeOut)
async def register_attendee(event_id: int, attendee: AttendeeCreate, db: AsyncSession = Depends(get_db)):
    result = await attendeeService.register_attendee(db, event_id, attendee)
    if result is None:
        raise HTTPException(status_code=404, detail="Event not found")
    if isinstance(result, str):
        raise HTTPException(status_code=400, detail=result)
    return result

@router.get("/events/{event_id}/attendees", response_model=List[AttendeeOut])
async def get_attendees(event_id: int, db: AsyncSession = Depends(get_db)):
    return await attendeeService.get_attendees(db, event_id)