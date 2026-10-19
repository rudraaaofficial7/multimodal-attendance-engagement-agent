import React from 'react';
import { 
  Video, 
  Github, 
  CheckCircle2, 
  Kanban, 
  BarChart3, 
  Layers, 
  Code2, 
  ScanFace,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';
import { ProjectMetadataState } from '../types';

interface HeaderProps {
  activeTab: 'live' | 'analytics' | 'kanban' | 'architecture' | 'python';
  setActiveTab: (tab: 'live' | 'analytics' | 'kanban' | 'architecture' | 'python') => void;
  isCameraActive: boolean;
  isMicActive: boolean;
  fusedScore: number;
  projectMeta: ProjectMetadataState;
  onOpenLinksModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  isCameraActive,
  isMicActive,
  fusedScore,
  projectMeta,
  onOpenLinksModal,
}) => {
  return (
    <header className="border-b border-slate-800/80 bg-[#090d16] sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Top Bar: Brand, Status Strip & Actions */}
        <div className="flex items-center justify-between h-14">
          
          {/* Brand & Identity */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-md bg-slate-800/90 border border-slate-700/80 flex items-center justify-center text-slate-200 shadow-sm">
              <ScanFace className="w-4 h-4 text-blue-400" />
            </div>
            <div className="flex items-center space-x-2.5">
              <h1 className="font-semibold text-sm sm:text-base text-slate-100 tracking-tight">
                Multimodal Attendance & Engagement Agent
              </h1>
              <span className="hidden sm:inline-flex items-center px-2 py-0.5 text-[11px] font-mono font-medium rounded text-slate-400 bg-slate-900 border border-slate-800">
                v2.4-edge
              </span>
            </div>
          </div>

          {/* Right Section: Telemetry Indicators & Mentor Evaluation Link */}
          <div className="flex items-center space-x-3">
            
            {/* Telemetry Status Strip */}
            <div className="hidden lg:flex items-center space-x-3 px-3 py-1 rounded-md bg-slate-900/90 border border-slate-800 text-xs">
              <div className="flex items-center space-x-1.5 font-mono text-[11px]">
                <span className={`w-1.5 h-1.5 rounded-full ${isCameraActive ? 'bg-emerald-400' : 'bg-slate-600'}`} />
                <span className={isCameraActive ? 'text-slate-200' : 'text-slate-400'}>
                  Vision: {isCameraActive ? 'Live' : 'Standby'}
                </span>
              </div>
              <span className="text-slate-700">/</span>
              <div className="flex items-center space-x-1.5 font-mono text-[11px]">
                <span className={`w-1.5 h-1.5 rounded-full ${isMicActive ? 'bg-sky-400' : 'bg-slate-600'}`} />
                <span className={isMicActive ? 'text-slate-200' : 'text-slate-400'}>
                  VAD: {isMicActive ? 'Active' : 'Off'}
                </span>
              </div>
              <span className="text-slate-700">/</span>
              <div className="flex items-center space-x-1.5 font-mono text-[11px]">
                <span className="text-slate-400">Score:</span>
                <span className="font-semibold text-blue-400">{fusedScore}%</span>
              </div>
            </div>

            {/* Mentor Review Links Button */}
            <button
              onClick={onOpenLinksModal}
              className="flex items-center space-x-1.5 px-2.5 py-1.5 text-xs font-medium rounded-md bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700/80 transition-colors"
              title="Add or review Demo & GitHub evaluation links for mentor"
            >
              <Github className="w-3.5 h-3.5 text-slate-400" />
              <span className="hidden sm:inline">Mentor Review Links</span>
              <span className="sm:hidden">Links</span>
              {projectMeta.githubUrl ? (
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              )}
            </button>
          </div>
        </div>

        {/* Tab Navigation - Understated, Data-Tool Style */}
        <nav className="flex space-x-1 overflow-x-auto border-t border-slate-800/80 text-xs font-medium scrollbar-none py-1">
          <button
            onClick={() => setActiveTab('live')}
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-md transition-colors whitespace-nowrap ${
              activeTab === 'live'
                ? 'bg-slate-800 text-white font-semibold border border-slate-700/60 shadow-xs'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-850/50'
            }`}
          >
            <Video className="w-3.5 h-3.5" />
            <span>Live Classroom</span>
          </button>

          <button
            onClick={() => setActiveTab('analytics')}
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-md transition-colors whitespace-nowrap ${
              activeTab === 'analytics'
                ? 'bg-slate-800 text-white font-semibold border border-slate-700/60 shadow-xs'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-850/50'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Session Analytics</span>
          </button>

          <button
            onClick={() => setActiveTab('kanban')}
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-md transition-colors whitespace-nowrap ${
              activeTab === 'kanban'
                ? 'bg-slate-800 text-white font-semibold border border-slate-700/60 shadow-xs'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-850/50'
            }`}
          >
            <Kanban className="w-3.5 h-3.5" />
            <span>Project Tasks (9 Epics / 17 Tasks)</span>
          </button>

          <button
            onClick={() => setActiveTab('architecture')}
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-md transition-colors whitespace-nowrap ${
              activeTab === 'architecture'
                ? 'bg-slate-800 text-white font-semibold border border-slate-700/60 shadow-xs'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-850/50'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Architecture & Specs</span>
          </button>

          <button
            onClick={() => setActiveTab('python')}
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-md transition-colors whitespace-nowrap ${
              activeTab === 'python'
                ? 'bg-slate-800 text-white font-semibold border border-slate-700/60 shadow-xs'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-850/50'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>Python Source Code</span>
          </button>
        </nav>
      </div>
    </header>
  );
};
