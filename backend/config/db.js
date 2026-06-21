import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';

export const dbState = {
  isMock: false,
  dataFile: path.join(process.cwd(), 'data_db.json'),
  data: {
    users: [],
    interviews: [],
    resumes: [],
  }
};

// Initialize JSON database fallback
try {
  const dir = path.dirname(dbState.dataFile);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  if (!fs.existsSync(dbState.dataFile)) {
    fs.writeFileSync(dbState.dataFile, JSON.stringify(dbState.data, null, 2));
  } else {
    const raw = fs.readFileSync(dbState.dataFile, 'utf8');
    dbState.data = JSON.parse(raw);
    if (!dbState.data.users) dbState.data.users = [];
    if (!dbState.data.interviews) dbState.data.interviews = [];
    if (!dbState.data.resumes) dbState.data.resumes = [];
  }
} catch (e) {
  console.error("Local database fallback read/write failed:", e);
}

export const saveMockDb = () => {
  try {
    fs.writeFileSync(dbState.dataFile, JSON.stringify(dbState.data, null, 2));
  } catch (e) {
    console.error("Failed to persist local storage DB changes:", e);
  }
};

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI;
  if (!uri || (!uri.startsWith('mongodb://') && !uri.startsWith('mongodb+srv://'))) {
    console.warn("⚠️ MONGODB_URI not found or invalid format. Running with robust disk-backed local storage file '/data_db.json'!");
    dbState.isMock = true;
    return;
  }
  try {
    await mongoose.connect(uri);
    console.log("🚀 Connected to MongoDB atlas successfully!");
  } catch (err) {
    console.error(`MongoDB connection failed: ${err.message}. Falling back to disk-backed local storage.`);
    dbState.isMock = true;
  }
};
