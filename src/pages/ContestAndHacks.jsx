import React, { useState } from 'react';
import { Trophy, Clock, Cpu, Users, Award, Shield, ChevronRight, Terminal, CheckCircle2, TrendingUp } from 'lucide-react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';

const CONTESTS = [
  {
    id: 'weekly-12',
    title: 'Weekly Code Challenge #12',
    duration: '2h duration',
    reward: '150 XP Reward',
    status: 'Registered',
    date: 'Starts in 1d 4h',
    participants: '1,240 enrolled'
  },
  {
    id: 'speedrun-04',
    title: 'Bi-Weekly Algorithm Speed Run',
    duration: '1h duration',
    reward: '200 XP Reward',
    status: 'Enter Arena',
    date: 'Starts in 3d 12h',
    participants: '840 enrolled'
  }
];

const LEADERBOARD = [
  { rank: 1, name: 'Jane Dev', score: '380 XP', badge: 'Tier 3 Master', current: false, initial: 'J' },
  { rank: 2, name: 'kishan kumar', score: '100 XP', badge: 'Tier 2 Scholar', current: true, initial: 'K' },
  { rank: 3, name: 'Alex Architect', score: '75 XP', badge: 'Tier 2 Scholar', current: false, initial: 'A' },
  { rank: 4, name: 'Sarah System', score: '50 XP', badge: 'Tier 1 Initiate', current: false, initial: 'S' },
  { rank: 5, name: 'Devon Miller', score: '25 XP', badge: 'Tier 1 Initiate', current: false, initial: 'D' }
];

const CHALLENGES = [
  { title: 'Matrix Pivot Search', category: '2D Arrays', difficulty: 'Medium', reward: '+50 XP' },
  { title: 'Path Compression Trees', category: 'Trees & Disjoint Sets', difficulty: 'Hard', reward: '+100 XP' },
  { title: 'Reverse Polish Notation', category: 'Stacks & Lists', difficulty: 'Easy', reward: '+25 XP' }
];

