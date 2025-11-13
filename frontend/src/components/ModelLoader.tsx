import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../services/api';

interface ModelStatus {
    audio_analyzer: boolean;
    emotion_integrator: boolean;
    story_generator: boolean;
    tts_narrator: boolean;
    music_generator: boolean;
}

interface LoadingStatus {
    audio_analyzer?: string;
    emotion_integrator?: string;
    story_generator?: string;
    tts_narrator?: string;
    music_generator?: string;
}

const ModelLoader = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [modelStatus, setModelStatus] = useState<ModelStatus | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [loadingStatus, setLoadingStatus] = useState<LoadingStatus>({});
    const [loadingTime, setLoadingTime] = useState<number | null>(null);

  const checkModelsStatus = async () => {
    try {
      const response = await api.checkHealth();
      if (response?.models) {
        setModelStatus(response.models);
      }
    } catch (error) {
      console.error('Erro ao verificar status dos modelos:', error);
    }
  };

  const loadAllModels = async () => {
    setIsLoading(true);
    setLoadingStatus({});
    setLoadingTime(null);
    
    try {
      const response = await api.loadModels();
      
      if (response?.models_status) {
        setLoadingStatus(response.models_status);
      }
      
      if (response?.loading_time) {
        setLoadingTime(response.loading_time);
      }
      
      // Atualizar status após carregamento
      await checkModelsStatus();
      
    } catch (error) {
      console.error('Erro ao carregar modelos:', error);
    } finally {
      setIsLoading(false);
    }
  };    useEffect(() => {
        if (isOpen) {
            checkModelsStatus();
        }
    }, [isOpen]);

    const getModelName = (key: string): string => {
        const names: Record<string, string> = {
            audio_analyzer: 'Analisador de Áudio',
            emotion_integrator: 'Integrador de Emoções',
            story_generator: 'Gerador de Histórias',
            tts_narrator: 'Narrador TTS',
            music_generator: 'Gerador de Música'
        };
        return names[key] || key;
    };

    const getStatusColor = (status: string): string => {
        if (status === 'loaded') return 'text-green-500';
        if (status.startsWith('error')) return 'text-red-500';
        return 'text-yellow-500';
    };

    const allModelsLoaded = modelStatus
        ? Object.values(modelStatus).every(status => status === true || status === 'loaded')
        : false;

    return (
        <div className="fixed bottom-6 right-6 z-50">
            {/* Botão flutuante */}
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(!isOpen)}
                className={`
          w-14 h-14 rounded-full shadow-lg flex items-center justify-center
          ${allModelsLoaded ? 'bg-green-500' : 'bg-purple-600'}
          text-white hover:shadow-xl transition-shadow
        `}
                title="Status dos Modelos IA"
            >
                {isLoading ? (
                    <svg className="animate-spin h-6 w-6" viewBox="0 0 24 24">
                        <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                            fill="none"
                        />
                        <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                    </svg>
                ) : (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"
                        />
                    </svg>
                )}
            </motion.button>

            {/* Painel de status */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.9 }}
                        transition={{ duration: 0.2 }}
                        className="absolute bottom-20 right-0 w-96 bg-white dark:bg-gray-800 rounded-lg shadow-2xl p-6 border border-gray-200 dark:border-gray-700"
                    >
                        <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">
                            Status dos Modelos IA
                        </h3>

                        {/* Lista de modelos */}
                        <div className="space-y-3 mb-4">
                            {modelStatus && Object.entries(modelStatus).map(([key, value]) => (
                                <div key={key} className="flex items-center justify-between">
                                    <span className="text-sm text-gray-700 dark:text-gray-300">
                                        {getModelName(key)}
                                    </span>
                                    <div className="flex items-center gap-2">
                                        {loadingStatus[key as keyof LoadingStatus] && (
                                            <span className={`text-xs ${getStatusColor(loadingStatus[key as keyof LoadingStatus]!)}`}>
                                                {loadingStatus[key as keyof LoadingStatus]}
                                            </span>
                                        )}
                                        <div className={`w-3 h-3 rounded-full ${value ? 'bg-green-500' : 'bg-gray-400'}`} />
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Tempo de carregamento */}
                        {loadingTime !== null && (
                            <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
                                Tempo de carregamento: <span className="font-semibold">{loadingTime.toFixed(2)}s</span>
                            </div>
                        )}

            {/* Botões de ação */}
            <div className="flex gap-2">
              <button
                onClick={loadAllModels}
                disabled={isLoading}
                className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin h-4 w-4 mr-2" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Carregando...
                  </>
                ) : (
                  'Carregar Modelos'
                )}
              </button>
              
              <button
                onClick={checkModelsStatus}
                disabled={isLoading}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Atualizar
              </button>
            </div>                        {/* Informação adicional */}
                        <div className="mt-4 text-xs text-gray-500 dark:text-gray-400">
                            Os modelos são carregados automaticamente quando necessário.
                            Use este painel para pré-carregar todos de uma vez.
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ModelLoader;
