import React, { useState, useEffect } from 'react';
import { Smartphone, HelpCircle, Award, RefreshCw, ChevronRight, Clock, CheckCircle2, XCircle, ChevronLeft } from 'lucide-react';
import { motion } from 'motion/react';

const APTITUDE_DATA = [
  {
    category: 'Quantitative Aptitude',
    question: 'A train 120 m long passes a telegraph post in 6 seconds. Find the speed of the train in km/hr.',
    options: ['40 km/hr', '72 km/hr', '80 km/hr', '60 km/hr'],
    correct: 1,
    explanation: 'Speed = Distance / Time = 120m / 6s = 20 m/s. To convert to km/hr, multiply by 18/5: 20 * (18/5) = 72 km/hr.'
  },
  {
    category: 'Logical Reasoning',
    question: 'Look at this series: 36, 34, 30, 28, 24, ... What number should come next?',
    options: ['22', '20', '23', '26'],
    correct: 0,
    explanation: 'This is an alternating subtraction series: subtract 2, then subtract 4, then subtract 2, then subtract 4, and so on. 24 - 2 = 22.'
  },
  {
    category: 'Time & Work',
    question: 'A can do work in 15 days and B in 20 days. If they work on it together for 4 days, then the fraction of the work that is left is:',
    options: ['8/15', '1/4', '7/15', '1/10'],
    correct: 0,
    explanation: "A's 1-day work = 1/15, B's 1-day work = 1/20. Together in 1 day = (1/15 + 1/20) = 7/60. In 4 days = 4 * 7/60 = 7/15. Leftover fraction = 1 - 7/15 = 8/15."
  },
  {
    category: 'Probability',
    question: 'Three unbiased coins are tossed. What is the probability of getting at most two heads?',
    options: ['3/4', '7/8', '1/2', '3/8'],
    correct: 1,
    explanation: 'Total outcomes = 2^3 = 8. Outcomes with at most 2 heads = all outcomes except for 3 heads (HHH), which is 8 - 1 = 7. Thus, probability is 7/8.'
  },
  {
    category: 'Profit & Loss',
    question: 'A shopkeeper sells an item with a 15% discount. If the marked price is $200, find the final selling price.',
    options: ['$170', '$185', '$160', '$150'],
    correct: 0,
    explanation: 'Discount amount = 15% of $200 = 0.15 * 200 = $30. Selling price = 200 - 30 = $170.'
  }
];

