import React, { useState } from 'react';
import { 
  Sparkles, 
  Lightbulb, 
  AlertTriangle, 
  CheckCircle, 
  RefreshCw, 
  MessageSquareQuote, 
  Zap, 
  BookOpen, 
  Bot,
  Brain,
  Cpu
} from 'lucide-react';
import { TeachingSuggestion } from '../../types';

interface AiTeachingAgentPanelProps {
  suggestion: TeachingSuggestion;
  onRequestGeminiSuggestion: (topic: string) => Promise<void>;
  isLoadingGemini: boolean;
  geminiSuggestionText: string | null;
  lectureTopic: string;
  onChangeLectureTopic: (topic: string) => void;
}

export const AiTeachingAgentPanel: React.FC<AiTeachingAgentPanelProps> = ({
  suggestion,
  onRequestGeminiSuggestion,
  isLoadingGemini,
  geminiSuggestionText,
  lectureTopic,
  onChangeLectureTopic,
}) => {
  const [activeTab, setActiveTab] = useState<'edge' | 'gemini'>('edge');

  const getBadge = () => {
    switch (suggestion.level) {
      case 'critical_drop':
        return {
          bg: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
          borderColor: 'border-l-rose-500',
          label: 'Immediate Intervention Needed',
        };
      case 'moderate_dip':
        return {
          bg: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
          borderColor: 'border-l-amber-500',
          label: 'Attention Dip Flagged',
        };
      case 'discussion_peak':
        return {
          bg: 'text-sky-400 bg-sky-500/10 border-sky-500/20',
          borderColor: 'border-l-sky-500',
          label: 'Active Discussion Dynamics',
        };
      default:
        return {
          bg: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
          borderColor: 'border-l-emerald-500',
          label: 'Optimal Instructional Flow',
        };
    }
  };

  const badge = getBadge();

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-4 space-y-3.5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-2.5">
        <div>
          <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-300">
            Teaching Decision Support
          </h2>
          <p className="text-[11px] text-slate-500">
            Scenario 3: Non-Intrusive Pedagogical Agent
          </p>
        </div>

        {/* Dual Mode Switcher */}
        <div className="inline-flex rounded-md bg-slate-950 p-0.5 border border-slate-800 text-[11px]">
          <button
            onClick={() => setActiveTab('edge')}
            className={`px-2 py-1 rounded font-medium transition-colors ${
              activeTab === 'edge'
                ? 'bg-slate-800 text-white font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Edge Engine (0ms)
          </button>
          <button
            onClick={() => {
              setActiveTab('gemini');
              if (!geminiSuggestionText && !isLoadingGemini) {
                onRequestGeminiSuggestion(lectureTopic);
              }
            }}
            className={`px-2 py-1 rounded font-medium flex items-center space-x-1 transition-colors ${
              activeTab === 'gemini'
                ? 'bg-blue-600 text-white font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-3 h-3 text-sky-200" />
            <span>Gemini 3.8 Flash</span>
          </button>
        </div>
      </div>

      {/* Classroom Lesson Context Input */}
      <div className="flex items-center space-x-2 bg-slate-950 px-2.5 py-1.5 rounded-md border border-slate-800 text-xs">
        <BookOpen className="w-3.5 h-3.5 text-slate-500 shrink-0" />
        <span className="text-slate-500 text-[11px] font-mono shrink-0">Topic:</span>
        <input
          type="text"
          value={lectureTopic}
          onChange={(e) => onChangeLectureTopic(e.target.value)}
          placeholder="e.g., Computer Vision & Multimodal Agent Architecture"
          className="bg-transparent border-none text-slate-200 focus:outline-none w-full text-xs font-mono"
        />
      </div>

      {/* Edge Heuristic Advice Tab */}
      {activeTab === 'edge' && (
        <div className="space-y-2.5">
          {/* Card 1: Immediate Action */}
          <div className={`p-3 rounded-md bg-slate-950/80 border border-slate-800/80 border-l-2 ${badge.borderColor} space-y-1`}>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wide">
                Immediate Action (30s)
              </span>
              <span className={`px-1.5 py-0.2 rounded text-[10px] font-mono border ${badge.bg}`}>
                {badge.label}
              </span>
            </div>
            <p className="text-xs text-slate-100 font-medium leading-relaxed">
              {suggestion.immediateAction}
            </p>
          </div>

          {/* Card 2: Pedagogical Diagnosis */}
          <div className="p-3 rounded-md bg-slate-950/80 border border-slate-800/80 space-y-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">
              Cognitive Pacing Diagnosis
            </span>
            <p className="text-xs text-slate-300 leading-relaxed">
              {suggestion.pedagogicalInsight}
            </p>
          </div>

          {/* Card 3: Interactive Strategy */}
          <div className="p-3 rounded-md bg-slate-950/80 border border-slate-800/80 space-y-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">
              Active Learning Strategy (2m)
            </span>
            <p className="text-xs text-slate-300 leading-relaxed">
              {suggestion.interactiveStrategy}
            </p>
          </div>

          <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 pt-0.5">
            <span>Evaluated: {suggestion.timestamp}</span>
            <span>Source: {suggestion.source}</span>
          </div>
        </div>
      )}

      {/* Gemini Deep Reasoning Tab */}
      {activeTab === 'gemini' && (
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-300 flex items-center space-x-1.5">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              <span>Gemini 3.8 Flash Contextual Reasoning</span>
            </span>
            <button
              onClick={() => onRequestGeminiSuggestion(lectureTopic)}
              disabled={isLoadingGemini}
              className="flex items-center space-x-1 px-2 py-1 text-[11px] rounded bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-3 h-3 ${isLoadingGemini ? 'animate-spin' : ''}`} />
              <span>Re-run Analysis</span>
            </button>
          </div>

          <div className="p-3.5 rounded-md bg-slate-950/90 border border-slate-800 text-xs text-slate-200 leading-relaxed max-h-72 overflow-y-auto whitespace-pre-line font-mono">
            {isLoadingGemini ? (
              <div className="flex flex-col items-center justify-center py-6 space-y-2 text-slate-400">
                <RefreshCw className="w-4 h-4 animate-spin text-blue-400" />
                <span className="text-xs">Formulating intervention strategy with Gemini 3.8 Flash...</span>
              </div>
            ) : geminiSuggestionText ? (
              geminiSuggestionText
            ) : (
              <p className="text-slate-500 text-center py-4 text-xs">
                Click "Re-run Analysis" to request real-time guidance from the Gemini pedagogical model.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
