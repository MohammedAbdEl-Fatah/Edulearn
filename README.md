# EduLearn 

EduLearn is a modern, high-performance E-Learning platform built with **Node.js**, **Express**, **TypeScript**, and **MongoDB**. It offers a robust environment connecting educators (teachers) and learners (students). 

The platform enables teachers to build structured courses, organize lesson sessions, stream/upload video lessons, and attach PDF assignments with automated submission & grading workflows.

---

## 🚀 Key Features

### 👨‍🏫 For Teachers
- **Course Management**: Create, update, list, and delete structured courses.
- **Session Structuring**: Divide courses into organized modules and sessions.
- **Video Content**: Upload multi-video files (up to 10 at once) per session to Cloudinary and dynamically reorder video playlists.
- **Material & Assignment Upload**: Upload reference files, quizzes, and assignments for students.
- **Grading System**: Review student assignment submissions, set numerical scores (0–100), and provide feedback.

### 👨‍🎓 For Students
- **Course & Session Access**: Discover courses, explore sessions, and stream video content.
- **Assignment Submissions**: Submit answers for assignments associated with sessions.
- **Grades & Feedback**: Access graded results and direct teacher feedback on submitted assignments.

###  Core Platform & Security Features
- **Role-Based Access Control (RBAC)**: Enforced via `STUDENT` and `TEACHER` roles.
- **Authentication**: JWT authentication with refresh token flow & bcrypt password hashing.
- **Email & OTP**: Nodemailer integration with OTP verification for email confirmation & password reset.
- **Rate Limiting & Security**: Rate limiting (`express-rate-limit`), security headers (`helmet`), CORS configuration, and Zod body validation.
- **Interactive Documentation**: Auto-generated Swagger OpenAPI 3.0 documentation served at `/api-docs`.

---

## 🛠️ Tech Stack

| Domain | Technology |
| :--- | :--- |
| **Runtime & Framework** | Node.js (v22.11.0), Express.js (v5.2.1), TypeScript (v7.0.2) |
| **Database & ORM** | MongoDB, Mongoose (v8.18.1) |
| **Cloud Media Storage** | Cloudinary (v2.10.0) |
| **Authentication & Security**| JWT (`jsonwebtoken`), Bcrypt, Helmet, Express Rate Limit, Zod |
| **File Processing** | Multer, File-Type |
| **API Documentation** | Swagger UI Express, Swagger-JSDoc |
| **Communication** | Nodemailer (Email/OTP delivery) |

---

## 📁 Project Structure

```
Edulearn/
├── src/
│   ├── app.controller.ts        # Main Express application bootstrap & route assembly
│   ├── index.ts                 # Application entry point
│   ├── DB/                      # Database connection, schemas, and repositories
│   │   ├── course/              # Course database model & repository
│   │   ├── file/                # File database model & repository
│   │   ├── session/             # Session database model & repository
│   │   ├── token/               # Token database model & repository
│   │   ├── user/                # User database model & repository
│   │   └── video/               # Video database model & repository
│   ├── config/                  # Environment variable configuration
│   ├── error/                   # Global custom AppError & async handler wrapper
│   ├── middleware/              # Auth, Role-based access, Multer, and Zod Validation middleware
│   ├── modules/                 # Modular feature controllers, services, responses, and DTOs
│   │   ├── auth/                # Auth controller & service
│   │   ├── course/              # Course controller & service
│   │   ├── file/                # File & assignment controller & service
│   │   ├── session/             # Session controller & service
│   │   ├── user/                # User profile controller & service
│   │   └── video/               # Video stream controller & service
│   ├── types/                   # TypeScript global declarations
│   └── utils/                   # Cloudinary SDK, Enums, and Swagger definitions
├── .env                         # Production environment variables
├── .env.local                   # Local development environment variables
├── package.json                 # Project dependencies & scripts
├── tsconfig.json                # TypeScript compiler configuration
└── vercel.json                  # Deployment configuration for Vercel
```

---

## 📡 API Endpoints Directory

Base URL: `http://localhost:8000/api/v1`

