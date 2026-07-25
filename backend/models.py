from sqlalchemy import Column, Integer, String, Float, Boolean, Text, BigInteger
from backend.database import Base
import time

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    uid = Column(String, unique=True, index=True)
    name = Column(String)
    email = Column(String, unique=True, index=True)
    phone = Column(String, nullable=True)
    hashed_password = Column(String)
    role = Column(String, default="student") # admin, student, guest
    status = Column(String, default="active")
    created_at = Column(BigInteger, default=lambda: int(time.time() * 1000))

class Student(Base):
    __tablename__ = "students"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(String, unique=True, index=True) # e.g. SAI-2026-101
    name = Column(String, index=True)
    email = Column(String, nullable=True)
    phone = Column(String, nullable=True)
    batch = Column(String)
    course = Column(String)
    fee = Column(Float, default=0.0)
    paid = Column(Float, default=0.0)
    balance = Column(Float, default=0.0)
    fee_status = Column(String, default="PENDING") # PAID, PARTIAL, OVERDUE, PENDING
    mess_enrollment = Column(Boolean, default=False)
    mess_fee = Column(Float, default=0.0)
    gender = Column(String, default="Male")
    join_date = Column(String, nullable=True)
    attendance_percentage = Column(Float, default=90.0)
    created_at = Column(BigInteger, default=lambda: int(time.time() * 1000))

class Payment(Base):
    __tablename__ = "payments"

    id = Column(Integer, primary_key=True, index=True)
    payment_id = Column(String, unique=True, index=True) # e.g. PAY_9A8B7C
    receipt_number = Column(String, unique=True, index=True) # e.g. SAI-2026-8812
    student_id = Column(String, nullable=True)
    student_name = Column(String)
    course_name = Column(String, nullable=True)
    amount = Column(Float)
    gateway = Column(String, default="UPI / Razorpay")
    status = Column(String, default="SUCCESS")
    paid_at = Column(BigInteger, default=lambda: int(time.time() * 1000))

class Course(Base):
    __tablename__ = "courses"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    fee = Column(Float)
    duration = Column(String)
    description = Column(Text)
    active = Column(Boolean, default=True)
    created_at = Column(BigInteger, default=lambda: int(time.time() * 1000))

class Book(Base):
    __tablename__ = "books"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    category = Column(String)
    author = Column(String, default="SAI Police Academy Faculty")
    pages = Column(Integer, default=250)
    file_size = Column(String, default="5.0 MB")
    downloads_count = Column(Integer, default=50)
    description = Column(Text)
    file_url = Column(String, nullable=True)
    created_at = Column(BigInteger, default=lambda: int(time.time() * 1000))

class Notice(Base):
    __tablename__ = "notices"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    content = Column(Text)
    priority = Column(String, default="Normal") # High, Urgent, Normal
    author = Column(String, default="Academy Director")
    date = Column(String)
    created_at = Column(BigInteger, default=lambda: int(time.time() * 1000))

class Quiz(Base):
    __tablename__ = "quizzes"

    id = Column(Integer, primary_key=True, index=True)
    subject = Column(String, index=True)
    question = Column(Text)
    option_a = Column(String)
    option_b = Column(String)
    option_c = Column(String)
    option_d = Column(String)
    correct_option = Column(String) # A, B, C, D
    explanation = Column(Text)
