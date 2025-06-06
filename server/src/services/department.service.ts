import pool from '../config/database';
import { DepartmentFilters, Department } from '../@types/department.interface';
import { AppError } from '../middlewares/error.middleware';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

export const departmentService = {
  // Get all departments with pagination and filters
  getDepartments: async (filters: DepartmentFilters) => {
    try {
      const { status, search, page = 1, limit = 10 } = filters;
      const offset = (page - 1) * limit;

      // Base query for both count and data
      let baseQuery = `
        FROM departments d
        LEFT JOIN (
          SELECT department_id, COUNT(*) as emp_count
          FROM employees
          GROUP BY department_id
        ) e ON d.id = e.department_id
        WHERE 1=1
      `;
      const params: any[] = [];

      if (status) {
        baseQuery += ' AND d.status = ?';
        params.push(status);
      }

      if (search) {
        baseQuery += ' AND d.name LIKE ?';
        params.push(`%${search}%`);
      }

      // Get total count
      const countQuery = `SELECT COUNT(*) as total ${baseQuery}`;
      const [countResult] = await pool.query<RowDataPacket[]>(countQuery, params);
      const total = countResult[0].total;

      // Get paginated results with employee count
      const dataQuery = `
        SELECT 
          d.*,
          COALESCE(e.emp_count, 0) as employee_count
        ${baseQuery}
        ORDER BY d.id DESC
        LIMIT ? OFFSET ?
      `;
      
      // Clone params array and add pagination parameters
      const dataParams = [...params, limit, offset];
      const [rows] = await pool.query<RowDataPacket[]>(dataQuery, dataParams);

      return {
        data: rows,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      };
    } catch (error) {
      console.error('Error in getDepartments service:', error);
      throw new AppError('Failed to fetch departments', 500);
    }
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