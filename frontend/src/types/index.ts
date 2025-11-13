// Emotion Types
export type EmotionType = 'joy' | 'sadness' | 'anger' | 'fear' | 'surprise' | 'disgust' | 'neutral';

export interface EmotionState {
  emotion: EmotionType;
  intensity: number;
  timestamp: string;
  source: 'audio' | 'text' | 'context';
}

export interface AggregatedEmotion {
  dominant_emotion: EmotionType;
  intensity: number;
  confidence: number;
  emotion_scores: Record<EmotionType, number>;
}

// Audio Types
export interface AudioAnalysis {
  transcript: string;
  emotions: EmotionState[];
  aggregated_emotion: AggregatedEmotion;
  processing_time: number;
}

// Story Types
export interface StoryParams {
  temperature: number;
  creativity: number;
  emotion_influence: number;
}

export interface Story {
  id: string;
  text: string;
  emotion_context: AggregatedEmotion;
  created_at: string;
  user_input?: string;
  audio_path?: string;
  narration_path?: string;
  music_path?: string;
}

// TTS Types
export interface TTSParams {
  style: 'neutral' | 'calm' | 'joyful' | 'sad' | 'angry' | 'fearful' | 'excited';
  speed: number;
  language: 'EN' | 'PT' | 'ES' | 'FR';
}

// Music Types
export interface MusicParams {
  style: 'ambient' | 'orchestral' | 'piano' | 'electronic' | 'acoustic' | 'cinematic';
  mood: 'calm' | 'joyful' | 'melancholic' | 'tense' | 'energetic' | 'neutral';
  tempo: 'slow' | 'medium' | 'fast';
  intensity: number;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface AudioUploadResponse {
  transcript: string;
  emotions: Array<{
    emotion: EmotionType;
    intensity: number;
    timestamp: string;
    source: string;
  }>;
  aggregated_emotion: AggregatedEmotion;
  audio_id: string;
  dominant_emotion: EmotionType;
}

export interface StoryGenerationResponse {
  story_id: string;
  text: string;
  story: string; // Alias for text
  emotion_adapted: boolean;
  generation_time: number;
}

export interface TTSResponse {
  audio_path: string;
  audio: Blob; // Binary audio data
  duration: number;
  style: string;
}

export interface MusicResponse {
  music_path: string;
  audio: Blob; // Binary audio data
  duration: number;
  params: MusicParams;
}

// UI State Types
export interface UIState {
  isRecording: boolean;
  isProcessing: boolean;
  isGenerating: boolean;
  currentEmotion: EmotionType | null;
  currentStory: Story | null;
}

// Theme Types
export type Theme = 'light' | 'dark';

export interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

// User Settings Types
export interface UserSettings {
  theme: Theme;
  language: 'en' | 'pt' | 'es' | 'fr';
  autoPlay: boolean;
  musicVolume: number;
  narrationVolume: number;
  emotionSensitivity: number;
}

// Gallery Types
export interface GalleryFilters {
  emotion?: EmotionType;
  dateFrom?: string;
  dateTo?: string;
  searchQuery?: string;
}

export interface StorySummary {
  id: string;
  title: string;
  preview: string;
  emotion: EmotionType;
  created_at: string;
  thumbnail?: string;
  duration?: number;
}

// Recording Types
export interface RecordingState {
  isRecording: boolean;
  duration: number;
  audioBlob: Blob | null;
  audioURL: string | null;
}

// Notification Types
export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export interface Notification {
  id: string;
  type: NotificationType;
  message: string;
  duration?: number;
}
