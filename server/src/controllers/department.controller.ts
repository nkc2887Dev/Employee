import { Request, Response, NextFunction } from 'express';
import { AppError } from '../middlewares/error.middleware';
import { departmentService } from '../services/department.service';
import { ResultSetHeader, RowDataPacket } from 'mysql2';
import pool from '../config/database';

interface Department extends RowDataPacket {
  id: number;
  name: string;
  status: 'active' | 'inactive';
  employee_count: number;
}

export const createDepartment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await departmentService.createDepartment(req.body);
    res.status(201).json({ message: 'Department created successfully', data: result });
  } catch (error) {
    next(new AppError('Failed to create department', 500));
  }
};

export const getAllDepartments = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const filters = {
      page: parseInt(req.query.page as string) || 1,
      limit: parseInt(req.query.limit as string) || 10,
      status: req.query.status as string,
      search: req.query.search as string,
    };

    const result = await departmentService.getDepartments(filters);

    res.json({
      data: result.data,
      pagination: {
        total: result.total,
        page: result.page,
        limit: result.limit,
        totalPages: Math.ceil(result.total / result.limit),
      },
    });
  } catch (error) {
    console.error('Error fetching departments:', error);
    next(new AppError('Failed to fetch departments', 500));
  }
};

export const getDepartmentById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const [rows] = await pool.query<Department[]>(
      `
      SELECT 
        d.id,
        d.name,
        d.status,
        COALESCE(COUNT(e.id), 0) as employee_count
      FROM departments d
      LEFT JOIN employees e ON e.department_id = d.id
      WHERE d.id = ?
      GROUP BY d.id, d.name, d.status
    `,
      [req.params.id],
    );

    if (rows.length === 0) {
      return next(new AppError('Department not found', 404));
    }

    // Convert BigInt to Number for JSON serialization
    const department = {
      ...rows[0],
      employee_count: Number(rows[0].employee_count),
    };

    res.json({
      data: department,
    });
  } catch (error) {
    console.error('Error fetching department:', error);
    next(new AppError('Failed to fetch department', 500));
  }
};

export const updateDepartment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Check if department exists
    const [existingDepartment] = await pool.query<Department[]>(
      'SELECT * FROM departments WHERE id = ?',
      [req.params.id],
    );

    if (existingDepartment.length === 0) {
      return next(new AppError('Department not found', 404));
    }

    // Create the SET clause dynamically based on provided fields
    const updateFields: string[] = [];
    const updateValues: any[] = [];

    if (req.body.name !== undefined) {
      updateFields.push('name = ?');
      updateValues.push(req.body.name);
    }
    if (req.body.status !== undefined) {
      updateFields.push('status = ?');
      updateValues.push(req.body.status);
    }

    if (updateFields.length === 0) {
      return next(new AppError('No fields to update', 400));
    }

    // Add the ID to the values array
    updateValues.push(req.params.id);

    // Update department with explicit SET clause
    await pool.query<ResultSetHeader>(
      `UPDATE departments SET ${updateFields.join(', ')} WHERE id = ?`,
      updateValues,
    );

    // Get the updated department
    const [updatedDepartment] = await pool.query<Department[]>(
      'SELECT * FROM departments WHERE id = ?',
      [req.params.id],
    );

    if (updatedDepartment.length === 0) {
      return next(new AppError('Failed to fetch updated department', 500));
    }

    res.json({
      message: 'Department updated successfully',
      data: updatedDepartment[0],
    });
  } catch (error: any) {
    console.error('Error updating department:', error);
    next(new AppError(error.message || 'Failed to update department', 500));
  }
};

export const deleteDepartment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const [result] = await pool.query<ResultSetHeader>('DELETE FROM departments WHERE id = ?', [
      req.params.id,
    ]);
    res.json({ message: 'Department deleted successfully', data: result });
  } catch (error) {
    next(new AppError('Failed to delete department', 500));
  }
};
