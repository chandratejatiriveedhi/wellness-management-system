@echo off
echo Setting up Wellness Management System...

REM Check prerequisites
echo Checking prerequisites...

where java >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo Java not found. Please install Java 11 or later
    exit /b 1
)

where mvn >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo Maven not found. Please install Maven
    exit /b 1
)

where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo Node.js not found. Please install Node.js
    exit /b 1
)

REM Setup Backend
echo Setting up backend...
cd backend
echo Building backend with Maven...
call mvn clean install

REM Setup Frontend
echo Setting up frontend...
cd ../frontend
echo Installing frontend dependencies...

REM Clean npm cache and remove existing node_modules
echo Cleaning npm cache...
call npm cache clean --force

if exist node_modules (
    echo Removing existing node_modules...
    rmdir /s /q node_modules
)

REM Install dependencies
echo Installing dependencies...
call npm install --legacy-peer-deps

REM Create .env file
echo Creating frontend environment configuration...
echo REACT_APP_API_URL=http://localhost:8080 > .env

echo.
echo Setup complete!
echo.
echo To start the application:
echo 1. Start backend: cd backend ^&^& mvn spring-boot:run
echo 2. Start frontend: cd frontend ^&^& npm start
