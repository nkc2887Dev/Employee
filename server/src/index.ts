import { createConnection } from './config/db.config';
import app from './app';

const startServer = async () => {
  try {
    const PORT = process.env.PORT || 5000;
    await createConnection();
    
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error: unknown) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer(); 