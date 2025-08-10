# Clinic Management System - Backend

A comprehensive clinic management system built with NestJS, featuring queue management, appointment scheduling, and doctor management.

## 🚀 Features

### 🔐 Authentication & User Management
- **JWT-based authentication** with secure token handling
- **Automatic admin user creation** - If no users exist, the system automatically creates:
  - **Email**: `admin@clinic.com`
  - **Password**: `admin123`
  - **Role**: `admin`
- **Role-based access control** (admin, frontdesk, doctor)

### 🏥 Core Modules
- **Queue Management**: Patient queue with priority and status tracking
- **Appointment Scheduling**: Comprehensive appointment system with doctor assignment
- **Doctor Management**: Doctor profiles with availability tracking
- **Patient Records**: Patient information management
- **User Management**: Staff account management

### 🛠 Technical Features
- **TypeORM** with MySQL database
- **Auto-increment synchronization** for all entities
- **Health check endpoint** for monitoring
- **Local development ready** with simple configuration

## 🛠 Tech Stack

- **Framework**: NestJS
- **Database**: MySQL with TypeORM
- **Authentication**: JWT with Passport
- **Security**: bcrypt for password hashing

## 📋 Prerequisites

- Node.js (v18+)
- MySQL database
- npm or yarn

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Database Setup
Make sure you have MySQL running locally with:
- **Host**: localhost
- **Port**: 3306
- **Username**: root
- **Password**: your_db_password
- **Database**: clinic_system

```sql
CREATE DATABASE clinic_system;
```

### 3. Run the Application
```bash
# Development
npm run start:dev

# Production
npm run build
npm run start:prod
```

## 🔐 Authentication

### Default Admin User
The system automatically creates an admin user if no users exist:
- **Email**: `admin@clinic.com`
- **Password**: `admin123`
- **Role**: `admin`

### API Endpoints

#### Authentication
- `POST /auth/login` - User login
- `GET /auth/setup-info` - Check system setup status

#### Health Check
- `GET /health` - Application health status

## 🏗 Project Structure

```
src/
├── auth/                 # Authentication module
├── users/               # User management
├── queue/               # Queue management
├── appointments/        # Appointment scheduling
├── doctors/            # Doctor management
├── patients/           # Patient records
├── database-init.service.ts  # Auto-increment sync
└── health.controller.ts      # Health monitoring
```

## 🔧 Configuration

### Database Configuration
The application is configured for local MySQL development:
- **Host**: localhost
- **Port**: 3306
- **Username**: root
- **Password**: your_db_password
- **Database**: clinic_system
- **Synchronize**: true (auto-creates tables)

### JWT Configuration
- **Secret**: SECRET_KEY (for local development)
- **Expiration**: 1 hour

## 🔒 Security Features

- **JWT Authentication** with 1-hour expiration
- **Password Hashing** using bcrypt
- **CORS Protection** for localhost development
- **Input Validation** with class-validator
- **SQL Injection Protection** via TypeORM

## 📊 Database

### Auto-Increment Synchronization
The system automatically synchronizes AUTO_INCREMENT values for all entities:
- Users
- Doctors
- Patients
- Appointments
- Queue entries

This ensures sequential IDs starting from 1, even after data deletion.

## 🧪 Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## 📝 API Documentation

### Authentication Flow
1. User submits credentials to `/auth/login`
2. System validates credentials
3. Returns JWT token and user info
4. Frontend stores token for subsequent requests

### Error Handling
- Invalid credentials: 401 Unauthorized
- Validation errors: 400 Bad Request
- Server errors: 500 Internal Server Error

## 🚀 Railway Deployment

### Environment Variables
Set these in Railway:
```bash
DB_HOST=${MYSQL_HOST}
DB_PORT=${MYSQL_PORT}
DB_USERNAME=${MYSQL_USERNAME}
DB_PASSWORD=${MYSQL_PASSWORD}
DB_DATABASE=${MYSQL_DATABASE}
NODE_ENV=production
PORT=3000
JWT_SECRET=your-secret-key
FRONTEND_URL=https://your-frontend-domain.vercel.app
```

### Database Setup
1. Create MySQL database in Railway
2. Import your `clinic.sql` dump
3. Deploy the application

### Health Check
- `GET /api/v1/health` - Application status

## 🚀 Local Development Checklist

- [ ] MySQL server running on localhost:3306
- [ ] Database `clinic_system` created
- [ ] Backend running on port 3000
- [ ] Frontend running on port 3001
- [ ] Test admin login: admin@clinic.com / admin123
- [ ] Check health endpoint: http://localhost:3000/api/v1/health

## 📞 Support

For issues or questions:
1. Check the health endpoint: `GET /api/v1/health`
2. Verify MySQL is running and accessible
3. Check application logs
4. Ensure database exists and is accessible

---

**Note**: This backend is designed to work with the clinic-system frontend. Make sure your frontend is running on `http://localhost:3001` for proper CORS handling.
