import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Code,
  MessageSquare,
  Terminal,
  FileText,
  TrendingUp,
  Award,
  ChevronRight,
  Sparkles,
  Calendar,
  Layers,
  ArrowRight,
  Trophy,
  User,
  Shield,
  Clock,
  Target
} from 'lucide-react';
import { motion } from 'motion/react';

export default function Dashboard() {
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [selectedRecord, setSelectedRecord] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userJson = localStorage.getItem('user');

    if (!token || !userJson) {
      navigate('/login');
      return;
    }

    setUser(JSON.parse(userJson));

    // Fetch user interview history logs
    const fetchHistory = async () => {
      try {
        const response = await fetch('/api/ai/interviews/history', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          navigate('/login');
          return;
        }

        const data = await response.json();
        if (response.ok && data.records) {
          setHistory(data.records);
        }
      } catch (err) {
        console.error("Failed to load interview history:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [navigate]);

  // Calculate statistics
  const totalCompleted = history.length;
  const averageScore = totalCompleted > 0
    ? Math.round(history.reduce((acc, curr) => acc + curr.score, 0) / totalCompleted)
    : 0;

  const technicalCount = history.filter(item => item.type === 'technical').length;
  const hrCount = history.filter(item => item.type === 'hr').length;

  // Let's retrieve kishan's initial or use name from storage
  const displayName = user?.name || 'kishan kumar';

  const toolsList = [
    {
      title: 'Practice Compiler',
      desc: 'Run logical compiler challenges evaluated instantly by Gemini.',
      path: '/coding',
      icon: Terminal,
      color: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
      badge: 'Code Suite'
    },
    {
      title: 'Mock Interview Simulator',
      desc: 'Experience authentic stateful technical & behavioral dialogue.',
      path: '/mock-interview',
      icon: MessageSquare,
      color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20',
      badge: 'Al Coach'
    },
    {
      title: 'Aptitude Tests',
      desc: 'Solve quantitative, logical, probability & time problems on key concepts.',
      path: '/aptitude',
      icon: Clock,
      color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
      badge: 'Timed Quizzes'
    },
    {
      title: 'ATS Resume Auditor',
      desc: 'Audit critical keywords and matching ratios for core software roles.',
      path: '/resume',
      icon: FileText,
      color: 'text-sky-400 bg-sky-500/10 border-sky-500/20',
      badge: 'Optimization'
    }
  ];

  return (
    <div className="bg-[#0b0f19] min-h-screen text-slate-100" id="page-dashboard">
      <div className="max-w-7xl mx-auto px-6 py-8">
        
        {/* HERO BLOCK: Profile Header & Platform Master Level (Photo 2 layout) */}
        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          
          {/* Welcome User Panel with Info Tags */}
          <motion.div 
            className="lg:col-span-2 bg-gradient-to-br from-slate-900 to-slate-950 p-6 rounded-2xl border border-slate-800 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="absolute -top-12 -left-12 w-32 h-32 bg-[#f97316]/5 rounded-full blur-2xl pointer-events-none"></div>
            
            <div className="flex items-center gap-4">
              {/* Profile letter symbol block */}
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-[#f97316] text-[#0f172a] flex items-center justify-center font-extrabold text-2xl font-mono shadow-lg border border-amber-300">
                {displayName.charAt(0).toUpperCase()}
              </div>
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-slate-850/80 border border-slate-800 rounded-full text-[10px] text-amber-400 font-extrabold uppercase tracking-wide mb-1.5 shadow-inner">
                  <Sparkles className="w-3 h-3 text-amber-400" />
                  LEVEL 2 SCHOLAR
                </div>
                <h1 className="text-xl md:text-2xl font-extrabold text-white tracking-tight">
                  Welcome Back, {displayName}!
                </h1>
                
                {/* Custom subtitle tags matching Photo 2 */}
                <div className="flex flex-wrap gap-x-2.5 gap-y-1 text-[11px] text-slate-400 mt-2 font-mono">
                  <span>• Full-Stack Web Architect</span>
                  <span>• TypeScript</span>
                  <span>• Node.js</span>
                  <span>• System Design</span>
                </div>
              </div>
            </div>

            <div className="flex md:flex-col gap-2 shrink-0 border-t md:border-t-0 md:border-l border-slate-800/80 pt-4 md:pt-0 md:pl-6 text-xs text-slate-400">
              <div className="bg-slate-950/60 border border-slate-800 px-3.5 py-2.5 rounded-xl text-center">
                <span className="block text-[9px] uppercase font-bold text-slate-500 tracking-wider">MOCKS</span>
                <span className="text-sm font-extrabold text-slate-350">{totalCompleted} Complete</span>
              </div>
              <div className="bg-[#f97316]/10 border border-[#f97316]/20 px-3.5 py-2.5 rounded-xl text-center">
                <span className="block text-[9px] uppercase font-bold text-orange-400 tracking-wider">AVG ACCURACY</span>
                <span className="text-sm font-extrabold text-[#f97316]">{averageScore}%</span>
              </div>
            </div>
          </motion.div>

          {/* Platform Master Level summary card (Photo 2) */}
          <motion.div
            className="bg-[#0f172a] border border-slate-850 p-6 rounded-2xl flex flex-col justify-between"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div>
              <div className="flex justify-between items-center mb-1 text-xs">
                <span className="font-extrabold text-slate-400">Platform Level Progress</span>
                <span className="text-amber-400 font-mono font-bold">100 / 200 XP</span>
              </div>
              <h3 className="text-sm font-extrabold text-white flex items-center gap-1.5">
                <Trophy className="w-4 h-4 text-amber-500" />
                <span>Tier 2: Advanced Problem Solver</span>
              </h3>
              
              {/* Progress Indicator line */}
              <div className="w-full bg-slate-950 rounded-full h-2 mt-3.5 border border-slate-850 overflow-hidden">
                <div className="bg-gradient-to-r from-amber-400 to-[#f97316] h-full rounded-full" style={{ width: '50%' }}></div>
              </div>

              <p className="text-[10px] text-slate-400 font-sans mt-3 leading-relaxed">
                Aim for <strong className="text-white">Level 3 Master</strong>! Earn XP by passing mock interviews (+50) or completing coding runs (+25).
              </p>
            </div>
            
            <div className="pt-3 border-t border-slate-800/60 mt-4 flex justify-between items-center text-[10px] text-slate-500 font-mono">
              <span>Next Rank Rise: +100 XP Needed</span>
              <span className="text-emerald-400">Streak: Off to a great start!</span>
            </div>
          </motion.div>

        </div>

        {/* CORE STATS SUMMARY BENTO INDEX DECK (Photo 2 layout) */}
        <div className="mb-8">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-2 font-mono">
            <span>// PERFORMANCE METRIC INDEX CARDS</span>
          </h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Bento Card 1: Coding Practice */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 flex flex-col justify-between hover:border-slate-700 transition-colors">
              <div className="flex justify-between items-start mb-3">
                <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400">
                  <Terminal className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">CODING</span>
              </div>
              <div>
                <span className="block text-xl font-extrabold text-white font-mono">0 / 10 Solved</span>
                <div className="flex items-center gap-2 mt-1.5">
                  <span className="text-[10.5px] text-slate-400">Completion</span>
                  <span className="text-[10.5px] text-amber-400 font-bold">0% Completed</span>
                </div>
              </div>
            </div>

            {/* Bento Card 2: Aptitude */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 flex flex-col justify-between hover:border-slate-700 transition-colors">
              <div className="flex justify-between items-start mb-3">
                <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-[#f97316]/20 text-emerald-400">
                  <Clock className="w-4 h-4 text-emerald-400" />
                </div>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">APTITUDE</span>
              </div>
              <div>
                <span className="block text-xl font-extrabold text-white font-mono">40% Average</span>
                <div className="flex items-center gap-2 mt-1.5">
                  <span className="text-[10.5px] text-slate-400">Target Range</span>
                  <span className="text-[10.5px] text-emerald-500 font-bold">80% Certification</span>
                </div>
              </div>
            </div>

            {/* Bento Card 3: Interview Rating */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 flex flex-col justify-between hover:border-slate-700 transition-colors">
              <div className="flex justify-between items-start mb-3">
                <div className="p-2.5 rounded-lg bg-slate-950 text-indigo-400">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">EVAL INDEX</span>
              </div>
              <div>
                <span className="block text-xl font-extrabold text-white font-mono">
                  {averageScore > 0 ? `${averageScore}% Rate` : '0% Evaluation'}
                </span>
                <div className="flex items-center gap-2 mt-1.5">
                  <span className="text-[10.5px] text-slate-400">Status</span>
                  <span className={`text-[10.5px] font-bold ${averageScore > 0 ? 'text-indigo-400' : 'text-slate-500'}`}>
                    {totalCompleted > 0 ? 'Active Analysis' : 'Pending Sessions'}
                  </span>
                </div>
              </div>
            </div>

            {/* Bento Card 4: Contests & Hacks */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 flex flex-col justify-between hover:border-slate-700 transition-colors">
              <div className="flex justify-between items-start mb-3">
                <div className="p-2.5 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-400">
                  <Trophy className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">CONTESTS</span>
              </div>
              <div>
                <span className="block text-xl font-extrabold text-teal-400 font-mono">2 Live Events</span>
                <Link to="/contests" className="text-[10px] text-[#f97316] font-bold hover:underline flex items-center gap-0.5 mt-1.5">
                  <span>Enter Arena</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>

          </div>
        </div>

        {/* 2-COLUMN BOTTOM: Practice Tools Grid & Sessions History list */}
        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Main Workspace tools selector */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2 font-mono">
                <span>// SELECT AN ACTIVE SIMULATION OR SANDBOX TASK</span>
              </h2>
              
              <div className="grid sm:grid-cols-2 gap-4">
                {toolsList.map((tool) => {
                  const Icon = tool.icon;
                  return (
                    <div
                      key={tool.path}
                      className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-5 hover:border-slate-600 transition-all flex flex-col justify-between group"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-4">
                          <div className={`p-2.5 rounded-xl border ${tool.color}`}>
                            <Icon className="w-5 h-5 shrink-0" />
                          </div>
                          <span className="text-[9px] font-bold uppercase tracking-widest text-[#f97316] font-mono select-none">
                            {tool.badge}
                          </span>
                        </div>
                        <h3 className="text-sm font-extrabold text-white mb-2 tracking-tight group-hover:text-[#f97316] transition-colors">
                          {tool.title}
                        </h3>
                        <p className="text-xs font-normal text-slate-400 leading-relaxed">
                          {tool.desc}
                        </p>
                      </div>
                      <div className="mt-5 pt-4 border-t border-slate-800/80 flex items-center justify-between">
                        <span className="text-[10px] font-sans text-slate-500">
                          Interactive Gateway
                        </span>
                        <Link
                          to={tool.path}
                          className="px-3.5 py-1.5 bg-[#f97316] hover:bg-orange-600 text-slate-950 rounded-lg text-xs font-extrabold flex items-center gap-1 transition-all"
                        >
                          <span>Launch Sandbox</span>
                          <ArrowRight className="w-3 h-3 text-slate-950" />
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Recommended Challenge practice shortcuts */}
            <div className="bg-slate-900/40 border border-slate-850 p-5 rounded-2xl">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono mb-4 flex items-center gap-1.5">
                <Terminal className="w-4 h-4 text-amber-400" />
                <span>Recommended Challenge Practice Deck</span>
              </h3>
              <div className="space-y-2.5">
                {[
                  { title: 'Two Sum Search', category: 'Arrays & Hashing', difficulty: 'Easy', reward: '+25 XP' },
                  { title: 'Validate String Anagram', category: 'Strings', difficulty: 'Easy', reward: '+25 XP' },
                  { title: 'Merge Overlapping Intervals', category: 'Intervals', difficulty: 'Medium', reward: '+50 XP' },
                ].map((task, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-slate-950/60 border border-slate-850 rounded-xl hover:border-slate-800 transition-all text-xs">
                    <div className="flex items-center gap-2.5">
                      <div className="w-1.5 h-1.5 bg-amber-400 rounded-full"></div>
                      <div>
                        <h4 className="font-bold text-white font-sans">{task.title}</h4>
                        <span className="text-[10px] text-slate-500 font-mono">{task.category}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded uppercase ${
                        task.difficulty === 'Easy' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'
                      }`}>
                        {task.difficulty}
                      </span>
                      <span className="text-[10px] font-bold text-slate-500 font-mono">{task.reward}</span>
                      <Link to="/coding" className="p-1 px-2.5 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded font-semibold border border-slate-800">
                        Solve
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: Competency Radar / Badges & History Logs */}
          <div className="space-y-6">
            
            {/* Earned Badges Section */}
            <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-2xl">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono mb-3.5 flex items-center gap-1.5">
                <Award className="w-4 h-4 text-[#f97316]" />
                <span>Earned Career Badges (3)</span>
              </h3>
              <div className="space-y-2.5">
                <div className="flex items-center gap-3 bg-slate-950/80 p-3 rounded-xl border border-slate-850">
                  <div className="w-9 h-9 rounded bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                    <Shield className="w-5 h-5 text-amber-400" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">Algorithmic Initiate</h4>
                    <p className="text-[10px] text-slate-500 leading-normal">Unlocked by running code tests in Sandbox.</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 bg-slate-950/80 p-3 rounded-xl border border-slate-850">
                  <div className="w-9 h-9 rounded bg-[#f97316]/10 border border-[#f97316]/30 flex items-center justify-center text-orange-400 shrink-0">
                    <Award className="w-5 h-5 text-[#f97316]" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">STAR Behavioral</h4>
                    <p className="text-[10px] text-slate-500 leading-normal">Completed initial behavioral mock coach rounds.</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 bg-slate-950/80 p-3 rounded-xl border border-slate-850">
                  <div className="w-9 h-9 rounded bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400 shrink-0">
                    <FileText className="w-5 h-5 text-sky-305 text-sky-400" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">ATS Certified Spec</h4>
                    <p className="text-[10px] text-slate-500 leading-normal">Optimized resume ATS keywords to maximum ratio.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Session History Logs list nested right column */}
            <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-2xl">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono mb-3.5 flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-emerald-400" />
                <span>Session Audits History</span>
              </h2>

              {loading ? (
                <div className="py-8 flex justify-center">
                  <svg className="animate-spin h-5 w-5 text-[#f97316]" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                </div>
              ) : history.length === 0 ? (
                <div className="text-center py-4 bg-slate-950/40 rounded-xl p-3 border border-slate-850">
                  <span className="text-[10px] text-slate-500 block leading-relaxed font-sans">No recorded mocks found. Take your first interview to track credentials history.</span>
                </div>
              ) : (
                <div className="space-y-2 max-h-[295px] overflow-y-auto pr-1">
                  {history.map((record) => (
                    <div
                      key={record._id}
                      onClick={() => setSelectedRecord(record)}
                      className="bg-slate-950/80 border border-slate-850 hover:border-slate-700/80 p-3 rounded-xl cursor-pointer transition-all flex items-center justify-between text-xs"
                    >
                      <div className="space-y-0.5">
                        <h4 className="font-bold text-white text-[12px] truncate max-w-[130px]">{record.topic}</h4>
                        <span className="text-[9px] text-slate-500 block font-mono">
                          {new Date(record.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="text-right flex items-center gap-2">
                        <span className={`font-mono font-extrabold ${
                          record.score >= 80 ? 'text-emerald-400' : 'text-amber-400'
                        }`}>
                          {record.score}%
                        </span>
                        <ChevronRight className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

        </div>

        {/* Modal display for selected log records */}
        {selectedRecord && (
          <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-md flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              className="bg-[#0f172a] border border-slate-800 rounded-3xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden"
            >
              <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/80">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] font-extrabold px-1.5 py-0.5 uppercase bg-[#f97316]/10 text-[#f97316] border border-[#f97316]/20 rounded">
                      {selectedRecord.type}
                    </span>
                    <h3 className="text-sm font-bold text-white font-sans">{selectedRecord.topic}</h3>
                  </div>
                  <p className="text-[9px] text-slate-500 mt-0.5">{new Date(selectedRecord.createdAt).toLocaleString()}</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <span className="text-[9px] text-slate-500 block font-bold uppercase">SCORE</span>
                    <span className="text-base font-extrabold text-amber-400 font-mono">{selectedRecord.score}%</span>
                  </div>
                  <button
                    onClick={() => setSelectedRecord(null)}
                    className="p-1 px-3 text-xs text-slate-300 hover:text-white bg-slate-900 border border-slate-800 rounded-lg transition-colors cursor-pointer font-bold"
                  >
                    Close
                  </button>
                </div>
              </div>

              {/* Modal Body scroll content */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {selectedRecord.details?.map((q, idx) => (
                  <div key={idx} className="bg-slate-950/60 border border-slate-850 p-4 rounded-xl space-y-3.5">
                    <div>
                      <span className="text-[9px] font-extrabold text-[#f97316] uppercase flex items-center gap-1">
                        <Award className="w-3.5 h-3.5" />
                        <span>Question {idx+1}</span>
                      </span>
                      <h4 className="text-xs font-bold text-white mt-1 leading-snug">{q.question}</h4>
                    </div>

                    <div className="border-t border-slate-800/80 pt-2 text-[11.5px]">
                      <span className="font-semibold text-slate-400 block">Candidate Reply:</span>
                      <p className="text-slate-300 mt-1 italic font-sans leading-relaxed">{q.answer || '(No response supplied)'}</p>
                    </div>

                    <div className="bg-slate-900/60 border border-slate-800 rounded-lg p-3 space-y-2 mt-2 font-sans text-[11px] leading-relaxed">
                      <div className="flex items-center gap-2 border-b border-slate-800/80 pb-1.5">
                        <span className="font-extrabold text-white text-xs">AI Assessment Evaluation:</span>
                        <span className={`font-mono font-bold text-xs ${
                          (q.feedback?.score || 0) >= 80 ? 'text-emerald-400' : 'text-amber-400'
                        }`}>
                          Score: {q.feedback?.score || 0}%
                        </span>
                      </div>

                      <p><strong className="text-emerald-400 uppercase text-[9px] tracking-wide">Strengths:</strong> <span className="text-slate-300">{q.feedback?.strengths || 'N/A'}</span></p>
                      <p><strong className="text-amber-400 uppercase text-[9px] tracking-wide">Gaps/Weaknesses:</strong> <span className="text-slate-300">{q.feedback?.weaknesses || 'N/A'}</span></p>
                      <p className="bg-slate-950/80 p-2.5 rounded border border-slate-850 mt-1 text-[11px] font-normal leading-relaxed text-slate-300">
                        <strong className="text-[#f97316] font-semibold block uppercase text-[9px] tracking-wide mb-0.5">Model Answer Suggestion:</strong>
                        {q.feedback?.improvedAnswer || 'N/A'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        )}

      </div>
    </div>
  );
}
