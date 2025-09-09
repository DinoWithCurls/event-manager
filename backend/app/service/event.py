from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.models.event import Event
from app.schemas.event import EventCreate, EventRead
from app.schemas.attendee import AttendeeRead
from sqlalchemy.orm import selectinload


async def create_event(db: AsyncSession, event: EventCreate):
    db_event = Event(**event.dict())
    db.add(db_event)
    await db.commit()
    await db.refresh(db_event)

    # ✅ Manually fetch with attendees preloaded
    result = await db.execute(
        select(Event)
        .options(selectinload(Event.attendees))
        .where(Event.id == db_event.id)
    )
    event_with_attendees = result.scalars().first()

    # ✅ Build Pydantic schema manually (no lazy loading later)
    return EventRead(
        id=event_with_attendees.id,
        name=event_with_attendees.name,
        start_time=event_with_attendees.start_time,
        end_time=event_with_attendees.end_time,
        location=event_with_attendees.location,
        max_capacity=event_with_attendees.max_capacity,
        attendees=[
            AttendeeRead(
                id=a.id,
                name=a.name,
                email=a.email,
                event_id=a.event_id
            )
            for a in event_with_attendees.attendees
        ]
    )

async def get_events(db: AsyncSession):
    result = await db.execute(
        select(Event).options(selectinload(Event.attendees))
    )
    return result.scalars().all()

# Get one Event (with attendees preloaded)
async def get_event(db: AsyncSession, event_id: int):
    result = await db.execute(
        select(Event)
        .options(selectinload(Event.attendees))
        .where(Event.id == event_id)
    )
    return result.scalars().first()
