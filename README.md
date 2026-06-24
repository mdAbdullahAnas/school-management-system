# 🎓 School Management System

A comprehensive full-stack School Management System built to streamline academic and administrative operations in educational institutions. The platform provides role-based access control for Administrators, Teachers, and Students, enabling efficient management of classes, subjects, attendance, assignments, results, notices, and user accounts.

---

## 📌 Project Overview

The School Management System is designed to digitize and automate daily school operations. It provides a centralized platform where administrators can manage academic resources, teachers can conduct academic activities, and students can access their educational information securely.

The system follows modern software engineering principles with a scalable architecture, secure authentication, and a responsive user interface.

---

## 🚀 Key Features

### 🔐 Authentication & Authorization
- Secure JWT Authentication
- Role-Based Access Control (RBAC)
- Protected Routes
- Password Encryption using BCrypt
- Login & Registration System

---

### 👨‍💼 Admin Features
- Manage Students
- Manage Teachers
- Manage Classes
- Manage Subjects
- Assign Teachers to Subjects
- Manage Attendance Records
- Manage Assignments
- Manage Student Results
- Manage Notices and Announcements
- View Dashboard Statistics
- Full System Access

---

### 👨‍🏫 Teacher Features
- View Assigned Subjects
- Manage Attendance
- Create Assignments
- Review Student Submissions
- Publish Notices
- Monitor Student Performance
- View Assigned Classes

---

### 👨‍🎓 Student Features
- View Personal Profile
- View Assigned Subjects
- Check Attendance Records
- View Assignments
- Submit Assignment Solutions
- View Academic Results
- Receive Notices
- Access Class Information

---

## 🏗️ System Architecture

```text
┌────────────────────────────┐
│     Next.js Frontend       │
│     (TypeScript)           │
└─────────────┬──────────────┘
              │ REST API
              ▼
┌────────────────────────────┐
│      NestJS Backend        │
│     (TypeScript)           │
└─────────────┬──────────────┘
              │ TypeORM
              ▼
┌────────────────────────────┐
│      PostgreSQL DB         │
│      (pgAdmin 4)           │
└────────────────────────────┘
```

---

## 🛠️ Technology Stack

### Frontend
- Next.js
- React
- TypeScript
- Tailwind CSS
- Zustand
- Axios
- React Hook Form

### Backend
- NestJS
- TypeORM
- JWT Authentication
- BCrypt
- Nodemailer
- RESTful APIs

### Database
- PostgreSQL
- pgAdmin 4

### Development Tools
- Git
- GitHub
- VS Code
- Postman

---

## 📂 Project Structure

```text
school-management-system/
│
├── backend/
│   ├── src/
│   │   ├── auth/
│   │   ├── users/
│   │   ├── students/
│   │   ├── teachers/
│   │   ├── classes/
│   │   ├── subjects/
│   │   ├── attendance/
│   │   ├── assignments/
│   │   ├── submissions/
│   │   ├── results/
│   │   ├── notices/
│   │   ├── mail/
│   │   └── database/
│   │
│   ├── package.json
│   └── .env
│
├── frontend/
│   └── school-m-s/
│       ├── src/
│       │   ├── app/
│       │   ├── components/
│       │   ├── services/
│       │   ├── store/
│       │   ├── providers/
│       │   └── lib/
│       │
│       ├── package.json
│       └── .env.local
│
└── README.md
```

---

## 📚 Core Modules

### User Management Module
- User Registration
- User Authentication
- Role Assignment
- Access Control

### Student Management Module
- Student Profiles
- Student Records
- Enrollment Information

### Teacher Management Module
- Teacher Profiles
- Subject Assignments
- Academic Responsibilities

### Class Management Module
- Class Creation
- Class Organization
- Academic Structure

### Subject Management Module
- Subject Creation
- Subject Allocation
- Teacher Assignment

### Attendance Module
- Daily Attendance Tracking
- Attendance Reports
- Student Attendance Monitoring

### Assignment Module
- Assignment Creation
- Assignment Submission
- Assignment Evaluation

### Result Management Module
- Result Publishing
- Academic Performance Tracking

### Notice Management Module
- School Announcements
- Academic Notices
- Information Distribution

---

## 🔐 Authentication Flow

```text
User Login
     │
     ▼
Validate Credentials
     │
     ▼
Generate JWT Token
     │
     ▼
Store Token
     │
     ▼
Access Protected Resources
```

---

## ⚙️ Installation Guide

### Clone the Repository

```bash
git clone https://github.com/yourusername/school-management-system.git
cd school-management-system
```

---

# Backend Setup

### Navigate to Backend

```bash
cd backend
```

### Install Dependencies

```bash
npm install
```

### Configure Environment Variables

Create a `.env` file inside the backend directory:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_DATABASE=school_management

JWT_SECRET=your_jwt_secret

MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USER=your_email@gmail.com
MAIL_PASSWORD=your_password
```

### Run Backend

```bash
npm run start:dev
```

Backend Server:

```text
http://localhost:3000
```

---

# Frontend Setup

### Navigate to Frontend

```bash
cd frontend/school-m-s
```

### Install Dependencies

```bash
npm install
```

### Configure Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

### Run Frontend

```bash
npm run dev
```

Frontend Server:

```text
http://localhost:3001
```

---

## 🗄️ Database Configuration

### PostgreSQL Setup

1. Install PostgreSQL
2. Open pgAdmin 4
3. Create a database:

```sql
CREATE DATABASE school_management;
```

4. Update the backend `.env` file with your database credentials.

---

## 📡 API Endpoints Overview

### Authentication

```http
POST /auth/register
POST /auth/login
GET  /auth/profile
```

### Students

```http
GET    /students
GET    /students/:id
POST   /students
PATCH  /students/:id
DELETE /students/:id
```

### Teachers

```http
GET    /teachers
GET    /teachers/:id
POST   /teachers
PATCH  /teachers/:id
DELETE /teachers/:id
```

### Subjects

```http
GET    /subjects
POST   /subjects
PATCH  /subjects/:id
DELETE /subjects/:id
```

### Classes

```http
GET    /classes
POST   /classes
PATCH  /classes/:id
DELETE /classes/:id
```

### Attendance

```http
GET    /attendance
POST   /attendance
PATCH  /attendance/:id
```

### Assignments

```http
GET    /assignments
POST   /assignments
PATCH  /assignments/:id
DELETE /assignments/:id
```

### Results

```http
GET    /results
POST   /results
PATCH  /results/:id
DELETE /results/:id
```

---

## 📈 Future Improvements

- Online Examination System
- Parent Portal
- Fee Management System
- Academic Calendar
- Live Notifications
- Email Notifications
- SMS Integration
- Report Generation
- Analytics Dashboard
- Student Performance Prediction

---

## 📊 Software Engineering Practices

- Modular Architecture
- RESTful API Design
- Role-Based Authorization
- Secure Authentication
- Responsive UI Design
- Scalable Backend Structure
- Separation of Concerns
- Clean Code Principles

---

## 🎯 Project Objectives

- Digitize school operations
- Improve academic management efficiency
- Reduce paperwork
- Enhance communication among stakeholders
- Provide centralized data management
- Improve accessibility of academic information

---

## 👨‍💻 Developer

**Abdullah Anas**

Software Engineer 
Dark Kak 

### Connect With Me

- GitHub: https://github.com/mdAbdullahAnas
- LinkedIn: https://www.linkedin.com/in/md-abdullah-anas-5a4914253/

---

## 📄 License

This project is developed for educational, academic, and portfolio purposes.

Copyright © 2026 Abdullah Anas. All Rights Reserved.
