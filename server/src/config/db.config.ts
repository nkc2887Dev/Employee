import mysql from 'mysql2/promise';
import { config } from 'dotenv';

// Load environment variables
config();

const createIndexIfNotExists = async (
  connection: mysql.Connection,
  table: string,
  indexName: string,
  column: string
) => {
  try {
    await connection.execute(`
      SELECT COUNT(1) IndexExists FROM INFORMATION_SCHEMA.STATISTICS
      WHERE table_schema=DATABASE() AND table_name=? AND index_name=?
    `, [table, indexName]);

    await connection.execute(`
      CREATE INDEX ${indexName} ON ${table}(${column})
    `);
  } catch (error) {
    // Index might already exist, which is fine
    console.info(`Note: Index ${indexName} might already exist`);
  }
};

export const initializeDatabase = async () => {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'password',
    database: process.env.DB_NAME || 'employee_management'
  });

  try {
    // Create tables
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS departments (
        id INT PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(100) NOT NULL,
        status ENUM('active', 'inactive') DEFAULT 'active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        modified_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    await connection.execute(`
      CREATE TABLE IF NOT EXISTS employees (
        id INT PRIMARY KEY AUTO_INCREMENT,
        department_id INT NOT NULL,
        name VARCHAR(100) NOT NULL,
        dob DATE NOT NULL,
        phone VARCHAR(20) NOT NULL,
        photo VARCHAR(255),
        email VARCHAR(100) NOT NULL UNIQUE,
        salary DECIMAL(10, 2) NOT NULL,
        status ENUM('active', 'inactive') DEFAULT 'active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        modified_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (department_id) REFERENCES departments(id)
      )
    `);

    // Create indexes if they don't exist
    await createIndexIfNotExists(connection, 'employees', 'idx_employee_department', 'department_id');
    await createIndexIfNotExists(connection, 'employees', 'idx_employee_status', 'status');
    await createIndexIfNotExists(connection, 'employees', 'idx_employee_email', 'email');
    await createIndexIfNotExists(connection, 'departments', 'idx_department_status', 'status');

    console.info('Database initialized successfully with tables, indexes, and default data');
  } catch (error) {
    console.error('Database initialization failed:', error);
    throw error;
  } finally {
    await connection.end();
  }
};

export const createConnection = async () => {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || 'password',
      database: process.env.DB_NAME || 'employee_management'
    });

    return connection;
  } catch (error) {
    console.error('Database connection failed:', error);
    throw error;
  }
}; 