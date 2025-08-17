from pydantic import BaseModel, Field
from typing import Optional, Literal
from datetime import datetime
from bson import ObjectId

# Custom ObjectId type
class PyObjectId(ObjectId):
    @classmethod
    def __get_validators__(cls):
        yield cls.validate
    
    @classmethod
    def validate(cls, v):
        if not ObjectId.is_valid(v):
            raise ValueError("Invalid ObjectId")
        return ObjectId(v)

class AppointmentSchema(BaseModel):
    name: str = Field(..., min_length=1)
    age: int
    date: datetime
    therapistId: PyObjectId
    userId: Optional[PyObjectId] = None
    status: Literal["PENDING", "CANCEL", "SUCCESS"] = "PENDING"
    appointmentId: str
    createdAt: datetime = Field(default_factory=datetime.utcnow)
    updatedAt: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        json_encoders = {ObjectId: str}
        populate_by_name = True
