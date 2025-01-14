# Local Development Setup Guide

## Prerequisites

Before you begin, ensure you have the following installed:
1. Java JDK 11 or later
2. Node.js 14 or later
3. Maven 3.6 or later
4. Git
5. Your favorite IDE (recommended: IntelliJ IDEA for backend, VS Code for frontend)

## Backend Setup

1. Clone the repository:
```bash
git clone https://github.com/chandratejatiriveedhi/wellness-management-system.git
cd wellness-management-system
```

2. Navigate to backend directory:
```bash
cd backend
```

3. Install dependencies and build:
```bash
mvn clean install
```

4. Run the Spring Boot application:
```bash
mvn spring-boot:run
```

The backend server will start at http://localhost:8080

### Database Setup
By default, the application uses H2 in-memory database. You can access the H2 console at:
http://localhost:8080/h2-console

Connection details (as per application.properties):
- JDBC URL: jdbc:h2:mem:wellnessdb
- Username: sa
- Password: (leave empty)

## Frontend Setup

1. Open a new terminal and navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a .env file in the frontend directory:
```bash
echo "REACT_APP_API_URL=http://localhost:8080" > .env
```

4. Start the development server:
```bash
npm start
```

The frontend application will start at http://localhost:3000

## Default Users

The system comes with these default users for testing:

```
Administrator:
- Username: admin
- Password: admin123

Teacher:
- Username: teacher
- Password: teacher123

Student:
- Username: student
- Password: student123
```

## Testing the Application

1. Access the application at http://localhost:3000
2. Log in using one of the default user credentials
3. Explore the different features based on your user role:
   - Activity Management
   - Schedule Management
   - Evaluation System
   - Analytics Dashboard

## Common Issues and Solutions

1. Backend won't start:
   - Check if port 8080 is available
   - Verify Java version: `java -version`
   - Check application.properties configuration

2. Frontend development server issues:
   - Clear npm cache: `npm cache clean --force`
   - Delete node_modules and reinstall: `rm -rf node_modules && npm install`
   - Check if port 3000 is available

3. Database connection issues:
   - Verify H2 console is accessible
   - Check database credentials in application.properties

## Development Workflow

1. Backend Development:
   - Use an IDE like IntelliJ IDEA
   - Run tests: `mvn test`
   - Access API documentation: http://localhost:8080/swagger-ui.html

2. Frontend Development:
   - Use VS Code with recommended extensions:
     - ESLint
     - Prettier
     - React Developer Tools
   - Run tests: `npm test`
   - Build production: `npm run build`

## API Endpoints

Main API endpoints available:

1. Authentication:
   - POST /api/auth/login - Login endpoint
   - POST /api/auth/refresh - Refresh token

2. Users:
   - GET /api/users - Get all users
   - POST /api/users - Create new user
   - PUT /api/users/{id} - Update user
   - DELETE /api/users/{id} - Delete user

3. Activities:
   - GET /api/activities - Get all activities
   - POST /api/activities - Create new activity
   - PUT /api/activities/{id} - Update activity
   - DELETE /api/activities/{id} - Delete activity

4. Schedules:
   - GET /api/schedules - Get all schedules
   - POST /api/schedules - Create new schedule
   - PUT /api/schedules/{id} - Update schedule
   - DELETE /api/schedules/{id} - Delete schedule

5. Evaluations:
   - GET /api/evaluations - Get all evaluations
   - POST /api/evaluations - Create new evaluation
   - PUT /api/evaluations/{id} - Update evaluation
   - DELETE /api/evaluations/{id} - Delete evaluation

## Directory Structure

```
wellness-management-system/
├── frontend/                # React frontend application
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── utils/          # Utility functions
│   │   ├── App.js         # Main application component
│   │   └── index.js       # Entry point
│   ├── package.json       # Frontend dependencies
│   └── tailwind.config.js # Tailwind CSS configuration
└── backend/               # Spring Boot backend application
    ├── src/
    │   └── main/
    │       ├── java/      # Java source files
    │       └── resources/  # Configuration files
    └── pom.xml            # Backend dependencies
```