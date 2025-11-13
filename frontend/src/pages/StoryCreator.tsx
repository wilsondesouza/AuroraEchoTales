import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    MicrophoneIcon,
    StopIcon,
    SparklesIcon,
    MusicalNoteIcon,
    SpeakerWaveIcon,
    ArrowPathIcon,
} from '@heroicons/react/24/outline';
import { CheckCircleIcon } from '@heroicons/react/24/solid';
import toast from 'react-hot-toast';
import { useAudioRecorder } from '../hooks/useAudioRecorder';
import { apiService } from '../services/api';
import type { EmotionState, Story, EmotionType } from '../types';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import EmotionBadge from '../components/ui/EmotionBadge';

type Step = 'record' | 'analyze' | 'generate' | 'narrate' | 'complete';

interface StepInfo {
    id: Step;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    description: string;
}

const steps: StepInfo[] = [
    {
        id: 'record',
        label: 'Gravar Áudio',
        icon: MicrophoneIcon,
        description: 'Grave sua voz para analisarmos suas emoções',
    },
    {
        id: 'analyze',
        label: 'Analisar Emoções',
        icon: SparklesIcon,
        description: 'Processando análise emocional...',
    },
    {
        id: 'generate',
        label: 'Gerar História',
        icon: SparklesIcon,
        description: 'Criando história baseada nas emoções',
    },
    {
        id: 'narrate',
        label: 'Narrar & Música',
        icon: MusicalNoteIcon,
        description: 'Gerando narração e trilha sonora',
    },
    {
        id: 'complete',
        label: 'Completo',
        icon: CheckCircleIcon,
        description: 'Sua história está pronta!',
    },
];

