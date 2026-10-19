import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json());

// Initialize Google Gen AI
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;

if (apiKey) {
  ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// API Health
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    hasApiKey: !!apiKey,
    timestamp: new Date().toISOString(),
  });
});

// Scenario 3: AI-Driven Teaching Suggestions
app.post('/api/gemini/suggest', async (req, res) => {
  try {
    const {
      engagementScore,
      attentivePercent,
      speechRatio,
      sustainedCount,
      totalEnrolled,
      attentionDipsCount,
      recentHistory,
      topic = 'Interactive Classroom Session',
    } = req.body;

    if (!ai) {
      // Local rule-based fallback when offline or no API key
      return res.json({
        source: 'local_heuristic_engine',
        status: 'success',
        suggestion: generateLocalPedagogicalAdvice(engagementScore, attentivePercent, speechRatio),
      });
    }

    const prompt = `You are the Multimodal Classroom Intelligence AI Agent serving as an assistive decision-support tool for an instructor in real-time.
Classroom Context:
- Current Subject/Topic: ${topic}
- Overall Fused Engagement Index: ${engagementScore}%
- Visually Attentive Students: ${attentivePercent}% (sustained face & eye gaze forward)
- Classroom Acoustic / Speech Activity: ${speechRatio}% (ratio of voice/interaction to silence)
- Sustained Attendance Confirmed: ${sustainedCount} of ${totalEnrolled} students
- Number of Attention Dips Flagged: ${attentionDipsCount}
- Recent Engagement Trend (last 10 ticks): [${(recentHistory || []).join(', ')}]

Task: Provide concise, high-impact, real-time teaching suggestions tailored to this moment.
Requirements:
1. "Immediate Action": 1 specific 30-second intervention (e.g. check for comprehension, shift pitch, ask a quick vote/poll, call on a student, or pause for note-taking).
2. "Pedagogical Insight": Why attention is at this state (cognitive fatigue, passive listening vs active discussion, pacing too fast/slow).
3. "Interactive Strategy": An engaging 2-minute activity to re-energize or deepen understanding.
Keep the output crisp, actionable, professional, and directly usable by the teacher while glancing at their screen.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction: 'You are an expert pedagogical AI coach trained on classroom dynamics, cognitive load theory, and real-time multimodal behavioral analytics.',
        temperature: 0.7,
      },
    });

    res.json({
      source: 'gemini-3.8-flash',
      status: 'success',
      suggestion: response.text || generateLocalPedagogicalAdvice(engagementScore, attentivePercent, speechRatio),
    });
  } catch (error: any) {
    console.error('Error generating AI suggestions:', error);
    // Graceful fallback to rule-based engine on any error
    const { engagementScore = 65, attentivePercent = 70, speechRatio = 30 } = req.body || {};
    res.json({
      source: 'local_heuristic_engine (fallback)',
      status: 'fallback',
      suggestion: generateLocalPedagogicalAdvice(engagementScore, attentivePercent, speechRatio),
      errorNote: error.message,
    });
  }
});

// Comprehensive Post-Session Classroom Intelligence Report
app.post('/api/gemini/report', async (req, res) => {
  try {
    const {
      sessionDurationMinutes,
      averageEngagement,
      peakEngagement,
      lowestEngagement,
      totalPresent,
      totalEnrolled,
      attentionDips,
      interactionPeaks,
      lectureName,
      timelineSummary,
    } = req.body;

    if (!ai) {
      return res.json({
        source: 'local_summary_generator',
        reportMarkdown: `# Classroom Session Intelligence Report: ${lectureName || 'Classroom Session'}
## Summary
- **Session Duration:** ${sessionDurationMinutes} minutes
- **Final Attendance:** ${totalPresent}/${totalEnrolled} Verified Sustained Attendees
- **Average Engagement Index:** ${averageEngagement}%
- **Attention Dips Detected:** ${attentionDips.length}
- **Discussion / Interaction Peaks:** ${interactionPeaks.length}

### Key Observations
The session demonstrated solid baseline participation with notable peak moments during collaborative segments. Sustained attendance verification ensured zero false-positive records from walk-bys.

### Recommendations for Next Session
1. Introduce formative assessment pauses around the 20-minute mark where engagement historically dips.
2. Maintain high vocal inflection and interactive breakout intervals.
`,
      });
    }

    const prompt = `You are an educational analytics expert reviewing data from the Multimodal Attendance & Engagement Agent for a classroom session.
Session Metrics:
- Lecture / Subject: ${lectureName || 'Advanced Computing & AI'}
- Duration: ${sessionDurationMinutes} minutes
- Attendance: ${totalPresent} out of ${totalEnrolled} confirmed sustained presence
- Average Multimodal Engagement Score: ${averageEngagement}%
- Peak Engagement: ${peakEngagement}%
- Lowest Engagement: ${lowestEngagement}%
- Attention Drops Flagged: ${attentionDips.length} instances
- Interaction/Discussion Peaks: ${interactionPeaks.length} instances
- Timeline Highlights: ${JSON.stringify(timelineSummary || {})}

Write a comprehensive, professional Classroom Dynamics & Engagement Analysis Report formatted in clean Markdown.
Include:
1. Executive Summary & Session Effectiveness Rating (e.g., A/B/C tier)
2. Attendance & Participation Authenticity Audit (addressing sustained presence vs transient presence)
3. Attention Trajectory & Cognitive Load Analysis (diagnosing dips and peaks)
4. Audio & Discussion Dynamics (lecture vs dialogue balance)
5. Actionable Pedagogical Recommendations for Instructor's Next Lecture
6. Student Takeaway and Focus Scorecard`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction: 'You are an educational researcher and AI analytics specialist evaluating classroom engagement from multimodal sensor streams.',
      },
    });

    res.json({
      source: 'gemini-3.8-flash',
      status: 'success',
      reportMarkdown: response.text,
    });
  } catch (error: any) {
    console.error('Error creating report:', error);
    res.status(500).json({ error: error.message || 'Failed to generate report' });
  }
});

function generateLocalPedagogicalAdvice(score: number, attentive: number, speech: number): string {
  if (score < 40) {
    return `### ⚠️ Critical Attention Drop Alert (${score}% Engagement)
- **Immediate Action:** Stop the lecture slide immediately. Ask students to stand and do a 30-second stretch or quick thumbs-up/thumbs-down poll.
- **Pedagogical Insight:** High drowsiness/inattention detected (${attentive}% visual attention). Cognitive saturation reached.
- **Interactive Strategy:** Launch a 2-minute think-pair-share challenge on the last concept covered.`;
  }
  if (score < 65) {
    return `### 💡 Moderate Attention Drift (${score}% Engagement)
- **Immediate Action:** Raise vocal pitch slightly and direct a targeted question to the back row.
- **Pedagogical Insight:** Visual focus is waning (${attentive}% gaze on board). Monotonous pacing detected.
- **Interactive Strategy:** Switch from theoretical slide to a live real-world demonstration or code snippet.`;
  }
  if (speech > 60) {
    return `### 🗣️ High Acoustic Discussion Detected (${speech}% Voice Activity)
- **Immediate Action:** Facilitate the current lively exchange, ensuring all student groups have spoken.
- **Pedagogical Insight:** Classroom is engaged in active dialogue. Transition from spontaneous questions to structured findings.
- **Interactive Strategy:** Have a designated spokesperson synthesize the group consensus.`;
  }
  return `### ✅ Optimal Classroom Flow (${score}% Engagement)
- **Immediate Action:** Pacing is calibrated perfectly. Continue smoothly with the planned curriculum.
- **Pedagogical Insight:** Consistent forward head pose and attentive eye posture across participants.
- **Interactive Strategy:** Introduce a stretch/bonus question to reward attentive students.`;
}

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Multimodal Attendance & Engagement Agent running on http://localhost:${PORT}`);
  });
}

startServer();