export default function ContestAndHacks() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('arena'); // 'arena' or 'leaderboard'
  const [enrollments, setEnrollments] = useState({ 'weekly-12': true });

  const toggleEnroll = (id) => {
    setEnrollments(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  return (
    <div className="bg-[#0b0f19] min-h-screen text-slate-100 py-8" id="page-contests">
      <div className="max-w-4xl mx-auto px-6">
        
        {/* Header Breadcrumb */}
        <div className="mb-6 flex justify-between items-center bg-slate-900 border border-slate-800 rounded-xl px-5 py-3">
          <div className="flex items-center gap-2 text-xs text-slate-400 font-sans">
            <span className="font-bold text-white">Interactive Contests & Leaderboards</span>
          </div>
          <div className="flex items-center gap-2 text-[#f97316] text-xs font-semibold">
            <Trophy className="w-4 h-4 text-amber-500 animate-bounce" />
            <span className="font-mono">Live Arena Active</span>
          </div>
        </div>

        {/* Navigation Tabs (Photo 4) */}
        <div className="flex gap-2 border-b border-slate-850 p-1 bg-slate-900 rounded-xl mb-6 max-w-sm">
          <button
            onClick={() => setActiveTab('arena')}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              activeTab === 'arena' ? 'bg-[#f97316] text-slate-950 font-extrabold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Arena Contests
          </button>
          <button
            onClick={() => setActiveTab('leaderboard')}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              activeTab === 'leaderboard' ? 'bg-[#f97316] text-slate-950 font-extrabold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Leaderboard Rankings
          </button>
        </div>

        {/* Tab content 1: Arena Contests */}
        {activeTab === 'arena' && (
          <div className="space-y-6">
            
            {/* Speedrun Cards Grid */}
            <div className="grid sm:grid-cols-2 gap-4">
              {CONTESTS.map((con) => {
                const enrolled = enrollments[con.id];
                return (
                  <div key={con.id} className="bg-[#0f172a] border border-slate-850 p-5 rounded-2xl flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start mb-3">
                        <span className="text-[10px] uppercase font-mono px-2 py-0.5 bg-slate-950 border border-slate-800 rounded text-slate-400">
                          {con.duration}
                        </span>
                        <span className="text-[10px] font-bold text-[#f97316] font-mono">{con.reward}</span>
                      </div>
                      <h3 className="text-sm font-extrabold font-sans text-white mb-1.5">{con.title}</h3>
                      <p className="text-[11px] text-slate-400 font-mono flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-slate-500" />
                        <span>{con.date} ({con.participants})</span>
                      </p>
                    </div>

                    <div className="mt-5 pt-4 border-t border-slate-850 flex items-center justify-between">
                      <span className="text-[11px] text-slate-500 font-sans">Enrolled automatically</span>
                      <button
                        onClick={() => toggleEnroll(con.id)}
                        className={`px-4 py-1.5 rounded-lg text-[10px] font-extrabold transition-all cursor-pointer ${
                          enrolled
                            ? 'bg-[#f97316]/10 text-[#f97316] border border-[#f97316]/20'
                            : 'bg-[#f97316] hover:bg-orange-600 text-slate-950'
                        }`}
                      >
                        {enrolled ? '✓ Registered' : 'Enroll Now'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Custom code-practice challenge entries (Photo 8 style) */}
            <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-2xl space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono mb-2">// HIGHLY SPECIFIED SPEEDRUN SUB-CHALLENGES</h3>
              
              <div className="space-y-2.5">
                {CHALLENGES.map((ch, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3.5 bg-slate-950/60 border border-slate-850 rounded-xl hover:border-slate-800 transition-all text-xs">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-[#f97316] rounded-full"></div>
                      <div>
                        <h4 className="font-bold text-white font-sans">{ch.title}</h4>
                        <span className="text-[10px] text-slate-500 font-mono">{ch.category}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded uppercase ${
                        ch.difficulty === 'Medium' ? 'bg-amber-500/10 text-amber-400' : 'bg-red-500/10 text-red-400'
                      }`}>
                        {ch.difficulty}
                      </span>
                      <span className="text-[10px] font-bold text-slate-500 font-mono">{ch.reward}</span>
                      <button
                        onClick={() => navigate('/coding')}
                        className="px-3 py-1 bg-[#f97316] hover:bg-orange-600 text-slate-950 font-extrabold text-[10px] rounded"
                      >
                        Code Practice &gt;
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* Tab content 2: Leaderboard rankings */}
        {activeTab === 'leaderboard' && (
          <div className="space-y-6">
            
            {/* Main leaderboard overview panel */}
            <div className="bg-[#0f172a] border border-slate-850 rounded-2xl overflow-hidden shadow-xl">
              <div className="p-5 border-b border-slate-850 flex justify-between items-center bg-slate-950/40">
                <div>
                  <h3 className="text-sm font-extrabold text-white font-sans">Global Developer Standings</h3>
                  <p className="text-[11px] text-slate-400 font-sans mt-0.5">Real-time compilation XP points achievements.</p>
                </div>
                <TrendingUp className="w-5 h-5 text-[#f97316]" />
              </div>

              {/* Table List */}
              <div className="divide-y divide-slate-850">
                {LEADERBOARD.map((user_row, idx) => (
                  <div
                    key={idx}
                    className={`p-4 flex items-center justify-between text-xs transition-colors ${
                      user_row.current ? 'bg-[#f97316]/5' : ''
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      {/* Rank badge */}
                      <span className={`w-6 text-center font-mono font-extrabold text-sm ${
                        user_row.rank === 1 ? 'text-yellow-405 text-yellow-400' : user_row.current ? 'text-[#f97316]' : 'text-slate-500'
                      }`}>
                        #{user_row.rank}
                      </span>

                      {/* Avatar initial block */}
                      <div className="w-8 h-8 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-center font-bold text-slate-300 font-mono uppercase">
                        {user_row.initial}
                      </div>

                      <div>
                        {/* Name showing user signifier */}
                        <h4 className="font-sans font-bold text-white flex items-center gap-1.5">
                          <span>{user_row.name}</span>
                          {user_row.current && (
                            <span className="text-[9px] uppercase px-1.5 py-0.5 font-mono bg-[#f97316]/10 text-[#f97316] border border-[#f97316]/20 rounded font-extrabold">YOU</span>
                          )}
                        </h4>
                        <span className="text-[10px] text-slate-500 font-mono">{user_row.badge}</span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="block font-mono font-extrabold text-white text-[13px]">
                        {user_row.score}
                      </span>
                      <span className="text-[9px] text-slate-550 text-slate-400 font-mono">Total Earned</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick motivators */}
            <div className="p-4 bg-[#f97316]/5 border border-[#f97316]/15 rounded-xl text-xs flex gap-2">
              <Cpu className="w-5 h-5 text-[#f97316] shrink-0 mt-0.5" />
              <div>
                <span className="font-extrabold text-[#f97316] block uppercase text-[10px] tracking-wider mb-0.5">Sandbox Recommendation:</span>
                <p className="text-slate-350 font-normal">Improve your globally recorded ranking! Answer technical prompts with correct O(N) constraints to score immediate increases to your active XP points bucket.</p>
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