const StoryCreator: React.FC = () => {
    const [currentStep, setCurrentStep] = useState<Step>('record');
    const [emotions, setEmotions] = useState<EmotionState[]>([]);
    const [dominantEmotion, setDominantEmotion] = useState<EmotionType | null>(null);
    const [storyText, setStoryText] = useState<string>('');
    const [story, setStory] = useState<Story | null>(null);
    const [userPrompt, setUserPrompt] = useState<string>('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [audioUrl, setAudioUrl] = useState<string | null>(null);
    const [narrationUrl, setNarrationUrl] = useState<string | null>(null);
    const [musicUrl, setMusicUrl] = useState<string | null>(null);
    const [useManualInput, setUseManualInput] = useState(false);
    const [manualPrompt, setManualPrompt] = useState<string>('');

    const {
        recordingState,
        startRecording,
        stopRecording,
        resetRecording,
    } = useAudioRecorder();

    const { isRecording, duration: recordingTime, audioBlob, audioURL } = recordingState;

    // Formatar tempo de gravação
    const formatTime = (seconds: number): string => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    // Analisar áudio quando gravação terminar
    useEffect(() => {
        if (audioBlob && currentStep === 'record') {
            handleAnalyzeAudio();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [audioBlob]);

    const handleAnalyzeAudio = async () => {
        if (!audioBlob) {
            toast.error('Nenhum áudio gravado!');
            return;
        }

        setCurrentStep('analyze');
        setIsProcessing(true);

        try {
            const response = await apiService.analyzeAudio(audioBlob);

            // Usar URL do hook se disponível
            if (audioURL) {
                setAudioUrl(audioURL);
            }

            // Processar emoções - verificar se response.data existe
            if (!response.data) {
                throw new Error('No data in response');
            }

            const emotionStates: EmotionState[] = response.data.emotions.map((emotion: {
                emotion: EmotionType;
                intensity: number;
                timestamp: string;
                source: string;
            }) => ({
                emotion: emotion.emotion,
                intensity: emotion.intensity,
                timestamp: new Date().toISOString(),
                source: emotion.source as 'audio' | 'text' | 'context',
            }));

            setEmotions(emotionStates);
            setDominantEmotion(response.data.dominant_emotion);

            toast.success('Análise emocional concluída!');
            setCurrentStep('generate');
        } catch (error) {
            console.error('Erro ao analisar áudio:', error);
            toast.error('Erro ao analisar áudio. Tente novamente.');
            setCurrentStep('record');
        } finally {
            setIsProcessing(false);
        }
    };

    const handleGenerateStory = async () => {
        if (emotions.length === 0) {
            toast.error('Nenhuma emoção detectada!');
            return;
        }

        setIsProcessing(true);

        try {
            const response = await apiService.generateStory(
                emotions,
                userPrompt || undefined,
                {
                    temperature: 0.8,
                }
            );

            if (!response.data) {
                throw new Error('No data in response');
            }

            const storyTextResult = response.data.story || response.data.text;
            setStoryText(storyTextResult);

            // Criar emotion_scores com valores padrão
            const emotionScores: Record<EmotionType, number> = {
                joy: 0,
                sadness: 0,
                anger: 0,
                fear: 0,
                surprise: 0,
                disgust: 0,
                neutral: 0,
            };

            // Preencher com as emoções detectadas
            emotions.forEach(e => {
                emotionScores[e.emotion] = e.intensity;
            });

            setStory({
                id: response.data.story_id || Date.now().toString(),
                text: storyTextResult,
                emotion_context: {
                    dominant_emotion: dominantEmotion || 'neutral',
                    intensity: emotions.reduce((acc, e) => acc + e.intensity, 0) / emotions.length,
                    confidence: 0.8,
                    emotion_scores: emotionScores,
                },
                created_at: new Date().toISOString(),
            });

            toast.success('História gerada com sucesso!');
            setCurrentStep('narrate');

            // Automaticamente iniciar geração de narração e música
            await handleGenerateNarrationAndMusic(storyTextResult);
        } catch (error) {
            console.error('Erro ao gerar história:', error);
            toast.error('Erro ao gerar história. Tente novamente.');
        } finally {
            setIsProcessing(false);
        }
    };

    const handleGenerateNarrationAndMusic = async (text: string) => {
        setIsProcessing(true);

        try {
            // Gerar narração em paralelo com música
            const [narrationResponse, musicResponse] = await Promise.all([
                apiService.synthesizeSpeech(text, {
                    language: 'PT',
                    speed: 1.0,
                }),
                apiService.generateMusic({
                    style: 'ambient',
                    mood: 'calm',
                    tempo: 'medium',
                    intensity: 0.5,
                }, 30),
            ]);

            // Converter blobs para URLs
            if (narrationResponse.data?.audio) {
                setNarrationUrl(URL.createObjectURL(narrationResponse.data.audio));
            }
            if (musicResponse.data?.audio) {
                setMusicUrl(URL.createObjectURL(musicResponse.data.audio));
            }

            toast.success('Narração e música geradas!');
            setCurrentStep('complete');
        } catch (error) {
            console.error('Erro ao gerar narração/música:', error);
            toast.error('Erro ao gerar áudio. Continuando sem áudio.');
            setCurrentStep('complete');
        } finally {
            setIsProcessing(false);
        }
    };

    const handleReset = () => {
        setCurrentStep('record');
        setEmotions([]);
        setDominantEmotion(null);
        setStoryText('');
        setStory(null);
        setUserPrompt('');
        setIsProcessing(false);
        setUseManualInput(false);
        setManualPrompt('');

        // Limpar URLs
        if (audioUrl) URL.revokeObjectURL(audioUrl);
        if (narrationUrl) URL.revokeObjectURL(narrationUrl);
        if (musicUrl) URL.revokeObjectURL(musicUrl);

        setAudioUrl(null);
        setNarrationUrl(null);
        setMusicUrl(null);

        // Reset recording state
        resetRecording();
    };

    const handleGenerateStoryFromText = async () => {
        if (!manualPrompt.trim()) {
            toast.error('Por favor, digite um prompt para a história!');
            return;
        }

        setCurrentStep('generate');
        setIsProcessing(true);

        try {
            // Gerar emoções neutras para modo manual
            const neutralEmotions: EmotionState[] = [{
                emotion: 'neutral',
                intensity: 1.0,
                timestamp: new Date().toISOString(),
                source: 'text',
            }];

            setEmotions(neutralEmotions);
            setDominantEmotion('neutral');

            const response = await apiService.generateStory(
                neutralEmotions,
                manualPrompt,
                {
                    temperature: 0.8,
                }
            );

            if (!response.data) {
                throw new Error('No data in response');
            }

            const storyTextResult = response.data.story || response.data.text;
            setStoryText(storyTextResult);

            const emotionScores: Record<EmotionType, number> = {
                joy: 0,
                sadness: 0,
                anger: 0,
                fear: 0,
                surprise: 0,
                disgust: 0,
                neutral: 1.0,
            };

            setStory({
                id: response.data.story_id || Date.now().toString(),
                text: storyTextResult,
                emotion_context: {
                    dominant_emotion: 'neutral',
                    intensity: 1.0,
                    confidence: 0.8,
                    emotion_scores: emotionScores,
                },
                created_at: new Date().toISOString(),
            });

            toast.success('História gerada com sucesso!');
            setCurrentStep('narrate');

            // Automaticamente iniciar geração de narração e música
            await handleGenerateNarrationAndMusic(storyTextResult);
        } catch (error) {
            console.error('Erro ao gerar história:', error);
            toast.error('Erro ao gerar história. Tente novamente.');
            setCurrentStep('record');
        } finally {
            setIsProcessing(false);
        }
    };

    // Cleanup URLs ao desmontar
    useEffect(() => {
        return () => {
            if (audioUrl) URL.revokeObjectURL(audioUrl);
            if (narrationUrl) URL.revokeObjectURL(narrationUrl);
            if (musicUrl) URL.revokeObjectURL(musicUrl);
        };
    }, [audioUrl, narrationUrl, musicUrl]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-12">
            <div className="container mx-auto px-4 max-w-6xl">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                        Criar Nova História
                    </h1>
                    <p className="text-lg text-gray-600 dark:text-gray-300">
                        Grave sua voz e deixe a IA criar uma história mágica baseada em suas emoções
                    </p>
                </motion.div>

                {/* Progress Steps */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="mb-12"
                >
                    <div className="flex justify-between items-center relative">
                        {/* Progress Line */}
                        <div className="absolute top-5 left-0 right-0 h-1 bg-gray-200 dark:bg-gray-700 -z-10">
                            <motion.div
                                className="h-full bg-gradient-to-r from-primary-500 to-accent-500"
                                initial={{ width: '0%' }}
                                animate={{
                                    width: `${(steps.findIndex((s) => s.id === currentStep) / (steps.length - 1)) * 100}%`,
                                }}
                                transition={{ duration: 0.5 }}
                            />
                        </div>

                        {/* Steps */}
                        {steps.map((step, index) => {
                            const isActive = step.id === currentStep;
                            const isCompleted = steps.findIndex((s) => s.id === currentStep) > index;
                            const Icon = step.icon;

                            return (
                                <div key={step.id} className="flex flex-col items-center relative">
                                    <motion.div
                                        className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${isActive
                                                ? 'bg-gradient-to-br from-primary-500 to-accent-500 text-white shadow-lg'
                                                : isCompleted
                                                    ? 'bg-green-500 text-white'
                                                    : 'bg-gray-200 dark:bg-gray-700 text-gray-400'
                                            }`}
                                        whileHover={{ scale: 1.1 }}
                                    >
                                        <Icon className="w-6 h-6" />
                                    </motion.div>
                                    <span
                                        className={`mt-2 text-xs font-medium text-center max-w-[80px] ${isActive
                                                ? 'text-primary-600 dark:text-primary-400'
                                                : isCompleted
                                                    ? 'text-green-600 dark:text-green-400'
                                                    : 'text-gray-400'
                                            }`}
                                    >
                                        {step.label}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </motion.div>

                {/* Main Content */}
                <AnimatePresence mode="wait">
                    {/* STEP 1: Record Audio */}
                    {currentStep === 'record' && (
                        <motion.div
                            key="record"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                        >
                            <Card className="p-8">
                                <div className="text-center">
                                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                                        {useManualInput ? 'Digite seu Prompt' : 'Grave sua Voz'}
                                    </h2>
                                    <p className="text-gray-600 dark:text-gray-300 mb-8">
                                        {useManualInput 
                                            ? 'Digite um prompt para gerar sua história personalizada.'
                                            : 'Fale naturalmente sobre qualquer coisa. Vamos analisar suas emoções através da sua voz.'
                                        }
                                    </p>

                                    {/* Toggle entre gravação e entrada manual */}
                                    <div className="flex justify-center mb-6">
                                        <div className="inline-flex rounded-lg border border-gray-300 dark:border-gray-600 p-1">
                                            <button
                                                onClick={() => setUseManualInput(false)}
                                                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                                                    !useManualInput
                                                        ? 'bg-primary-600 text-white'
                                                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                                                }`}
                                            >
                                                <MicrophoneIcon className="w-4 h-4 inline mr-1" />
                                                Gravar Áudio
                                            </button>
                                            <button
                                                onClick={() => setUseManualInput(true)}
                                                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                                                    useManualInput
                                                        ? 'bg-primary-600 text-white'
                                                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                                                }`}
                                            >
                                                <SparklesIcon className="w-4 h-4 inline mr-1" />
                                                Digitar Texto
                                            </button>
                                        </div>
                                    </div>

                                    {/* Conteúdo condicional */}
                                    {useManualInput ? (
                                        /* Entrada Manual de Texto */
                                        <div className="max-w-2xl mx-auto">
                                            <textarea
                                                value={manualPrompt}
                                                onChange={(e) => setManualPrompt(e.target.value)}
                                                placeholder="Ex: Uma história sobre um astronauta que encontra vida em Marte..."
                                                className="w-full h-40 px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent placeholder:text-gray-400 dark:placeholder:text-gray-500 resize-none"
                                            />
                                            <div className="flex justify-center gap-4 mt-6">
                                                <Button
                                                    variant="primary"
                                                    size="lg"
                                                    onClick={handleGenerateStoryFromText}
                                                    disabled={!manualPrompt.trim() || isProcessing}
                                                    className="px-8"
                                                >
                                                    <SparklesIcon className="w-5 h-5 mr-2" />
                                                    Gerar História
                                                </Button>
                                            </div>
                                        </div>
                                    ) : (
                                        /* Gravação de Áudio Original */
                                        <>
                                            {/* Recording Visualizer */}
                                            <div className="flex justify-center mb-8">
                                                <div
                                                    className={`relative w-32 h-32 rounded-full flex items-center justify-center transition-all ${isRecording
                                                    ? 'bg-red-500 animate-pulse shadow-lg shadow-red-500/50'
                                                    : 'bg-gradient-to-br from-primary-500 to-accent-500'
                                                }`}
                                        >
                                            {isRecording ? (
                                                <div className="text-white text-center">
                                                    <StopIcon className="w-12 h-12 mx-auto mb-2" />
                                                    <span className="text-sm font-mono">{formatTime(recordingTime)}</span>
                                                </div>
                                            ) : (
                                                <MicrophoneIcon className="w-16 h-16 text-white" />
                                            )}
                                        </div>
                                    </div>

                                    {/* Recording Controls */}
                                    <div className="flex justify-center gap-4 mb-8">
                                        {!isRecording ? (
                                            <Button
                                                variant="primary"
                                                size="lg"
                                                onClick={startRecording}
                                                className="px-8"
                                            >
                                                <MicrophoneIcon className="w-5 h-5 mr-2" />
                                                Iniciar Gravação
                                            </Button>
                                        ) : (
                                            <Button
                                                variant="accent"
                                                size="lg"
                                                onClick={stopRecording}
                                            >
                                                <StopIcon className="w-5 h-5 mr-2" />
                                                Parar e Analisar
                                            </Button>
                                        )}
                                    </div>

                                    {/* Audio Preview */}
                                    {audioUrl && !isRecording && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="mt-8"
                                        >
                                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                                Prévia do áudio gravado:
                                            </p>
                                            <audio
                                                controls
                                                src={audioUrl}
                                                className="w-full max-w-md mx-auto"
                                            />
                                        </motion.div>
                                    )}
                                </>
                                    )}
                                </div>
                            </Card>
                        </motion.div>
                    )}

                    {/* STEP 2: Analyze (Loading) */}
                    {currentStep === 'analyze' && (
                        <motion.div
                            key="analyze"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            <Card className="p-8">
                                <div className="text-center">
                                    <div className="inline-block animate-spin-slow mb-4">
                                        <SparklesIcon className="w-16 h-16 text-primary-500" />
                                    </div>
                                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                                        Analisando Emoções...
                                    </h2>
                                    <p className="text-gray-600 dark:text-gray-300">
                                        Nossos modelos de IA estão processando sua voz e identificando suas emoções.
                                    </p>
                                </div>
                            </Card>
                        </motion.div>
                    )}

                    {/* STEP 3: Generate Story */}
                    {currentStep === 'generate' && (
                        <motion.div
                            key="generate"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                        >
                            <Card className="p-8">
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                                    Emoções Detectadas
                                </h2>

                                {/* Emotions Display */}
                                <div className="mb-8">
                                    <div className="flex flex-wrap gap-3 justify-center mb-6">
                                        {emotions.map((emotion, index) => (
                                            <EmotionBadge
                                                key={index}
                                                emotion={emotion.emotion}
                                                intensity={emotion.intensity}
                                            />
                                        ))}
                                    </div>

                                    {dominantEmotion && (
                                        <div className="text-center">
                                            <p className="text-gray-600 dark:text-gray-300 mb-2">
                                                Emoção Dominante:
                                            </p>
                                            <EmotionBadge
                                                emotion={dominantEmotion}
                                                intensity={1}
                                                size="lg"
                                            />
                                        </div>
                                    )}
                                </div>

                                {/* Optional Prompt */}
                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Adicionar contexto (opcional):
                                    </label>
                                    <textarea
                                        value={userPrompt}
                                        onChange={(e) => setUserPrompt(e.target.value)}
                                        placeholder="Ex: Uma história sobre..."
                                        className="input w-full h-24 resize-none"
                                    />
                                </div>

                                {/* Generate Button */}
                                <div className="flex justify-center">
                                    <Button
                                        variant="primary"
                                        size="lg"
                                        onClick={handleGenerateStory}
                                        disabled={isProcessing}
                                        className="px-8"
                                    >
                                        {isProcessing ? (
                                            <>
                                                <ArrowPathIcon className="w-5 h-5 mr-2 animate-spin" />
                                                Gerando História...
                                            </>
                                        ) : (
                                            <>
                                                <SparklesIcon className="w-5 h-5 mr-2" />
                                                Gerar História
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </Card>
                        </motion.div>
                    )}

                    {/* STEP 4: Narrate (Loading) */}
                    {currentStep === 'narrate' && (
                        <motion.div
                            key="narrate"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            <Card className="p-8">
                                <div className="text-center mb-8">
                                    <div className="flex justify-center gap-4 mb-4">
                                        <div className="inline-block animate-pulse">
                                            <SpeakerWaveIcon className="w-16 h-16 text-accent-500" />
                                        </div>
                                        <div className="inline-block animate-pulse delay-150">
                                            <MusicalNoteIcon className="w-16 h-16 text-primary-500" />
                                        </div>
                                    </div>
                                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                                        Criando Experiência Completa...
                                    </h2>
                                    <p className="text-gray-600 dark:text-gray-300">
                                        Gerando narração em voz e trilha sonora para sua história.
                                    </p>
                                </div>

                                {/* Story Preview */}
                                {storyText && (
                                    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                                            Sua História:
                                        </h3>
                                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                            {storyText}
                                        </p>
                                    </div>
                                )}
                            </Card>
                        </motion.div>
                    )}

                    {/* STEP 5: Complete */}
                    {currentStep === 'complete' && (
                        <motion.div
                            key="complete"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                        >
                            <Card className="p-8">
                                <div className="text-center mb-8">
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ type: 'spring', stiffness: 200 }}
                                        className="inline-block mb-4"
                                    >
                                        <CheckCircleIcon className="w-20 h-20 text-green-500" />
                                    </motion.div>
                                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                                        História Completa! 🎉
                                    </h2>
                                    <p className="text-gray-600 dark:text-gray-300 mb-8">
                                        Sua história está pronta com narração e música de fundo.
                                    </p>
                                </div>

                                {/* Emotions */}
                                <div className="mb-6">
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 text-center">
                                        Emoções Detectadas:
                                    </h3>
                                    <div className="flex flex-wrap gap-2 justify-center">
                                        {emotions.map((emotion, index) => (
                                            <EmotionBadge
                                                key={index}
                                                emotion={emotion.emotion}
                                                intensity={emotion.intensity}
                                            />
                                        ))}
                                    </div>
                                </div>

                                {/* Story Text */}
                                <div className="bg-gradient-to-br from-primary-50 to-accent-50 dark:from-gray-800 dark:to-gray-700 rounded-lg p-6 mb-6">
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                                        História:
                                    </h3>
                                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                                        {storyText}
                                    </p>
                                </div>

                                {/* Audio Players */}
                                <div className="space-y-4 mb-8">
                                    {audioUrl && (
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                🎤 Áudio Original:
                                            </label>
                                            <audio controls src={audioUrl} className="w-full" />
                                        </div>
                                    )}

                                    {narrationUrl && (
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                🔊 Narração:
                                            </label>
                                            <audio controls src={narrationUrl} className="w-full" />
                                        </div>
                                    )}

                                    {musicUrl && (
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                🎵 Música de Fundo:
                                            </label>
                                            <audio controls src={musicUrl} className="w-full" />
                                        </div>
                                    )}
                                </div>

                                {/* Action Buttons */}
                                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                    <Button
                                        variant="primary"
                                        size="lg"
                                        onClick={handleReset}
                                    >
                                        <SparklesIcon className="w-5 h-5 mr-2" />
                                        Criar Nova História
                                    </Button>
                                    <Button
                                        variant="secondary"
                                        size="lg"
                                        onClick={() => window.location.href = '/gallery'}
                                    >
                                        Ver Galeria
                                    </Button>
                                </div>
                            </Card>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default StoryCreator;
