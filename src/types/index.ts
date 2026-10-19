export interface Student {
  id: string;
  rollNo: string;
  name: string;
  avatar: string;
  department: string;
  sustainedTimeSec: number;
  presenceStatus: 'Absent' | 'Verifying' | 'Present';
  markedAt?: string;
  confidence: number;
  currentEngagement: number; // 0-100%
  headPose: 'forward' | 'distracted_left' | 'distracted_right' | 'looking_down' | 'nodding_off';
  eyesOpen: boolean;
  earValue: number; // Eye Aspect Ratio
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  rollNo: string;
  studentName: string;
  status: 'Present' | 'Late' | 'Absent';
  markedAt: string;
  sustainedDurationSec: number;
  averageAttention: number;
  confidence: number;
  method: 'Biometric Sustained Vision' | 'Manual Override';
}

export interface EngagementTick {
  timestamp: string;
  fusedEngagement: number;
  visualAttention: number;
  audioActivity: number;
  attentiveStudentRatio: number;
  isAttentionDip: boolean;
  isInteractionPeak: boolean;
}

export interface TeachingSuggestion {
  id: string;
  timestamp: string;
  level: 'optimal' | 'moderate_dip' | 'critical_drop' | 'discussion_peak';
  title: string;
  immediateAction: string;
  pedagogicalInsight: string;
  interactiveStrategy: string;
  source: string;
}

export interface KanbanTask {
  id: string;
  epicId: string;
  epicTitle: string;
  title: string;
  description: string;
  status: 'To Do' | 'In Progress' | 'In Review' | 'Completed';
  priority: 'High' | 'Medium' | 'Low';
  storyPoints: number;
  acceptanceCriteria: string[];
}

export interface Epic {
  id: string;
  number: number;
  title: string;
  description: string;
  tasksCount: number;
  category: 'Environment' | 'Pipeline' | 'Vision' | 'Audio' | 'Fusion' | 'AI Agent' | 'UI' | 'Testing';
}

export interface ProjectMetadataState {
  demoUrl: string;
  githubUrl: string;
  mentorName: string;
  studentName: string;
  institution: string;
}
