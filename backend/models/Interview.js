import mongoose from 'mongoose';
import { dbState, saveMockDb } from '../config/db.js';

const InterviewSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  type: { type: String, enum: ['technical', 'hr'], required: true },
  topic: { type: String, required: true },
  score: { type: Number, required: true },
  questionsCount: { type: Number, required: true },
  details: { type: Array, default: [] }, // array of { question, answer, feedback, score }
  createdAt: { type: Date, default: Date.now }
});

const MongoInterviewModel = mongoose.models.Interview || mongoose.model('Interview', InterviewSchema);

export class Interview {
  static async create(interviewData) {
    if (dbState.isMock) {
      const newInterview = {
        _id: 'i_' + Math.random().toString(36).substring(2, 11),
        userId: interviewData.userId,
        type: interviewData.type,
        topic: interviewData.topic,
        score: interviewData.score,
        questionsCount: interviewData.questionsCount,
        details: interviewData.details || [],
        createdAt: new Date()
      };
      dbState.data.interviews.push(newInterview);
      saveMockDb();
      return { ...newInterview, id: newInterview._id };
    } else {
      const doc = new MongoInterviewModel(interviewData);
      await doc.save();
      return doc;
    }
  }

  static async findByUserId(userId) {
    if (dbState.isMock) {
      return dbState.data.interviews
        .filter((item) => item.userId === userId)
        .sort((a, b) => {
          const dateA = a.createdAt instanceof Date ? a.createdAt.getTime() : new Date(a.createdAt).getTime();
          const dateB = b.createdAt instanceof Date ? b.createdAt.getTime() : new Date(b.createdAt).getTime();
          return dateB - dateA;
        });
    } else {
      return await MongoInterviewModel.find({ userId }).sort({ createdAt: -1 });
    }
  }
}
