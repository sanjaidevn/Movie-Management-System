# 🎬 Movie Management System (Full Stack)

A full-stack Movie Management System built with **React, Redux Toolkit, Bootstrap** on the frontend and **Node.js, Express, MongoDB** on the backend.  
The application supports **role-based authentication (Admin & User)**, movie CRUD operations, live search & filters, and a clean UI.

---

## 🚀 Features

### 🔐 Authentication

- User Login & Registration
- Admin Login & Admin Creation (by existing Admin)
- Role-based routing (Admin / User)
- JWT-based authentication
- Protected routes

### 👤 User Features

- View movies
- Live search (by title)
- Live filter by language
- Multi-select genre filter (with Apply logic)
- Load more pagination
- Clean dashboard UI

### 👑 Admin Features

- Create, update, delete movies
- Movie table with pagination
- Live search & filters
- Create new admins (modal-based)
- Confirmation modals for destructive actions
- Stay on same admin dashboard after admin creation

### 🎨 UI / UX

- Bootstrap-based responsive layout
- Reusable form input components
- Live field validation
- Auto-hide alerts
- Modal-based workflows
- Sticky navbar

---

## 🛠️ Tech Stack

### Frontend

- React
- Redux Toolkit
- React Router DOM
- Bootstrap 5
- React-Select
- Lucide Icons

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication

---

## 📁 Project Structure (Frontend)

src/
├── api/
├── components/
│ ├── auth/
│ ├── common/
│ ├── movies/
│ └── navbar/
├── constants/
├── redux/
│ ├── auth/
│ └── movie/
├── utils/
├── pages/
│ ├── admin/
│ ├── auth/
│ └── user/
└── App.jsx

---

## ⚙️ Installation & Setup

### 1️⃣ Clone the repository

```bash
git clone https://github.com/your-username/movie-management-system.git
cd movie-management-system
2️⃣ Install dependencies
npm install
3️⃣ Configure environment variables
Create a .env file in the root:

VITE_API_BASE_URL=http://localhost:5000/api
4️⃣ Run the app
npm run dev
🔑 Roles & Access
Role	Access
User	View movies, search, filter
Admin	Full movie CRUD, create admins


📌 Key Highlights
Admin creation does not log out the current admin

Errors & form states reset correctly on modal close

Live search & filters with debouncing

Clean Redux state management

Production-ready structure



📜 License
This project is for educational and portfolio purposes.



🙌 Author
Sanjai Dev
Computer Science Engineering | Full Stack Developer

```
