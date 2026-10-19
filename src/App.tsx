/**
 * Multimodal Attendance & Engagement Agent
 * Real-Time Privacy-Preserving Classroom Intelligence System
 */

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Header } from './components/Header';
import { LiveFeedView } from './components/LiveClassroom/LiveFeedView';
import { MultimodalMeters } from './components/LiveClassroom/MultimodalMeters';
import { AiTeachingAgentPanel } from './components/LiveClassroom/AiTeachingAgentPanel';
import { SustainedAttendanceTable } from './components/LiveClassroom/SustainedAttendanceTable';
import { AnalyticsView } from './components/Analytics/AnalyticsView';
import { KanbanBoard } from './components/Kanban/KanbanBoard';
import { ArchitectureView } from './components/Architecture/ArchitectureView';
import { PythonCodeViewer } from './components/PythonCodeHub/PythonCodeViewer';
import { DemoLinksModal } from './components/Modals/DemoLinksModal';
import { EnrollStudentModal } from './components/Modals/EnrollStudentModal';

import { 
  Student, 
  KanbanTask, 
  EngagementTick, 
  TeachingSuggestion, 
  ProjectMetadataState 
} from './types';
import { 
  INITIAL_EPICS, 
  INITIAL_TASKS, 
  INITIAL_STUDENTS 
} from './data/initialData';
import { ClassroomAudioProcessor } from './services/audioProcessor';
import { MultimodalFusionEngine, FusionWeights } from './services/fusionEngine';
import { VideoStreamManager } from './services/videoSimulation';

