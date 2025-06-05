# Employee Management System

A full-stack MERN application for managing employee data with advanced statistics and department management.

## Features

- Employee listing with pagination
- Add/Edit/Delete employees
- Department management
- Advanced statistics:
  - Department-wise highest salary
  - Salary range distribution
  - Youngest employees by department

## Tech Stack

- **Frontend**: React.js with TypeScript, Redux Toolkit, React Query
- **Backend**: Node.js, Express.js
- **Database**: MySQL
- **Other Tools**: 
  - Vite for frontend build
  - JWT for authentication
  - Zod for validation
  - Tailwind CSS for styling

## Project Structure

```
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── assets/        # Static assets
│   │   ├── components/    # Reusable components
│   │   ├── features/      # Feature-based modules
│   │   ├── hooks/        # Custom hooks
│   │   ├── layouts/      # Layout components
│   │   ├── pages/        # Page components
│   │   ├── services/     # API services
│   │   ├── store/        # Redux store
│   │   ├── types/        # TypeScript types
│   │   └── utils/        # Utility functions
│   └── ...
├── server/                # Backend Node.js application
│   ├── src/
│   │   ├── config/       # Configuration files
│   │   ├── controllers/  # Route controllers
│   │   ├── middleware/   # Custom middleware
│   │   ├── models/       # Database models
│   │   ├── routes/       # API routes
│   │   ├── services/     # Business logic
│   │   ├── types/        # TypeScript types
│   │   └── utils/        # Utility functions
│   └── ...
```

## Getting Started

### Prerequisites

- Node.js >= 18
- MySQL >= 8.0
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
```

2. Install dependencies:
```bash
# Install frontend dependencies
cd client
npm install

# Install backend dependencies
cd ../server
npm install
```

3. Set up environment variables:
```bash
# In server directory
cp .env.example .env
# Update .env with your MySQL credentials

# In client directory
cp .env.example .env
```

4. Initialize database:
```bash
# In server directory
npm run db:setup
```

5. Start the development servers:
```bash
# Start backend server (from server directory)
npm run dev

# Start frontend development server (from client directory)
npm run dev
```

## API Documentation

The API documentation is available at `/api-docs` when running the server locally.

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request 