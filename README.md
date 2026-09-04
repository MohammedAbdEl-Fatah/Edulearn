# EduLearn

EduLearn is an innovative educational platform designed to connect teachers and students, providing a comprehensive learning experience. The platform enables teachers to create and manage courses, record educational videos, and share PDF materials with students.

##  Project Overview

EduLearn aims to bridge the gap between educators and learners by providing a robust platform for:
- **Teachers**: Create courses, record video lessons, upload PDF materials, and manage student engagement
- **Students**: Access quality educational content, learn through videos and PDFs, and track their progress

##  Key Features

### For Teachers
- **Course Creation**: Create and manage comprehensive courses with detailed descriptions
- **Video Recording**: Record and upload educational videos organized by sessions
- **PDF Materials**: Upload and share PDF documents as supplementary learning materials
- **Student Management**: Track enrolled students and their progress
- **Review System**: Receive and manage student reviews and feedback

### For Students
- **Course Discovery**: Browse and enroll in courses across various categories
- **Video Learning**: Access high-quality video lessons organized in structured sessions
- **PDF Resources**: Download and study PDF materials provided by instructors
- **Progress Tracking**: Monitor learning progress through course completion
- **Reviews & Ratings**: Provide feedback on courses and instructors

### Platform Features
- **User Authentication**: Secure signup and login for both teachers and students
- **Email Verification**: OTP-based email verification system
- **Role-Based Access**: Distinct roles for teachers and students with appropriate permissions
- **Session Management**: Organize course content into structured sessions
- **Review System**: Comprehensive review and rating mechanism for courses
- **Secure API**: RESTful API with JWT authentication and rate limiting

##  Technologies & Tools

### Core Framework
- **Node.js** (v22.11.0) - JavaScript runtime
- **Express** (v5.2.1) - Web application framework
- **TypeScript** (v7.0.2) - Type-safe JavaScript

### Database & Storage
- **MongoDB** (via Mongoose v8.18.1) - NoSQL database for data persistence
- **Cloudinary** (v2.10.0) - Cloud-based media storage for videos and PDFs

### Authentication & Security
- **JWT** (jsonwebtoken v9.0.3) - Token-based authentication
- **bcrypt** (v6.0.0) - Password hashing
- **crypto-js** (v4.2.0) - Encryption utilities
- **Helmet** (v8.2.0) - Security headers
- **express-rate-limit** (v8.5.2) - API rate limiting

### File Handling
- **Multer** (v2.2.0) - File upload handling
- **file-type** (v22.0.2) - File type detection

### Email Services
- **Nodemailer** (v9.0.1) - Email sending functionality

### API Documentation
- **Swagger** (swagger-jsdoc v6.3.0, swagger-ui-express v5.0.1) - Interactive API documentation

### Validation & Utilities
- **Zod** (v4.4.3) - Schema validation
- **CORS** (v2.8.6) - Cross-origin resource sharing
- **Morgan** (v1.11.0) - HTTP request logger

### Development Tools
- **Concurrently** (v10.0.3) - Run multiple commands simultaneously
- **dotenv** (v17.4.2) - Environment variable management
--------------------------------------------------------
##  Project Structure


```
Edulearn/
├── src/
│   ├── DB/                    # Database models and repositories
│   │   ├── course/           # Course schema and repository
│   │   ├── pdf/              # PDF schema and repository
│   │   ├── review/           # Review schema and repository
│   │   ├── session/          # Session schema and repository
│   │   ├── token/            # Token schema and repository
│   │   ├── user/             # User schema and repository
│   │   └── video/            # Video schema and repository
│   ├── config/               # Configuration files
│   ├── middleware/           # Express middleware
│   ├── modules/              # Feature modules
│   │   ├── auth/            # Authentication module
│   │   ├── course/          # Course module
│   │   └── user/            # User module
│   ├── types/                # TypeScript type definitions
│   ├── utils/                # Utility functions
│   ├── app.controller.ts     # Main application controller
│   └── index.ts              # Application entry point
├── .env                      # Environment variables
├── .env.local               # Local environment configuration
├── package.json              # Project dependencies
├── tsconfig.json            # TypeScript configuration
└── vercel.json              # Vercel deployment configuration
```

##  Getting Started

###  Prerequisites
- Node.js v22.11.0 or higher
- MongoDB database
- Cloudinary account (for media storage)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd Edulearn
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
Create a `.env` file with the following variables:
```
PORT=your_port_connection_string
MONGODB_URI=your_mongodb_connection_string
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
JWT_SECRET=your_jwt_secret
EMAIL_HOST=your_email_host
EMAIL_USER=your_email_user
EMAIL_PASS=your_email_password
```

4. Build the project:
```bash
npm run build
```

5. Start the development server:
```bash
npm run dev:run
```

Or for production:
```bash
npm start
```

### API Documentation

Once the server is running, access the interactive API documentation at:
```
http://localhost:8000/api-docs
```

## API Endpoints

### Authentication
- `POST /api/v1/auth/signup/student` - Student registration
- `POST /api/v1/auth/signup/teacher` - Teacher registration
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/verify-email` - Email verification
- `POST /api/v1/auth/forgot-password` - Password reset request

### User
- `GET /api/v1/user/profile` - Get user profile
- `PUT /api/v1/user/profile` - Update user profile

### Course
- `POST /api/v1/course/create` - Create new course
- `GET /api/v1/course/:id` - Get course details
- `GET /api/v1/courses` - List all courses
- `PUT /api/v1/course/:id` - Update course
- `DELETE /api/v1/course/:id` - Delete course

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Rate limiting to prevent API abuse
- CORS configuration for cross-origin requests
- Helmet for security headers
- Input validation with Zod

## 🌟 Future Enhancements

- Real-time chat between teachers and students
- Live streaming capabilities
- Payment integration for paid courses
- Certificate generation upon course completion
- Advanced analytics and reporting
- Mobile application support


## 👥 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Contact

Created by **Mohamed Mohamed Abd El Fatah**:
- WhatsApp: +20 10 91428881
- LinkedIn: https://www.linkedin.com/in/mohamed-mohamed-abd-el-fatah-a276ab264/
- Email: mohammedabdelfatah837@gmail.com

