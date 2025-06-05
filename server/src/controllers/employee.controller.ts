import { Request, Response, NextFunction } from 'express';
import { AppError } from '../middlewares/error.middleware';
import { createConnection } from '../config/db.config';
import { ResultSetHeader, RowDataPacket } from 'mysql2';

interface Employee extends RowDataPacket {
  id: number;
  department_id: number;
  name: string;
  email: string;
  phone: string;
  dob: string;
  salary: number;
  status: 'active' | 'inactive';
  photo?: string;
}

export const createEmployee = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const conn = await createConnection();
    const [result] = await conn.execute<ResultSetHeader>('INSERT INTO employees SET ?', [req.body]);
    await conn.end();
    res.status(201).json({ message: 'Employee created successfully', data: result });
  } catch (error) {
    next(new AppError('Failed to create employee', 500));
  }
};

export const getAllEmployees = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const conn = await createConnection();
    const [rows] = await conn.execute<Employee[]>('SELECT * FROM employees');
    await conn.end();
    res.json({ data: rows });
  } catch (error) {
    next(new AppError('Failed to fetch employees', 500));
  }
};

export const getEmployeeById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const conn = await createConnection();
    const [rows] = await conn.execute<Employee[]>('SELECT * FROM employees WHERE id = ?', [req.params.id]);
    await conn.end();
    if (rows.length === 0) {
      return next(new AppError('Employee not found', 404));
    }
    res.json({ data: rows[0] });
  } catch (error) {
    next(new AppError('Failed to fetch employee', 500));
  }
};

export const updateEmployee = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const conn = await createConnection();
    const [result] = await conn.execute<ResultSetHeader>('UPDATE employees SET ? WHERE id = ?', [req.body, req.params.id]);
    await conn.end();
    res.json({ message: 'Employee updated successfully', data: result });
  } catch (error) {
    next(new AppError('Failed to update employee', 500));
  }
};

export const deleteEmployee = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const conn = await createConnection();
    const [result] = await conn.execute<ResultSetHeader>('DELETE FROM employees WHERE id = ?', [req.params.id]);
    await conn.end();
    res.json({ message: 'Employee deleted successfully', data: result });
  } catch (error) {
    next(new AppError('Failed to delete employee', 500));
  }
};

export const getEmployeeStats = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const conn = await createConnection();
    const [salaryStats] = await conn.execute<RowDataPacket[]>(`
      SELECT d.name as department, MAX(e.salary) as highest_salary
      FROM employees e
      JOIN departments d ON e.department_id = d.id
      GROUP BY d.id, d.name
    `);
    await conn.end();
    res.json({ data: salaryStats });
  } catch (error) {
    next(new AppError('Failed to fetch employee statistics', 500));
  }
}; 