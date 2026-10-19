import React, { useState } from 'react';
import { 
  Sliders, 
  Eye, 
  Mic2, 
  UserCheck, 
  Layers,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { FusionWeights } from '../../services/fusionEngine';

interface MultimodalMetersProps {
  fusedScore: number;
  visualScore: number;
  audioScore: number;
  attentivePercent: number;
  speechRatio: number;
  decibels: number;
  sustainedCount: number;
  totalStudents: number;
  weights: FusionWeights;
  onUpdateWeights: (weights: Partial<FusionWeights>) => void;
}

export const MultimodalMeters: React.FC<MultimodalMetersProps> = ({
  fusedScore,
  visualScore,
  audioScore,
  attentivePercent,
  speechRatio,
  decibels,
  sustainedCount,
  totalStudents,
  weights,
  onUpdateWeights,
}) => {
  const [showConfig, setShowConfig] = useState(false);

  const getStatusText = (score: number) => {
    if (score >= 70) return { label: 'Optimal Engagement Flow', color: 'text-emerald-400', barColor: 'bg-emerald-500' };
    if (score >= 45) return { label: 'Moderate Attention Drift', color: 'text-amber-400', barColor: 'bg-amber-500' };
    return { label: 'Critical Attention Drop', color: 'text-rose-400', barColor: 'bg-rose-500' };
  };

  const status = getStatusText(fusedScore);
  const attendancePercent = totalStudents > 0 ? Math.round((sustainedCount / totalStudents) * 100) : 0;

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-4 space-y-3.5">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-2.5">
        <div>
          <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-300">
            Multimodal Telemetry
          </h2>
          <p className="text-[11px] text-slate-500">
            Real-time Sensor Fusion (Vision + VAD + Presence)
          </p>
        </div>

        <button
          onClick={() => setShowConfig(!showConfig)}
          className={`flex items-center space-x-1 px-2 py-1 rounded text-[11px] border transition-colors ${
            showConfig 
              ? 'bg-slate-800 border-slate-700 text-slate-200' 
              : 'border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-850'
          }`}
          title="Adjust fusion weights"
        >
          <Sliders className="w-3 h-3" />
          <span>Weights</span>
          {showConfig ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
        </button>
      </div>

      {/* Primary KPI Card: Fused Classroom Index */}
      <div className="p-3.5 rounded-md bg-slate-950/80 border border-slate-800/90 space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-400 font-medium">Fused Classroom Index</span>
          <span className={`text-[11px] font-medium font-mono ${status.color}`}>
            {status.label}
          </span>
        </div>

        <div className="flex items-baseline space-x-2">
          <span className="text-3xl font-bold font-mono text-slate-100 tracking-tight">
            {fusedScore}%
          </span>
          <span className="text-[11px] text-slate-500 font-mono">
            / 100 Index
          </span>
        </div>

        {/* Linear Calibrated Progress Bar */}
        <div className="w-full bg-slate-800 h-1.5 rounded-xs overflow-hidden">
          <div
            className={`h-full transition-all duration-300 ${status.barColor}`}
            style={{ width: `${fusedScore}%` }}
          />
        </div>

        <div className="flex justify-between text-[10px] font-mono text-slate-500 pt-0.5">
          <span>0% Drop Alert</span>
          <span>50% Drift</span>
          <span>100% Focused</span>
        </div>
      </div>

      {/* Triad of Underlying Modalities */}
      <div className="grid grid-cols-3 gap-2">
        
        {/* Visual Attention */}
        <div className="bg-slate-950/70 p-2.5 rounded-md border border-slate-800 space-y-1.5">
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span className="font-medium">Visual Focus</span>
            <Eye className="w-3 h-3 text-slate-500" />
          </div>
          <div className="text-base font-bold font-mono text-slate-100">
            {attentivePercent}%
          </div>
          <div className="text-[10px] text-slate-500 truncate">
            Head & EAR align
          </div>
          <div className="w-full bg-slate-800 h-1 rounded-xs overflow-hidden">
            <div
              className="bg-blue-500 h-full transition-all duration-300"
              style={{ width: `${attentivePercent}%` }}
            />
          </div>
        </div>

        {/* Acoustic VAD */}
        <div className="bg-slate-950/70 p-2.5 rounded-md border border-slate-800 space-y-1.5">
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span className="font-medium">Speech VAD</span>
            <Mic2 className="w-3 h-3 text-slate-500" />
          </div>
          <div className="text-base font-bold font-mono text-slate-100">
            {speechRatio}%
          </div>
          <div className="text-[10px] text-slate-500 font-mono truncate">
            {decibels} dB acoustic
          </div>
          <div className="w-full bg-slate-800 h-1 rounded-xs overflow-hidden">
            <div
              className="bg-sky-500 h-full transition-all duration-300"
              style={{ width: `${Math.min(100, speechRatio)}%` }}
            />
          </div>
        </div>

        {/* Sustained Presence Verified */}
        <div className="bg-slate-950/70 p-2.5 rounded-md border border-slate-800 space-y-1.5">
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span className="font-medium">Attendance</span>
            <UserCheck className="w-3 h-3 text-slate-500" />
          </div>
          <div className="text-base font-bold font-mono text-slate-100">
            {sustainedCount}/{totalStudents}
          </div>
          <div className="text-[10px] text-emerald-400 font-mono font-medium truncate">
            {attendancePercent}% Verified
          </div>
          <div className="w-full bg-slate-800 h-1 rounded-xs overflow-hidden">
            <div
              className="bg-emerald-500 h-full transition-all duration-300"
              style={{ width: `${attendancePercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Expandable Fusion Weights Drawer */}
      {showConfig && (
        <div className="p-3 bg-slate-950 rounded-md border border-slate-800 text-xs space-y-2.5">
          <div className="flex items-center justify-between font-semibold text-slate-300 text-[11px]">
            <span>Multimodal Fusion Weights</span>
            <span className="text-[10px] font-mono text-slate-500">Auto-normalized</span>
          </div>

          <div className="space-y-2 text-[11px]">
            <div>
              <div className="flex justify-between text-slate-400 mb-0.5">
                <span>Visual Factor (Pose + EAR)</span>
                <span className="font-mono text-slate-200">{Math.round(weights.visual * 100)}%</span>
              </div>
              <input
                type="range"
                min="0.2"
                max="0.8"
                step="0.05"
                value={weights.visual}
                onChange={(e) => onUpdateWeights({ visual: parseFloat(e.target.value) })}
                className="w-full accent-blue-500 h-1 bg-slate-800 rounded-sm cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-slate-400 mb-0.5">
                <span>Acoustic Dynamics (Speech Ratio)</span>
                <span className="font-mono text-slate-200">{Math.round(weights.audio * 100)}%</span>
              </div>
              <input
                type="range"
                min="0.1"
                max="0.5"
                step="0.05"
                value={weights.audio}
                onChange={(e) => onUpdateWeights({ audio: parseFloat(e.target.value) })}
                className="w-full accent-sky-500 h-1 bg-slate-800 rounded-sm cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-slate-400 mb-0.5">
                <span>Posture & Stability</span>
                <span className="font-mono text-slate-200">{Math.round(weights.posture * 100)}%</span>
              </div>
              <input
                type="range"
                min="0.05"
                max="0.3"
                step="0.05"
                value={weights.posture}
                onChange={(e) => onUpdateWeights({ posture: parseFloat(e.target.value) })}
                className="w-full accent-emerald-500 h-1 bg-slate-800 rounded-sm cursor-pointer"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
