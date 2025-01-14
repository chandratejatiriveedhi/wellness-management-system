#!/bin/bash

echo "Setting up Wellness Management System..."

# Check prerequisites
echo "Checking prerequisites..."

check_command() {
    if ! command -v $1 &> /dev/null; then
        echo "$2 not found. Please install $2"
        exit 1
    fi
}

check_command java "Java 11 or later"
check_command mvn "Maven"
check_command node "Node.js"
check_command npm "npm"

# Setup Backend
echo "Setting up backend..."
cd backend
echo "Building backend with Maven..."
mvn clean install

# Setup Frontend
echo "Setting up frontend..."
cd ../frontend
echo "Installing frontend dependencies..."
npm install

# Create .env file
echo "Creating frontend environment configuration..."
echo "REACT_APP_API_URL=http://localhost:8080" > .env

echo ""
echo "Setup complete!"
echo ""
echo "To start the application:"
echo "1. Start backend: cd backend && mvn spring-boot:run"
echo "2. Start frontend: cd frontend && npm start"
