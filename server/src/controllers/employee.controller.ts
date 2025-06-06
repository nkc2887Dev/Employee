import { Request, Response, NextFunction } from 'express';
import { AppError } from '../middlewares/error.middleware';
import { createConnection } from '../config/db.config';
import { ResultSetHeader, RowDataPacket } from 'mysql2';
import { employeeService } from '../services/employee.service';

interface Employee extends RowDataPacket {
  id: number;
  department_id: number;
  department_name?: string;
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
    
    // Check if email already exists
    const [existingEmployees] = await conn.execute<Employee[]>(
      'SELECT id FROM employees WHERE email = ?',
      [req.body.email]
    );

    if (existingEmployees.length > 0) {
      await conn.end();
      return next(new AppError('Email already exists', 400));
    }

    // Check if department exists
    const [departments] = await conn.execute<Employee[]>(
      'SELECT id FROM departments WHERE id = ?',
      [req.body.department_id]
    );

    if (departments.length === 0) {
      await conn.end();
      return next(new AppError('Invalid department ID', 400));
    }

    // Extract values from request body
    const { name, email, phone, dob, department_id, salary, status, photo } = req.body;

    // Create employee with explicit column names
    const [result] = await conn.execute<ResultSetHeader>(
      `INSERT INTO employees (name, email, phone, dob, department_id, salary, status, photo) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [name, email, phone, dob, department_id, salary, status, photo || null]
    );
    
    // Get the created employee
    const [employees] = await conn.execute<Employee[]>(
      'SELECT * FROM employees WHERE id = ?',
      [result.insertId]
    );
    
    await conn.end();
    
    if (employees.length === 0) {
      return next(new AppError('Failed to create employee', 500));
    }

    res.status(201).json({ 
      message: 'Employee created successfully', 
      data: employees[0]
    });
  } catch (error: any) {
    console.error('Error creating employee:', error);
    if (error.code === 'ER_DUP_ENTRY') {
      next(new AppError('Email already exists', 400));
    } else {
      next(new AppError(error.message || 'Failed to create employee', 500));
    }
  }
};

export const getAllEmployees = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const filters = {
      page: parseInt(req.query.page as string) || 1,
      limit: parseInt(req.query.limit as string) || 10,
      status: req.query.status as string,
      department: parseInt(req.query.department as string),
      search: req.query.search as string
    };

    const result = await employeeService.getEmployees(filters);
    console.log('result: ', result);
    res.json({
      data: result.data,
      pagination: {
        total: result.total,
        page: result.page,
        limit: result.limit,
        totalPages: Math.ceil(result.total / result.limit)
      }
    });
  } catch (error) {
    console.error('Error fetching employees:', error);
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

    // Check if employee exists
    const [existingEmployee] = await conn.execute<Employee[]>(
      'SELECT * FROM employees WHERE id = ?',
      [req.params.id]
    );

    if (existingEmployee.length === 0) {
      await conn.end();
      return next(new AppError('Employee not found', 404));
    }

    // Remove email from update data if present
    const { email, ...updateData } = req.body;

    // Create the SET clause dynamically based on provided fields
    const updateFields: string[] = [];
    const updateValues: any[] = [];

    if (updateData.name !== undefined) {
      updateFields.push('name = ?');
      updateValues.push(updateData.name);
    }
    if (updateData.phone !== undefined) {
      updateFields.push('phone = ?');
      updateValues.push(updateData.phone);
    }
    if (updateData.dob !== undefined) {
      updateFields.push('dob = ?');
      updateValues.push(updateData.dob);
    }
    if (updateData.department_id !== undefined) {
      updateFields.push('department_id = ?');
      updateValues.push(updateData.department_id);
    }
    if (updateData.salary !== undefined) {
      updateFields.push('salary = ?');
      updateValues.push(updateData.salary);
    }
    if (updateData.status !== undefined) {
      updateFields.push('status = ?');
      updateValues.push(updateData.status);
    }
    if (updateData.photo !== undefined) {
      updateFields.push('photo = ?');
      updateValues.push(updateData.photo);
    }

    if (updateFields.length === 0) {
      await conn.end();
      return next(new AppError('No fields to update', 400));
    }

    // Add the ID to the values array
    updateValues.push(req.params.id);

    // Update employee with explicit SET clause
    await conn.execute<ResultSetHeader>(
      `UPDATE employees SET ${updateFields.join(', ')} WHERE id = ?`,
      updateValues
    );

    // Get updated employee data
    const [updatedEmployee] = await conn.execute<Employee[]>(
      'SELECT * FROM employees WHERE id = ?',
      [req.params.id]
    );

    await conn.end();

    res.json({ 
      message: 'Employee updated successfully',
      data: updatedEmployee[0]
    });
  } catch (error: any) {
    console.error('Error updating employee:', error);
    next(new AppError(error.message || 'Failed to update employee', 500));
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
    
    // 1. Department wise highest salary
    const [departmentHighestSalary] = await conn.execute<RowDataPacket[]>(`
      SELECT 
        d.name as department, 
        MAX(e.salary) as salary
      FROM departments d
      LEFT JOIN employees e ON e.department_id = d.id
      GROUP BY d.id, d.name
      ORDER BY salary DESC
    `);

    // 2. Salary range wise employee count
    const [salaryRangeCount] = await conn.execute<RowDataPacket[]>(`
      SELECT 
        CASE
          WHEN salary <= 50000 THEN '0-50000'
          WHEN salary > 50000 AND salary <= 100000 THEN '50001-100000'
          ELSE '100000+'
        END as \`range\`,
        COUNT(*) as count
      FROM employees
      GROUP BY 
        CASE
          WHEN salary <= 50000 THEN '0-50000'
          WHEN salary > 50000 AND salary <= 100000 THEN '50001-100000'
          ELSE '100000+'
        END
      ORDER BY 
        CASE \`range\`
          WHEN '0-50000' THEN 1
          WHEN '50001-100000' THEN 2
          ELSE 3
        END
    `);

    // 3. Name and age of youngest employee by department
    const [youngestByDepartment] = await conn.execute<RowDataPacket[]>(`
      SELECT 
        d.name as department,
        e.name,
        TIMESTAMPDIFF(YEAR, e.dob, CURDATE()) as age
      FROM departments d
      LEFT JOIN employees e ON e.department_id = d.id
      WHERE (e.department_id, e.dob) IN (
        SELECT 
          department_id,
          MAX(dob) as max_dob
        FROM employees
        GROUP BY department_id
      ) OR e.id IS NULL
      ORDER BY d.name
    `);

    await conn.end();
    
    const result = {
      departmentHighestSalary: departmentHighestSalary || [],
      salaryRangeCount: salaryRangeCount || [],
      youngestByDepartment: youngestByDepartment || []
    };

    res.json(result);
  } catch (error: any) {
    console.error('Error in getEmployeeStats:', error);
    next(new AppError(error.message || 'Failed to fetch employee statistics', 500));
  }
}; 