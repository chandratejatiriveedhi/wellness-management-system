# Wellness Management System

A comprehensive management system for wellness activities including Pilates, Massage, Nutrition, and Yoga.

## Tech Stack

- Frontend: React with Tailwind CSS
- Backend: Spring Boot
- Database: H2 (for development)

## Features

- User authentication and authorization
- Activity management
- Schedule management
- Attendance tracking
- Evaluation management
- Analytics and reporting

## Getting Started

### Prerequisites

- Java JDK 11+
- Node.js 14+
- Maven 3.6+

### Installation

1. Clone the repository
2. Backend setup:
   ```bash
   cd backend
   mvn clean install
   mvn spring-boot:run
   ```
3. Frontend setup:
   ```bash
   cd frontend
   npm install
   npm start
   ```

## Project Structure

```
wellness-management-system/
├── frontend/                # React frontend application
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── App.js         # Main application component
│   │   └── index.js       # Application entry point
│   ├── package.json       # Frontend dependencies
│   └── tailwind.config.js # Tailwind CSS configuration
└── backend/               # Spring Boot backend application
    ├── src/
    │   └── main/
    │       ├── java/
    │       │   └── com/wellness/management/
    │       │       ├── config/       # Security configurations
    │       │       ├── controller/   # REST controllers
    │       │       ├── model/        # Entity classes
    │       │       ├── repository/   # JPA repositories
    │       │       ├── service/      # Business logic
    │       │       └── util/         # Utility classes
    │       └── resources/
    │           └── application.properties
    └── pom.xml            # Backend dependencies
```