export default function App() {
  // Navigation & View State
  const [activeTab, setActiveTab] = useState<'live' | 'analytics' | 'kanban' | 'architecture' | 'python'>('live');
  const [isSessionRunning, setIsSessionRunning] = useState(true);

  // Classroom Modalities State
  const [students, setStudents] = useState<Student[]>(() => {
    const saved = localStorage.getItem('multimodal_students');
    return saved ? JSON.parse(saved) : INITIAL_STUDENTS;
  });
  const [sustainedThreshold, setSustainedThreshold] = useState<number>(5); // default 5s
  const [simulationPreset, setSimulationPreset] = useState<'normal' | 'slump' | 'discussion' | 'distracted'>('normal');

  // Input Hardware Stream State
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isMicActive, setIsMicActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Audio Telemetry
  const [decibels, setDecibels] = useState(38);
  const [speechRatio, setSpeechRatio] = useState(25);
  const [isVoiceActive, setIsVoiceActive] = useState(false);

  // Multimodal Metrics
  const [fusedScore, setFusedScore] = useState(82);
  const [visualScore, setVisualScore] = useState(85);
  const [audioScore, setAudioScore] = useState(80);
  const [attentivePercent, setAttentivePercent] = useState(80);

  // Timeline History
  const [timeline, setTimeline] = useState<EngagementTick[]>([
    { timestamp: '09:00:10', fusedEngagement: 85, visualAttention: 90, audioActivity: 20, attentiveStudentRatio: 85, isAttentionDip: false, isInteractionPeak: false },
    { timestamp: '09:00:20', fusedEngagement: 84, visualAttention: 88, audioActivity: 25, attentiveStudentRatio: 85, isAttentionDip: false, isInteractionPeak: false },
    { timestamp: '09:00:30', fusedEngagement: 86, visualAttention: 92, audioActivity: 30, attentiveStudentRatio: 90, isAttentionDip: false, isInteractionPeak: false },
    { timestamp: '09:00:40', fusedEngagement: 82, visualAttention: 84, audioActivity: 35, attentiveStudentRatio: 80, isAttentionDip: false, isInteractionPeak: false },
  ]);

  // AI Teaching Suggestions State
  const [lectureTopic, setLectureTopic] = useState('Multimodal AI & Sustained Attendance System');
  const [teachingSuggestion, setTeachingSuggestion] = useState<TeachingSuggestion>({
    id: 'sug-init',
    timestamp: '09:00:00',
    level: 'optimal',
    title: 'Optimal Classroom Engagement Flow',
    immediateAction: 'Pacing is well-calibrated. Maintain current instructional cadence.',
    pedagogicalInsight: 'High visual focus (80% forward gaze) with steady ocular attentiveness across present participants.',
    interactiveStrategy: 'Prepare an application question to challenge fast-finishers without stalling the lecture cadence.',
    source: 'Multimodal Edge Reasoning Agent',
  });
  const [geminiSuggestionText, setGeminiSuggestionText] = useState<string | null>(null);
  const [isLoadingGemini, setIsLoadingGemini] = useState(false);
  const [generatedReport, setGeneratedReport] = useState<string | null>(null);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);

  // Epics & Tasks (9 Epics / 17 Tasks)
  const [tasks, setTasks] = useState<KanbanTask[]>(() => {
    const saved = localStorage.getItem('multimodal_tasks');
    return saved ? JSON.parse(saved) : INITIAL_TASKS;
  });

  // Project Metadata (Demo URL & GitHub Links for Mentor)
  const [projectMeta, setProjectMeta] = useState<ProjectMetadataState>(() => {
    const saved = localStorage.getItem('multimodal_project_meta');
    return saved
      ? JSON.parse(saved)
      : {
          demoUrl: window.location.href,
          githubUrl: 'https://github.com/rudrakumarbarnwal/multimodal-classroom-agent',
          mentorName: 'No mentor assigned yet',
          studentName: 'Rudra Kumar Barnwal',
          institution: 'Department of Computer Science & Artificial Intelligence',
        };
  });

  // Modals
  const [isLinksModalOpen, setIsLinksModalOpen] = useState(false);
  const [isEnrollModalOpen, setIsEnrollModalOpen] = useState(false);

  // Core Singletons
  const audioProcessor = useMemo(() => new ClassroomAudioProcessor(), []);
  const fusionEngine = useMemo(() => new MultimodalFusionEngine(), []);
  const videoManager = useMemo(() => new VideoStreamManager(), []);
  const [fusionWeights, setFusionWeights] = useState<FusionWeights>(fusionEngine.getWeights());

  // Save state helpers
  useEffect(() => {
    localStorage.setItem('multimodal_students', JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem('multimodal_tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('multimodal_project_meta', JSON.stringify(projectMeta));
  }, [projectMeta]);

  // Handle webcam toggle
  const handleToggleCamera = async () => {
    if (!videoRef.current) return;
    if (isCameraActive) {
      videoManager.stopCamera(videoRef.current);
      setIsCameraActive(false);
    } else {
      const success = await videoManager.startCamera(videoRef.current);
      setIsCameraActive(success);
    }
  };

  // Handle mic toggle
  const handleToggleMic = async () => {
    if (isMicActive) {
      audioProcessor.stop();
      setIsMicActive(false);
    } else {
      const success = await audioProcessor.startMicrophone((data) => {
        setDecibels(data.decibels);
        setSpeechRatio(data.speechRatio);
        setIsVoiceActive(data.isVoiceActive);
      });
      setIsMicActive(success);
    }
  };

  // Main Real-time Processing Engine Interval (runs every 1.5 seconds)
  useEffect(() => {
    if (!isSessionRunning) return;

    const interval = setInterval(() => {
      // 1. Audio update (if not using physical mic, use simulated dynamics)
      let currentDb = decibels;
      let currentSpeech = speechRatio;
      let currentVoice = isVoiceActive;

      if (!isMicActive) {
        const simAudio = audioProcessor.getSimulatedAudio(simulationPreset);
        currentDb = simAudio.decibels;
        currentSpeech = simAudio.speechRatio;
        currentVoice = simAudio.isVoiceActive;
        setDecibels(currentDb);
        setSpeechRatio(currentSpeech);
        setIsVoiceActive(currentVoice);
      }

      // 2. Update students' states based on simulation preset & sustained presence logic
      setStudents((prevStudents) => {
        return prevStudents.map((student, idx) => {
          // Determine simulated behavior according to preset
          let headPose = student.headPose;
          let eyesOpen = student.eyesOpen;
          let earValue = student.earValue;

          if (simulationPreset === 'slump') {
            // More students looking down or drowsy
            if (idx === 1 || idx === 2 || idx === 4) {
              headPose = 'nodding_off';
              eyesOpen = false;
              earValue = 0.13;
            } else if (idx === 3) {
              headPose = 'looking_down';
              eyesOpen = true;
              earValue = 0.22;
            }
          } else if (simulationPreset === 'discussion') {
            // Active interaction
            headPose = 'forward';
            eyesOpen = true;
            earValue = 0.28;
          } else if (simulationPreset === 'distracted') {
            if (idx === 2 || idx === 3) {
              headPose = 'distracted_left';
            }
          } else {
            // Normal
            if (idx === 4) {
              headPose = 'nodding_off';
              eyesOpen = false;
              earValue = 0.14;
            } else if (idx === 2) {
              headPose = 'distracted_left';
              eyesOpen = true;
              earValue = 0.23;
            } else {
              headPose = 'forward';
              eyesOpen = true;
              earValue = 0.27;
            }
          }

          // Sustained Attendance Engine logic (Scenario 1)
          let sustainedTime = student.sustainedTimeSec;
          let presence = student.presenceStatus;
          let markedAt = student.markedAt;

          // If absent and simulation allows presence
          if (presence === 'Absent' && idx < 5) {
            presence = 'Verifying';
          }

          if (presence === 'Verifying') {
            sustainedTime += 1;
            if (sustainedTime >= sustainedThreshold) {
              presence = 'Present';
              markedAt = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
            }
          } else if (presence === 'Present') {
            sustainedTime += 1;
          }

          return {
            ...student,
            sustainedTimeSec: sustainedTime,
            presenceStatus: presence,
            markedAt: markedAt || student.markedAt,
            headPose,
            eyesOpen,
            earValue,
            confidence: presence === 'Present' ? 0.95 : 0.85,
          };
        });
      });

      // 3. Compute Multimodal Fusion Score
      const result = fusionEngine.calculateFusedScore(
        students,
        currentSpeech,
        currentVoice
      );

      setFusedScore(result.fusedScore);
      setVisualScore(result.visualScore);
      setAudioScore(result.audioScore);
      setAttentivePercent(result.attentivePercent);

      // 4. Evaluate Edge Teaching Suggestion (Scenario 3)
      const newSug = fusionEngine.evaluateSuggestion(
        result.fusedScore,
        result.attentivePercent,
        currentSpeech,
        lectureTopic
      );
      setTeachingSuggestion(newSug);

      // 5. Append to Timeline history
      const tick: EngagementTick = {
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        fusedEngagement: result.fusedScore,
        visualAttention: result.visualScore,
        audioActivity: currentSpeech,
        attentiveStudentRatio: result.attentivePercent,
        isAttentionDip: result.fusedScore < 45,
        isInteractionPeak: currentSpeech > 55,
      };

      setTimeline((prev) => [...prev.slice(-45), tick]);
    }, 1500);

    return () => clearInterval(interval);
  }, [isSessionRunning, simulationPreset, sustainedThreshold, isMicActive, decibels, speechRatio, isVoiceActive, fusionEngine, audioProcessor, students, lectureTopic]);

  // Request deep Gemini AI suggestions via server proxy
  const handleRequestGeminiSuggestion = async (topic: string) => {
    setIsLoadingGemini(true);
    try {
      const res = await fetch('/api/gemini/suggest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          engagementScore: fusedScore,
          attentivePercent,
          speechRatio,
          sustainedCount: students.filter((s) => s.presenceStatus === 'Present').length,
          totalEnrolled: students.length,
          attentionDipsCount: timeline.filter((t) => t.isAttentionDip).length,
          recentHistory: timeline.slice(-10).map((t) => t.fusedEngagement),
          topic,
        }),
      });

      const data = await res.json();
      if (data.suggestion) {
        setGeminiSuggestionText(data.suggestion);
      }
    } catch (err) {
      console.error('Error fetching Gemini suggestion:', err);
    } finally {
      setIsLoadingGemini(false);
    }
  };

  // Generate deep session report via Gemini API
  const handleGenerateReport = async (): Promise<string | null> => {
    setIsGeneratingReport(true);
    try {
      const res = await fetch('/api/gemini/report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionDurationMinutes: Math.max(5, Math.round(timeline.length * 1.5 / 60)),
          averageEngagement: Math.round(timeline.reduce((a, b) => a + b.fusedEngagement, 0) / Math.max(1, timeline.length)),
          peakEngagement: Math.max(...timeline.map((t) => t.fusedEngagement), 88),
          lowestEngagement: Math.min(...timeline.map((t) => t.fusedEngagement), 42),
          totalPresent: students.filter((s) => s.presenceStatus === 'Present').length,
          totalEnrolled: students.length,
          attentionDips: timeline.filter((t) => t.isAttentionDip),
          interactionPeaks: timeline.filter((t) => t.isInteractionPeak),
          lectureName: lectureTopic,
          timelineSummary: {
            totalTicks: timeline.length,
            averageSpeechRatio: Math.round(timeline.reduce((a, b) => a + b.audioActivity, 0) / Math.max(1, timeline.length)),
          },
        }),
      });

      const data = await res.json();
      if (data.reportMarkdown) {
        setGeneratedReport(data.reportMarkdown);
        return data.reportMarkdown;
      }
      return null;
    } catch (err) {
      console.error('Failed to generate report:', err);
      return null;
    } finally {
      setIsGeneratingReport(false);
    }
  };

  // Task status transition handler for Kanban
  const handleUpdateTaskStatus = (taskId: string, newStatus: KanbanTask['status']) => {
    setTasks((prev) =>
      prev.map((task) => (task.id === taskId ? { ...task, status: newStatus } : task))
    );
  };

  // Enroll new student handler
  const handleEnrollStudent = (newStudentData: any) => {
    const newStudent: Student = {
      ...newStudentData,
      id: `std-${Date.now().toString().slice(-4)}`,
      sustainedTimeSec: 0,
      presenceStatus: 'Verifying',
      confidence: 0.90,
      currentEngagement: 85,
      headPose: 'forward',
      eyesOpen: true,
      earValue: 0.28,
    };
    setStudents((prev) => [...prev, newStudent]);
  };

  // Manual mark attendance
  const handleManualMark = (studentId: string) => {
    setStudents((prev) =>
      prev.map((s) =>
        s.id === studentId
          ? {
              ...s,
              presenceStatus: 'Present',
              sustainedTimeSec: sustainedThreshold,
              markedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
            }
          : s
      )
    );
  };

  return (
    <div className="min-h-screen bg-[#080c14] text-slate-200 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* Global Navigation Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isCameraActive={isCameraActive}
        isMicActive={isMicActive}
        fusedScore={fusedScore}
        projectMeta={projectMeta}
        onOpenLinksModal={() => setIsLinksModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-5 lg:p-6 space-y-4">
        
        {/* Tab 1: Live Classroom Agent */}
        {activeTab === 'live' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              
              {/* Left Column (2 Cols): Live Video & Vision Stream */}
              <div className="lg:col-span-2 space-y-4">
                <LiveFeedView
                  students={students}
                  isCameraActive={isCameraActive}
                  isMicActive={isMicActive}
                  onToggleCamera={handleToggleCamera}
                  onToggleMic={handleToggleMic}
                  simulationPreset={simulationPreset}
                  onChangePreset={setSimulationPreset}
                  sustainedThreshold={sustainedThreshold}
                  onChangeThreshold={setSustainedThreshold}
                  isSessionRunning={isSessionRunning}
                  onToggleSession={() => setIsSessionRunning(!isSessionRunning)}
                  speechRatio={speechRatio}
                  decibels={decibels}
                  videoRef={videoRef}
                />

                {/* Scenario 1: Sustained Attendance Verification Log */}
                <SustainedAttendanceTable
                  students={students}
                  sustainedThreshold={sustainedThreshold}
                  onOpenEnrollModal={() => setIsEnrollModalOpen(true)}
                  onManualMark={handleManualMark}
                />
              </div>

              {/* Right Column (1 Col): Multimodal Telemetry & AI Decision Agent */}
              <div className="space-y-4">
                <MultimodalMeters
                  fusedScore={fusedScore}
                  visualScore={visualScore}
                  audioScore={audioScore}
                  attentivePercent={attentivePercent}
                  speechRatio={speechRatio}
                  decibels={decibels}
                  sustainedCount={students.filter((s) => s.presenceStatus === 'Present').length}
                  totalStudents={students.length}
                  weights={fusionWeights}
                  onUpdateWeights={(w) => {
                    fusionEngine.setWeights(w);
                    setFusionWeights(fusionEngine.getWeights());
                  }}
                />

                <AiTeachingAgentPanel
                  suggestion={teachingSuggestion}
                  onRequestGeminiSuggestion={handleRequestGeminiSuggestion}
                  isLoadingGemini={isLoadingGemini}
                  geminiSuggestionText={geminiSuggestionText}
                  lectureTopic={lectureTopic}
                  onChangeLectureTopic={setLectureTopic}
                />
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Session Analytics & AI Report */}
        {activeTab === 'analytics' && (
          <AnalyticsView
            timeline={timeline}
            students={students}
            lectureTopic={lectureTopic}
            onGenerateReport={handleGenerateReport}
            isGeneratingReport={isGeneratingReport}
            generatedReport={generatedReport}
          />
        )}

        {/* Tab 3: Project Kanban & Epics Workspace */}
        {activeTab === 'kanban' && (
          <KanbanBoard
            epics={INITIAL_EPICS}
            tasks={tasks}
            onUpdateTaskStatus={handleUpdateTaskStatus}
            projectMeta={projectMeta}
            onOpenLinksModal={() => setIsLinksModalOpen(true)}
          />
        )}

        {/* Tab 4: Technical Architecture & System Specs */}
        {activeTab === 'architecture' && <ArchitectureView />}

        {/* Tab 5: Offline Python Code Hub */}
        {activeTab === 'python' && <PythonCodeViewer />}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-[#090d16] py-3 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-wrap items-center justify-between gap-2">
          <div className="font-mono text-[11px]">
            <span>Multimodal Attendance & Engagement Agent</span> • Privacy-Preserving On-Device Intelligence
          </div>
          <div className="flex items-center space-x-3 font-mono text-[11px]">
            <span>9 Epics • 17 Tasks Verified</span>
            <span>|</span>
            <button
              onClick={() => setIsLinksModalOpen(true)}
              className="text-blue-400 hover:underline"
            >
              Mentor Submission Portal
            </button>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <DemoLinksModal
        isOpen={isLinksModalOpen}
        onClose={() => setIsLinksModalOpen(false)}
        metadata={projectMeta}
        onSaveMetadata={setProjectMeta}
      />

      <EnrollStudentModal
        isOpen={isEnrollModalOpen}
        onClose={() => setIsEnrollModalOpen(false)}
        onEnroll={handleEnrollStudent}
      />
    </div>
  );
}
