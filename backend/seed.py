import sys
import os
import time

# Ensure backend package import path works
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from backend.database import Base, engine, SessionLocal
from backend import models

def seed_database():
    print("Initializing Database Tables & Seeding Initial Data for Sai Police Academy...")
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    try:
        # 1. Seed Initial Admin & Student Accounts if empty
        if db.query(models.User).count() == 0:
            print("Seeding Users...")
            admin_user = models.User(
                uid="USR_ADMIN_001",
                name="Academy Director",
                email="admin@test.com",
                hashed_password="password", # In production use passlib/bcrypt
                role="admin",
                status="active"
            )
            student_user = models.User(
                uid="USR_STU_001",
                name="Vikram Goutham",
                email="student@test.com",
                hashed_password="password",
                role="student",
                status="active"
            )
            db.add_all([admin_user, student_user])

        # 2. Seed Courses if empty
        if db.query(models.Course).count() == 0:
            print("Seeding Courses...")
            c1 = models.Course(name="Police Sub-Inspector Coaching (SI)", fee=35000, duration="6 Months", description="Comprehensive coaching for State Police SI Preliminary & Main examination with physical training.")
            c2 = models.Course(name="Constable Direct Recruitment Batch", fee=22000, duration="4 Months", description="Specialized batch focusing on general aptitude, reasoning, and local penal codes.")
            c3 = models.Course(name="Executive DSP Foundation Track", fee=55000, duration="1 Year", description="Advanced mentorship program for upper-tier civil services and police administration.")
            db.add_all([c1, c2, c3])

        # 3. Seed Students if empty
        if db.query(models.Student).count() == 0:
            print("Seeding Students...")
            students_data = [
                models.Student(student_id="SAI-2026-101", name="Vikram Goutham", phone="+91 98450 12345", email="student@test.com", batch="SI Police Batch A", course="Police Sub-Inspector Coaching (SI)", fee=35000, paid=35000, balance=0, fee_status="PAID", mess_enrollment=True, mess_fee=2800, gender="Male", join_date="15 Jan 2026", attendance_percentage=96.0),
                models.Student(student_id="SAI-2026-102", name="Ananya S. Rao", phone="+91 97412 89012", email="ananya.rao@gmail.com", batch="SI Police Batch A", course="Police Sub-Inspector Coaching (SI)", fee=35000, paid=20000, balance=15000, fee_status="PARTIAL", mess_enrollment=False, mess_fee=0, gender="Female", join_date="18 Jan 2026", attendance_percentage=89.5),
                models.Student(student_id="SAI-2026-103", name="Karthik Rajan", phone="+91 91234 56789", email="karthik.r@yahoo.com", batch="Constable Direct Batch", course="Constable Direct Recruitment Batch", fee=22000, paid=5000, balance=17000, fee_status="PARTIAL", mess_enrollment=True, mess_fee=2800, gender="Male", join_date="01 Feb 2026", attendance_percentage=91.0),
                models.Student(student_id="SAI-2026-104", name="Deepa Krishnan", phone="+91 94455 66778", email="deepa.k@outlook.com", batch="Executive DSP Track", course="Executive DSP Foundation Track", fee=55000, paid=0, balance=55000, fee_status="OVERDUE", mess_enrollment=False, mess_fee=0, gender="Female", join_date="05 Feb 2026", attendance_percentage=84.0),
                models.Student(student_id="SAI-2026-105", name="Rohit Verma", phone="+91 98877 66554", email="rohit.v@gmail.com", batch="SI Police Batch A", course="Police Sub-Inspector Coaching (SI)", fee=35000, paid=35000, balance=0, fee_status="PAID", mess_enrollment=True, mess_fee=2800, gender="Male", join_date="10 Jan 2026", attendance_percentage=98.2)
            ]
            db.add_all(students_data)

        # 4. Seed Payments if empty
        if db.query(models.Payment).count() == 0:
            print("Seeding Payment Records...")
            p1 = models.Payment(payment_id="PAY_8921A", receipt_number="SAI-2026-901", student_id="SAI-2026-101", student_name="Vikram Goutham", course_name="Police Sub-Inspector Coaching (SI)", amount=35000, status="SUCCESS")
            p2 = models.Payment(payment_id="PAY_4412B", receipt_number="SAI-2026-902", student_id="SAI-2026-102", student_name="Ananya S. Rao", course_name="Police Sub-Inspector Coaching (SI)", amount=20000, status="SUCCESS")
            db.add_all([p1, p2])

        # 5. Seed E-Books if empty
        if db.query(models.Book).count() == 0:
            print("Seeding E-Books...")
            b1 = models.Book(title="Indian Penal Code (IPC) Complete Commentary", category="Law & Policing", pages=420, file_size="8.4 MB", description="Comprehensive coverage of IPC sections relevant for SI and Inspector grade competitive exams.")
            b2 = models.Book(title="General Intelligence & Spatial Reasoning", category="Aptitude & Reasoning", pages=280, file_size="5.1 MB", description="Practice sets and time-saving heuristics for police entrance examinations.")
            b3 = models.Book(title="Current Affairs & Security Challenges 2026", category="General Knowledge", pages=150, file_size="3.2 MB", description="Curated national security and local administration developments.")
            db.add_all([b1, b2, b3])

        # 6. Seed Notices if empty
        if db.query(models.Notice).count() == 0:
            print("Seeding Academy Notices...")
            n1 = models.Notice(title="Physical Efficiency Test (PET) Schedule Announced", content="All candidates enrolled in SI Police Batch A are requested to assemble at the Olympic Stadium ground at 06:00 AM this Saturday in proper sportswear.", priority="Urgent", date="Jul 25, 2026")
            n2 = models.Notice(title="Mock Preliminary Exam Results Released", content="Top 50 scorers will receive personalized mentorship sessions with retired Assistant Commissioner of Police.", priority="Normal", date="Jul 22, 2026")
            db.add_all([n1, n2])

        # 7. Seed Quizzes if empty
        if db.query(models.Quiz).count() == 0:
            print("Seeding Interactive Quiz Question Bank...")
            q1 = models.Quiz(
                subject="Indian Penal Code & Criminal Procedure",
                question="Which Section of the Indian Penal Code (IPC) defines 'Culpable Homicide'?",
                option_a="Section 299",
                option_b="Section 300",
                option_c="Section 302",
                option_d="Section 304",
                correct_option="A",
                explanation="Section 299 of the Indian Penal Code specifies the definition of Culpable Homicide, while Section 300 defines Murder."
            )
            q2 = models.Quiz(
                subject="General Intelligence & Reasoning",
                question="If POLICE is coded as QPMJDF, what is the code for ACADEMY?",
                option_a="BDBEFNZ",
                option_b="BDBEFNZ",
                option_c="BDBEFNZ",
                option_d="BDBEFNZ",
                correct_option="A",
                explanation="Each letter is shifted forward by +1 in the alphabetical sequence: A->B, C->D, A->B, D->E, E->F, M->N, Y->Z."
            )
            q3 = models.Quiz(
                subject="General Knowledge & Security",
                question="In India, who is the head of the State Police force in a State?",
                option_a="Superintendent of Police (SP)",
                option_b="Inspector General of Police (IGP)",
                option_c="Director General of Police (DGP)",
                option_d="Assistant Commissioner of Police (ACP)",
                correct_option="C",
                explanation="The Director General of Police (DGP) is the highest-ranking police officer in an Indian state."
            )
            db.add_all([q1, q2, q3])

        db.commit()
        print("Successfully seeded all demo database records into PostgreSQL / database!")
    except Exception as e:
        db.rollback()
        print(f"Error seeding database: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    seed_database()
