import React, { useRef, useEffect, useState } from 'react';
import { 
  Camera, 
  CameraOff, 
  Mic, 
  MicOff, 
  Play, 
  Pause, 
  ShieldCheck, 
  Eye, 
  Clock, 
  Activity,
  Layers,
  Sparkles
} from 'lucide-react';
import { Student } from '../../types';
import { SIMULATION_PRESETS } from '../../services/videoSimulation';

interface LiveFeedViewProps {
  students: Student[];
  isCameraActive: boolean;
  isMicActive: boolean;
  onToggleCamera: () => void;
  onToggleMic: () => void;
  simulationPreset: 'normal' | 'slump' | 'discussion' | 'distracted';
  onChangePreset: (preset: 'normal' | 'slump' | 'discussion' | 'distracted') => void;
  sustainedThreshold: number;
  onChangeThreshold: (val: number) => void;
  isSessionRunning: boolean;
  onToggleSession: () => void;
  speechRatio: number;
  decibels: number;
  videoRef: React.RefObject<HTMLVideoElement | null>;
}

export const LiveFeedView: React.FC<LiveFeedViewProps> = ({
  students,
  isCameraActive,
  isMicActive,
  onToggleCamera,
  onToggleMic,
  simulationPreset,
  onChangePreset,
  sustainedThreshold,
  onChangeThreshold,
  isSessionRunning,
  onToggleSession,
  speechRatio,
  decibels,
  videoRef,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Precision canvas tracking overlay
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (!isSessionRunning) return;

      if (isCameraActive) {
        const primaryStudent = students[0];
        if (primaryStudent) {
          const cx = canvas.width / 2;
          const cy = canvas.height / 2 - 10;
          const boxW = 200;
          const boxH = 240;

          const isAttentive = primaryStudent.eyesOpen && primaryStudent.headPose === 'forward';
          const strokeColor = isAttentive ? '#10b981' : primaryStudent.eyesOpen ? '#f59e0b' : '#ef4444';

          // Bounding box with corner tick marks (technical viewfinder style)
          ctx.strokeStyle = strokeColor;
          ctx.lineWidth = 1.5;
          ctx.strokeRect(cx - boxW / 2, cy - boxH / 2, boxW, boxH);

          // Technical L-brackets
          const tick = 14;
          ctx.lineWidth = 2.5;
          // Top Left
          ctx.beginPath();
          ctx.moveTo(cx - boxW / 2 - 2, cy - boxH / 2 + tick);
          ctx.lineTo(cx - boxW / 2 - 2, cy - boxH / 2 - 2);
          ctx.lineTo(cx - boxW / 2 + tick, cy - boxH / 2 - 2);
          ctx.stroke();

          // Top Right
          ctx.beginPath();
          ctx.moveTo(cx + boxW / 2 + 2, cy - boxH / 2 + tick);
          ctx.lineTo(cx + boxW / 2 + 2, cy - boxH / 2 - 2);
          ctx.lineTo(cx + boxW / 2 - tick, cy - boxH / 2 - 2);
          ctx.stroke();

          // Bottom Left
          ctx.beginPath();
          ctx.moveTo(cx - boxW / 2 - 2, cy + boxH / 2 - tick);
          ctx.lineTo(cx - boxW / 2 - 2, cy + boxH / 2 + 2);
          ctx.lineTo(cx - boxW / 2 + tick, cy + boxH / 2 + 2);
          ctx.stroke();

          // Bottom Right
          ctx.beginPath();
          ctx.moveTo(cx + boxW / 2 + 2, cy + boxH / 2 - tick);
          ctx.lineTo(cx + boxW / 2 + 2, cy + boxH / 2 + 2);
          ctx.lineTo(cx + boxW / 2 - tick, cy + boxH / 2 + 2);
          ctx.stroke();

          // Reticle center
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(cx - 8, cy);
          ctx.lineTo(cx + 8, cy);
          ctx.moveTo(cx, cy - 8);
          ctx.lineTo(cx, cy + 8);
          ctx.stroke();

          // Header Tag
          ctx.fillStyle = 'rgba(10, 15, 26, 0.85)';
          ctx.fillRect(cx - boxW / 2, cy - boxH / 2 - 22, boxW, 20);
          ctx.fillStyle = '#f1f5f9';
          ctx.font = '500 11px JetBrains Mono, monospace';
          ctx.fillText(`ID: ${primaryStudent.rollNo} [${isAttentive ? 'ATTENTIVE' : 'UNFOCUSED'}]`, cx - boxW / 2 + 6, cy - boxH / 2 - 8);

          // Footer Tag - Sustained Presence Verification
          const isVerified = primaryStudent.presenceStatus === 'Present';
          ctx.fillStyle = isVerified ? 'rgba(16, 185, 129, 0.9)' : 'rgba(245, 158, 11, 0.9)';
          ctx.fillRect(cx - boxW / 2, cy + boxH / 2 + 2, boxW, 20);
          ctx.fillStyle = '#090d16';
          ctx.font = '600 10.5px JetBrains Mono, monospace';
          const label = isVerified 
            ? `SUSTAINED: ${primaryStudent.sustainedTimeSec}s (VERIFIED)`
            : `VERIFYING: ${primaryStudent.sustainedTimeSec}s / ${sustainedThreshold}s`;
          ctx.fillText(label, cx - boxW / 2 + 6, cy + boxH / 2 + 15);
        }
      }

      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [isSessionRunning, isCameraActive, students, sustainedThreshold]);

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-4 space-y-3.5">
      {/* Feed Controls Header */}
      <div className="flex flex-wrap items-center justify-between gap-2.5">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 rounded-full bg-blue-500" />
          <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-300">
            Classroom Optical Stream
          </h2>
          <span className={`px-2 py-0.5 text-[10px] font-mono font-medium rounded ${
            isSessionRunning 
              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
              : 'bg-slate-800 text-slate-400 border border-slate-700'
          }`}>
            {isSessionRunning ? 'PROCESSING LIVE' : 'SESSION PAUSED'}
          </span>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-1.5">
          <button
            onClick={onToggleSession}
            className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium border transition-colors ${
              isSessionRunning
                ? 'bg-slate-800 hover:bg-slate-750 text-slate-200 border-slate-700'
                : 'bg-emerald-600 hover:bg-emerald-500 text-white border-emerald-500'
            }`}
          >
            {isSessionRunning ? <Pause className="w-3.5 h-3.5 text-amber-400" /> : <Play className="w-3.5 h-3.5" />}
            <span>{isSessionRunning ? 'Pause Engine' : 'Resume Engine'}</span>
          </button>

          <button
            onClick={onToggleCamera}
            className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium border transition-colors ${
              isCameraActive
                ? 'bg-blue-600 text-white border-blue-500'
                : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-750'
            }`}
            title="Toggle hardware camera feed"
          >
            {isCameraActive ? <Camera className="w-3.5 h-3.5" /> : <CameraOff className="w-3.5 h-3.5" />}
            <span>{isCameraActive ? 'Webcam On' : 'Use Webcam'}</span>
          </button>

          <button
            onClick={onToggleMic}
            className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium border transition-colors ${
              isMicActive
                ? 'bg-sky-600 text-white border-sky-500'
                : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-750'
            }`}
            title="Toggle microphone Voice Activity Detection"
          >
            {isMicActive ? <Mic className="w-3.5 h-3.5" /> : <MicOff className="w-3.5 h-3.5" />}
            <span>{isMicActive ? 'Mic Active' : 'Enable Mic'}</span>
          </button>
        </div>
      </div>

      {/* Main Video & Multi-Participant Monitoring Viewport */}
      <div className="relative aspect-video w-full rounded-md bg-[#070b12] border border-slate-800 overflow-hidden flex items-center justify-center">
        
        {/* Real HTML Video element */}
        <video
          ref={videoRef}
          playsInline
          muted
          autoPlay
          className={`absolute inset-0 w-full h-full object-cover ${isCameraActive ? 'block' : 'hidden'}`}
        />

        {/* Multi-Student Surveillance/Telemetry Grid */}
        {!isCameraActive && (
          <div className="absolute inset-0 w-full h-full grid grid-cols-2 md:grid-cols-3 gap-2 p-2.5 bg-[#070b12]">
            {students.map((student) => {
              const isPresent = student.presenceStatus === 'Present';
              const isVerifying = student.presenceStatus === 'Verifying';
              const isAttentive = student.eyesOpen && student.headPose === 'forward';

              return (
                <div
                  key={student.id}
                  className={`relative rounded-md border p-2 flex flex-col justify-between transition-colors bg-slate-900/60 ${
                    isPresent
                      ? 'border-emerald-500/30'
                      : isVerifying
                      ? 'border-amber-500/30'
                      : 'border-slate-800/80 opacity-60'
                  }`}
                >
                  {/* Participant Header */}
                  <div className="flex items-center justify-between text-[11px] mb-1">
                    <span className="font-medium text-slate-200 truncate pr-1">
                      {student.name}
                    </span>
                    <span className={`px-1.5 py-0.2 rounded text-[10px] font-mono font-medium ${
                      isPresent
                        ? 'text-emerald-400 bg-emerald-500/10'
                        : isVerifying
                        ? 'text-amber-400 bg-amber-500/10'
                        : 'text-slate-500 bg-slate-800/50'
                    }`}>
                      {student.presenceStatus}
                    </span>
                  </div>

                  {/* Thumbnail & Orientation Indicator */}
                  <div className="relative my-auto flex items-center justify-center">
                    <div className="relative">
                      <img
                        src={student.avatar}
                        alt={student.name}
                        className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover border ${
                          isAttentive
                            ? 'border-emerald-500/80'
                            : student.eyesOpen
                            ? 'border-amber-500/80'
                            : 'border-rose-500/80'
                        }`}
                      />
                      <span className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-mono ${
                        student.eyesOpen ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'
                      }`}>
                        {student.eyesOpen ? 'O' : 'X'}
                      </span>
                    </div>
                  </div>

                  {/* Telemetry Readout */}
                  <div className="mt-1 space-y-1 text-[10px] text-slate-400">
                    <div className="flex justify-between items-center font-mono">
                      <span>Pose:</span>
                      <span className="text-slate-200 capitalize">
                        {student.headPose.replace('_', ' ')}
                      </span>
                    </div>

                    <div className="flex justify-between items-center font-mono">
                      <span>Sustained:</span>
                      <span className={isPresent ? 'text-emerald-400 font-semibold' : 'text-slate-300'}>
                        {isPresent 
                          ? `${student.sustainedTimeSec}s (Pass)` 
                          : `${student.sustainedTimeSec}s / ${sustainedThreshold}s`}
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-slate-800 h-1 rounded-xs overflow-hidden">
                      <div
                        className={`h-full transition-all duration-300 ${
                          isPresent ? 'bg-emerald-500' : 'bg-amber-500'
                        }`}
                        style={{
                          width: `${Math.min(100, (student.sustainedTimeSec / sustainedThreshold) * 100)}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Precision Canvas Overlay */}
        <canvas
          ref={canvasRef}
          width={640}
          height={360}
          className="absolute inset-0 w-full h-full pointer-events-none"
        />

        {/* Technical Status Overlays */}
        <div className="absolute top-2.5 left-2.5 flex items-center space-x-2 pointer-events-none text-[11px] font-mono">
          <div className="flex items-center space-x-1.5 px-2 py-0.5 rounded bg-slate-950/80 border border-slate-800 text-slate-300">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>FaceMesh: 468 Keypoints</span>
          </div>
          <div className="hidden sm:flex items-center space-x-1.5 px-2 py-0.5 rounded bg-slate-950/80 border border-slate-800 text-slate-300">
            <ShieldCheck className="w-3 h-3 text-sky-400" />
            <span>Sustained Gate: &ge; {sustainedThreshold}s</span>
          </div>
        </div>

        {/* Audio Meter Overlay in Bottom Left */}
        <div className="absolute bottom-2.5 left-2.5 flex items-center space-x-2 px-2.5 py-1 rounded bg-slate-950/80 border border-slate-800 text-[11px] font-mono text-slate-300 pointer-events-none">
          <Activity className="w-3 h-3 text-sky-400" />
          <span>Mic VAD:</span>
          <span className="text-slate-100 font-bold">{decibels} dB</span>
          <div className="w-12 bg-slate-800 h-1 rounded-xs overflow-hidden ml-1">
            <div
              className={`h-full ${decibels > 50 ? 'bg-amber-400' : 'bg-sky-400'}`}
              style={{ width: `${Math.min(100, (decibels / 80) * 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Preset & Verification Threshold Controls Bar */}
      <div className="pt-2 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
        
        {/* Scenario Preset Selector */}
        <div className="flex items-center space-x-2">
          <span className="text-slate-400 text-[11px] font-medium">Scenario Mode:</span>
          <div className="inline-flex rounded-md bg-slate-950 p-0.5 border border-slate-800">
            {SIMULATION_PRESETS.map((p) => (
              <button
                key={p.id}
                onClick={() => onChangePreset(p.id)}
                className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors ${
                  simulationPreset === p.id
                    ? 'bg-slate-800 text-white font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title={p.description}
              >
                {p.name.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>

        {/* Sustained Presence Threshold Selector */}
        <div className="flex items-center space-x-2">
          <Clock className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-400 text-[11px] font-medium">Sustained Presence Window:</span>
          <div className="inline-flex rounded-md bg-slate-950 p-0.5 border border-slate-800">
            {[3, 5, 10, 15].map((sec) => (
              <button
                key={sec}
                onClick={() => onChangeThreshold(sec)}
                className={`px-2 py-0.5 rounded text-[11px] font-mono transition-colors ${
                  sustainedThreshold === sec
                    ? 'bg-blue-600 text-white font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {sec}s
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
