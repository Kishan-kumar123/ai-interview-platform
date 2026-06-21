import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MessageSquare,
  Award,
  AlertCircle,
  Cpu,
  CornerDownLeft,
  ChevronRight,
  BookOpen,
  CheckCircle2,
  RefreshCw,
  ArrowRight
} from 'lucide-react';
import { motion } from 'motion/react';

export default function HRInterview() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  // Config State
  const [role, setRole] = useState('Senior Software Engineer');
  const [level, setLevel] = useState('Senior-Level');
  const [focusSkills, setFocusSkills] = useState('');
  const [loadingQuestions, setLoadingQuestions] = useState(false);
  const [errorHeader, setErrorHeader] = useState('');

  // Active Simulation State
  const [questions, setQuestions] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [roundProgress, setRoundProgress] = useState([]);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  if (!token) {
    navigate('/login');
    return null;
  }

  // Fetch Questions
  const handleStartMock = async (e) => {
    e.preventDefault();
    if (!role.trim()) return;

    setLoadingQuestions(true);
    setErrorHeader('');
    setQuestions([]);
    setCurrentIdx(0);
    setRoundProgress([]);
    setIsCompleted(false);

    try {
      const res = await fetch('/api/ai/generate-questions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          role,
          level,
          type: 'hr', // HR/behavioral category
          focusSkills: focusSkills.trim() || undefined
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Unable to instantiate HR mock session.');
      }

      if (data.questions && data.questions.length > 0) {
        setQuestions(data.questions);
        const initialProgress = data.questions.map((q) => ({
          question: q.text,
          answer: '',
          feedback: null
        }));
        setRoundProgress(initialProgress);
      } else {
        throw new Error("No behavioral questions retrieved.");
      }
    } catch (err) {
      setErrorHeader(err.message || 'Communication error with Gemini API.');
    } finally {
      setLoadingQuestions(false);
    }
  };

  // Evaluate single question answer
  const handleEvaluateAnswer = async () => {
    if (!userAnswer.trim()) {
      alert("Please provide some response to review.");
      return;
    }

    setIsEvaluating(true);
    try {
      const res = await fetch('/api/ai/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          role,
          question: questions[currentIdx].text,
          answer: userAnswer.trim()
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Answer scoring failure.');
      }

      const updatedProgress = [...roundProgress];
      updatedProgress[currentIdx].answer = userAnswer.trim();
      updatedProgress[currentIdx].feedback = data;
      setRoundProgress(updatedProgress);

    } catch (err) {
      alert(`Feedback evaluation failed: ${err.message}`);
    } finally {
      setIsEvaluating(false);
    }
  };

  // Advance state
  const handleNextQuestion = () => {
    setUserAnswer('');
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(prev => prev + 1);
    } else {
      handleFinishRound();
    }
  };

  // Save HR logs to db
  const handleFinishRound = async () => {
    setIsSaving(true);
    const validScores = roundProgress.filter(p => p.feedback !== null).map(p => p.feedback?.score || 0);
    const aggregateFinalScore = validScores.length > 0
      ? Math.round(validScores.reduce((acc, c) => acc + c, 0) / validScores.length)
      : 0;

    try {
      await fetch('/api/ai/interviews/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          type: 'hr',
          topic: `HR behavioral: ${role}`,
          score: aggregateFinalScore,
          questionsCount: questions.length,
          details: roundProgress.map((p) => ({
            question: p.question,
            answer: p.answer,
            feedback: p.feedback || { score: 0, strengths: 'No answer', weaknesses: 'No answer provided', improvedAnswer: '' }
          }))
        })
      });

      setIsCompleted(true);
    } catch (err) {
      console.error("Round persistence save error:", err);
      setIsCompleted(true);
    } finally {
      setIsSaving(false);
    }
  };

  const currentProgress = roundProgress[currentIdx];
  const activeFeedback = currentProgress?.feedback;

  return (
    <div className="bg-[#0b0f19] min-h-screen text-slate-100 py-8" id="page-hr">
      <div className="max-w-4xl mx-auto px-6">
        
        {/* Breadcrumb section header */}
        <div className="mb-6 flex justify-between items-center bg-slate-900 border border-slate-800 rounded-xl px-5 py-3">
          <div className="flex items-center gap-2 text-xs text-slate-400 font-sans">
            <span className="cursor-pointer hover:text-[#f97316] transition-colors font-bold" onClick={() => navigate('/dashboard')}>Dashboard</span>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="font-semibold text-white">HR Behavioral Interview</span>
          </div>
          <div className="flex items-center gap-2 text-white text-xs font-semibold">
            <Cpu className="w-4 h-4 text-[#f97316] animate-pulse" />
            <span className="font-mono font-bold">STAR Coach Active</span>
          </div>
        </div>

        {/* 1. CONFIGURATION SCREEN */}
        {questions.length === 0 && !isCompleted && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#0f172a] border border-slate-850 rounded-2xl p-6 md:p-8 space-y-6"
          >
            <div className="flex items-start gap-4 border-b border-slate-800 pb-5">
              <div className="p-2.5 rounded-xl bg-[#f97316]/10 border border-[#f97316]/20 text-[#f97316] shrink-0">
                <MessageSquare className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-base font-extrabold text-white tracking-wide uppercase font-mono">// BEHAVIORAL EVALUATION ROUND</h1>
                <p className="text-xs text-slate-400 font-sans mt-0.5 leading-relaxed font-normal">
                  Generate situational team leadership and cultural alignment questions designed to review your emotional quotient, problem-solving, and communication frameworks.
                </p>
              </div>
            </div>

            {errorHeader && (
              <div className="p-4 bg-rose-950/40 border border-[#ea580c]/20 rounded-xl text-xs text-rose-300 flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-[#ea580c]" />
                <span>{errorHeader}</span>
              </div>
            )}

            <form onSubmit={handleStartMock} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-350 mb-2 font-mono">
                    Target Job Role / Specialisation
                  </label>
                  <input
                    type="text"
                    required
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    placeholder="e.g. Account Manager, Team Lead"
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-850 focus:border-[#f97316] rounded-xl text-xs outline-none text-white transition-all placeholder:text-slate-650"
                    id="hr-role-input"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-355 text-slate-300 mb-2 font-mono">
                    Job Level Setup
                  </label>
                  <select
                    value={level}
                    onChange={(e) => setLevel(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-850 focus:border-[#f97316] rounded-xl text-xs outline-none text-white transition-all"
                    id="hr-level-select"
                  >
                    <option value="Junior-Level">Junior-Level / Entry</option>
                    <option value="Mid-Level">Mid-Level Professional</option>
                    <option value="Senior-Level">Senior-Level Manager</option>
                    <option value="Executive-Level">Director / Executive Manager</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-350 mb-2 font-mono">
                  Target Values Focus (Optional)
                </label>
                <input
                  type="text"
                  value={focusSkills}
                  onChange={(e) => setFocusSkills(e.target.value)}
                  placeholder="e.g. conflict resolution, remote management, team delegation, customer crisis management"
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-850 focus:border-[#f97316] rounded-xl text-xs outline-none text-white transition-all placeholder:text-slate-650"
                  id="hr-skills-focus"
                />
              </div>

              <div className="border-t border-slate-850 pt-5 flex justify-end">
                <button
                  type="submit"
                  disabled={loadingQuestions}
                  className="px-6 py-2.5 bg-[#f97316] hover:bg-orange-600 text-slate-950 font-extrabold rounded-xl text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                  id="btn-hr-start"
                >
                  {loadingQuestions ? (
                    <>
                      <svg className="animate-spin h-4 w-4 text-slate-950" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      <span>Compiling Behavioral Matrix...</span>
                    </>
                  ) : (
                    <>
                      <span>Generate Behavioral Questions</span>
                      <ArrowRight className="w-4 h-4 text-slate-950" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        )}

        {/* 2. ACTIVE INTERVIEW FLOW */}
        {questions.length > 0 && !isCompleted && (
          <div className="space-y-6">
            
            {/* Round Tracker */}
            <div className="bg-[#0f172a] border border-slate-850 rounded-2xl p-4 flex items-center justify-between">
              <div>
                <span className="text-[9px] text-[#f97316] font-mono tracking-wider uppercase font-bold">Active Profile</span>
                <span className="text-xs font-bold text-white block mt-0.5">{role} ({level})</span>
              </div>
              <div className="flex items-center gap-1.5 font-mono text-xs text-slate-400 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800">
                <span>Problem Status:</span>
                <span className="text-[#f97316] font-extrabold">{currentIdx + 1} / {questions.length}</span>
              </div>
            </div>

            {/* Main prompt slide */}
            <motion.div
              key={currentIdx}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-[#0f172a] border border-slate-850 p-6 md:p-8 rounded-2xl space-y-5"
            >
              <div className="space-y-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-[#f97316]/10 border border-[#f97316]/20 text-[#f97316] rounded-full text-[9px] font-mono font-bold uppercase tracking-wider">
                  <Cpu className="w-3.5 h-3.5 text-[#f97316]" />
                  HR BEHAVIORAL QUESTIONS
                </span>
                <h2 className="text-sm md:text-base font-bold text-white leading-relaxed">
                  {questions[currentIdx].text}
                </h2>
                <p className="text-[11px] text-slate-505 text-slate-500 font-sans italic font-normal">
                  <strong>Interviewer rationale:</strong> {questions[currentIdx].rationale}
                </p>
              </div>

              {/* Rationale key criteria */}
              <div className="bg-slate-950/80 border border-slate-850 rounded-xl p-4 font-sans text-xs">
                <span className="font-bold text-slate-500 block mb-2 font-mono">// Tested EQ Competency traits assessed:</span>
                <div className="flex flex-wrap gap-1.5">
                  {questions[currentIdx].keyPoints?.map((pt, i) => (
                    <span key={i} className="bg-slate-900 border border-slate-800 text-slate-300 font-mono text-[10px] px-2 py-0.5 rounded">
                      {pt}
                    </span>
                  ))}
                </div>
              </div>

              {/* Textarea answer input */}
              <div className="space-y-2">
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-350 font-mono">
                    Your Response
                  </label>
                  <span className="text-[9px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded px-1.5 py-0.5 font-bold font-mono">
                    Situation • Task • Action • Result (STAR)
                  </span>
                </div>
                <textarea
                  disabled={activeFeedback !== null || isEvaluating}
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  placeholder="Explain a specific situation you faced, the task required, the actions you took, and what objective results occurred..."
                  className="w-full h-44 p-4 text-xs font-mono bg-slate-950 border border-slate-850 focus:border-[#f97316] rounded-xl outline-none resize-none transition-all text-[#f97316] focus:text-white"
                  id={`hr-textarea-answer-${currentIdx}`}
                />
                <span className="text-[9px] text-slate-500 block font-normal text-right font-mono">
                  CHARACTERS TYPE LIMIT: {userAnswer.length}
                </span>
              </div>

              {/* Submission panel controls */}
              <div className="pt-4 border-t border-slate-850 flex flex-wrap items-center justify-between gap-4">
                <div>
                  {activeFeedback === null && (
                    <button
                      onClick={handleEvaluateAnswer}
                      disabled={isEvaluating || !userAnswer.trim()}
                      className="px-5 py-2 bg-[#f97316] hover:bg-orange-600 text-slate-950 rounded-xl text-xs font-extrabold shadow transition-colors flex items-center gap-1.5 cursor-pointer"
                      id="btn-hr-evaluate"
                    >
                      {isEvaluating ? (
                        <>
                          <svg className="animate-spin h-4 w-4 text-slate-950" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          <span>Reviewing STAR formulation...</span>
                        </>
                      ) : (
                        <>
                          <span>Submit Answer Segment</span>
                          <CornerDownLeft className="w-3.5 h-3.5 text-slate-950" />
                        </>
                      )}
                    </button>
                  )}
                </div>

                <div>
                  {activeFeedback !== null && (
                    <button
                      onClick={handleNextQuestion}
                      className="px-5 py-2.5 bg-slate-900 border border-slate-800 text-slate-200 text-xs font-bold rounded-xl check-proceed cursor-pointer flex items-center gap-1 hover:border-slate-700"
                      id="btn-hr-next-question"
                    >
                      <span>{currentIdx === questions.length - 1 ? "Complete and persist logs" : "Proceed Next Question"}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Inline AI evaluation box */}
            {activeFeedback && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-[#0f172a] border border-slate-850 rounded-2xl overflow-hidden shadow-2xl space-y-4 p-5"
              >
                <div className="flex items-center justify-between border-b border-slate-850 pb-3">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-[#f97316]" />
                    <span className="font-sans font-extrabold text-[#f97316] text-[10px] uppercase tracking-wide">STAR Formulation diagnostic scorecard</span>
                  </div>
                  <div className="bg-[#f97316]/10 border border-[#f97316]/20 px-3.5 py-1 rounded-full text-xs font-mono font-bold text-[#f97316]">
                    STAR SCORE: {activeFeedback.score} / 100
                  </div>
                </div>

                <div className="space-y-3 font-sans text-xs">
                  <div>
                    <h4 className="font-bold text-emerald-400 uppercase tracking-wide text-[10px] font-mono">✓ Strengths / Logical Layout</h4>
                    <p className="text-slate-350 mt-1 leading-relaxed font-sans">{activeFeedback.strengths}</p>
                  </div>

                  <div className="border-t border-slate-850 pt-3">
                    <h4 className="font-bold text-rose-450 text-rose-400 uppercase tracking-wide text-[10px] font-mono">⚡ Missed Details / Gaps</h4>
                    <p className="text-slate-355 text-slate-300 mt-1 leading-relaxed font-sans">{activeFeedback.weaknesses}</p>
                  </div>

                  <div className="bg-slate-950 border border-slate-850 p-4 rounded-xl mt-4 leading-relaxed font-sans font-normal">
                    <h4 className="font-extrabold text-[#f97316] uppercase tracking-wide text-[10px] mb-1 font-mono">Ideal Corporate Phrasing Blueprint</h4>
                    <p className="text-slate-300 leading-normal font-sans italic text-[11.5px] whitespace-pre-line">{activeFeedback.improvedAnswer}</p>
                  </div>
                </div>
              </motion.div>
            )}

          </div>
        )}

        {/* 3. FINAL SUMMARY REPORT */}
        {isCompleted && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#0f172a] border border-slate-850 shadow-2xl rounded-2xl p-6 md:p-8 text-center space-y-5"
          >
            <div className="w-14 h-14 bg-[#f97316]/10 border border-[#f97316]/20 rounded-full flex items-center justify-center text-[#f97316] mx-auto shadow">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <h1 className="text-lg font-bold text-white uppercase tracking-wider font-mono">BEHAVIORAL INTERVIEW COMPLETED</h1>
              <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto font-sans leading-relaxed">
                Evaluation history logged securely inside the local file sandbox. Review aggregate scores metrics anytime.
              </p>
            </div>

            <div className="max-w-xs mx-auto bg-slate-950 border border-slate-850 rounded-2xl p-5">
              <span className="text-[10px] uppercase text-slate-500 font-bold tracking-wider font-mono font-sans">ROUND ACCURACY</span>
              <p className="text-3xl font-mono font-extrabold text-[#f97316] mt-1">
                {roundProgress.length > 0
                  ? Math.round(roundProgress.filter(p => p.feedback !== null).reduce((acc, curr) => acc + (curr.feedback?.score || 0), 0) / roundProgress.length)
                  : 0}%
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                onClick={() => navigate('/dashboard')}
                className="w-full sm:w-auto px-5 py-2.5 bg-slate-950 hover:bg-slate-900 border border-slate-800 text-slate-300 font-bold text-xs rounded-xl cursor-pointer"
              >
                Go Back Dashboard
              </button>
              <button
                onClick={() => {
                  setQuestions([]);
                  setIsCompleted(false);
                }}
                className="w-full sm:w-auto px-5 py-2.5 bg-[#f97316] hover:bg-[#ea580c] text-slate-950 font-extrabold text-xs rounded-xl cursor-pointer flex items-center justify-center gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5 text-slate-950 shrink-0" />
                <span>Simulate Another session</span>
              </button>
            </div>
          </motion.div>
        )}

      </div>
    </div>
  );
}
