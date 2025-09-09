from pydantic import BaseModel
from datetime import datetime
from typing import List
from app.schemas.attendee import AttendeeOut, AttendeeRead

class EventBase(BaseModel):
    name: str
    start_time: datetime
    end_time: datetime
    location: str
    max_capacity: int

class EventCreate(EventBase):
    pass

class EventOut(EventBase):
    id: int
    attendees: List[AttendeeOut] = []
    class Config:
        from_attributes = True   # instead of orm_mode

class EventRead(EventBase):
    id: int
    attendees: List[AttendeeRead] = []  # ✅ Preloaded, won’t lazy load

    class Config:
        from_attributes = True