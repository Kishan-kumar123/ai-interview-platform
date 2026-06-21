import { GoogleGenAI, Type } from '@google/genai';
import { Interview } from '../models/Interview.js';

let googleAiClient = null;

const getGeminiClient = () => {
  if (!googleAiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not defined in the environment secrets. Please set it up in Settings > Secrets to enable AI.");
    }
    googleAiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return googleAiClient;
};

// 1. Generate Interview Questions
export const generateQuestions = async (req, res) => {
  const { role, level, type, focusSkills } = req.body;

  if (!role || !level || !type) {
    res.status(400).json({ message: "Parameters 'role', 'level', and 'type' (technical/hr) are required." });
    return;
  }

  try {
    const ai = getGeminiClient();
    
    // Custom prompting based on interview format
    const focusPrompt = focusSkills ? `, focusing heavily on skills like: ${focusSkills}` : '';
    const systemPrompt = type === 'technical'
      ? `You are an expert Chief Technology Officer (CTO) and professional Technical Interviewer. 
         Your task is to generate 5 high-quality technical interview questions for a ${level}-level ${role} position${focusPrompt}.
         Ensure questions cover coding patterns, architecture, frameworks, database, and algorithmic basics appropriate for ${level} level. Include rationale and what interviewer is looking for in keyPoints.`
      : `You are an expert Human Resources (HR) Director and behavioral interviewer.
         Your task is to generate 5 high-quality behavioral/HR interview questions for a ${level}-level ${role} position${focusPrompt}.
         Make the questions open-ended, situational, or behavioral (using the STAR method format: Situation, Task, Action, Result). Include rationale and keyPoints.`;

    const userInstructions = `Generate a JSON object containing a 'questions' array. Each question must contain:
1. id (integer from 1 to 5)
2. text (the question text)
3. rationale (why this question is asked and what it tests)
4. keyPoints (array of strings representing key concepts correct answers should contain)`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: `${systemPrompt}\n\n${userInstructions}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            questions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.INTEGER },
                  text: { type: Type.STRING },
                  rationale: { type: Type.STRING },
                  keyPoints: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING }
                  }
                },
                required: ["id", "text", "rationale", "keyPoints"]
              }
            }
          },
          required: ["questions"]
        }
      }
    });

    const parsedData = JSON.parse(response.text.trim());
    res.status(200).json(parsedData);
  } catch (err) {
    console.error("AI Generation Error:", err);
    res.status(500).json({
      message: "Failed to generate interview questions.",
      error: err.message || "An unknown error occurred during AI processing."
    });
  }
};

// 2. AI Feedback on Single Answer
export const analyzeAnswer = async (req, res) => {
  const { role, question, answer } = req.body;

  if (!question || !answer) {
    res.status(400).json({ message: "Fields 'question' and 'answer' are required." });
    return;
  }

  try {
    const ai = getGeminiClient();

    const prompt = `You are a professional assessor reviewing a candidate's answer for an interview.
Role: ${role || "Software Engineer"}
Question asked: "${question}"
Candidate's response: "${answer}"
 
Analyze the response, scoring it from 0 to 100 on correctness, depth, and professionalism. Highlight specific strengths, primary gaps or weaknesses, and supply an elegant exemplar improved model answer that is concise yet comprehensive.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.INTEGER, description: "A score from 0 to 100 based on answer completeness and depth." },
            strengths: { type: Type.STRING, description: "List of key positive ideas or professional aspects in the user's answer." },
            weaknesses: { type: Type.STRING, description: "Gaps, errors, missing keywords, or opportunities to polish the answer further." },
            improvedAnswer: { type: Type.STRING, description: "A high-scoring, reference level answer explaining how an expert would respond." }
          },
          required: ["score", "strengths", "weaknesses", "improvedAnswer"]
        }
      }
    });

    const parsedData = JSON.parse(response.text.trim());
    res.status(200).json(parsedData);
  } catch (err) {
    console.error("AI Answer Analysis Error:", err);
    res.status(500).json({
      message: "Failed to analyze interview response.",
      error: err.message
    });
  }
};

// 3. AI Resume Analyzer
export const analyzeResume = async (req, res) => {
  const { resumeText, targetRole } = req.body;

  if (!resumeText || !targetRole) {
    res.status(400).json({ message: "Parameters 'resumeText' and 'targetRole' are required." });
    return;
  }

  try {
    const ai = getGeminiClient();

    const prompt = `You are an expert Executive Recruiter and Resume Coach.
Target Job Position: ${targetRole}
Resume File Content:
"""
${resumeText}
"""

Review this resume. Score it from 0 to 100 based on layout structure, active action-verbs, alignment with target role metrics, and clarity. List high-value missing industry keywords, call out style or layout improvements, and provide rewritten bullet points for their experience to maximize candidate conversion.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            overallScore: { type: Type.INTEGER, description: "Resume score from 0 to 100" },
            formattingScore: { type: Type.INTEGER, description: "Formatting clarity / spelling score from 0 to 100" },
            strengths: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "What the resume does extremely well currently."
            },
            missingKeywords: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Relevant industry keywords for targetRole missing in the text."
            },
            layoutSuggestions: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Fixes for phrasing, brevity, metrics inclusion, or spacing."
            },
            rewrittenBulletPoints: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "3-4 direct optimized examples of how they should rephrase their work histories."
            }
          },
          required: ["overallScore", "formattingScore", "strengths", "missingKeywords", "layoutSuggestions", "rewrittenBulletPoints"]
        }
      }
    });

    const parsedResponse = JSON.parse(response.text.trim());
    res.status(200).json(parsedResponse);
  } catch (err) {
    console.error("AI Resume Analysis Error:", err);
    res.status(500).json({
      message: "Failed to perform AI resume audit.",
      error: err.message
    });
  }
};

// 4. Save and fetch completed interviews
export const saveInterview = async (req, res) => {
  const { type, topic, score, questionsCount, details } = req.body;
  const userId = req.user?.id;

  if (!userId || !type || !topic || score === undefined) {
    res.status(400).json({ message: "Invalid payload parameters. ID, type, topic, and score are required." });
    return;
  }

  try {
    const interview = await Interview.create({
      userId,
      type,
      topic,
      score,
      questionsCount: questionsCount || details?.length || 5,
      details: details || []
    });

    res.status(201).json({ message: "Interview record saved successfully.", interview });
  } catch (err) {
    res.status(500).json({ message: "Failed to save interview record.", error: err.message });
  }
};

export const getHistory = async (req, res) => {
  const userId = req.user?.id;
  if (!userId) {
    res.status(401).json({ message: "User not identified." });
    return;
  }

  try {
    const records = await Interview.findByUserId(userId);
    res.status(200).json({ records });
  } catch (err) {
    res.status(500).json({ message: "Failed to retrieve interview records.", error: err.message });
  }
};
