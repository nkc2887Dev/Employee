import express, { Application } from 'express';
import cors from 'cors';
import { config } from 'dotenv';
import { errorHandler } from './middlewares/error.middleware';

// Routes
import employeeRoutes from './routes/employee.routes';
import departmentRoutes from './routes/department.routes';

// Load environment variables
config();

const app: Application = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static file serving
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api/employees', employeeRoutes);
app.use('/api/departments', departmentRoutes);

// Error handling middleware
app.use(errorHandler);

export default app; 