import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { connectDB } from './backend/config/db.js';
import authRoutes from './backend/routes/authRoutes.js';
import aiRoutes from './backend/routes/aiRoutes.js';
import dotenv from 'dotenv';

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Connect to MongoDB or activate disk-persisted offline database
  await connectDB();

  // Configure JSON and URL body parsing with high limit supports for resumes
  app.use(express.json({ limit: '12mb' }));
  app.use(express.urlencoded({ extended: true, limit: '12mb' }));

  // Mount clean backend security API endpoints
  app.use('/api/auth', authRoutes);
  app.use('/api/ai', aiRoutes);

  // Health probe
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', serverTime: new Date() });
  });

  // Hot module replacement or static file server deployment
  if (process.env.NODE_ENV !== "production") {
    console.log("🛠️ App booting with Vite middleware for responsive HMR live views...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("📦 Production assets configuration activated. Serving '/dist' directly...");
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`📡 Platform server running successfully on port ${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("💥 Critical startup failure inside platform bootstrapper:", err);
});
console.log("Mongo URI:", process.env.MONGODB_URI);