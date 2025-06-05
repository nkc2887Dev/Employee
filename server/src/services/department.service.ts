import pool from '../config/database';
import { DepartmentFilters, Department } from '../@types/department.interface';
import { AppError } from '../middlewares/error.middleware';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

export const departmentService = {
  // Get all departments with pagination and filters
  getDepartments: async (filters: DepartmentFilters) => {
    const { status, search, page = 1, limit = 10 } = filters;
    const offset = (page - 1) * limit;

    let query = 'SELECT * FROM departments WHERE 1=1';
    const params: any[] = [];

    if (status) {
      query += ' AND status = ?';
      params.push(status);
    }

    if (search) {
      query += ' AND name LIKE ?';
      params.push(`%${search}%`);
    }

    // Get total count
    const [countResult] = await pool.query<RowDataPacket[]>(
      `SELECT COUNT(*) as total FROM (${query}) as subquery`,
      params
    );
    const total = countResult[0].total;

    // Get paginated results
    query += ' ORDER BY id DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const [rows] = await pool.query<RowDataPacket[]>(query, params);
    
    return {
      data: rows,
      total,
      page,
      limit,
    };
  },

  // Get single department by ID
  getDepartmentById: async (id: number): Promise<Department | null> => {
    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT * FROM departments WHERE id = ?',
      [id]
    );
    return rows[0] as Department || null;
  },

  // Create new department
  createDepartment: async (data: Omit<Department, 'id' | 'created_at' | 'modified_at'>): Promise<Department> => {
    const [result] = await pool.query<ResultSetHeader>(
      'INSERT INTO departments SET ?',
      data
    );
    return departmentService.getDepartmentById(result.insertId) as Promise<Department>;
  },

  // Update department
  updateDepartment: async (
    id: number,
    data: Partial<Omit<Department, 'id' | 'created_at' | 'modified_at'>>
  ): Promise<Department | null> => {
    const [result] = await pool.query<ResultSetHeader>(
      'UPDATE departments SET ? WHERE id = ?',
      [data, id]
    );
    if (result.affectedRows === 0) {
      return null;
    }
    return departmentService.getDepartmentById(id);
  },

  // Delete department
  deleteDepartment: async (id: number): Promise<void> => {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      // Check if department has employees
      const [employees] = await connection.query<RowDataPacket[]>(
        'SELECT COUNT(*) as count FROM employees WHERE department_id = ?',
        [id]
      );

      if (employees[0].count > 0) {
        throw new AppError('Cannot delete department with existing employees', 400);
      }

      // Delete department
      const [result] = await connection.query<ResultSetHeader>(
        'DELETE FROM departments WHERE id = ?',
        [id]
      );

      if (result.affectedRows === 0) {
        throw new AppError('Department not found', 404);
      }

      await connection.commit();
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  },
}; 