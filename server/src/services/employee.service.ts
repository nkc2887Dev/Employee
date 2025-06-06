import pool from '../config/database';
import { EmployeeFilters, Employee, EmployeeStats } from '../@types/employee.interface';
import { AppError } from '../middlewares/error.middleware';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

export const employeeService = {
  // Get all employees with pagination and filters
  getEmployees: async (filters: EmployeeFilters) => {
    try {
      console.log('filters: ', filters);
      const { status, department, search, page = 1, limit = 10 } = filters;
      const offset = (page - 1) * limit;

      // Base query for both count and data
      let baseQuery = `
        FROM employees e
        LEFT JOIN departments d ON e.department_id = d.id
        WHERE 1=1
      `;
      const params: any[] = [];

      if (status) {
        baseQuery += ' AND e.status = ?';
        params.push(status);
      }

      if (department) {
        baseQuery += ' AND e.department_id = ?';
        params.push(department);
      }

      if (search) {
        baseQuery += ' AND (e.name LIKE ? OR e.email LIKE ?)';
        params.push(`%${search}%`, `%${search}%`);
      }

      // Get total count
      const countQuery = `SELECT COUNT(*) as total ${baseQuery}`;
      const [countResult] = await pool.query<RowDataPacket[]>(countQuery, params);
      console.log('countResult: ', countResult);
      const total = countResult[0].total;

      // Get paginated results
      const dataQuery = `
        SELECT 
          e.*,
          d.name as department_name
        ${baseQuery}
        ORDER BY e.id DESC
        LIMIT ? OFFSET ?
      `;
      
      // Clone params array and add pagination parameters
      const dataParams = [...params, limit, offset];
      const [rows] = await pool.query<RowDataPacket[]>(dataQuery, dataParams);
      console.log('rows: ', rows);
      return {
        data: rows,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      };
    } catch (error) {
      console.error('Error in getEmployees service:', error);
      throw new AppError('Failed to fetch employees', 500);
    }
  },

  // Get employee statistics
  getStatistics: async (): Promise<EmployeeStats> => {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      // Get department-wise highest salary
      const [highestSalaries] = await connection.query<RowDataPacket[]>(`
        SELECT d.name as department, MAX(e.salary) as salary
        FROM employees e
        JOIN departments d ON e.department_id = d.id
        WHERE e.status = 'active'
        GROUP BY d.id, d.name
      `);

      // Get salary range distribution
      const [salaryRanges] = await connection.query<RowDataPacket[]>(`
        SELECT 
          CASE 
            WHEN salary <= 50000 THEN '0-50000'
            WHEN salary <= 100000 THEN '50001-100000'
            ELSE '100000+'
          END as range,
          COUNT(*) as count
        FROM employees
        WHERE status = 'active'
        GROUP BY 
          CASE 
            WHEN salary <= 50000 THEN '0-50000'
            WHEN salary <= 100000 THEN '50001-100000'
            ELSE '100000+'
          END
      `);

      // Get youngest employee by department
      const [youngestEmployees] = await connection.query<RowDataPacket[]>(`
        SELECT d.name as department, e.name, 
          TIMESTAMPDIFF(YEAR, e.dob, CURDATE()) as age
        FROM employees e
        JOIN departments d ON e.department_id = d.id
        WHERE e.id IN (
          SELECT e2.id
          FROM employees e2
          WHERE e2.department_id = d.id
          AND e2.status = 'active'
          ORDER BY e2.dob DESC
          LIMIT 1
        )
      `);

      await connection.commit();

      return {
        departmentHighestSalary: highestSalaries as { department: string; salary: number }[],
        salaryRangeCount: salaryRanges as { range: string; count: number }[],
        youngestByDepartment: youngestEmployees as { department: string; name: string; age: number }[],
      };
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  },

  // Get single employee by ID
  getEmployeeById: async (id: number): Promise<Employee | null> => {
    const [rows] = await pool.query<RowDataPacket[]>(
      `SELECT e.*, d.name as department_name 
       FROM employees e
       LEFT JOIN departments d ON e.department_id = d.id
       WHERE e.id = ?`,
      [id]
    );
    return rows[0] as Employee || null;
  },

  // Create new employee
  createEmployee: async (data: Omit<Employee, 'id' | 'created_at' | 'modified_at'>): Promise<Employee> => {
    const [result] = await pool.query<ResultSetHeader>(
      'INSERT INTO employees SET ?',
      data
    );
    return employeeService.getEmployeeById(result.insertId) as Promise<Employee>;
  },

  // Update employee
  updateEmployee: async (
    id: number,
    data: Partial<Omit<Employee, 'id' | 'created_at' | 'modified_at'>>
  ): Promise<Employee | null> => {
    const [result] = await pool.query<ResultSetHeader>(
      'UPDATE employees SET ? WHERE id = ?',
      [data, id]
    );
    if (result.affectedRows === 0) {
      return null;
    }
    return employeeService.getEmployeeById(id);
  },

  // Delete employee
  deleteEmployee: async (id: number): Promise<void> => {
    const [result] = await pool.query<ResultSetHeader>(
      'DELETE FROM employees WHERE id = ?',
      [id]
    );
    if (result.affectedRows === 0) {
      throw new AppError('Employee not found', 404);
    }
  },
}; 