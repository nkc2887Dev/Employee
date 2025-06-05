import { Request, Response, NextFunction } from 'express';
import { AppError } from '../middlewares/error.middleware';
import { createConnection } from '../config/db.config';
import { ResultSetHeader, RowDataPacket } from 'mysql2';

interface Department extends RowDataPacket {
  id: number;
  name: string;
  status: 'active' | 'inactive';
}

export const createDepartment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const conn = await createConnection();
    const [result] = await conn.execute<ResultSetHeader>('INSERT INTO departments SET ?', [req.body]);
    await conn.end();
    res.status(201).json({ message: 'Department created successfully', data: result });
  } catch (error) {
    next(new AppError('Failed to create department', 500));
  }
};

export const getAllDepartments = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const conn = await createConnection();
    const [rows] = await conn.execute<Department[]>('SELECT * FROM departments');
    await conn.end();
    res.json({ data: rows });
  } catch (error) {
    next(new AppError('Failed to fetch departments', 500));
  }
};

export const getDepartmentById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const conn = await createConnection();
    const [rows] = await conn.execute<Department[]>('SELECT * FROM departments WHERE id = ?', [req.params.id]);
    await conn.end();
    if (rows.length === 0) {
      return next(new AppError('Department not found', 404));
    }
    res.json({ data: rows[0] });
  } catch (error) {
    next(new AppError('Failed to fetch department', 500));
  }
};

export const updateDepartment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const conn = await createConnection();
    const [result] = await conn.execute<ResultSetHeader>('UPDATE departments SET ? WHERE id = ?', [req.body, req.params.id]);
    await conn.end();
    res.json({ message: 'Department updated successfully', data: result });
  } catch (error) {
    next(new AppError('Failed to update department', 500));
  }
};

export const deleteDepartment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const conn = await createConnection();
    const [result] = await conn.execute<ResultSetHeader>('DELETE FROM departments WHERE id = ?', [req.params.id]);
    await conn.end();
    res.json({ message: 'Department deleted successfully', data: result });
  } catch (error) {
    next(new AppError('Failed to delete department', 500));
  }
}; 