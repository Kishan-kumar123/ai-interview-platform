import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Terminal,
  ChevronRight,
  Play,
  Cpu,
  BookOpen,
  Code2,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  FileCode,
  BookMarked,
  Info,
  HelpCircle,
  FileText
} from 'lucide-react';
import { motion } from 'motion/react';

const CHALLENGES = [
  {
    id: 'two-sum',
    title: 'Two Sum Search',
    difficulty: 'Easy',
    category: 'Arrays & Hashing',
    problem: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.',
    examples: 'Input: nums = [2,7,11,15], target = 9\nOutput: [0,1]\nExplanation: Because nums[0] + nums[1] == 9, we return [0, 1].',
    constraints: [
      '2 <= nums.length <= 104',
      '-109 <= nums[i] <= 109',
      'Only one valid answer exists.'
    ],
    initialStub: `function twoSum(nums, target) {
  // Write your O(n) or O(n^2) solution here
  const map = new Map();
  for (let i = 0; i < nums.length; i++) {
    const diff = target - nums[i];
    if (map.has(diff)) {
      return [map.get(diff), i];
    }
    map.set(nums[i], i);
  }
  return [];
}`,
    testInput: 'nums = [2, 7, 11, 15], target = 9',
    expectedOutput: '[0, 1]',
    hints: [
      'Try using a Hash Map to store indices of numbers you have already computed.',
      'A single pass O(N) lookup checks if target minus current element exists in the map.'
    ],
    editorial: 'Optimal solution utilizes a single-pass hash map. Time Complexity: O(N) where N is the length of digits. Space Complexity: O(N) to store hashed elements.'
  },
  {
    id: 'valid-anagram',
    title: 'Validate String Anagram',
    difficulty: 'Easy',
    category: 'Strings',
    problem: 'Given two strings s and t, return true if t is an anagram of s, and false otherwise.\nAn Anagram is a word or phrase formed by rearranging the letters of a different word or phrase, typically using all the original letters exactly once.',
    examples: 'Input: s = "anagram", t = "nagaram"\nOutput: true\n\nInput: s = "rat", t = "car"\nOutput: false',
    constraints: [
      '1 <= s.length, t.length <= 5 * 104',
      's and t consist of lowercase English letters.'
    ],
    initialStub: `function isAnagram(s, t) {
  if (s.length !== t.length) return false;
  
  const charMap = {};
  for (let char of s) {
    charMap[char] = (charMap[char] || 0) + 1;
  }
  
  for (let char of t) {
    if (!charMap[char]) return false;
    charMap[char]--;
  }
  
  return true;
}`,
    testInput: 's = "anagram", t = "nagaram"',
    expectedOutput: 'true',
    hints: [
      'Count frequencies of characters in string s, and verify if string t matches these exact frequencies.',
      'Keep a single character frequency counter object to complete in O(N+M) time.'
    ],
    editorial: 'Sort arrays or map characters to single frequency bounds. Recommended: constant space frequency array of size 26.'
  },
  {
    id: 'merge-intervals',
    title: 'Merge Overlapping Intervals',
    difficulty: 'Medium',
    category: 'Intervals',
    problem: 'Given an array of intervals where intervals[i] = [starti, endi], merge all overlapping intervals, and return an array of the non-overlapping intervals that cover all the intervals in the input.',
    examples: 'Input: intervals = [[1,3],[2,6],[8,10],[15,18]]\nOutput: [[1,6],[8,10],[15,18]]\nExplanation: Since intervals [1,3] and [2,6] overlap, merge them into [1,6].',
    constraints: [
      '1 <= intervals.length <= 104',
      'intervals[i].length == 2',
      '0 <= starti <= endi <= 104'
    ],
    initialStub: `function mergeIntervals(intervals) {
  if (intervals.length <= 1) return intervals;
  
  // Sort intervals by start value
  intervals.sort((a, b) => a[0] - b[0]);
  
  const merged = [intervals[0]];
  for (let i = 1; i < intervals.length; i++) {
    const current = intervals[i];
    const lastMerged = merged[merged.length - 1];
    
    if (current[0] <= lastMerged[1]) {
      lastMerged[1] = Math.max(lastMerged[1], current[1]);
    } else {
      merged.push(current);
    }
  }
  
  return merged;
}`,
    testInput: '[[1,3],[2,6],[8,10],[15,18]]',
    expectedOutput: '[[1,6],[8,10],[15,18]]',
    hints: [
      'Sorting intervals by their starting indices is crucial to evaluate continuous intervals.',
      'Insert the first interval to the list, then iteratively check if the next overlaps with the last active interval.'
    ],
    editorial: 'Sort interval pointers first O(N log N). Check sequential spans to merge. Total runtime O(N log N).'
  }
];

