from pydantic import BaseModel
from typing import Optional, List

class UserRegister(BaseModel):
    name: str
    email: str
    password: str
    phone: Optional[str] = None
    role: Optional[str] = "student"

class UserLogin(BaseModel):
    email: str
    password: str

class UserResponse(BaseModel):
    uid: str
    name: str
    email: str
    role: str
    phone: Optional[str] = None

    class Config:
        from_attributes = True

class StudentCreate(BaseModel):
    name: str
    email: Optional[str] = None
    phone: Optional[str] = None
    batch: str
    course: str
    fee: float
    paid: float = 0.0
    messEnrollment: bool = False
    gender: Optional[str] = "Male"

class PaymentCreate(BaseModel):
    studentId: Optional[str] = None
    studentName: str
    courseName: Optional[str] = None
    amount: float
    gateway: Optional[str] = "UPI / Razorpay"

class CourseCreate(BaseModel):
    name: str
    fee: float
    duration: str
    description: str

class NoticeCreate(BaseModel):
    title: str
    content: str
    priority: Optional[str] = "Normal"
