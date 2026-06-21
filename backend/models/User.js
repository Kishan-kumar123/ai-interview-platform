import mongoose from 'mongoose';
import { dbState, saveMockDb } from '../config/db.js';

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const MongoUserModel = mongoose.models.User || mongoose.model('User', UserSchema);

export class User {
  static async findOne({ email }) {
    if (dbState.isMock) {
      const lookupEmail = email.toLowerCase().trim();
      const u = dbState.data.users.find((user) => user.email.toLowerCase().trim() === lookupEmail);
      return u ? { ...u, id: u._id } : null;
    } else {
      return await MongoUserModel.findOne({ email });
    }
  }

  static async findById(id) {
    if (dbState.isMock) {
      const u = dbState.data.users.find((user) => user._id === id);
      return u ? { ...u, id: u._id } : null;
    } else {
      return await MongoUserModel.findById(id);
    }
  }

  static async create(userData) {
    if (dbState.isMock) {
      const newUser = {
        _id: 'u_' + Math.random().toString(36).substring(2, 11),
        name: userData.name,
        email: userData.email.toLowerCase().trim(),
        password: userData.password,
        createdAt: new Date()
      };
      dbState.data.users.push(newUser);
      saveMockDb();
      return { ...newUser, id: newUser._id };
    } else {
      const doc = new MongoUserModel(userData);
      await doc.save();
      return doc;
    }
  }
}