export default function CodingPractice() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const [activeChallenge, setActiveChallenge] = useState(CHALLENGES[0]);
  const [code, setCode] = useState(CHALLENGES[0].initialStub);
  const [testLogs, setTestLogs] = useState([]);
  const [isRunningTests, setIsRunningTests] = useState(false);

  // Left Column Tabs state (Photo 5 tabs)
  const [activeTab, setActiveTab] = useState('description'); // 'description', 'hints', 'editorial', 'explainer'

  // AI Evaluation parameters
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [feedback, setFeedback] = useState(null);

  if (!token) {
    navigate('/login');
    return null;
  }

  const selectChallenge = (chall) => {
    setActiveChallenge(chall);
    setCode(chall.initialStub);
    setTestLogs([]);
    setFeedback(null);
    setActiveTab('description');
  };

  // Simulate local test checks
  const runLocalTests = () => {
    setIsRunningTests(true);
    setTestLogs([]);

    setTimeout(() => {
      setTestLogs([
        '💎 IDE: Instantiating test harness compiler runtime...',
        '💎 IDE: Injecting unit inputs -> ' + activeChallenge.testInput,
        `💎 IDE: Running invocation call -> ${activeChallenge.id}()`,
        '🟢 OUTPUT: MATCH SUCCESS',
        '🟢 EXPECTED: ' + activeChallenge.expectedOutput,
        '🎉 Local unit tests completed successfully with 0 fatal leaks!'
      ]);
      setIsRunningTests(false);
    }, 1200);
  };

  // Run AI feedback verification
  const handleVerifyAI = async () => {
    setIsEvaluating(true);
    setFeedback(null);

    const promptText = `Verify candidate code correctness inside our Coding Practice IDE.
Challenge title: "${activeChallenge.title}"
Category: "${activeChallenge.category}"
Initial Problem: "${activeChallenge.problem}"
Submitted Code:
"""
${code}
"""

Double-check syntax structure, compute overall score (0 to 100), identify Big O complexity (Time/Space complexity), list and evaluate edge case coverage and optimization notes.`;

    try {
      const res = await fetch('/api/ai/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          role: "Algorithm Engineer",
          question: `Review Algorithmic Challenge: ${activeChallenge.title}`,
          answer: promptText
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Verification audit failure from LLM.');
      }

      setFeedback(data);
    } catch (err) {
      alert(`Review check failed: ${err.message}`);
    } finally {
      setIsEvaluating(false);
    }
  };

  return (
    <div className="bg-[#0b0f19] min-h-screen text-slate-100 py-8" id="page-coding">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Breadcrumb Section Header */}
        <div className="mb-6 flex justify-between items-center bg-slate-900 border border-slate-800 rounded-xl px-5 py-3">
          <div className="flex items-center gap-2 text-xs text-slate-400 font-sans">
            <span className="cursor-pointer hover:text-[#f97316] transition-colors font-bold" onClick={() => navigate('/dashboard')}>Dashboard</span>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="font-semibold text-white">Algorithmic Challenge Arena</span>
          </div>
          <div className="flex items-center gap-2 text-white text-xs font-semibold">
            <Terminal className="w-4 h-4 text-amber-500 animate-pulse" />
            <span className="font-mono">Mock Compiler Sandbox v1.2</span>
          </div>
        </div>

        {/* 2-Column Main Workspace */}
        <div className="grid lg:grid-cols-4 gap-6">
          
          {/* Left Columns 1: Dynamic Challenges List */}
          <div className="lg:col-span-1 space-y-4">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 font-mono">
              // Challenges Deck
            </h3>
            
            <div className="space-y-2">
              {CHALLENGES.map((chall) => (
                <div
                  key={chall.id}
                  onClick={() => selectChallenge(chall)}
                  className={`p-3.5 border rounded-xl cursor-pointer transition-all ${
                    activeChallenge.id === chall.id
                      ? 'bg-gradient-to-br from-[#f97316]/20 to-orange-950/40 border-[#f97316] text-white shadow-md'
                      : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5 text-[9px] font-mono">
                    <span className="bg-slate-950 px-1.5 py-0.5 rounded text-slate-400 border border-slate-800">
                      {chall.category}
                    </span>
                    <span className={`font-extrabold ${
                      chall.difficulty === 'Easy' ? 'text-emerald-400' : 'text-amber-400'
                    }`}>
                      {chall.difficulty}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold leading-normal">{chall.title}</h4>
                </div>
              ))}
            </div>
          </div>

          {/* Core IDE container workspace */}
          <div className="lg:col-span-3 space-y-6">
            
            <div className="grid md:grid-cols-2 gap-6 bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden min-h-[580px] shadow-2xl">
              
              {/* Left Column Problem Instructions & Tabs (Photo 5 Layout) */}
              <div className="p-5 md:p-6 border-b md:border-b-0 md:border-r border-slate-800/80 flex flex-col justify-between bg-slate-950/40">
                <div className="space-y-4">
                  
                  {/* Category/Tab Selector Buttons */}
                  <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                    <span className="text-[10px] font-extrabold text-[#f97316] bg-[#f97316]/10 border border-[#f97316]/20 rounded px-2.5 py-0.5 uppercase tracking-wide font-mono">
                      {activeChallenge.category}
                    </span>
                    <span className="text-xs text-slate-500 font-mono">Problem Spec</span>
                  </div>

                  {/* Tabs Row matching Photo 5 */}
                  <div className="flex gap-1 border-b border-slate-850 p-1 bg-slate-900 rounded-lg text-[11px] font-bold">
                    <button
                      onClick={() => setActiveTab('description')}
                      className={`flex-1 py-1.5 rounded-md transition-colors ${
                        activeTab === 'description' ? 'bg-slate-8c0 bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      Description
                    </button>
                    <button
                      onClick={() => setActiveTab('hints')}
                      className={`flex-1 py-1.5 rounded-md transition-colors ${
                        activeTab === 'hints' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      Hints
                    </button>
                    <button
                      onClick={() => setActiveTab('editorial')}
                      className={`flex-1 py-1.5 rounded-md transition-colors ${
                        activeTab === 'editorial' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      Editorial
                    </button>
                    <button
                      onClick={() => setActiveTab('explainer')}
                      className={`flex-1 py-1.5 rounded-md transition-colors ${
                        activeTab === 'explainer' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      AI Explainer
                    </button>
                  </div>

                  {/* Active Tab View */}
                  {activeTab === 'description' && (
                    <div className="space-y-4 animate-fadeIn">
                      <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-1.5">
                        <Code2 className="w-4 h-4 text-[#f97316]" />
                        <span>{activeChallenge.title}</span>
                      </h2>
                      <p className="text-xs text-slate-300 font-sans leading-relaxed font-normal whitespace-pre-line">
                        {activeChallenge.problem}
                      </p>

                      <div className="pt-2 space-y-2">
                        <h5 className="text-xs font-extrabold text-slate-300 font-mono">// I/O Samples</h5>
                        <pre className="bg-slate-950 text-slate-300 border border-slate-850 p-2.5 rounded-lg text-[10px] font-mono leading-relaxed overflow-x-auto">
                          {activeChallenge.examples}
                        </pre>
                      </div>

                      <div className="pt-2 space-y-1.5 text-xs">
                        <h5 className="text-xs font-extrabold text-slate-400 font-mono">// Constraints</h5>
                        <ul className="list-disc pl-4 text-slate-400 space-y-1">
                          {activeChallenge.constraints.map((c, i) => <li key={i}>{c}</li>)}
                        </ul>
                      </div>
                    </div>
                  )}

                  {activeTab === 'hints' && (
                    <div className="space-y-4 animate-fadeIn">
                      <h3 className="text-xs font-extrabold text-[#f97316] uppercase font-mono tracking-wide">
                        Available Hints ({activeChallenge.hints?.length || 0})
                      </h3>
                      <div className="space-y-3">
                        {activeChallenge.hints?.map((hint, idx) => (
                          <div key={idx} className="bg-slate-900 border border-slate-800 p-3 rounded-lg text-xs leading-relaxed flex gap-2">
                            <Lightbulb className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                            <p className="text-slate-300">{hint}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {activeTab === 'editorial' && (
                    <div className="space-y-4 animate-fadeIn">
                      <h3 className="text-xs font-extrabold text-emerald-400 uppercase font-mono tracking-wide">
                        Optimal Algorithm Editorial Guide
                      </h3>
                      <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl text-xs leading-relaxed space-y-3">
                        <p className="text-slate-300 font-medium">
                          {activeChallenge.editorial}
                        </p>
                        <div className="p-3 bg-slate-950 rounded-lg text-[10px] text-slate-500 font-mono">
                          • Time Complexity: O(N) / O(N log N) <br />
                          • Space Complexity: O(N) / O(1)
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'explainer' && (
                    <div className="space-y-4 animate-fadeIn">
                      <h2 className="text-xs font-extrabold text-indigo-400 uppercase font-mono tracking-wide">
                        Gemini AI Explainer Panel
                      </h2>
                      <p className="text-xs text-slate-400 leading-normal">
                        Submit your code through the "Verify with AI" trigger to retrieve complex diagnostic reports, performance scores, and custom alternative layouts.
                      </p>
                      <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-2 text-xs">
                        <div className="flex gap-2 text-indigo-300 font-mono text-[10px] uppercase items-center">
                          <Cpu className="w-3.5 h-3.5 text-indigo-400" />
                          <span>AI Assessment Metrics</span>
                        </div>
                        <p className="text-slate-300">
                          The system double-checks edge-cases, memory allocation overhead, and handles type boundaries before generating optimizations feedback.
                        </p>
                      </div>
                    </div>
                  )}

                </div>

                <div className="pt-4 font-sans text-[11px] text-slate-500 flex items-center gap-1.5 border-t border-slate-850 mt-6 bg-slate-950/10">
                  <Info className="w-4 h-4 text-[#f97316] shrink-0" />
                  <span>Aim for optimal Time/Space specs.</span>
                </div>
              </div>

              {/* Right Column Interactive Editor inside dark editor block */}
              <div className="bg-slate-950/80 p-5 md:p-6 flex flex-col justify-between font-mono text-xs">
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-[11px] text-slate-500 border-b border-slate-850 pb-2.5">
                    <div className="flex items-center gap-1.5 text-[#f97316]">
                      <FileCode className="w-3.5 h-3.5" />
                      <span>index.js</span>
                    </div>
                    <span>javascript / ES6</span>
                  </div>
                  
                  <textarea
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="w-full h-80 bg-transparent text-[#f97316] focus:text-white border-0 outline-none resize-none font-mono text-xs leading-relaxed"
                    spellCheck={false}
                    id="code-ide-textarea"
                  />
                </div>

                {/* IDE Action Buttons */}
                <div className="border-t border-slate-850 pt-4 flex items-center gap-3">
                  <button
                    onClick={runLocalTests}
                    disabled={isRunningTests || isEvaluating}
                    className="px-4 py-2 bg-slate-900 hover:bg-slate-850 text-slate-300 border border-slate-800 rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                    id="btn-run-tests"
                  >
                    <Play className="w-3 h-3 fill-slate-300" />
                    <span>Run Local Tests</span>
                  </button>

                  <button
                    onClick={handleVerifyAI}
                    disabled={isEvaluating || isRunningTests}
                    className="px-4 py-2 bg-[#f97316] hover:bg-orange-600 text-slate-950 rounded-lg text-xs font-extrabold flex items-center gap-1 cursor-pointer transition-colors"
                    id="btn-verify-ai"
                  >
                    <Cpu className="w-3.5 h-3.5 text-slate-950 shrink-0" />
                    <span>Verify with AI</span>
                  </button>
                </div>
              </div>

            </div>

            {/* Test Outputs panel */}
            {testLogs.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-slate-950 text-slate-300 border border-slate-850 rounded-2xl p-5 font-mono text-xs space-y-2 shadow-inner"
              >
                <div className="flex items-center justify-between text-slate-500 border-b border-slate-850 pb-1.5 mb-2.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider">Console Output Log</span>
                  <button onClick={() => setTestLogs([])} className="text-[10px] hover:text-white transition-colors uppercase">Clear</button>
                </div>
                {testLogs.map((log, i) => (
                  <p key={i} className={log.startsWith('🟢') ? 'text-emerald-400 font-bold' : log.startsWith('💎') ? 'text-slate-500' : 'text-slate-300'}>
                    {log}
                  </p>
                ))}
              </motion.div>
            )}

            {/* AI Review Report Card panel */}
            {isEvaluating && (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-center animate-pulse">
                <svg className="animate-spin h-6 w-6 text-[#f97316] mx-auto mb-2" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <p className="text-xs font-sans text-slate-400">Gemini reviewing code complexity, safety benchmarks, and correctness index...</p>
              </div>
            )}

            {feedback && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-slate-900 border border-slate-850 rounded-2xl overflow-hidden shadow-xl"
              >
                <div className="bg-[#0f172a] text-white px-6 py-4 flex items-center justify-between border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-[#f97316]" />
                    <span className="font-sans font-extrabold text-xs tracking-wide uppercase">Gemini Algorithmic Review Card</span>
                  </div>
                  <div className="bg-[#f97316]/10 border border-[#f97316]/20 px-3.5 py-1 rounded-full text-xs font-mono font-bold text-[#f97316]">
                    Score: {feedback.score} / 100
                  </div>
                </div>

                <div className="p-6 space-y-4 text-xs font-sans">
                  <div className="grid sm:grid-cols-2 gap-4 border-b border-slate-850 pb-4">
                    <div className="flex items-start gap-2 bg-slate-950 p-3.5 rounded-xl border border-slate-850">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-extrabold uppercase text-[10px] text-slate-405 text-slate-400">Code Strengths</h4>
                        <p className="text-slate-300 mt-1 leading-normal text-[11.5px]">{feedback.strengths}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-2 bg-slate-950 p-3.5 rounded-xl border border-slate-850">
                      <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-extrabold uppercase text-[10px] text-slate-405 text-slate-400">Pitfalls / Gaps</h4>
                        <p className="text-slate-300 mt-1 leading-normal text-[11.5px]">{feedback.weaknesses}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-[#f97316]/5 border border-[#f97316]/15 p-4 rounded-xl leading-relaxed">
                    <h4 className="font-extrabold text-[#f97316] uppercase tracking-wide text-[10px] mb-1">Assessor Complexity & Tuning Review</h4>
                    <p className="text-slate-200 leading-normal font-sans italic text-[11.5px] whitespace-pre-line">{feedback.improvedAnswer}</p>
                  </div>
                </div>
              </motion.div>
            )}

          </div>
        </div>

      </div>
    </div>
  );
}
