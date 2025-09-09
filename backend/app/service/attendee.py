from fastapi import HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload
from app.models.event import Event
from app.models.attendee import Attendee
from app.schemas.attendee import AttendeeCreate, AttendeeRead

async def register_attendee(db: AsyncSession, event_id: int, attendee: AttendeeCreate):
    result = await db.execute(
        select(Event)
        .options(selectinload(Event.attendees))
        .where(Event.id == event_id)
    )
    event = result.scalars().first()

    if not event:
        raise HTTPException(status_code=404, detail="Event not found")

    if len(event.attendees) >= event.max_capacity:
        raise HTTPException(status_code=400, detail="Event is at full capacity")

    if any(existing.email == attendee.email for existing in event.attendees):
        raise HTTPException(status_code=400, detail="Attendee already registered")

    db_attendee = Attendee(event_id=event_id, **attendee.dict())
    db.add(db_attendee)
    await db.commit()
    await db.refresh(db_attendee)

    return AttendeeRead(
        id=db_attendee.id,
        name=db_attendee.name,
        email=db_attendee.email,
        event_id=db_attendee.event_id
    )

async def get_attendees(db: AsyncSession, event_id: int):
    result = await db.execute(select(Attendee).filter(Attendee.event_id == event_id))
    return result.scalars().all()