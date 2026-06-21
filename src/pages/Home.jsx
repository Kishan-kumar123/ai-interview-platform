import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Code, MessageSquare, Terminal, FileText, ArrowRight, ShieldCheck, Cpu, Target, CirclePlay } from 'lucide-react';

export default function Home() {
  const token = localStorage.getItem('token');
  const actionLink = token ? '/dashboard' : '/register';

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.12 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] }
    }
  };

  const features = [
    {
      title: 'Technical Interviews',
      desc: 'Simulate intensive live technical rounds for software developers, data experts, and architects powered by Gemini.',
      icon: Code,
      color: 'bg-indigo-950/50 border-indigo-900/50 text-indigo-300',
      badge: 'Dynamic Generation'
    },
    {
      title: 'HR Behavioral Sandbox',
      desc: 'Practice STAR behavioral answers with open-ended situational prompts, active feedback, and confidence indicators.',
      icon: MessageSquare,
      color: 'bg-purple-950/50 border-purple-900/50 text-purple-300',
      badge: 'STAR Evaluation'
    },
    {
      title: 'Algorithmic Coding Checks',
      desc: 'Interactive compiler mocked simulation with algorithmic code challenges. Write solutions and prompt instant AI evaluation.',
      icon: Terminal,
      color: 'bg-amber-950/50 border-amber-900/50 text-amber-300',
      badge: 'AI Validated Code'
    },
    {
      title: 'Resume Optimizer Audit',
      desc: 'Submit your resume text to execute an executive-level ATS parsing search, score card metrics, format suggestions, and bullet re-writes.',
      icon: FileText,
      color: 'bg-emerald-950/50 border-emerald-900/50 text-emerald-300',
      badge: 'ATS Scoring Match'
    }
  ];

  return (
    <div className="bg-[#0b0f19] min-h-screen text-slate-100 flex flex-col justify-between" id="page-home">
      <main className="flex-1 max-w-7xl mx-auto px-6 py-12 md:py-20">
        
        {/* Hero Segment */}
        <motion.div 
          className="text-center max-w-3xl mx-auto mb-16 md:mb-20"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-900 border border-slate-800 text-[#f97316] rounded-full text-xs font-semibold uppercase tracking-wider mb-6">
            <Cpu className="w-3.5 h-3.5 shrink-0 animate-pulse text-[#f97316]" />
            Next-Gen AI Interview Trainer
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white leading-[1.15] mb-6">
            Master Your Next Technical and HR Interview
          </h1>
          <p className="text-base md:text-lg text-slate-400 font-sans font-normal leading-relaxed mb-8 max-w-2xl mx-auto">
            Get instant expert feedback, score calculations, coding validation, and resume audit advice. Prepare dynamically with Gemini-powered generative rounds.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to={actionLink}
              className="w-full sm:w-auto px-8 py-3.5 bg-[#f97316] hover:bg-orange-600 text-white font-extrabold rounded-xl shadow-lg hover:shadow-orange-950 flex items-center justify-center gap-2 group transition-all"
              id="cta-get-started"
            >
              <span>Get Started Free</span>
              <ArrowRight className="w-4 h-4 shrink-0 group-hover:translate-x-1 transition-transform" />
            </Link>
            <a
              href="#learn-more"
              className="w-full sm:w-auto px-8 py-3.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 font-medium rounded-xl flex items-center justify-center gap-2 transition-all"
            >
              <CirclePlay className="w-4 h-4 text-slate-500" />
              <span>Explore Platforms</span>
            </a>
          </div>
        </motion.div>

        {/* Feature Bento Section */}
        <div id="learn-more" className="scroll-mt-24">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
              A Complete Preparation Suite
            </h2>
            <p className="text-slate-400 font-normal mt-2 text-sm">
              Everything you need to transform your skills and confidently secure complex tech offers.
            </p>
          </div>

          <motion.div 
            className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            {features.map((feat, index) => {
              const IconComponent = feat.icon;
              return (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="bg-slate-900/60 backdrop-blur border border-slate-800 hover:border-slate-700 hover:shadow-lg transition-all rounded-2xl p-6 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className={`p-3 rounded-xl border ${feat.color}`}>
                        <IconComponent className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] uppercase font-bold tracking-wider text-[#f97316] bg-slate-950/80 px-2.5 py-1 rounded-full border border-slate-800">
                        {feat.badge}
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-white mb-2 font-sans tracking-tight">
                      {feat.title}
                    </h3>
                    <p className="text-xs font-normal text-slate-400 leading-relaxed font-sans">
                      {feat.desc}
                    </p>
                  </div>

                  <Link
                    to={token ? actionLink : `/login`}
                    className="mt-6 inline-flex items-center gap-1 text-xs font-bold text-[#f97316] hover:text-orange-400 transition-colors w-max"
                  >
                    <span>Practice tool</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>
        </div>

        {/* Informative Grid Segment */}
        <div className="mt-20 bg-slate-900/80 border border-slate-800 rounded-3xl p-8 md:p-12 flex flex-col lg:flex-row items-center gap-10">
          <div className="flex-1">
            <h3 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white mb-4">
              Real-world Readiness, Powered by cutting-edge Gemini AI
            </h3>
            <p className="text-slate-350 font-sans leading-relaxed text-sm font-normal mb-6">
              Skip standard canned QA pools. PrepMaster generates situational questions dynamically tailored to your exact tech tree, analyzes the code you input, and provides direct, actionable improvements to your grammar, framing, and structure.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-slate-400">
              <div className="flex items-center gap-2 text-xs">
                <ShieldCheck className="w-4.5 h-4.5 text-emerald-400" />
                <span>Zero client CORS issues</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <Target className="w-4.5 h-4.5 text-emerald-400" />
                <span>Immediate answer metrics</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <Cpu className="w-4.5 h-4.5 text-emerald-400" />
                <span>Strict API confidentiality</span>
              </div>
            </div>
          </div>
          <div className="w-full lg:w-80 shrink-0 flex flex-col gap-4 bg-slate-950/80 rounded-2xl p-6 border border-slate-800 font-mono text-xs">
            <div className="flex items-center gap-2 text-indigo-300">
              <div className="w-2 h-2 bg-emerald-400 rounded-full shrink-0"></div>
              <span>AI Evaluation Context</span>
            </div>

            <div className="space-y-3 pt-2 text-slate-300">
              <p className="border-b border-slate-800 pb-2">
                <span className="text-emerald-400 font-bold">Score Range:</span> 85 / 100
              </p>
              <p className="border-b border-slate-800 pb-2">
                <span className="text-slate-400 font-bold">Pros:</span> Direct, structured, includes clear complexity definitions.
              </p>
              <p className="hover:text-white transition-colors">
                <span className="text-slate-400 font-bold">Gaps:</span> Could explain the Garbage Collection implications of memory allocation.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
