import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import {
  generateQuestions,
  analyzeAnswer,
  analyzeResume,
  saveInterview,
  getHistory
} from '../controllers/aiController.js';

const router = express.Router();

// Apply security guard to all AI routes
router.use(authMiddleware);

router.post('/generate-questions', generateQuestions);
router.post('/feedback', analyzeAnswer);
router.post('/analyze-resume', analyzeResume);
router.post('/interviews/save', saveInterview);
router.get('/interviews/history', getHistory);

export default router;
