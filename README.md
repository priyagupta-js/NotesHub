# NotesHub - Full Stack Notes Application

NotesHub is a full-stack Notes Management application built using **Next.js**, **Node.js**, **Express.js**, and **MongoDB** with secure JWT-based authentication.

The application allows users to:

* Register and log in securely
* Create, read, update, and delete notes
* Access protected routes using JWT authentication
* Manage personal notes with a clean and responsive UI

---

# Tech Stack

## Frontend

* Next.js (App Router)
* Tailwind CSS

## Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT Authentication
* bcryptjs

---

# Features

## Authentication

* User Signup
* User Login
* JWT Token Authentication
* Protected Routes

## Notes Management

* Create Notes
* View Notes
* Update Notes
* Delete Notes

## UI Features

* Responsive Design
* Modern and Clean Interface
* User-Friendly Layout

---

# Project Structure

```bash
NotesHub/
│
├── backend/
│   ├── config/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── .env
│   ├── .env.example
│   └── server.js
│
└── frontend/
    ├── app/
    ├── public/
    ├── .env.local
    └── package.json
```

---

# Environment Variables

## Backend `.env`

Create a `.env` file inside the `backend` folder.

Example:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
PORT=5000
```

---

# `.env.example`

As required in the assignment, include the following file inside the backend folder:

## backend/.env.example

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
PORT=5000
```

---

# Frontend Environment Variable

Create a `.env.local` file inside the `frontend` folder.

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

---

# Installation & Setup

## 1. Clone Repository

```bash
git clone <your_repository_link>
cd NotesHub
```

---

# Backend Setup

```bash
cd backend
npm install
npm run dev
```

Backend runs on:

```bash
http://localhost:5000
```

---

# Frontend Setup

Open a new terminal:

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on:

```bash
http://localhost:3000
```

---

# API Endpoints

## Authentication

| Method | Endpoint         | Description   |
| ------ | ---------------- | ------------- |
| POST   | /api/auth/signup | Register user |
| POST   | /api/auth/login  | Login user    |

---

## Notes

| Method | Endpoint       | Description     |
| ------ | -------------- | --------------- |
| GET    | /api/notes     | Fetch all notes |
| POST   | /api/notes     | Create note     |
| PUT    | /api/notes/:id | Update note     |
| DELETE | /api/notes/:id | Delete note     |

---

# Authentication Flow

1. User logs in or signs up
2. Backend returns JWT token
3. Token stored in localStorage
4. Protected routes use Authorization header

Example:

```bash
Authorization: Bearer <token>
```

---

# Security Features

* Password hashing using bcryptjs
* JWT token verification
* Protected API routes
* User-specific notes access

---

# Author

Priya Gupta
