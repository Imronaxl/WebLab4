# Lab 4 - Web Application for Point Verification on Coordinate Plane

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Java](https://img.shields.io/badge/Java-17-orange.svg)
![Angular](https://img.shields.io/badge/Angular-17-red.svg)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2.3-green.svg)

## 📋 Project Overview

**Lab 4** is a full-stack web application that allows users to check whether points on a coordinate plane fall within a specific geometric region. The application features user authentication, interactive canvas visualization, and persistent data storage with PostgreSQL.

### Key Features

✨ **User Authentication & Authorization**
- Secure JWT-based authentication
- User registration and login functionality
- Protected API endpoints

📊 **Interactive Coordinate Plane Visualization**
- Real-time canvas rendering with custom coordinate system
- Click-based point placement on the graph
- Visual representation of hit/miss regions

🔍 **Point Verification**
- Validate if points fall within the defined area
- Support for variable radius values (0.5 to 3.0)
- X coordinates from -2 to 2
- Y coordinates from -5 to 3

📈 **Results Tracking**
- Persistent storage of all verification results
- Paginated results table with timestamps
- Clear and manage result history

## 🏗️ Architecture

### Technology Stack

**Backend:**
- **Framework:** Spring Boot 3.2.3
- **Language:** Java 17
- **Database:** PostgreSQL
- **Authentication:** JWT (JSON Web Token)
- **ORM:** Spring Data JPA with Hibernate
- **Security:** Spring Security 6.2.3

**Frontend:**
- **Framework:** Angular 17
- **Language:** TypeScript
- **UI Library:** PrimeNG 17.0.0
- **Styling:** SCSS with PrimeFlex CSS Framework
- **HTTP Client:** Angular HttpClient with Interceptors

### Project Structure

```
lab4/
├── lab4-backend/                          # Spring Boot Backend
│   ├── src/main/java/com/weblab/
│   │   ├── controller/                    # REST API endpoints
│   │   ├── service/                       # Business logic
│   │   ├── entity/                        # JPA entities (User, PointResult)
│   │   ├── dto/                           # Data Transfer Objects
│   │   ├── repository/                    # Data access layer
│   │   ├── security/                      # JWT and security configuration
│   │   ├── config/                        # Application configuration
│   │   ├── exception/                     # Custom exceptions
│   │   └── WebLabApplication.java         # Main entry point
│   ├── src/main/resources/
│   │   ├── application.properties         # Configuration
│   │   └── static/                        # Frontend build output
│   ├── build.gradle                       # Gradle build configuration
│   └── gradle.properties
│
├── lab4-front/                            # Angular Frontend
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/
│   │   │   │   ├── login/                 # Login form component
│   │   │   │   └── main/                  # Main workspace component
│   │   │   ├── services/
│   │   │   │   ├── auth.service.ts        # Authentication service
│   │   │   │   └── point.service.ts       # Point API service
│   │   │   ├── guards/
│   │   │   │   └── auth.guard.ts          # Route protection guard
│   │   │   ├── interceptors/
│   │   │   │   └── auth.interceptor.ts    # JWT token injection
│   │   │   ├── models/
│   │   │   │   ├── auth.model.ts          # Auth interfaces
│   │   │   │   └── point.model.ts         # Point interfaces
│   │   │   ├── app.module.ts              # Main module
│   │   │   ├── app-routing.module.ts      # Routing configuration
│   │   │   └── app.component.ts           # Root component
│   │   ├── index.html
│   │   └── styles.scss
│   ├── package.json
│   ├── angular.json
│   └── tsconfig.json
│
└── README.md                              # This file
```

## 🚀 Getting Started

### Prerequisites

- **Java Development Kit (JDK):** 17 or higher
- **Node.js:** 18.x or higher
- **npm:** 9.x or higher
- **PostgreSQL:** 12.x or higher
- **Gradle:** 8.x (or use gradlew wrapper)

### Backend Setup

#### 1. Configure Database

Ensure PostgreSQL is running and create the database:

```bash
psql -U postgres
CREATE DATABASE studs;
```

#### 2. Update Database Credentials

Edit `lab4-backend/src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/studs
spring.datasource.username=your_username
spring.datasource.password=your_password
```

#### 3. Build and Run Backend

```bash
cd lab4-backend

# Build the project
./gradlew clean build

# Run the Spring Boot application
./gradlew bootRun
```

The backend will start on `http://localhost:8080`

### Frontend Setup

#### 1. Install Dependencies

```bash
cd lab4-front
npm install
```

#### 2. Development Server

```bash
npm start
```

The frontend will start on `http://localhost:4200`

#### 3. Build for Production

```bash
npm run build
```

The production-ready build will be output to the `dist/` directory.

## 📡 API Endpoints

### Authentication Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---|
| POST | `/api/auth/register` | Register a new user | No |
| POST | `/api/auth/login` | Authenticate user and receive JWT token | No |

**Request Body (Login/Register):**
```json
{
  "username": "string",
  "password": "string"
}
```

**Response (Login):**
```json
{
  "token": "jwt_token_string",
  "username": "string"
}
```

### Points Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---|
| GET | `/api/points` | Get all points for authenticated user | Yes |
| POST | `/api/points` | Add and verify a new point | Yes |
| DELETE | `/api/points` | Clear all points for authenticated user | Yes |

**Request Body (Add Point):**
```json
{
  "x": -2.0,
  "y": 1.5,
  "r": 1.5
}
```

**Response (Point Result):**
```json
{
  "id": 1,
  "x": -2.0,
  "y": 1.5,
  "r": 1.5,
  "hit": true,
  "checkDate": "2024-02-08T10:30:45"
}
```

## 🔐 Authentication Flow

1. **Registration:** User creates an account with username and password
2. **Login:** User provides credentials, receives JWT token valid for 24 hours
3. **Token Storage:** JWT is stored in browser's localStorage
4. **Authorization:** Token is automatically injected in all API requests via HTTP interceptor
5. **Token Refresh:** When token expires, user must login again

## 📐 Point Verification Algorithm

The application verifies if a point (X, Y) falls within a specific geometric region based on the radius R:

**Region Definition:**
- Circle in quadrant I: Center at (0, 0), radius R
- Rectangle in quadrant II: From (-R, 0) to (0, R)
- Triangle in quadrant III: vertices at (-R, 0), (-R, -R), (0, -R)

**Coordinate Constraints:**
- X range: -2 to 2
- Y range: -5 to 3
- R range: 0.5, 1.0, 1.5, 2.0, 2.5, 3.0

## 💾 Database Schema

### Users Table
```sql
CREATE TABLE users (
  id BIGINT PRIMARY KEY,
  username VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP
);
```

### Point Results Table
```sql
CREATE TABLE point_result (
  id BIGINT PRIMARY KEY,
  x DOUBLE PRECISION NOT NULL,
  y DOUBLE PRECISION NOT NULL,
  r DOUBLE PRECISION NOT NULL,
  hit BOOLEAN NOT NULL,
  check_date TIMESTAMP NOT NULL,
  user_id BIGINT NOT NULL REFERENCES users(id)
);
```

## 🎨 Frontend Features

### Login Component
- Username and password input fields
- Client-side validation
- Error messaging
- Navigation to registration/login

### Main Component
- **Left Panel:**
  - X coordinate selector (dropdown with 9 options)
  - Y coordinate input (text field with validation)
  - R radius selector (dropdown with 6 options)
  - Verification button
  - Clear results button
  - Information panel showing current values

- **Center Panel:**
  - Interactive canvas (500x500px)
  - Real-time graph rendering
  - Click-to-place functionality
  - Grid visualization
  - Automatic point snapping

- **Bottom Panel:**
  - Paginated results table
  - Columns: X, Y, R, Result (Hit/Miss), Check Time
  - 10 rows per page by default
  - Sortable and filterable

### UI Framework: PrimeNG
- Professional component library
- Responsive design using PrimeFlex
- Toast notifications for user feedback
- Dialog components for modals

## ⚙️ Configuration

### Backend Configuration (`application.properties`)

```properties
# Server
server.port=8080
server.servlet.context-path=/api

# Database Configuration
spring.datasource.url=jdbc:postgresql://localhost:5432/studs
spring.datasource.driver-class-name=org.postgresql.Driver

# JPA/Hibernate
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=false

# JWT Configuration
jwt.secret=MySuperSecretKeyForLab4Variant32434212MustBeLongEnoughForHS512Algorithm
jwt.expiration=86400000  # 24 hours in milliseconds
```

### Frontend Configuration

CORS is enabled on backend for frontend requests:
```java
@CrossOrigin(origins = "*")
```

API base URL: `http://localhost:8080/api`

## 🧪 Testing

### Backend Tests
```bash
cd lab4-backend
./gradlew test
```

### Frontend Tests
```bash
cd lab4-front
npm test
```

## 📦 Building for Production

### Backend Production Build

```bash
cd lab4-backend
./gradlew clean build -Pproduction
```

Creates an executable JAR: `lab4-backend/build/libs/app-*.jar`

### Frontend Production Build

```bash
cd lab4-front
npm run build
```

Output: `lab4-front/dist/lab4-front/`

### Full Integration

Copy the frontend build to backend static resources:

```bash
./copy-frontend-to-backend.sh
```

Then run backend from JAR file:

```bash
java -jar lab4-backend/build/libs/app-0.0.1-SNAPSHOT.jar
```

Access application at: `http://localhost:8080`

## 🔧 Development Tips

### Running Backend in Development Mode

```bash
cd lab4-backend
./gradlew bootRun
```

With hot reload and live reload enabled.

### Running Frontend in Development Mode

```bash
cd lab4-front
npm start
```

With Angular CLI hot reload on file changes.

### Debugging

**Backend:** Use IDE debugger with Spring Boot Debug Configuration

**Frontend:** Use Chrome DevTools or Angular DevTools extension

## 📚 API Documentation

### Authentication Service

```typescript
// Login
authService.login(request: AuthRequest): Observable<AuthResponse>

// Register
authService.register(request: AuthRequest): Observable<any>

// Logout
authService.logout(): void

// Check if authenticated
authService.isAuthenticated(): Observable<boolean>

// Get stored username
authService.getUsername(): string
```

### Point Service

```typescript
// Get all user points
pointService.getPoints(): Observable<PointResult[]>

// Add a new point
pointService.addPoint(request: PointRequest): Observable<PointResult>

// Clear all points
pointService.clearPoints(): Observable<any>
```

## 🐛 Troubleshooting

### Database Connection Issues
```bash
# Check PostgreSQL is running
psql -U postgres -d studs -c "SELECT 1"

# Check credentials in application.properties
```

### Frontend Build Issues
```bash
# Clear node_modules and reinstall
rm -rf lab4-front/node_modules package-lock.json
npm install
```

### CORS Errors
Ensure backend is configured with:
```java
@CrossOrigin(origins = "*")
```

### JWT Token Expiration
After 24 hours, user must login again to receive a new token.

