import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FileText,
  ChevronRight,
  Cpu,
  BookmarkPlus,
  Layout,
  CheckCircle,
  TrendingUp,
  AlertCircle,
  FileCode,
  Upload,
  Keyboard
} from 'lucide-react';
import { motion } from 'motion/react';

const MOCK_RESUME_TEMP = `Jane Doe
Senior Fullstack Engineer | San Francisco, CA | jane.doe@email.com

SUMMARY
Experienced React and Node.js developer with 5+ years of experience leading team projects. Passionate about building web applications and collaborating.

EXPERIENCE
Software Engineer | Acme Corp (2022 - Present)
- Responsible for the web development product quality and fixing bugs.
- Built multiple pages in React.
- Worked with relational databases and SQL queries.
- Helped train two interns who recently.

SKILLS
React, JavaScript, HTML, CSS, Git, SQLite, Express.js`;

export default function ResumeAnalyzer() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  // Input States (Photo 9 selector list)
  const [targetRole, setTargetRole] = useState('Full Stack Engineer');
  const [evalMethod, setEvalMethod] = useState('text'); // 'text' or 'file'
  const [resumeText, setResumeText] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorHeader, setErrorHeader] = useState('');
  const [fileName, setFileName] = useState('');

  // Report Output (Photo 13 outputs)
  const [report, setReport] = useState(null);

  if (!token) {
    navigate('/login');
    return null;
  }

  const loadSampleData = () => {
    setResumeText(MOCK_RESUME_TEMP);
    setTargetRole("Full Stack Engineer");
    setEvalMethod('text');
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileName(file.name);
      // Read text content as mockup sandbox parser
      const reader = new FileReader();
      reader.onload = (evt) => {
        setResumeText(evt.target.result);
      };
      reader.readAsText(file);
    }
  };

  const handleAudit = async (e) => {
    e.preventDefault();
    if (!resumeText.trim() || !targetRole.trim()) {
      alert("Please provide target position and raw resume copy.");
      return;
    }

    setLoading(true);
    setErrorHeader('');
    setReport(null);

    try {
      const res = await fetch('/api/ai/analyze-resume', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          resumeText: resumeText.trim(),
          targetRole: targetRole.trim()
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'ATS Resume audit run failed.');
      }

      setReport(data);
    } catch (err) {
      setErrorHeader(err.message || 'ATS scanner API timeout.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#0b0f19] min-h-screen text-slate-100 py-8" id="page-resume">
      <div className="max-w-4xl mx-auto px-6">
        
        {/* Breadcrumb Section */}
        <div className="mb-6 flex justify-between items-center bg-slate-900 border border-slate-800 rounded-xl px-5 py-3">
          <div className="flex items-center gap-2 text-xs text-slate-400 font-sans">
            <span className="cursor-pointer hover:text-[#f97316] transition-colors font-bold" onClick={() => navigate('/dashboard')}>Dashboard</span>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="font-semibold text-white">ATS Resume Auditor & Analyzer</span>
          </div>
          <div className="flex items-center gap-2 text-white text-xs font-semibold">
            <Cpu className="w-4 h-4 text-[#f97316] animate-pulse" />
            <span className="font-mono">ATS Analyzer Suite v2.0</span>
          </div>
        </div>

        {/* Input Panel Layout (Photo 9 style) */}
        <div className="grid md:grid-cols-4 gap-6">
          
          {/* Instructions checklist */}
          <div className="md:col-span-1 space-y-4">
            <div className="bg-[#0f172a] border border-slate-850 p-5 rounded-2xl space-y-4">
              <div className="p-2.5 rounded-xl bg-[#f97316]/10 border border-[#f97316]/20 text-[#f97316] w-max">
                <FileText className="w-5 h-5" />
              </div>
              <h3 className="text-xs font-extrabold uppercase text-slate-400 tracking-wider font-mono">// AUDIT PARAMETERS</h3>
              <p className="text-xs text-slate-400 leading-normal font-sans">
                Align your past software engineering records with strict recruiter index keywords.
              </p>
              
              <button
                onClick={loadSampleData}
                type="button"
                className="w-full py-2 bg-slate-950 hover:bg-slate-900 text-slate-300 hover:text-white text-xs font-semibold rounded-lg border border-slate-800 transition-colors cursor-pointer"
              >
                Insert Sandbox Resume
              </button>
            </div>
          </div>

          {/* Form input details */}
          <div className="md:col-span-3">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-[#0f172a] border border-slate-850 rounded-2xl p-6 space-y-5"
            >
              <h2 className="text-sm font-extrabold uppercase text-white tracking-wider font-mono">// CONTEXT PARAMETERS</h2>

              {errorHeader && (
                <div className="p-4 bg-rose-950/40 border border-[#ea580c]/20 rounded-xl text-xs text-rose-300 flex items-start gap-2.5 animate-shake">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-[#ea580c]" />
                  <span>{errorHeader}</span>
                </div>
              )}

              <form onSubmit={handleAudit} className="space-y-4">
                
                {/* Target Role input select */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2 font-mono">
                    Target Role Description
                  </label>
                  <select
                    value={targetRole}
                    onChange={(e) => setTargetRole(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-850 rounded-xl text-xs outline-none text-white focus:border-[#f97316]"
                  >
                    <option value="Full Stack Engineer">Full Stack Engineer</option>
                    <option value="Senior Frontend Architect">Senior Frontend Architect</option>
                    <option value="Backend Developer (Node.js)">Backend Developer (Node.js)</option>
                    <option value="System Design Architect">System Design Architect</option>
                    <option value="Machine Learning Engineer">Machine Learning Engineer</option>
                  </select>
                </div>

                {/* Evaluation method toggle buttons (Photo 9) */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2 font-mono">
                    Evaluation Method
                  </label>
                  <div className="flex gap-2 border-b border-slate-850 pb-2">
                    <button
                      type="button"
                      onClick={() => setEvalMethod('text')}
                      className={`flex-1 py-2 text-xs font-bold rounded-lg border transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${
                        evalMethod === 'text'
                          ? 'bg-slate-950 border-[#f97316] text-[#f97316] font-extrabold'
                          : 'bg-transparent border-transparent text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <Keyboard className="w-4 h-4" />
                      <span>Paste Text Segment</span>
                    </button>
                    
                    <button
                      type="button"
                      onClick={() => setEvalMethod('file')}
                      className={`flex-1 py-2 text-xs font-bold rounded-lg border transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${
                        evalMethod === 'file'
                          ? 'bg-slate-950 border-[#f97316] text-[#f97316] font-extrabold'
                          : 'bg-transparent border-transparent text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <Upload className="w-4 h-4" />
                      <span>Upload Resume File</span>
                    </button>
                  </div>
                </div>

                {/* Conditional Paste text area or Upload input matches Photo 9 */}
                {evalMethod === 'text' ? (
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2 font-mono">
                      Resume Text String
                    </label>
                    <textarea
                      required
                      value={resumeText}
                      onChange={(e) => setResumeText(e.target.value)}
                      placeholder="Paste details of your education, skills, and historic work experience..."
                      className="w-full h-80 p-4 text-xs font-mono bg-slate-950/80 border border-slate-850 rounded-xl outline-none resize-none transition-all focus:border-[#f97316] text-[#f97316]"
                      id="resume-text-input"
                    />
                    <div className="text-[9px] text-slate-550 text-slate-500 font-mono text-right mt-1.5">
                      PASTED CHARACTERS: {resumeText.length}
                    </div>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-slate-800 rounded-xl p-8 text-center space-y-3 bg-slate-950/60 hover:border-slate-700 transition-colors">
                    <Upload className="w-8 h-8 text-slate-600 mx-auto animate-bounce" />
                    <div className="text-xs">
                      <span className="text-slate-300 font-bold block">Drag & Drop or browse files</span>
                      <span className="text-[10px] text-slate-500 block mt-0.5">Supports standard UTF/.txt/Markdown formats</span>
                    </div>
                    <input
                      type="file"
                      onChange={handleFileUpload}
                      className="hidden"
                      id="file-resume-upload"
                      accept=".txt,.md,.pdf"
                    />
                    <label
                      htmlFor="file-resume-upload"
                      className="px-4 py-2 bg-slate-900 border border-slate-800 hover:bg-slate-850 text-xs text-slate-300 rounded-lg inline-block cursor-pointer font-bold"
                    >
                      Select File
                    </label>
                    {fileName && (
                      <p className="text-[11px] text-[#f97316] font-mono font-bold mt-2">✓ Loaded: {fileName}</p>
                    )}
                  </div>
                )}

                <div className="border-t border-slate-850 pt-4 flex justify-end">
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-2.5 bg-[#f97316] hover:bg-orange-600 text-slate-950 font-extrabold rounded-xl text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                    id="btn-resume-audit"
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin h-4 w-4 text-slate-950" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        <span>Audit scanner processing...</span>
                      </>
                    ) : (
                      <>
                        <span>Submit For Analysis &gt;</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>

        </div>

        {/* Audit feedback report screen (Photo 13 Results style) */}
        {report && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#0f172a] border border-slate-850 rounded-2xl p-6 md:p-8 mt-8 space-y-6 shadow-2xl"
          >
            {/* Top Analysis complete score gauges */}
            <div className="border-b border-slate-850 pb-5 flex flex-wrap gap-6 justify-between items-center">
              <div>
                <span className="text-[9px] uppercase font-mono px-2 py-0.5 bg-slate-950 border border-slate-850 text-slate-400 rounded-md">
                  ANALYSIS COMPLETE
                </span>
                <h3 className="text-base font-bold text-white mt-2 font-sans">Gemini ATS Auditor Report Log</h3>
                <p className="text-xs text-slate-405 text-slate-400 mt-1 font-sans">Target Role Match: {targetRole}</p>
              </div>

              <div className="flex gap-4">
                <div className="text-center bg-slate-950 px-4 py-2.5 rounded-xl border border-slate-850">
                  <span className="text-[9px] uppercase font-bold text-slate-500 tracking-wider font-mono">ATS SCORE</span>
                  <span className="block text-xl font-extrabold text-emerald-400 font-mono mt-0.5">{report.overallScore}%</span>
                </div>
                <div className="text-center bg-slate-950 px-4 py-2.5 rounded-xl border border-slate-850">
                  <span className="text-[9px] uppercase font-bold text-slate-500 tracking-wider font-mono">LAYOUT RATING</span>
                  <span className="block text-xl font-extrabold text-[#f97316] font-mono mt-0.5">{report.formattingScore}%</span>
                </div>
              </div>
            </div>

            {/* Layout grid reports matching Photo 13 */}
            <div className="grid sm:grid-cols-2 gap-6 text-xs font-sans">
              
              {/* Detailed Strengths */}
              <div className="bg-slate-950/60 border border-slate-850 p-4 rounded-xl space-y-3.5">
                <h4 className="font-bold text-emerald-400 uppercase tracking-wide text-[10px] flex items-center gap-1.5 font-mono">
                  <CheckCircle className="w-4 h-4 text-emerald-450" />
                  <span>DECTECTED INDUSTRY KEYWORDS (7)</span>
                </h4>
                <ul className="space-y-2 list-none pl-1">
                  {report.strengths?.map((s, i) => (
                    <li key={i} className="text-slate-300 flex items-start gap-1.5 leading-relaxed font-normal">
                      <span className="text-emerald-500 shrink-0 font-extrabold mt-0.5">✓</span>
                      <span>{s}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Missing High-Value Industry Keywords */}
              <div className="bg-slate-950/60 border border-slate-850 p-4 rounded-xl space-y-3.5">
                <h4 className="font-bold text-amber-400 uppercase tracking-wide text-[10px] flex items-center gap-1.5 font-mono">
                  <AlertCircle className="w-4 h-4 shrink-0 text-amber-400" />
                  <span>MISSING CRITICAL KEYWORDS (5)</span>
                </h4>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {report.missingKeywords?.map((kw, i) => (
                    <span key={i} className="bg-slate-900 border border-slate-800 text-amber-305 px-2.5 py-1 rounded text-[10px] border-[#ea580c]/10 text-[#f97316] font-mono">
                      {kw}
                    </span>
                  ))}
                </div>
                <p className="text-[9.5px] text-slate-500 font-mono italic pt-2 border-t border-slate-900 leading-normal">
                  Injecting these terms significantly raises matching index lookup.
                </p>
              </div>

            </div>

            {/* Practical recommendations bullet layout improvements */}
            <div className="bg-slate-950/40 border border-slate-850 p-5 rounded-xl space-y-3 font-sans text-xs">
              <h4 className="font-bold text-slate-300 uppercase tracking-wide text-[10px] flex items-center gap-1.5 font-mono">
                <Layout className="w-4 h-4 text-[#f97316]" />
                <span>Executive Style & Brevity Optimization Notes</span>
              </h4>
              <ul className="space-y-2 pl-4 list-disc leading-relaxed text-slate-400 font-sans">
                {report.layoutSuggestions?.map((suggest, i) => (
                  <li key={i} className="font-normal">{suggest}</li>
                ))}
              </ul>
            </div>

            {/* Optimized bullet rewrites (Photo 13 bottom segment) */}
            <div className="bg-slate-950 border border-slate-850 p-5 rounded-2xl space-y-3.5 font-sans">
              <h4 className="font-extrabold text-[#f97316] uppercase tracking-wider text-[11px] flex items-center gap-2">
                <BookmarkPlus className="w-4.5 h-4.5 text-[#f97316]" />
                <span>Optimized Phrasing Suggestion Sheets</span>
              </h4>
              <p className="text-xs text-slate-400 leading-normal font-sans font-normal border-b border-slate-850 pb-2.5">
                ATS scoring metrics appreciate dynamic impact verbs paired with quantifiable percentages and accomplishments. We rephrased your experiential logs:
              </p>
              <div className="space-y-3 pt-1 text-xs">
                {report.rewrittenBulletPoints?.map((bp, i) => (
                  <div key={i} className="bg-slate-900/60 border border-slate-850 p-4 rounded-xl shadow-xs italic font-sans text-slate-300 leading-normal">
                    {bp}
                  </div>
                ))}
              </div>
            </div>

          </motion.div>
        )}

      </div>
    </div>
  );
}
