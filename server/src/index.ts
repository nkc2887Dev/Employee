import { createConnection, initializeDatabase } from './config/db.config';
import app from './app';

const startServer = async () => {
  try {
    const PORT = process.env.PORT || 5000;
    
    // Initialize database with tables, indexes, and default data
    await initializeDatabase();
    
    // Test connection
    const connection = await createConnection();
    await connection.end();
    
    app.listen(PORT, () => {
      console.info(`Server is running on port ${PORT}`);
    });
  } catch (error: unknown) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer(); 