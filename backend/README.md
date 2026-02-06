# 🎬 Movie Management System – Backend

A production-ready backend for a Movie Management System built with **Node.js**, **Express**, and **MongoDB**, featuring **JWT authentication**, **Role-Based Access Control (RBAC)**, **admin/user separation**, **strict validation**, **soft deletes**, **rate limiting**, and **centralized error handling**.

---

## 🚀 Tech Stack

- **Node.js**
- **Express.js**
- **MongoDB + Mongoose**
- **JWT (Cookie-based authentication)**
- **Argon2** – Password hashing
- **Axios / Fetch compatible API**
- **Rate Limiting**
- **RBAC (Admin & User roles)**

---

## ✨ Core Features

### 🔐 Authentication & Authorization

- Cookie-based JWT authentication
- Roles: `user`, `admin`
- Role-based route protection
- Token auto-expiry handling

### 👥 User & Admin Management

- User registration & login
- **Admin creation restricted**:
  - First admin can be created manually
  - Only existing admins can create new admins
- Profile management
- Change password functionality

### 🎥 Movie Management

- Admin-only CRUD operations
- Duplicate movie prevention
- Soft delete (`Is-Deleted`)
- Advanced filters:
  - Search
  - Language
  - Genres

### 📊 Activity Logs

- Admin-only activity log access
- API-level logging middleware

### 🛡️ Security & Stability

- Global error handler
- API logging middleware
- Rate limiting (IP + Email for auth)
- Defensive coding:
  - Optional chaining everywhere
  - Safe defaults
  - Try/catch in all layers

---

## 📂 Project Structure

```txt
src/
├── app.js
├── server.js
│
├── config/
│   ├── cors/
│   ├── db/
│   └── env/
│
├── controllers/
│   ├── auth/
│   ├── user/
│   ├── movie/
│   └── activityLog/
│
├── queries/
│   ├── auth/
│   ├── user/
│   ├── movie/
│   └── activityLog/
│
├── models/
│   ├── user/
│   ├── movie/
│   └── activityLog/
│
├── middlewares/
│   ├── auth/
│   ├── validator/
│   ├── rateLimit/
│   ├── logger/
│   └── error/
│
├── validators/
│   ├── auth/
│   ├── user/
│   └── movie/
│
├── routes/
│   ├── auth/
│   ├── user/
│   ├── movie/
│   └── activityLog/
│
├── utils/
│   ├── constants.js
│   ├── commonFunctions.js
│   └── jwtUtils.js
│
└── logs/


⚙️ Environment Setup

Create a .env file in the root directory:

APP_ENV={
  "PORT":5000,
  "MONGO_URI":"mongodb+srv://<username>:<password>@cluster.mongodb.net/MovieManagement",
  "JWT_SECRET":"your_jwt_secret",
  "JWT_EXPIRES_IN":"1h",
  "CLIENT_URL":"http://localhost:5173"
}


▶️ Installation & Run
# Install dependencies
npm install

# Run in development
npm run dev

# Run in production
npm start


🔗 API Overview
Auth
Method	        Endpoint	            Access
POST	        /api/auth/register	    Public (User)
POST	        /api/auth/login	        Public
POST	        /api/auth/logout	    Authenticated

Admin Auth
Method	        Endpoint	                Access
POST	        /api/admin/register	        Admin only


Movies
Method	        Endpoint	                Access
GET	            /api/movies	                User/Admin
POST	        /api/movies	                Admin
PUT	            /api/movies/:movieId	    Admin
DELETE	        /api/movies/:movieId	    Admin

Activity Logs
Method	        Endpoint	           Access
GET	            /api/activity-logs	   Admin


🧠 Design Decisions

Custom IDs (User-Id, Movie-Id) instead of _id

Soft delete instead of hard delete

Uppercase DB fields for consistency

Single source of truth for constants

No app crash policy



🧪 Recommended Tools

Postman / Thunder Client

MongoDB Compass

Madge (circular dependency check)



📌 Future Enhancements

Pagination / infinite scroll

Image upload for movies

Redis caching

Refresh token rotation

Audit trail export

👨‍💻 Author

Sanjai Dev N
Full Stack Developer – MERN


```