### 🔑 Authentication (`/api/v1/auth`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/auth/sign-up/student` | Public | Register a new Student account |
| `POST` | `/auth/sign-up/teacher` | Public | Register a new Teacher account |
| `PUT` | `/auth/confirm-email` | Public | Confirm account email via OTP |
| `POST` | `/auth/login` | Public | Authenticate user & receive access/refresh tokens |
| `PATCH` | `/auth/logout` | Authenticated | Invalidate current session/token |
| `POST` | `/auth/refresh-token` | Public | Obtain new access token using refresh token |
| `POST` | `/auth/generated-otp` | Public | Generate OTP for password recovery |
| `POST` | `/auth/forget-password` | Public | Reset password using OTP |

### User (`/api/v1/user`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/user/profile` | Authenticated | Retrieve logged-in user profile information |

###  Course (`/api/v1/course`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/course/create-course` | Teacher | Create a new course |
| `PATCH` | `/course/edit-course/:id` | Teacher (Owner) | Edit existing course details |
| `GET` | `/course/get-course/:id` | Public | Get single course details by ID |
| `GET` | `/course/get-all-course` | Public | List all published courses |
| `GET` | `/course/get-courses-teacher/:id` | Public | Get all courses published by a specific teacher |
| `DELETE` | `/course/delete-course/:id` | Teacher (Owner) | Delete a course by ID |

###  Session (`/api/v1/session`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/session/create-session/:id` | Teacher | Add a new session module to course `:id` |
| `PUT` | `/session/update-session/:sessionID/:id` | Teacher | Update session title for course `:id` |
| `GET` | `/session/get-all-sessions/:id` | Authenticated | Get all sessions for course `:id` |
| `DELETE` | `/session/delete-session/:sessionID/:id` | Teacher | Delete a session module |

###  Video (`/api/v1/video`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/video/upload/:id` | Teacher | Upload up to 10 video files for session `:id` |
| `GET` | `/video/get-all-video/:id` | Teacher | Retrieve all video files in session `:id` |
| `GET` | `/video/get-video/:id/:idvideo` | Teacher | Get specific video details in session `:id` |
| `PATCH` | `/video/:id/reorder` | Teacher | Reorder video sequence in session `:id` |
| `DELETE` | `/video/delete-video/:id/:idvideo` | Teacher | Delete a video file from Cloudinary and DB |

###  File & Assignment (`/api/v1/file`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/file/upload/:id` | Teacher | Upload assignment or PDF file to session `:id` |
| `POST` | `/file/submit-assignment/:id/:idAssenment` | Student | Submit answer file for assignment `:idAssenment` |
| `PATCH` | `/file/result/:id` | Teacher | Grade submitted student file `:id` & attach feedback |
| `PUT` | `/file/replace/:id` | Teacher | Replace an uploaded file |
| `DELETE` | `/file/delete/:id` | Teacher | Delete a file from Cloudinary & DB |
| `GET` | `/file/get-correst/:id` | Student | View grade & feedback result for file `:id` |
| `GET` | `/file/get-all-submit-assignment/:id` | Teacher | List all student submissions for assignment `:id` |
| `GET` | `/file/get-files-session/:teacherId/:id` | Student/Teacher | Retrieve files for session `:id` |

---

## 💻 Getting Started

### Prerequisites
- **Node.js** `>= v22.11.0`
- **MongoDB** instance (Local or MongoDB Atlas)
- **Cloudinary Account** (for video and file asset uploads)

### 1️⃣ Installation
```bash
git clone https://github.com/MohammedAbdEl-Fatah/Edulearn
cd Edulearn
npm install
```

### 2️⃣ Environment Configuration
Create a `.env` or `.env.local` file in the project root:
```env
PORT=8000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/edulearn
JWT_SECRET=your_jwt_secret_key
REFRESH_TOKEN_SECRET=your_refresh_token_secret_key
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

### 3️⃣ Build & Run

**Build TypeScript:**
```bash
npm run build
```

**Run Development Server (with Watch Mode):**
```bash
npm run dev:run
```

**Run Production Server:**
```bash
npm start
```

### 📖 API Swagger Documentation
Once the application starts, navigate to:
```
http://localhost:8000/api-docs
```
You will find interactive OpenAPI 3.0 documentation where you can execute and test endpoints directly.

---

## 📧 Contact & Support

Created by **Mohamed Mohamed Abd El Fatah**:
- **WhatsApp**: +20 10 91428881
- **LinkedIn**: [LinkedIn Profile](https://www.linkedin.com/in/mohamed-mohamed-abd-el-fatah-a276ab264/)
- **Email**: mohammedabdelfatah837@gmail.com
