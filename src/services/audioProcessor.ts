export interface AudioAnalysisResult {
  rms: number;
  decibels: number;
  isVoiceActive: boolean;
  speechRatio: number; // 0-100%
  noiseFloor: number;
  isInteractionPeak: boolean;
}

export class ClassroomAudioProcessor {
  private audioCtx: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private micStream: MediaStream | null = null;
  private dataArray: Uint8Array<ArrayBuffer> | null = null;
  private isRunning: boolean = false;
  private speechHistory: number[] = [];
  private noiseFloor: number = 0.02;
  private calibrationFrames: number = 0;

  async startMicrophone(onData?: (result: AudioAnalysisResult) => void): Promise<boolean> {
    try {
      this.micStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.audioCtx = new AudioContextClass();
      
      const source = this.audioCtx.createMediaStreamSource(this.micStream);
      this.analyser = this.audioCtx.createAnalyser();
      this.analyser.fftSize = 512;
      this.analyser.smoothingTimeConstant = 0.7;

      source.connect(this.analyser);
      const bufferLength = this.analyser.frequencyBinCount;
      this.dataArray = new Uint8Array(bufferLength);
      this.isRunning = true;
      this.speechHistory = [];
      this.calibrationFrames = 0;

      const loop = () => {
        if (!this.isRunning || !this.analyser || !this.dataArray) return;
        this.analyser.getByteTimeDomainData(this.dataArray);

        // Calculate RMS
        let sumSquares = 0;
        for (let i = 0; i < this.dataArray.length; i++) {
          const norm = (this.dataArray[i] - 128) / 128;
          sumSquares += norm * norm;
        }
        const rms = Math.sqrt(sumSquares / this.dataArray.length);

        // Dynamic noise floor calibration in first 30 frames
        if (this.calibrationFrames < 30) {
          this.noiseFloor = Math.max(0.015, (this.noiseFloor * this.calibrationFrames + rms) / (this.calibrationFrames + 1));
          this.calibrationFrames++;
        }

        const threshold = this.noiseFloor * 1.8 + 0.02;
        const isVoiceActive = rms > threshold;
        const decibels = Math.max(0, Math.round(20 * Math.log10(rms + 1e-4) + 80));

        this.speechHistory.push(isVoiceActive ? 1 : 0);
        if (this.speechHistory.length > 50) {
          this.speechHistory.shift();
        }

        const speechRatio = Math.round((this.speechHistory.reduce((a, b) => a + b, 0) / this.speechHistory.length) * 100);
        const isInteractionPeak = speechRatio > 55 && decibels > 45;

        if (onData) {
          onData({
            rms: Math.round(rms * 1000) / 1000,
            decibels,
            isVoiceActive,
            speechRatio,
            noiseFloor: Math.round(this.noiseFloor * 1000) / 1000,
            isInteractionPeak,
          });
        }

        requestAnimationFrame(loop);
      };

      loop();
      return true;
    } catch (err) {
      console.warn('Microphone access denied or unavailable, using acoustic simulation:', err);
      return false;
    }
  }

  stop() {
    this.isRunning = false;
    if (this.micStream) {
      this.micStream.getTracks().forEach((track) => track.stop());
      this.micStream = null;
    }
    if (this.audioCtx && this.audioCtx.state !== 'closed') {
      this.audioCtx.close();
      this.audioCtx = null;
    }
  }

  getSimulatedAudio(scenario: 'normal' | 'slump' | 'discussion' | 'quiet' | 'distracted'): AudioAnalysisResult {
    let baseDb = 35;
    let speechChance = 0.3;

    if (scenario === 'discussion') {
      baseDb = 58;
      speechChance = 0.75;
    } else if (scenario === 'slump' || scenario === 'quiet') {
      baseDb = 22;
      speechChance = 0.08;
    } else if (scenario === 'distracted') {
      baseDb = 42;
      speechChance = 0.4;
    }

    const jitter = Math.random() * 8 - 4;
    const decibels = Math.max(15, Math.min(85, Math.round(baseDb + jitter)));
    const isVoiceActive = Math.random() < speechChance;
    
    this.speechHistory.push(isVoiceActive ? 1 : 0);
    if (this.speechHistory.length > 50) {
      this.speechHistory.shift();
    }
    const speechRatio = Math.round((this.speechHistory.reduce((a, b) => a + b, 0) / Math.max(1, this.speechHistory.length)) * 100);

    return {
      rms: decibels / 1000,
      decibels,
      isVoiceActive,
      speechRatio,
      noiseFloor: 0.02,
      isInteractionPeak: speechRatio > 50 && decibels > 50,
    };
  }
}
