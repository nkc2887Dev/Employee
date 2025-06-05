import mysql from 'mysql2/promise';
import { config } from 'dotenv';

// Load environment variables
config();

const createIndexIfNotExists = async (connection: mysql.Connection, tableName: string, indexName: string, columnName: string) => {
  try {
    const [rows]: any = await connection.execute(
      `SELECT COUNT(1) as indexExists
       FROM INFORMATION_SCHEMA.STATISTICS
       WHERE table_schema = DATABASE()
       AND table_name = ?
       AND index_name = ?`,
      [tableName, indexName]
    );

    if (rows[0].indexExists === 0) {
      await connection.execute(`CREATE INDEX ${indexName} ON ${tableName}(${columnName})`);
      console.log(`Created index ${indexName} on ${tableName}`);
    }
  } catch (error) {
    console.error(`Error creating index ${indexName}:`, error);
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

    console.log('Database connected successfully and tables/indexes created/verified');
    return connection;
  } catch (error) {
    console.error('Database connection failed:', error);
    throw error;
  }
}; 