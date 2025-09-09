from pydantic import BaseModel

class AttendeeBase(BaseModel):
    name: str
    email: str

class AttendeeCreate(AttendeeBase):
    pass

class AttendeeOut(AttendeeBase):
    id: int
    class Config:
        from_attributes = True   # instead of orm_mode

class AttendeeRead(AttendeeBase):
    id: int
    event_id: int

    class Config:
        from_attributes = True