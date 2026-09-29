import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initializeDatabase } from './database.js';

// Route imports
import authRoutes from './routes/auth.js';
import patientRoutes from './routes/patients.js';
import doctorRoutes from './routes/doctors.js';
import triageRoutes from './routes/triage.js';
import facilityRoutes from './routes/facilities.js';
import campRoutes from './routes/camps.js';
import medicineRoutes from './routes/medicines.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));

async function start() {
  await initializeDatabase();

  // Mount routes
  app.use('/api/auth', authRoutes);
  app.use('/api/patients', patientRoutes);
  app.use('/api/doctors', doctorRoutes);
  app.use('/api/triage', triageRoutes);
  app.use('/api/facilities', facilityRoutes);
  app.use('/api/camps', campRoutes);
  app.use('/api', medicineRoutes);

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ success: true, data: { status: 'ok', timestamp: new Date().toISOString() } });
  });

  // 404 handler
  app.use((req, res) => {
    res.status(404).json({ success: false, error: 'Route not found' });
  });

  // Global error handler
  app.use((err, req, res, _next) => {
    console.error('Unhandled error:', err);
    res.status(500).json({ success: false, error: 'Internal server error' });
  });

  app.listen(PORT, () => {
    console.log(`Healora server running on port ${PORT}`);
  });
}

start().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});

export default app;
