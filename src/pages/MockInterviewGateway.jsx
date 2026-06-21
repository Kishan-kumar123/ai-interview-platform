import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageSquare, Cpu, Code, Layers, Shield, HelpCircle, Sparkles, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

export default function MockInterviewGateway() {
  const navigate = useNavigate();
  const [customStack, setCustomStack] = useState('');

  const scenarios = [
    {
      title: 'Technical Scenario',
      desc: 'Syntax structures, algorithmic tradeoffs, complexities, and runtime errors solving.',
      path: '/technical',
      icon: Code,
      color: 'indigo',
      badge: 'Algorithm Masterclass'
    },
    {
      title: 'System Design Scenario',
      desc: 'Scalability diagrams, horizontal partitions, caching strategies, and API contracts.',
      path: '/technical?mode=system-design',
      icon: Layers,
      color: 'purple',
      badge: 'Client & Scale'
    },
    {
      title: 'Behavioral Scenario',
      desc: 'Teamwork conflicts solving, STAR scenarios, and executive presence under pressure.',
      path: '/hr',
      icon: Shield,
      color: 'emerald',
      badge: 'STAR Coaching'
    },
    {
      title: 'HR Scenario',
      desc: 'Career motivation alignment, organizational values integration, and culture match.',
      path: '/hr?mode=hr',
      icon: HelpCircle,
      color: 'sky',
      badge: 'Cultural Valance'
    }
  ];

  const handleLaunchCustom = (e) => {
    e.preventDefault();
    if (!customStack.trim()) return;
    navigate(`/technical?mode=custom&stack=${encodeURIComponent(customStack)}`);
  };

  return (
    <div className="bg-[#0b0f19] min-h-screen text-slate-100 py-8" id="page-mock-gateway">
      <div className="max-w-4xl mx-auto px-6">
        
        {/* Header Block precisely styled */}
        <div className="mb-8 p-6 bg-slate-900 border border-slate-850 rounded-2xl relative overflow-hidden">
          <div className="absolute -top-12 -right-12 w-32 h-32 bg-[#f97316]/5 rounded-full blur-2xl pointer-events-none"></div>

          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-[#f97316]/10 border border-[#f97316]/20 rounded-full text-[9px] text-[#f97316] font-extrabold uppercase tracking-wide mb-2.5 font-mono">
              <Sparkles className="w-3.5 h-3.5" />
              GOOGLE GEMINI-2.5 DRIVEN API
            </span>
            <h1 className="text-xl md:text-2xl font-extrabold text-white tracking-tight leading-snug">
              Al Conversational Mock Coach
            </h1>
            <p className="text-xs text-slate-400 mt-1.5 leading-relaxed font-sans">
              Experience authentic stateful interviewing dialogue backed by multi-parameter Recruiter profiling. Track performance scores and immediate conceptual feedback logs.
            </p>
          </div>
        </div>

        {/* Scenario Selection Grid */}
        <div className="space-y-6">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 font-mono">// SELECT INTERVIEW SCENARIO</h2>

          <div className="grid sm:grid-cols-2 gap-4">
            {scenarios.map((sc, idx) => {
              const Icon = sc.icon;
              return (
                <div
                  key={idx}
                  className="bg-[#0f172a] border border-slate-850 rounded-2xl p-5 hover:border-slate-700 transition-all flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className={`p-2.5 rounded-xl bg-slate-950 text-slate-350 border border-slate-800`}>
                        <Icon className="w-5 h-5 shrink-0 text-[#f97316]" />
                      </div>
                      <span className="text-[9px] font-bold uppercase tracking-wider text-slate-500 font-mono">
                        {sc.badge}
                      </span>
                    </div>
                    
                    <h3 className="text-xs font-extrabold text-white mb-2 tracking-tight group-hover:text-[#f97316] transition-colors font-sans">
                      {sc.title}
                    </h3>
                    <p className="text-xs font-normal text-slate-400 leading-normal font-sans">
                      {sc.desc}
                    </p>
                  </div>

                  <div className="mt-5 pt-4 border-t border-slate-850 flex items-center justify-end">
                    <button
                      onClick={() => navigate(sc.path)}
                      className="px-3.5 py-1.5 bg-[#f97316] hover:bg-orange-600 text-slate-950 font-extrabold text-[11px] rounded-lg cursor-pointer flex items-center gap-1"
                    >
                      <span>Launch Session</span>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-950" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Dynamic Custom Scenario */}
          <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-2xl">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono mb-2 flex items-center gap-1.5">
              <Cpu className="w-4 h-4 text-[#f97316]" />
              <span>Dynamic Custom Scenario Creator</span>
            </h3>
            <p className="text-xs text-slate-405 text-slate-400 mb-4 font-sans">
              Instantiate interview dialogue based entirely on any custom tech stack, framework, or role of your choice.
            </p>

            <form onSubmit={handleLaunchCustom} className="flex gap-2.5">
              <input
                type="text"
                required
                value={customStack}
                onChange={(e) => setCustomStack(e.target.value)}
                placeholder="e.g. Next.js, Redux Toolkit, PostgreSQL optimization, iOS Architect"
                className="flex-1 px-3.5 py-2.5 bg-slate-950/80 border border-slate-850 focus:border-[#f97316] rounded-xl text-xs font-sans outline-none placeholder:text-slate-650 text-white"
              />
              <button
                type="submit"
                className="px-6 py-2.5 bg-slate-950 hover:bg-slate-850 text-[#f97316] border border-[#f97316]/20 rounded-xl text-xs font-bold cursor-pointer transition-colors"
              >
                Launch Custom
              </button>
            </form>
          </div>

        </div>

      </div>
    </div>
  );
}
