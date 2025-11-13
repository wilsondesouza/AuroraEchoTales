import axios, { type AxiosInstance } from 'axios';
import type {
    ApiResponse,
    AudioUploadResponse,
    StoryGenerationResponse,
    TTSResponse,
    MusicResponse,
    StoryParams,
    TTSParams,
    MusicParams,
} from '../types';

class APIService {
    private api: AxiosInstance;
    private baseURL: string;

    constructor() {
        this.baseURL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

        this.api = axios.create({
            baseURL: this.baseURL,
            timeout: 300000, // 5 minutes for model operations
            headers: {
                'Content-Type': 'application/json',
            },
        });

        // Request interceptor
        this.api.interceptors.request.use(
            (config) => {
                console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`);
                return config;
            },
            (error) => {
                console.error('❌ API Request Error:', error);
                return Promise.reject(error);
            }
        );

        // Response interceptor
        this.api.interceptors.response.use(
            (response) => {
                console.log(`✅ API Response: ${response.config.url}`, response.status);
                return response;
            },
            (error) => {
                console.error('❌ API Response Error:', error.response?.data || error.message);
                return Promise.reject(error);
            }
        );
    }

    // Health check
    async healthCheck(): Promise<ApiResponse<{ status: string; models_loaded: string[] }>> {
        try {
            const response = await this.api.get('/health');
            return {
                success: true,
                data: response.data,
            };
        } catch (error: any) {
            return {
                success: false,
                error: error.response?.data?.detail || error.message,
            };
        }
    }

    // Audio Analysis
    async analyzeAudio(audioBlob: Blob): Promise<ApiResponse<AudioUploadResponse>> {
        try {
            const formData = new FormData();
            formData.append('audio', audioBlob, 'recording.wav');

            const response = await this.api.post('/api/analyze-audio', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            // Backend já retorna no formato { success, data }
            return response.data;
        } catch (error: any) {
            return {
                success: false,
                error: error.response?.data?.detail || 'Failed to analyze audio',
            };
        }
    }

    // Story Generation
    async generateStory(
        emotionContext: any,
        userPrompt?: string,
        params?: Partial<StoryParams>
    ): Promise<ApiResponse<StoryGenerationResponse>> {
        try {
            const response = await this.api.post('/api/generate-story', {
                emotions: emotionContext,
                user_prompt: userPrompt,
                params: params || {},
            });

            // Backend já retorna no formato { success, data }
            return response.data;
        } catch (error: any) {
            return {
                success: false,
                error: error.response?.data?.detail || 'Failed to generate story',
            };
        }
    }

    // Interactive Story Continuation
    async continueStory(
        storyId: string,
        userInput: string,
        emotionContext: any
    ): Promise<ApiResponse<{ continuation: string; story_id: string }>> {
        try {
            const response = await this.api.post(`/api/stories/${storyId}/continue`, {
                user_input: userInput,
                emotion_context: emotionContext,
            });

            return {
                success: true,
                data: response.data,
            };
        } catch (error: any) {
            return {
                success: false,
                error: error.response?.data?.detail || 'Failed to continue story',
            };
        }
    }

    // Text-to-Speech Synthesis
    async synthesizeSpeech(
        text: string,
        params?: Partial<TTSParams>
    ): Promise<ApiResponse<TTSResponse>> {
        try {
            const response = await this.api.post(
                '/api/synthesize-speech',
                { text, params: params || {} },
                { responseType: 'blob' } // Receber como blob
            );

            // Converter blob em resposta estruturada
            return {
                success: true,
                data: {
                    audio: response.data,
                    audio_path: '',
                    duration: 0,
                    style: params?.style || 'neutral',
                },
            };
        } catch (error: any) {
            return {
                success: false,
                error: error.response?.data?.detail || 'Failed to synthesize speech',
            };
        }
    }

    // Music Generation
    async generateMusic(
        params: Partial<MusicParams>,
        duration?: number
    ): Promise<ApiResponse<MusicResponse>> {
        try {
            const response = await this.api.post(
                '/api/generate-music',
                { params, duration: duration || 30 },
                { responseType: 'blob' } // Receber como blob
            );

            // Converter blob em resposta estruturada
            return {
                success: true,
                data: {
                    audio: response.data,
                    music_path: '',
                    duration: duration || 30,
                    params: params as MusicParams,
                },
            };
        } catch (error: any) {
            return {
                success: false,
                error: error.response?.data?.detail || 'Failed to generate music',
            };
        }
    }

    // Get story by ID
    async getStory(storyId: string): Promise<ApiResponse<any>> {
        try {
            const response = await this.api.get(`/api/stories/${storyId}`);
            return {
                success: true,
                data: response.data,
            };
        } catch (error: any) {
            return {
                success: false,
                error: error.response?.data?.detail || 'Failed to fetch story',
            };
        }
    }

    // List stories
    async listStories(filters?: any): Promise<ApiResponse<any[]>> {
        try {
            const response = await this.api.get('/api/stories', {
                params: filters,
            });
            return {
                success: true,
                data: response.data,
            };
        } catch (error: any) {
            return {
                success: false,
                error: error.response?.data?.detail || 'Failed to fetch stories',
            };
        }
    }

    // Delete story
    async deleteStory(storyId: string): Promise<ApiResponse<void>> {
        try {
            await this.api.delete(`/api/stories/${storyId}`);
            return {
                success: true,
            };
        } catch (error: any) {
            return {
                success: false,
                error: error.response?.data?.detail || 'Failed to delete story',
            };
        }
    }

    // Get audio file
    getAudioURL(path: string): string {
        return `${this.baseURL}${path}`;
    }

    // Download audio file
    async downloadAudio(path: string): Promise<Blob | null> {
        try {
            const response = await this.api.get(path, {
                responseType: 'blob',
            });
            return response.data;
        } catch (error) {
            console.error('Failed to download audio:', error);
            return null;
        }
    }

    // Health check
    async checkHealth(): Promise<any> {
        try {
            const response = await this.api.get('/health');
            return response.data;
        } catch (error) {
            console.error('Failed to check health:', error);
            return null;
        }
    }

    // Load all models
    async loadModels(): Promise<any> {
        try {
            const response = await this.api.post('/api/load-models');
            return response.data;
        } catch (error) {
            console.error('Failed to load models:', error);
            throw error;
        }
    }
}

// Export singleton instance
export const apiService = new APIService();
export default apiService;