export default function AptitudeTests() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isQuizActive, setIsQuizActive] = useState(false);
  const [currentAnswers, setCurrentAnswers] = useState({});
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(420); // 7 minutes clock timer
  const [score, setScore] = useState(0);

  // Active quiz list filtered
  const quizQuestions = selectedCategory === 'All' 
    ? APTITUDE_DATA 
    : APTITUDE_DATA.filter(q => q.category === selectedCategory);

  useEffect(() => {
    let timer;
    if (isQuizActive && !quizCompleted && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isQuizActive) {
      handleFinishQuiz();
    }
    return () => clearInterval(timer);
  }, [isQuizActive, quizCompleted, timeLeft]);

  const handleBeginQuiz = () => {
    setIsQuizActive(true);
    setQuizCompleted(false);
    setCurrentAnswers({});
    setTimeLeft(300); // 5 minutes timer
  };

  const handleSelectOption = (qIdx, optIdx) => {
    setCurrentAnswers(prev => ({
      ...prev,
      [qIdx]: optIdx
    }));
  };

  const handleFinishQuiz = () => {
    // Calculate total correct
    let matches = 0;
    quizQuestions.forEach((q, idx) => {
      if (currentAnswers[idx] === q.correct) {
        matches += 1;
      }
    });

    setScore(matches);
    setQuizCompleted(true);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const categories = ['All', 'Quantitative Aptitude', 'Logical Reasoning', 'Time & Work', 'Probability', 'Profit & Loss'];

  return (
    <div className="bg-[#0b0f19] min-h-screen text-slate-100 py-8" id="page-aptitude">
      <div className="max-w-4xl mx-auto px-6">
        
        {/* Header segment matching screenshots precisely */}
        <div className="mb-6 flex justify-between items-center bg-slate-900 border border-slate-800 rounded-xl px-5 py-3">
          <div className="flex items-center gap-2 text-xs text-slate-400 font-sans">
            <span className="font-bold text-white">Timed Aptitude & Logical Testing</span>
          </div>
          <div className="flex items-center gap-2 text-white text-xs font-semibold">
            <Smartphone className="w-4 h-4 text-[#f97316]" />
            <span className="font-mono">Adaptive Reasoning Engine</span>
          </div>
        </div>

        {/* Phase 1: Quiz selection dashboard (Photo 11) */}
        {!isQuizActive ? (
          <div className="space-y-6">
            
            {/* Choose Your Category Bar */}
            <div className="bg-[#0f172a] border border-slate-850 p-6 rounded-2xl">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4 font-mono">// CHOOSE YOUR REASONING CATEGORY</h3>
              
              <div className="flex flex-wrap gap-2.5">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-2 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
                      selectedCategory === cat
                        ? 'bg-[#f97316] border-[#f97316] text-slate-950 font-extrabold'
                        : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Instruction Panel & Launch Quiz Trigger */}
            <div className="bg-slate-900/60 border border-slate-800 p-8 rounded-2xl text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-[#f97316]/10 flex items-center justify-center text-[#f97316] mx-auto border border-[#f97316]/20">
                <HelpCircle className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Timed Adaptive Session: {selectedCategory}</h3>
                <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
                  Evaluate your quantitative, logical, probability, and corporate problem solving metrics inside a 5-minute timed mock quiz block.
                </p>
              </div>

              <div className="flex justify-center gap-6 text-xs text-slate-400 font-mono pt-2">
                <span>• Questions count: <strong className="text-white">{quizQuestions.length}</strong></span>
                <span>• Time limit: <strong className="text-white">5:00 minutes</strong></span>
                <span>• Correct point: <strong className="text-white">+20 XP</strong></span>
              </div>

              <button
                onClick={handleBeginQuiz}
                className="px-8 py-3 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-extrabold rounded-xl text-xs transition-all tracking-wide cursor-pointer flex items-center gap-2 mx-auto mt-4"
              >
                <span>Begin Timed Quiz</span>
                <Clock className="w-4 h-4 text-slate-950" />
              </button>
            </div>

          </div>
        ) : !quizCompleted ? (
          
          /* Phase 2: Ongoing Test screen (Photo 11 style) */
          <div className="space-y-6">
            
            {/* Timed countdown bar */}
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex items-center justify-between">
              <span className="text-xs text-slate-400 font-mono">CATEGORY: <strong className="text-white">{selectedCategory}</strong></span>
              <div className="flex items-center gap-2 text-[#f97316] font-mono font-bold text-xs">
                <Clock className="w-4 h-4 animate-pulse text-[#f97316]" />
                <span>Timer Left: {formatTime(timeLeft)}</span>
              </div>
            </div>

            {/* Questions scroll list */}
            <div className="space-y-5">
              {quizQuestions.map((q, qIdx) => (
                <div key={qIdx} className="bg-[#0f172a] border border-slate-850 p-6 rounded-2xl space-y-4">
                  <div className="flex items-start gap-3">
                    <span className="bg-[#f97316]/10 text-[#f97316] text-[10px] font-mono border border-[#f97316]/20 py-0.5 px-2 rounded-md font-bold mt-0.5">
                      Q{qIdx+1}
                    </span>
                    <h4 className="text-xs font-bold font-sans text-white leading-relaxed">{q.question}</h4>
                  </div>

                  {/* Multiple outputs choice block */}
                  <div className="grid sm:grid-cols-2 gap-3 pt-2">
                    {q.options.map((opt, optIdx) => {
                      const selected = currentAnswers[qIdx] === optIdx;
                      return (
                        <button
                          key={optIdx}
                          onClick={() => handleSelectOption(qIdx, optIdx)}
                          className={`p-3 text-left rounded-xl text-xs border transition-all cursor-pointer ${
                            selected
                              ? 'bg-slate-8c0 bg-slate-850 border-[#f97316] text-white font-bold'
                              : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:bg-slate-800/40'
                          }`}
                        >
                          <span className="inline-block w-5 h-5 rounded-full mr-2 text-center leading-normal text-[10px] text-slate-500 font-bold bg-slate-950 border border-slate-800">
                            {String.fromCharCode(65 + optIdx)}
                          </span>
                          <span>{opt}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* Test action triggers */}
            <div className="flex justify-between items-center pt-4">
              <button
                onClick={() => {
                  if (confirm("Abandon quiz? Process will not generate points.")) {
                    setIsQuizActive(false);
                  }
                }}
                className="px-5 py-2 hover:bg-slate-900 border border-slate-820 rounded-xl text-xs text-slate-400 font-bold cursor-pointer"
              >
                Cancel and Return
              </button>

              <button
                onClick={handleFinishQuiz}
                className="px-6 py-2.5 bg-[#f97316] hover:bg-orange-600 font-extrabold text-[#0f172a] text-xs rounded-xl cursor-pointer"
              >
                Submit Answers for Review &gt;
              </button>
            </div>

          </div>
        ) : (
          
          /* Phase 3: Completed Evaluation Card (Photo 10 styles) */
          <div className="space-y-6">
            
            {/* Completed Header block */}
            <div className="bg-slate-950 border border-emerald-500/20 p-8 rounded-2xl text-center space-y-4">
              <div className="w-14 h-14 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400 mx-auto border border-emerald-500/20 shadow-md">
                <CheckCircle2 className="w-7 h-7" />
              </div>

              <div>
                <h3 className="text-lg font-bold text-white">Quiz Completed Successfully</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Answers compiled and evaluated under system constraints.
                </p>
              </div>

              {/* Progress and Score layout matches Photo 10 */}
              <div className="text-center pt-2 max-w-sm mx-auto p-4 bg-slate-900 rounded-xl border border-slate-850">
                <div className="flex justify-between items-center border-b border-slate-850 pb-2 text-xs">
                  <span className="text-slate-400">Correct Answers:</span>
                  <span className="font-extrabold text-white font-mono">{score} / {quizQuestions.length}</span>
                </div>
                <div className="flex justify-between items-center pt-2 text-xs">
                  <span className="text-slate-400">Score Percentage:</span>
                  <span className="font-extrabold text-emerald-400 font-mono">
                    {Math.round((score / quizQuestions.length) * 100)}%
                  </span>
                </div>
              </div>

              {/* Buttons matching Photo 10 */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => setIsQuizActive(false)}
                  className="w-full sm:w-auto px-5 py-2.5 bg-slate-905 border border-slate-800 hover:bg-slate-800 text-slate-300 font-bold text-xs rounded-xl cursor-pointer"
                >
                  Return to Categories
                </button>
                <button
                  onClick={handleBeginQuiz}
                  className="w-full sm:w-auto px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-extrabold text-xs rounded-xl cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Retake Quiz</span>
                </button>
              </div>
            </div>

            {/* Questions explanations (Photo 10 layout) */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-455 text-slate-400 font-mono">
                // Review Explanations Walkthroughs
              </h3>

              {quizQuestions.map((q, idx) => {
                const candidateChoice = currentAnswers[idx];
                const isCorrect = candidateChoice === q.correct;

                return (
                  <div key={idx} className="bg-[#0f172a] border border-slate-850 rounded-2xl p-5 space-y-3 font-sans text-xs">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex gap-2">
                        <span className="bg-slate-950 border border-slate-800 p-1 px-2.5 rounded font-bold font-mono text-[10px] text-slate-400">
                          {idx+1}
                        </span>
                        <h4 className="font-bold text-white leading-relaxed">{q.question}</h4>
                      </div>

                      {/* Correct or incorrect insignia badge */}
                      {isCorrect ? (
                        <div className="flex items-center gap-1 text-emerald-400 shrink-0 font-bold font-mono text-[10px]">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>CORRECT</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 text-rose-500 shrink-0 font-bold font-mono text-[10px]">
                          <XCircle className="w-3.5 h-3.5" />
                          <span>INCORRECT</span>
                        </div>
                      )}
                    </div>

                    <div className="grid sm:grid-cols-2 gap-2 pt-2 text-[11px]">
                      <div className="p-2 bg-slate-950 rounded border border-slate-850">
                        <span className="block text-slate-500 font-bold text-[10px]">Your Answer:</span>
                        <span className={isCorrect ? 'text-emerald-400 font-bold' : 'text-rose-400'}>
                          {candidateChoice !== undefined ? q.options[candidateChoice] : '(Unanswered)'}
                        </span>
                      </div>
                      <div className="p-2 bg-slate-950 rounded border border-slate-850">
                        <span className="block text-slate-500 font-bold text-[10px]">Correct Answer:</span>
                        <span className="text-emerald-400 font-extrabold">{q.options[q.correct]}</span>
                      </div>
                    </div>

                    <div className="bg-slate-900/60 p-3.5 rounded-xl border border-slate-850 text-slate-350 leading-relaxed font-sans mt-2">
                      <strong className="text-[#f97316] uppercase text-[10px] tracking-wide block mb-1">Concept Explanation:</strong>
                      <p className="text-[11.5px] leading-relaxed italic">{q.explanation}</p>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
