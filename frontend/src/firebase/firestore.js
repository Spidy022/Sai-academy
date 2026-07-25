import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy, 
  where,
  serverTimestamp 
} from "firebase/firestore";
import { db } from "./config";

// --- STUDENTS SERVICE ---
export const getStudents = async () => {
  try {
    const q = query(collection(db, "students"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (err) {
    console.error("Error fetching students:", err);
    return [];
  }
};

export const saveStudent = async (studentData, id = null) => {
  const totalDue = Number(studentData.fee || 0) + (studentData.messEnrollment ? 2800 : 0);
  const currentPaid = Number(studentData.paid || 0);
  const newBalance = totalDue - currentPaid;
  
  const data = {
    ...studentData,
    messFee: studentData.messEnrollment ? 2800 : 0,
    balance: newBalance,
    feeStatus: newBalance <= 0 ? "PAID" : "PENDING",
    updatedAt: Date.now()
  };
  if (id) {
    const docRef = doc(db, "students", id);
    await updateDoc(docRef, data);
    return { id, ...data };
  } else {
    const docRef = await addDoc(collection(db, "students"), {
      ...data,
      id: "STU_" + Math.floor(10000 + Math.random() * 90000),
      createdAt: Date.now(),
      attendancePercentage: 92.5
    });
    return { id: docRef.id, ...data };
  }
};

export const deleteStudent = async (id) => {
  await deleteDoc(doc(db, "students", id));
};

// --- PAYMENTS SERVICE ---
export const getPayments = async () => {
  try {
    const q = query(collection(db, "payments"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (err) {
    console.error("Error fetching payments:", err);
    return [];
  }
};

export const recordPayment = async (paymentData) => {
  const newReceiptNo = "SAI-" + new Date().getFullYear() + "-" + Math.floor(1000 + Math.random() * 9000);
  const docRef = await addDoc(collection(db, "payments"), {
    ...paymentData,
    receiptNumber: newReceiptNo,
    paymentId: "PAY_" + Math.random().toString(36).substring(2, 9).toUpperCase(),
    paidAt: Date.now(),
    status: "SUCCESS",
    verified: true,
    gateway: "Razorpay"
  });
  
  // Simultaneously update Student's paid and balance amounts if studentId exists
  if (paymentData.studentId && paymentData.studentDocId) {
    try {
      const stuRef = doc(db, "students", paymentData.studentDocId);
      const stuSnap = await getDoc(stuRef);
      if (stuSnap.exists()) {
        const currentPaid = Number(stuSnap.data().paid || 0) + Number(paymentData.amount || 0);
        const newBalance = Number(stuSnap.data().fee || 0) - currentPaid;
        await updateDoc(stuRef, {
          paid: currentPaid,
          balance: newBalance,
          feeStatus: newBalance <= 0 ? "PAID" : currentPaid > 0 ? "PARTIAL" : "PENDING"
        });
      }
    } catch (e) {
      console.warn("Could not automatically update student fee balance:", e);
    }
  }
  return { id: docRef.id, receiptNumber: newReceiptNo, ...paymentData };
};

// --- COURSES SERVICE ---
export const getCourses = async () => {
  try {
    const snapshot = await getDocs(collection(db, "courses"));
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (err) {
    console.error("Error fetching courses:", err);
    return [];
  }
};

export const saveCourse = async (courseData) => {
  const docRef = await addDoc(collection(db, "courses"), {
    ...courseData,
    active: true,
    createdAt: Date.now()
  });
  return { id: docRef.id, ...courseData };
};

export const deleteCourse = async (id) => {
  await deleteDoc(doc(db, "courses", id));
};

export const updateCourse = async (id, courseData) => {
  const docRef = doc(db, "courses", id);
  await updateDoc(docRef, { ...courseData, updatedAt: Date.now() });
};

// --- BOOKS & STUDY MATERIALS SERVICE ---
export const getBooks = async () => {
  try {
    const snapshot = await getDocs(collection(db, "books"));
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (err) {
    console.error("Error fetching books:", err);
    return [];
  }
};

export const saveBook = async (bookData) => {
  const docRef = await addDoc(collection(db, "books"), {
    ...bookData,
    author: "SAI Police Academy Faculty",
    downloadsCount: Math.floor(Math.random() * 150) + 20,
    fileSize: "4.2 MB",
    createdAt: Date.now()
  });
  return { id: docRef.id, ...bookData };
};

export const deleteBook = async (id) => {
  await deleteDoc(doc(db, "books", id));
};

export const updateBook = async (id, bookData) => {
  const docRef = doc(db, "books", id);
  await updateDoc(docRef, { ...bookData, updatedAt: Date.now() });
};

// --- NOTICES SERVICE ---
export const getNotices = async () => {
  try {
    const snapshot = await getDocs(collection(db, "notices"));
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })).sort((a, b) => b.createdAt - a.createdAt);
  } catch (err) {
    console.error("Error fetching notices:", err);
    return [];
  }
};

export const createNotice = async (title, content, priority = "High") => {
  const docRef = await addDoc(collection(db, "notices"), {
    title,
    content,
    priority,
    author: "Academy Director",
    date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    createdAt: Date.now()
  });
  return { id: docRef.id, title, content };
};

// --- ATTENDANCE SERVICE ---
export const getAttendanceRecords = async () => {
  try {
    const snapshot = await getDocs(collection(db, "attendance"));
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (err) {
    console.error("Error fetching attendance:", err);
    return [];
  }
};

export const recordBatchAttendance = async (batch, date, studentStatusArray) => {
  const promises = studentStatusArray.map((item) => {
    return addDoc(collection(db, "attendance"), {
      studentId: item.studentId,
      studentName: item.studentName,
      batch,
      date,
      month: date.substring(0, 7),
      status: item.status,
      remarks: "Automated web classroom log",
      recordedAt: Date.now()
    });
  });
  await Promise.all(promises);
};

// --- DEMO DATA SEEDER ---
export const seedDemoData = async () => {
  console.log("Seeding Demo Data for Sai Police Academy...");
  
  // Seed Courses
  const sampleCourses = [
    { name: "Police Sub-Inspector Coaching (SI)", fee: 35000, duration: "6 Months", description: "Comprehensive coaching for State Police SI Preliminary & Main examination with physical training." },
    { name: "Constable Direct Recruitment Batch", fee: 22000, duration: "4 Months", description: "Specialized batch focusing on general aptitude, reasoning, and local penal codes." },
    { name: "Executive DSP Foundation Track", fee: 55000, duration: "1 Year", description: "Advanced mentorship program for upper-tier civil services and police administration." }
  ];
  for (const c of sampleCourses) {
    await addDoc(collection(db, "courses"), { ...c, active: true, createdAt: Date.now() });
  }

  // Seed Students
  const sampleStudents = [
    { name: "Vikram Goutham", rollNumber: "SAI-2026-101", phone: "+91 98450 12345", email: "vikram.g@gmail.com", batch: "SI Police Batch A", course: "Police Sub-Inspector Coaching (SI)", fee: 35000, paid: 35000, balance: 0, feeStatus: "PAID", gender: "Male", joinDate: "15 Jan 2026", attendancePercentage: 96.0 },
    { name: "Ananya S. Rao", rollNumber: "SAI-2026-102", phone: "+91 97412 89012", email: "ananya.rao@gmail.com", batch: "SI Police Batch A", course: "Police Sub-Inspector Coaching (SI)", fee: 35000, paid: 20000, balance: 15000, feeStatus: "PARTIAL", gender: "Female", joinDate: "18 Jan 2026", attendancePercentage: 89.5 },
    { name: "Karthik Rajan", rollNumber: "SAI-2026-103", phone: "+91 91234 56789", email: "karthik.r@yahoo.com", batch: "Constable Direct Batch", course: "Constable Direct Recruitment Batch", fee: 22000, paid: 5000, balance: 17000, feeStatus: "PARTIAL", gender: "Male", joinDate: "01 Feb 2026", attendancePercentage: 91.0 },
    { name: "Deepa Krishnan", rollNumber: "SAI-2026-104", phone: "+91 94455 66778", email: "deepa.k@outlook.com", batch: "Executive DSP Track", course: "Executive DSP Foundation Track", fee: 55000, paid: 0, balance: 55000, feeStatus: "OVERDUE", gender: "Female", joinDate: "05 Feb 2026", attendancePercentage: 84.0 },
    { name: "Rohit Verma", rollNumber: "SAI-2026-105", phone: "+91 98877 66554", email: "rohit.v@gmail.com", batch: "SI Police Batch A", course: "Police Sub-Inspector Coaching (SI)", fee: 35000, paid: 35000, balance: 0, feeStatus: "PAID", gender: "Male", joinDate: "10 Jan 2026", attendancePercentage: 98.2 }
  ];
  for (const s of sampleStudents) {
    await addDoc(collection(db, "students"), { ...s, createdAt: Date.now() });
  }

  // Seed Books
  const sampleBooks = [
    { title: "Indian Penal Code (IPC) Complete Commentary", category: "Law & Policing", pages: 420, fileSize: "8.4 MB", description: "Comprehensive coverage of IPC sections relevant for SI and Inspector grade competitive exams." },
    { title: "General Intelligence & Spatial Reasoning", category: "Aptitude & Reasoning", pages: 280, fileSize: "5.1 MB", description: "Practice sets and time-saving heuristics for police entrance examinations." },
    { title: "Current Affairs & Security Challenges 2026", category: "General Knowledge", pages: 150, fileSize: "3.2 MB", description: "Curated national security and local administration developments." }
  ];
  for (const b of sampleBooks) {
    await addDoc(collection(db, "books"), { ...b, author: "SAI Police Academy Faculty", downloadsCount: 84, createdAt: Date.now() });
  }

  // Seed Notices
  const sampleNotices = [
    { title: "Physical Efficiency Test (PET) Schedule Announced", content: "All candidates enrolled in SI Police Batch A are requested to assemble at the Olympic Stadium ground at 06:00 AM this Saturday in proper sportswear.", priority: "Urgent", date: "Jul 25, 2026" },
    { title: "Mock Preliminary Exam Results Released", content: "Top 50 scorers will receive personalized mentorship sessions with retired Assistant Commissioner of Police.", priority: "Normal", date: "Jul 22, 2026" }
  ];
  for (const n of sampleNotices) {
    await addDoc(collection(db, "notices"), { ...n, author: "Academy Director", createdAt: Date.now() });
  }

  return true;
};
