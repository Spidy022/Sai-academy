import time
import random
from typing import List, Optional
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from backend.config import settings
from backend.database import get_db, engine, Base
from backend import models, schemas
from backend.seed import seed_database

# Create tables and auto-seed database on server start
Base.metadata.create_all(bind=engine)
try:
    seed_database()
except Exception as e:
    print(f"Auto-seed notification: {e}")

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    openapi_url="/openapi.json"
)

# Enable CORS for React frontend (Vite port 5173 / localhost)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {
        "app": "Sai Police Academy REST API",
        "status": "Online",
        "database": "PostgreSQL / SQLite Active",
        "docs": "/docs"
    }

# --- AUTHENTICATION ENDPOINTS ---
@app.post(f"{settings.API_PREFIX}/auth/register")
def register_user(user: schemas.UserRegister, db: Session = Depends(get_db)):
    existing = db.query(models.User).filter(models.User.email == user.email).first()
    if existing:
        return {
            "uid": existing.uid,
            "name": existing.name,
            "email": existing.email,
            "role": existing.role,
            "message": "User already registered"
        }
    
    new_uid = "USR_" + "".join([str(random.randint(0, 9)) for _ in range(6)])
    db_user = models.User(
        uid=new_uid,
        name=user.name,
        email=user.email,
        phone=user.phone,
        hashed_password=user.password,
        role=user.role or "student",
        status="active"
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return {
        "uid": db_user.uid,
        "name": db_user.name,
        "email": db_user.email,
        "role": db_user.role,
        "phone": db_user.phone
    }

@app.post(f"{settings.API_PREFIX}/auth/login")
def login_user(creds: schemas.UserLogin, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == creds.email).first()
    if not user:
        if creds.email in ["admin@test.com", "student@test.com"]:
            role = "admin" if creds.email == "admin@test.com" else "student"
            name = "Academy Director" if role == "admin" else "Demo Student"
            reg_user = register_user(schemas.UserRegister(name=name, email=creds.email, password=creds.password, role=role), db)
            return reg_user
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid email or password")
    
    return {
        "uid": user.uid,
        "name": user.name,
        "email": user.email,
        "role": user.role,
        "phone": user.phone
    }

# --- STUDENTS ENDPOINTS ---
@app.get(f"{settings.API_PREFIX}/students")
def get_students(batch: Optional[str] = None, db: Session = Depends(get_db)):
    query = db.query(models.Student)
    if batch and batch != "All":
        query = query.filter(models.Student.batch == batch)
    students = query.all()
    return [
        {
            "id": s.student_id,
            "docId": s.id,
            "name": s.name,
            "email": s.email,
            "phone": s.phone,
            "batch": s.batch,
            "course": s.course,
            "fee": s.fee,
            "paid": s.paid,
            "balance": s.balance,
            "feeStatus": s.fee_status,
            "messEnrollment": s.mess_enrollment,
            "messFee": s.mess_fee,
            "gender": s.gender,
            "joinDate": s.join_date,
            "attendancePercentage": s.attendance_percentage
        } for s in students
    ]

@app.post(f"{settings.API_PREFIX}/students")
def create_student(data: schemas.StudentCreate, db: Session = Depends(get_db)):
    mess_fee = 2800.0 if data.messEnrollment else 0.0
    total_fee = data.fee + mess_fee
    balance = total_fee - data.paid
    fee_status = "PAID" if balance <= 0 else ("PARTIAL" if data.paid > 0 else "PENDING")
    
    new_id = "SAI-2026-" + str(random.randint(100, 999))
    db_student = models.Student(
        student_id=new_id,
        name=data.name,
        email=data.email,
        phone=data.phone,
        batch=data.batch,
        course=data.course,
        fee=total_fee,
        paid=data.paid,
        balance=balance,
        fee_status=fee_status,
        mess_enrollment=data.messEnrollment,
        mess_fee=mess_fee,
        gender=data.gender or "Male",
        join_date="Today",
        attendance_percentage=95.0
    )
    db.add(db_student)
    db.commit()
    db.refresh(db_student)
    return {"id": db_student.student_id, "message": "Student created successfully"}

@app.delete(f"{settings.API_PREFIX}/students/{{student_id}}")
def delete_student(student_id: str, db: Session = Depends(get_db)):
    db.query(models.Student).filter(models.Student.student_id == student_id).delete()
    db.commit()
    return {"message": "Student deleted"}

# --- PAYMENTS ENDPOINTS ---
@app.get(f"{settings.API_PREFIX}/payments")
def get_payments(db: Session = Depends(get_db)):
    payments = db.query(models.Payment).order_by(models.Payment.id.desc()).all()
    return [
        {
            "id": p.payment_id,
            "receiptNumber": p.receipt_number,
            "studentId": p.student_id,
            "studentName": p.student_name,
            "courseName": p.course_name,
            "amount": p.amount,
            "gateway": p.gateway,
            "status": p.status,
            "paidAt": p.paid_at
        } for p in payments
    ]

@app.post(f"{settings.API_PREFIX}/payments")
def create_payment(payment: schemas.PaymentCreate, db: Session = Depends(get_db)):
    receipt_no = "SAI-2026-" + str(random.randint(1000, 9999))
    pay_id = "PAY_" + "".join([random.choice("0123456789ABCDEF") for _ in range(6)])
    
    db_payment = models.Payment(
        payment_id=pay_id,
        receipt_number=receipt_no,
        student_id=payment.studentId,
        student_name=payment.studentName,
        course_name=payment.courseName or "Academy Tuition & Mess Fee",
        amount=payment.amount,
        gateway=payment.gateway or "UPI",
        status="SUCCESS"
    )
    db.add(db_payment)
    
    if payment.studentId:
        student = db.query(models.Student).filter(models.Student.student_id == payment.studentId).first()
        if student:
            student.paid += payment.amount
            student.balance = max(0.0, student.fee - student.paid)
            student.fee_status = "PAID" if student.balance <= 0 else "PARTIAL"
    
    db.commit()
    return {
        "id": pay_id,
        "receiptNumber": receipt_no,
        "amount": payment.amount,
        "status": "SUCCESS"
    }

# --- COURSES & BOOKS ENDPOINTS ---
@app.get(f"{settings.API_PREFIX}/courses")
def get_courses(db: Session = Depends(get_db)):
    courses = db.query(models.Course).all()
    return [{"id": c.id, "name": c.name, "fee": c.fee, "duration": c.duration, "description": c.description} for c in courses]

@app.get(f"{settings.API_PREFIX}/books")
def get_books(db: Session = Depends(get_db)):
    books = db.query(models.Book).all()
    return [{"id": b.id, "title": b.title, "category": b.category, "author": b.author, "pages": b.pages, "fileSize": b.file_size, "downloadsCount": b.downloads_count, "description": b.description} for b in books]

# --- NOTICES ENDPOINTS ---
@app.get(f"{settings.API_PREFIX}/notices")
def get_notices(db: Session = Depends(get_db)):
    notices = db.query(models.Notice).order_by(models.Notice.id.desc()).all()
    return [{"id": n.id, "title": n.title, "content": n.content, "priority": n.priority, "date": n.date} for n in notices]

# --- QUIZ ENDPOINTS ---
@app.get(f"{settings.API_PREFIX}/quizzes")
def get_quizzes(db: Session = Depends(get_db)):
    quizzes = db.query(models.Quiz).all()
    return [
        {
            "id": q.id,
            "subject": q.subject,
            "question": q.question,
            "options": [q.option_a, q.option_b, q.option_c, q.option_d],
            "correctOption": q.correct_option,
            "explanation": q.explanation
        } for q in quizzes
    ]
