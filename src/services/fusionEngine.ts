import { Student, EngagementTick, TeachingSuggestion } from '../types';

export interface FusionWeights {
  visual: number;   // default 0.65
  audio: number;    // default 0.25
  posture: number;  // default 0.10
}

export class MultimodalFusionEngine {
  private weights: FusionWeights = {
    visual: 0.65,
    audio: 0.25,
    posture: 0.10,
  };

  setWeights(newWeights: Partial<FusionWeights>) {
    this.weights = { ...this.weights, ...newWeights };
    const sum = this.weights.visual + this.weights.audio + this.weights.posture;
    if (sum > 0) {
      this.weights.visual /= sum;
      this.weights.audio /= sum;
      this.weights.posture /= sum;
    }
  }

  getWeights(): FusionWeights {
    return { ...this.weights };
  }

  calculateFusedScore(
    students: Student[],
    speechRatio: number,
    isVoiceActive: boolean,
    averagePostureStability: number = 88
  ): {
    fusedScore: number;
    visualScore: number;
    audioScore: number;
    attentivePercent: number;
  } {
    // 1. Calculate Visual Score across present/tracked students
    const activeStudents = students.filter(s => s.presenceStatus !== 'Absent');
    if (activeStudents.length === 0) {
      return {
        fusedScore: 50,
        visualScore: 50,
        audioScore: 50,
        attentivePercent: 0,
      };
    }

    const attentiveCount = activeStudents.filter(
      s => s.headPose === 'forward' && s.eyesOpen
    ).length;
    const attentivePercent = Math.round((attentiveCount / activeStudents.length) * 100);

    const visualScores = activeStudents.map(s => {
      let score = 30;
      if (s.headPose === 'forward' && s.eyesOpen) score = 96;
      else if (s.headPose === 'forward' && !s.eyesOpen) score = 28; // drowsiness
      else if (s.headPose !== 'forward' && s.eyesOpen) score = 52; // looking away/distracted
      else score = 15;
      return score;
    });

    const visualScore = Math.round(
      visualScores.reduce((acc, curr) => acc + curr, 0) / visualScores.length
    );

    // 2. Audio Score: Moderate discussion is best; dead silence or persistent loud noise is penalized
    let audioScore = 75;
    if (speechRatio >= 15 && speechRatio <= 55) {
      audioScore = 95; // Ideal Q&A / lecture response dynamic
    } else if (speechRatio > 55) {
      audioScore = 80; // Lively group discussion
    } else if (speechRatio < 8) {
      audioScore = 55; // Monologue / potential silence slump
    }

    // 3. Multimodal Weighted Fusion
    const fusedScore = Math.min(
      100,
      Math.max(
        0,
        Math.round(
          this.weights.visual * visualScore +
          this.weights.audio * audioScore +
          this.weights.posture * averagePostureStability
        )
      )
    );

    return {
      fusedScore,
      visualScore,
      audioScore,
      attentivePercent,
    };
  }

  evaluateSuggestion(
    fusedScore: number,
    attentivePercent: number,
    speechRatio: number,
    lectureTopic: string = 'Classroom Topic'
  ): TeachingSuggestion {
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

    if (fusedScore < 42) {
      return {
        id: `sug-${Date.now()}`,
        timestamp,
        level: 'critical_drop',
        title: 'Severe Attention Drop Alert',
        immediateAction: 'Pause the presentation immediately and request a quick 30-second stretch or comprehension vote.',
        pedagogicalInsight: `Engagement dropped to ${fusedScore}% (${attentivePercent}% gaze alignment). High cognitive fatigue or monotonous delivery detected.`,
        interactiveStrategy: `Launch a 2-minute Think-Pair-Share exercise addressing: "What is the key takeaway so far in ${lectureTopic}?"`,
        source: 'Multimodal Edge Reasoning Agent',
      };
    }

    if (fusedScore < 65) {
      return {
        id: `sug-${Date.now()}`,
        timestamp,
        level: 'moderate_dip',
        title: 'Moderate Attention Drift Warning',
        immediateAction: 'Vary vocal modulation and ask a targeted check-in question to lateral seats.',
        pedagogicalInsight: `Attention index sits at ${fusedScore}%. Multiple students exhibiting downward head tilts (likely note-taking or screen distraction).`,
        interactiveStrategy: 'Present a short visual counter-example or live diagram on the board rather than continuing bullet slides.',
        source: 'Multimodal Edge Reasoning Agent',
      };
    }

    if (speechRatio > 58) {
      return {
        id: `sug-${Date.now()}`,
        timestamp,
        level: 'discussion_peak',
        title: 'High Interactive Engagement Detected',
        immediateAction: 'Allow current dialogue momentum to flourish; moderate time to ensure inclusive speaking turns.',
        pedagogicalInsight: `Speech ratio peaked at ${speechRatio}%. Dynamic student participation and organic peer discussion are occurring.`,
        interactiveStrategy: 'Designate a student spokesperson to synthesize the key consensus into two bullet points on screen.',
        source: 'Multimodal Edge Reasoning Agent',
      };
    }

    return {
      id: `sug-${Date.now()}`,
      timestamp,
      level: 'optimal',
      title: 'Optimal Classroom Engagement Flow',
      immediateAction: 'Pacing and cognitive delivery are well-calibrated. Maintain current instructional cadence.',
      pedagogicalInsight: `Robust engagement (${fusedScore}%) with ${attentivePercent}% sustained eye alignment and balanced acoustic feedback.`,
      interactiveStrategy: 'Prepare a bonus application problem to challenge fast-finishers without interrupting class flow.',
      source: 'Multimodal Edge Reasoning Agent',
    };
  }
}
