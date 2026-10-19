import React, { useState } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  AlertTriangle, 
  Sparkles, 
  Users, 
  Volume2, 
  FileText, 
  Download, 
  RefreshCw,
  Clock
} from 'lucide-react';
import { EngagementTick, Student } from '../../types';

interface AnalyticsViewProps {
  timeline: EngagementTick[];
  students: Student[];
  lectureTopic: string;
  onGenerateReport: () => Promise<string | null>;
  isGeneratingReport: boolean;
  generatedReport: string | null;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({
  timeline,
  students,
  lectureTopic,
  onGenerateReport,
  isGeneratingReport,
  generatedReport,
}) => {
  const [selectedIncidentFilter, setSelectedIncidentFilter] = useState<'all' | 'dips' | 'peaks'>('all');

  // Compute metrics
  const scores = timeline.map((t) => t.fusedEngagement);
  const avgEngagement = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 74;
  const peakEngagement = scores.length > 0 ? Math.max(...scores) : 92;
  const lowestEngagement = scores.length > 0 ? Math.min(...scores) : 41;

  const attentionDips = timeline.filter((t) => t.isAttentionDip);
  const interactionPeaks = timeline.filter((t) => t.isInteractionPeak);
  const presentStudents = students.filter((s) => s.presenceStatus === 'Present').length;

  const incidentList = timeline
    .filter((t) => {
      if (selectedIncidentFilter === 'dips') return t.isAttentionDip;
      if (selectedIncidentFilter === 'peaks') return t.isInteractionPeak;
      return t.isAttentionDip || t.isInteractionPeak;
    })
    .slice(-8)
    .reverse();

  // Export Report to Markdown
  const handleDownloadReport = () => {
    if (!generatedReport) return;
    const blob = new Blob([generatedReport], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Classroom_Intelligence_Report_${new Date().toISOString().slice(0, 10)}.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      {/* Top Metric Cards Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-slate-900/90 border border-slate-800 p-3.5 rounded-lg">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span className="font-medium">Mean Engagement</span>
            <TrendingUp className="w-3.5 h-3.5 text-slate-500" />
          </div>
          <div className="text-2xl font-bold font-mono text-slate-100">
            {avgEngagement}%
          </div>
          <span className="text-[11px] text-emerald-400 font-mono">
            Range: [{lowestEngagement}% - {peakEngagement}%]
          </span>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 p-3.5 rounded-lg">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span className="font-medium">Sustained Attendance</span>
            <Users className="w-3.5 h-3.5 text-slate-500" />
          </div>
          <div className="text-2xl font-bold font-mono text-slate-100">
            {presentStudents}/{students.length}
          </div>
          <span className="text-[11px] text-blue-400 font-mono">
            {Math.round((presentStudents / Math.max(1, students.length)) * 100)}% Verified Gate
          </span>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 p-3.5 rounded-lg">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span className="font-medium">Attention Drops</span>
            <AlertTriangle className="w-3.5 h-3.5 text-slate-500" />
          </div>
          <div className="text-2xl font-bold font-mono text-amber-400">
            {attentionDips.length}
          </div>
          <span className="text-[11px] text-slate-500 font-mono">
            Below 45% threshold
          </span>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 p-3.5 rounded-lg">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span className="font-medium">Discussion Peaks</span>
            <Volume2 className="w-3.5 h-3.5 text-slate-500" />
          </div>
          <div className="text-2xl font-bold font-mono text-sky-400">
            {interactionPeaks.length}
          </div>
          <span className="text-[11px] text-slate-500 font-mono">
            VAD activity &gt; 55%
          </span>
        </div>
      </div>

      {/* Main Trajectory Chart */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-4 space-y-3.5">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-2.5">
          <div>
            <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-300">
              Multimodal Engagement Trajectory & Dynamics
            </h2>
            <p className="text-[11px] text-slate-500">
              Continuous time-series combining Visual Attention, Acoustic VAD, and Composite Index
            </p>
          </div>

          <div className="flex items-center space-x-3 text-xs font-mono">
            <span className="flex items-center space-x-1.5 text-blue-400">
              <span className="w-2.5 h-0.5 bg-blue-500 inline-block" />
              <span>Fused Index</span>
            </span>
            <span className="flex items-center space-x-1.5 text-sky-400">
              <span className="w-2.5 h-0.5 bg-sky-400 inline-block" />
              <span>Speech VAD</span>
            </span>
            <span className="flex items-center space-x-1.5 text-rose-400">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 inline-block" />
              <span>Drop Event</span>
            </span>
          </div>
        </div>

        {/* SVG Graph Viewport */}
        <div className="relative h-60 w-full bg-[#070b12] rounded-md p-3 border border-slate-800 flex flex-col justify-between overflow-hidden">
          {timeline.length > 1 ? (
            <svg className="w-full h-full overflow-visible" viewBox={`0 0 ${timeline.length * 20} 100`} preserveAspectRatio="none">
              {/* Reference Grid lines */}
              <line x1="0" y1="25" x2={timeline.length * 20} y2="25" stroke="#1e293b" strokeDasharray="2 2" strokeWidth="0.5" />
              <line x1="0" y1="50" x2={timeline.length * 20} y2="50" stroke="#1e293b" strokeDasharray="2 2" strokeWidth="0.5" />
              <line x1="0" y1="75" x2={timeline.length * 20} y2="75" stroke="#1e293b" strokeDasharray="2 2" strokeWidth="0.5" />

              {/* Shaded Area under Fused Curve */}
              <polygon
                points={`0,100 ${timeline.map((t, i) => `${i * 20},${100 - t.fusedEngagement}`).join(' ')} ${(timeline.length - 1) * 20},100`}
                fill="url(#blueFill)"
                opacity="0.15"
              />

              <defs>
                <linearGradient id="blueFill" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#3b82f6" />
                  <stop offset="100%" stopColor="#070b12" />
                </linearGradient>
              </defs>

              {/* Audio Activity Line */}
              <polyline
                fill="none"
                stroke="#38bdf8"
                strokeWidth="1.2"
                strokeOpacity="0.8"
                points={timeline.map((t, i) => `${i * 20},${100 - t.audioActivity}`).join(' ')}
              />

              {/* Fused Score Line */}
              <polyline
                fill="none"
                stroke="#3b82f6"
                strokeWidth="2"
                points={timeline.map((t, i) => `${i * 20},${100 - t.fusedEngagement}`).join(' ')}
              />

              {/* Data points for flagged events */}
              {timeline.map((t, i) => (
                <g key={i}>
                  {t.isAttentionDip && (
                    <circle
                      cx={i * 20}
                      cy={100 - t.fusedEngagement}
                      r="3.5"
                      fill="#f43f5e"
                    />
                  )}
                  {t.isInteractionPeak && (
                    <circle
                      cx={i * 20}
                      cy={100 - t.fusedEngagement}
                      r="3.5"
                      fill="#0284c7"
                    />
                  )}
                </g>
              ))}
            </svg>
          ) : (
            <div className="flex items-center justify-center h-full text-slate-500 text-xs font-mono">
              Collecting continuous sensor stream... (Session active)
            </div>
          )}

          {/* Time axis notation */}
          <div className="flex justify-between text-[10px] text-slate-500 font-mono pt-1.5 border-t border-slate-800">
            <span>T-0 Start</span>
            <span>Recorded Samples: {timeline.length} intervals</span>
            <span>Live Head</span>
          </div>
        </div>

        {/* Dynamic Incidents Log */}
        <div className="space-y-2 pt-1">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-300">Flagged Trajectory Events</span>
            <div className="inline-flex rounded-md bg-slate-950 p-0.5 border border-slate-800 text-[11px]">
              {(['all', 'dips', 'peaks'] as const).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setSelectedIncidentFilter(filter)}
                  className={`px-2 py-0.5 rounded capitalize transition-colors ${
                    selectedIncidentFilter === filter
                      ? 'bg-slate-800 text-white font-medium'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
            {incidentList.length > 0 ? (
              incidentList.map((inc, idx) => (
                <div
                  key={idx}
                  className={`p-2.5 rounded-md border flex items-center justify-between bg-slate-950/60 ${
                    inc.isAttentionDip
                      ? 'border-rose-500/30 text-rose-300'
                      : 'border-sky-500/30 text-sky-300'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    {inc.isAttentionDip ? (
                      <AlertTriangle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                    ) : (
                      <Volume2 className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                    )}
                    <div>
                      <span className="font-medium block text-slate-200 text-xs">
                        {inc.isAttentionDip ? 'Attention Drop Detected' : 'Interactive Discussion Peak'}
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono">
                        Score: {inc.fusedEngagement}% | VAD: {inc.audioActivity}%
                      </span>
                    </div>
                  </div>
                  <span className="font-mono text-[10px] text-slate-500">
                    {inc.timestamp}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-500 col-span-2 py-1 font-mono">
                No acute attention dips or interaction anomalies flagged in this window.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Comprehensive Gemini AI Report Section */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-4 space-y-3.5">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-2.5">
          <div>
            <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-300">
              Session Analytical Dossier (Gemini 3.8 Flash)
            </h2>
            <p className="text-[11px] text-slate-500">
              Comprehensive pedagogical evaluation prepared for mentor review and instructional debriefing
            </p>
          </div>

          <div className="flex items-center space-x-2">
            {generatedReport && (
              <button
                onClick={handleDownloadReport}
                className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export .md</span>
              </button>
            )}

            <button
              onClick={onGenerateReport}
              disabled={isGeneratingReport}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs font-medium bg-blue-600 hover:bg-blue-500 text-white transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isGeneratingReport ? 'animate-spin' : ''}`} />
              <span>{isGeneratingReport ? 'Compiling Dossier...' : 'Generate Session Dossier'}</span>
            </button>
          </div>
        </div>

        {/* Report Output Viewport */}
        <div className="p-4 rounded-md bg-[#070b12] border border-slate-800 text-xs text-slate-200 leading-relaxed font-mono whitespace-pre-line max-h-96 overflow-y-auto">
          {isGeneratingReport ? (
            <div className="flex flex-col items-center justify-center py-10 space-y-2 text-slate-400">
              <RefreshCw className="w-5 h-5 animate-spin text-blue-400" />
              <p className="font-medium text-slate-200">
                Gemini 3.8 Flash is analyzing multimodal telemetry, attention dips, and participation data...
              </p>
              <span className="text-[11px] text-slate-500">
                Synthesizing sustained presence metrics into pedagogical insights
              </span>
            </div>
          ) : generatedReport ? (
            <div className="prose prose-invert max-w-none text-slate-200 text-xs font-mono leading-relaxed">
              {generatedReport}
            </div>
          ) : (
            <div className="text-center py-6 text-slate-500 space-y-1 font-mono text-xs">
              <FileText className="w-6 h-6 mx-auto text-slate-600" />
              <p className="font-medium text-slate-400">
                No session analytical dossier compiled yet.
              </p>
              <p className="text-[11px] text-slate-600 max-w-md mx-auto">
                Click "Generate Session Dossier" to run the server-side Gemini 3.8 Flash model across the entire session timeline and sustained attendance logs.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
