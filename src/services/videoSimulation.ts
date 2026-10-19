import { Student } from '../types';

export interface ClassroomSimulationPreset {
  id: 'normal' | 'slump' | 'discussion' | 'distracted';
  name: string;
  description: string;
}

export const SIMULATION_PRESETS: ClassroomSimulationPreset[] = [
  {
    id: 'normal',
    name: 'Normal Active Lecture',
    description: 'Majority attentive, good eye contact, balanced pacing.',
  },
  {
    id: 'slump',
    name: 'Afternoon Attention Slump (Dips)',
    description: 'High drowsiness, looking down, low attention drop triggers.',
  },
  {
    id: 'discussion',
    name: 'Interactive Q&A / Discussion Peak',
    description: 'High acoustic activity, dynamic head shifts, group buzz.',
  },
  {
    id: 'distracted',
    name: 'Distracted & Hallway Transients',
    description: 'Passers-by entering briefly, testing sustained presence filtering.',
  },
];

export class VideoStreamManager {
  private videoStream: MediaStream | null = null;
  private isCameraActive: boolean = false;

  async startCamera(videoElement: HTMLVideoElement): Promise<boolean> {
    try {
      this.videoStream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'user',
        },
        audio: false,
      });
      videoElement.srcObject = this.videoStream;
      await videoElement.play();
      this.isCameraActive = true;
      return true;
    } catch (err) {
      console.warn('Unable to access webcam, defaulting to simulated classroom feed:', err);
      this.isCameraActive = false;
      return false;
    }
  }

  stopCamera(videoElement?: HTMLVideoElement) {
    if (this.videoStream) {
      this.videoStream.getTracks().forEach((track) => track.stop());
      this.videoStream = null;
    }
    if (videoElement) {
      videoElement.srcObject = null;
    }
    this.isCameraActive = false;
  }

  get isStreaming(): boolean {
    return this.isCameraActive;
  }
}
