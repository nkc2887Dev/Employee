# Employee Management System - Backend

This is the backend server for the Employee Management System built with Node.js, Express, TypeScript, and MySQL.

## Features

- Employee CRUD operations with file upload
- Department management
- Employee statistics
  - Department-wise highest salary
  - Salary range distribution
  - Youngest employee by department
- Authentication and authorization
- Input validation using Zod
- Error handling middleware
- TypeScript for type safety
- MySQL database with proper indexing

## Prerequisites

- Node.js (v14 or higher)
- MySQL (v8 or higher)
- TypeScript

## Setup

1. Clone the repository and navigate to the server directory:
   ```bash
   cd server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file based on `.env.example`:
   ```bash
   cp .env.example .env
   ```

4. Update the environment variables in `.env` with your configuration.

5. Create the MySQL database:
   ```sql
   CREATE DATABASE employee_management;
   ```

6. Import the database schema:
   ```bash
   mysql -u your_username -p employee_management < src/config/schema.sql
   ```

7. Create the uploads directory:
   ```bash
   mkdir uploads
   ```

## Development

Start the development server:
```bash
npm run dev
```

## Production Build

1. Build the TypeScript code:
   ```bash
   npm run build
   ```

2. Start the production server:
   ```bash
   npm start
   ```

## API Documentation

### Employees

- `GET /api/employees` - Get all employees (with pagination and filters)
- `GET /api/employees/stats` - Get employee statistics
- `GET /api/employees/:id` - Get single employee
- `POST /api/employees` - Create new employee
- `PUT /api/employees/:id` - Update employee
- `DELETE /api/employees/:id` - Delete employee

### Departments

- `GET /api/departments` - Get all departments (with pagination and filters)
- `GET /api/departments/:id` - Get single department
- `POST /api/departments` - Create new department
- `PUT /api/departments/:id` - Update department
- `DELETE /api/departments/:id` - Delete department

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

## Project Structure

```
src/
├── config/         # Configuration files
├── controllers/    # Route controllers
├── interfaces/     # TypeScript interfaces
├── middlewares/    # Custom middlewares
├── models/         # Database models
├── routes/         # Route definitions
├── services/      # Business logic
├── utils/         # Utility functions
└── validations/   # Request validation schemas
```

## Error Handling

The application uses a centralized error handling middleware that:
- Handles operational errors with proper status codes
- Logs unexpected errors
- Sends appropriate error responses to clients

## File Upload

- Supports image uploads (jpg, jpeg, png)
- Maximum file size: 5MB
- Files are stored in the `uploads` directory
- File paths are stored in the database 