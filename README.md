# Student Migration Portal

A comprehensive web application to track student academic history and facilitate seamless transfers between educational institutions.

**Live Demo**: [https://student-migration-portal.onrender.com](https://student-migration-portal.onrender.com)

---

## 📋 Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [Project Structure](#project-structure)
- [Usage Guide](#usage-guide)
- [API Documentation](#api-documentation)
- [Contributing](#contributing)
- [License](#license)

---

## 🎯 Overview

The **Student Migration Portal** is designed to streamline the student transfer process across educational institutions. It provides a centralized platform where schools, boards, and students can manage academic records, issue transfer certificates, and track student mobility across different schools.

The application supports three main user roles:
- **Students**: View personal academic history and transfer records
- **Schools**: Manage student enrollment, issue transfer certificates, and maintain academic records
- **Education Board**: Oversee all schools and students within their jurisdiction

---

## ✨ Key Features

### 🎓 Student Profiles
- Track comprehensive academic history including:
  - Current enrollment status
  - Academic performance records
  - Transfer history across institutions
  - Personal identification documents
- Secure access to personal records with role-based visibility

### 🏫 School Management
- **Student Enrollment**: Register and manage student profiles
- **Transfer Certificates**: Issue official transfer certificates for students moving to other institutions
- **Academic Records**: Maintain and update student academic performance data
- **School Dashboard**: Overview of enrolled students and ongoing transfers

### 🏛️ Board Administration
- **System Overview**: Monitor all schools under the board's jurisdiction
- **Student Tracking**: Track student distribution across schools
- **School Management**: Manage school registrations and access controls
- **Transfer Monitoring**: Oversee all student transfers within the board

---

## 🏗️ Architecture

The application follows a **client-server architecture**:

```
┌─────────────────────────────────────────────────┐
│          Frontend (React + Vite)                │
│  - Student Dashboard                            │
│  - School Management Interface                  │
│  - Board Administrative Console                 │
└────────────────────┬────────────────────────────┘
                     │ HTTP/REST API
                     ↓
┌─────────────────────────────────────────────────┐
│        Backend (Node.js + Express)              │
│  - Authentication & Authorization               │
│  - Business Logic                               │
│  - API Endpoints                                │
└────────────────────┬────────────────────────────┘
                     │ SQL Queries
                     ↓
┌─────────────────────────────────────────────────┐
│         Database (MySQL)                        │
│  - Student Records                              │
│  - School Information                           │
│  - Transfer Certificates                        │
│  - User Accounts & Roles                        │
└─────────────────────────────────────────────────┘
```

---

## 🛠️ Tech Stack

### Frontend
- **React 19.2.6** - UI library
- **Vite 8.0.12** - Build tool & development server
- **Redux Toolkit 2.12.0** - State management
- **React Router 7.15.1** - Client-side routing
- **Tailwind CSS 4.3.0** - Styling framework
- **Lucide React** - Icon library
- **Axios 1.16.1** - HTTP client
- **ESLint** - Code quality

### Backend
- **Node.js** - JavaScript runtime
- **Express 5.2.1** - Web framework
- **MySQL2 3.22.5** - Database driver
- **Dotenv 16.4.5** - Environment configuration
- **CORS 2.8.6** - Cross-origin resource sharing
- **Nodemon 3.1.14** - Development hot-reload

### Database
- **MySQL** - Relational database

### Deployment
- **Render** - Cloud hosting platform

---

## 🚀 Installation

### Prerequisites
- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **MySQL** (v5.7 or higher)

### Clone Repository

```bash
git clone https://github.com/Shashanklko/Student-Migration-portal.git
cd Student-Migration-portal
```

### Install Dependencies

**Frontend Setup:**
```bash
cd Client
npm install
```

**Backend Setup:**
```bash
cd ../Server
npm install
```

---

## ⚙️ Configuration

### Environment Variables

Create a `.env` file in the `Server` directory with the following variables:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_USER=your_mysql_username
DB_PASSWORD=your_mysql_password
DB_NAME=student_migration_portal
DB_PORT=3306

# Frontend URL (for CORS)
CLIENT_URL=http://localhost:5173
```

### Database Setup

1. Create a MySQL database:
```sql
CREATE DATABASE student_migration_portal;
```

2. Import the database schema (if available):
```bash
mysql -u root -p student_migration_portal < database/schema.sql
```

3. Configure your MySQL connection in the `.env` file

---

## ▶️ Running the Application

### Development Mode

**Terminal 1 - Start Backend:**
```bash
cd Server
npm run dev
```
Backend will run on `http://localhost:5000`

**Terminal 2 - Start Frontend:**
```bash
cd Client
npm run dev
```
Frontend will run on `http://localhost:5173`

### Production Build

**Build Frontend:**
```bash
cd Client
npm run build
```

**Start Backend in Production:**
```bash
cd Server
npm start
```

---

## 📁 Project Structure

```
Student-Migration-portal/
├── Client/                          # Frontend (React)
│   ├── src/
│   │   ├── components/              # Reusable React components
│   │   ├── pages/                   # Page components
│   │   ├── store/                   # Redux store configuration
│   │   ├── styles/                  # Tailwind CSS configurations
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   ├── vite.config.js
│   └── eslint.config.js
│
├── Server/                          # Backend (Node.js + Express)
│   ├── controllers/                 # Request handlers
│   ├── routes/                      # API routes
│   ├── middleware/                  # Express middleware
│   ├── models/                      # Database models
│   ├── config/                      # Configuration files
│   ├── server.js                    # Application entry point
│   └── package.json
│
├── database/                        # Database schemas & migrations
│
├── .gitignore
├── README.md
└── LICENSE
```

---

## 💻 Usage Guide

### For Students

1. **Login**: Access your student account with credentials
2. **View Academic Records**: Check your academic history and performance
3. **Transfer Records**: See all your transfer certificates and mobility history
4. **Apply for Transfer**: Request a transfer certificate from your current school

### For Schools

1. **Dashboard**: View enrolled students and school statistics
2. **Manage Students**: Add, edit, or remove student records
3. **Issue Certificates**: Generate and issue transfer certificates
4. **Track Transfers**: Monitor outgoing and incoming student transfers

### For Board Administrators

1. **System Dashboard**: Overview of all schools and students
2. **School Management**: Register and manage schools
3. **Transfer Oversight**: Monitor all transfers across schools
4. **Generate Reports**: Create reports on student migration patterns

---

## 🔌 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication
All endpoints (except login) require a valid JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

### Key Endpoints

#### Authentication
- `POST /auth/login` - User login
- `POST /auth/register` - User registration
- `POST /auth/logout` - User logout

#### Students
- `GET /students` - Get student list
- `GET /students/:id` - Get student details
- `POST /students` - Create new student
- `PUT /students/:id` - Update student information
- `GET /students/:id/transfers` - Get student transfer history

#### Schools
- `GET /schools` - Get all schools
- `GET /schools/:id` - Get school details
- `POST /schools/:id/students` - Enroll a student
- `POST /schools/:id/transfers` - Issue transfer certificate

#### Board
- `GET /board/overview` - Get board overview
- `GET /board/schools` - Get all schools under board
- `GET /board/students` - Get all students

For complete API documentation, see [API_DOCS.md](./API_DOCS.md) (if available)

---

## 🤝 Contributing

Contributions are welcome! To contribute:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m 'Add your feature'`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a Pull Request

Please ensure your code follows the project's coding standards and includes appropriate tests.

---

## 📄 License

This project is licensed under the ISC License - see the LICENSE file for details.

---

## 📞 Support

For issues, questions, or suggestions, please:
- Open an [issue](https://github.com/Shashanklko/Student-Migration-portal/issues)
- Contact the repository owner

---

## 🎉 Acknowledgments

- Built with [React](https://react.dev) and [Express.js](https://expressjs.com)
- Styled with [Tailwind CSS](https://tailwindcss.com)
- Deployed on [Render](https://render.com)

---

**Last Updated**: July 2026  
**Repository**: [Shashanklko/Student-Migration-portal](https://github.com/Shashanklko/Student-Migration-portal)
