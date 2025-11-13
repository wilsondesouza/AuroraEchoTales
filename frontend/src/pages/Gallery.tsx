import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  TrashIcon,
  CalendarIcon,
} from '@heroicons/react/24/outline';
import { HeartIcon } from '@heroicons/react/24/solid';
import toast from 'react-hot-toast';
import { apiService } from '../services/api';
import type { Story, EmotionType } from '../types';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import EmotionBadge from '../components/ui/EmotionBadge';

const Gallery: React.FC = () => {
  const [stories, setStories] = useState<Story[]>([]);
  const [filteredStories, setFilteredStories] = useState<Story[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEmotion, setSelectedEmotion] = useState<EmotionType | 'all'>('all');
  const [showFilters, setShowFilters] = useState(false);

  const emotions: EmotionType[] = ['joy', 'sadness', 'anger', 'fear', 'surprise', 'disgust', 'neutral'];

  useEffect(() => {
    loadStories();
  }, []);

  useEffect(() => {
    filterStories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stories, searchQuery, selectedEmotion]);

  const loadStories = async () => {
    setIsLoading(true);
    try {
      const response = await apiService.listStories();
      if (response.success && response.data) {
        setStories(response.data as Story[]);
      }
    } catch (error) {
      console.error('Erro ao carregar histórias:', error);
      toast.error('Erro ao carregar galeria');
      // Dados mock para desenvolvimento
      setStories([]);
    } finally {
      setIsLoading(false);
    }
  };

  const filterStories = () => {
    // Garantir que stories seja sempre um array
    const safeStories = Array.isArray(stories) ? stories : [];
    let filtered = [...safeStories];

    // Filtro por busca
    if (searchQuery) {
      filtered = filtered.filter(story =>
        story.text.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filtro por emoção
    if (selectedEmotion !== 'all') {
      filtered = filtered.filter(
        story => story.emotion_context.dominant_emotion === selectedEmotion
      );
    }

    setFilteredStories(filtered);
  };

  const handleDelete = async (storyId: string) => {
    if (!confirm('Tem certeza que deseja excluir esta história?')) {
      return;
    }

    try {
      await apiService.deleteStory(storyId);
      setStories(stories.filter(s => s.id !== storyId));
      toast.success('História excluída com sucesso!');
    } catch (error) {
      console.error('Erro ao excluir história:', error);
      toast.error('Erro ao excluir história');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-12">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Galeria de Histórias
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Explore suas histórias criadas com emoção
          </p>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar histórias..."
                className="input w-full pl-10"
              />
            </div>

            {/* Filter Toggle */}
            <Button
              variant="secondary"
              onClick={() => setShowFilters(!showFilters)}
            >
              <FunnelIcon className="w-5 h-5 mr-2" />
              Filtros
            </Button>
          </div>

          {/* Emotion Filters */}
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="flex flex-wrap gap-2"
            >
              <button
                onClick={() => setSelectedEmotion('all')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedEmotion === 'all'
                    ? 'bg-primary-500 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                Todas
              </button>
              {emotions.map((emotion) => (
                <button
                  key={emotion}
                  onClick={() => setSelectedEmotion(emotion)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedEmotion === emotion
                      ? 'bg-primary-500 text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                  }`}
                >
                  {emotion.charAt(0).toUpperCase() + emotion.slice(1)}
                </button>
              ))}
            </motion.div>
          )}
        </motion.div>

        {/* Stories Grid */}
        {isLoading ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin-slow mb-4">
              <HeartIcon className="w-16 h-16 text-primary-500" />
            </div>
            <p className="text-gray-600 dark:text-gray-300">Carregando histórias...</p>
          </div>
        ) : filteredStories.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <HeartIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
              {stories.length === 0 ? 'Nenhuma história ainda' : 'Nenhuma história encontrada'}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {stories.length === 0
                ? 'Crie sua primeira história para começar sua jornada!'
                : 'Tente ajustar os filtros de busca'}
            </p>
            {stories.length === 0 && (
              <Button
                variant="primary"
                size="lg"
                onClick={() => window.location.href = '/create'}
              >
                Criar Primeira História
              </Button>
            )}
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStories.map((story, index) => (
              <motion.div
                key={story.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full flex flex-col">
                  {/* Emotion Badge */}
                  <div className="mb-4">
                    <EmotionBadge
                      emotion={story.emotion_context.dominant_emotion}
                      intensity={story.emotion_context.intensity}
                    />
                  </div>

                  {/* Story Text */}
                  <div className="flex-1 mb-4">
                    <p className="text-gray-700 dark:text-gray-300 line-clamp-4 leading-relaxed">
                      {story.text}
                    </p>
                  </div>

                  {/* Metadata */}
                  <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-4">
                    <CalendarIcon className="w-4 h-4" />
                    <span>{formatDate(story.created_at)}</span>
                  </div>

                  {/* Audio Players */}
                  {(story.audio_path || story.narration_path || story.music_path) && (
                    <div className="space-y-2 mb-4">
                      {story.audio_path && (
                        <div>
                          <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                            🎤 Áudio Original
                          </label>
                          <audio
                            controls
                            src={apiService.getAudioURL(story.audio_path)}
                            className="w-full"
                            style={{ height: '32px' }}
                          />
                        </div>
                      )}
                      {story.narration_path && (
                        <div>
                          <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                            🔊 Narração
                          </label>
                          <audio
                            controls
                            src={apiService.getAudioURL(story.narration_path)}
                            className="w-full"
                            style={{ height: '32px' }}
                          />
                        </div>
                      )}
                      {story.music_path && (
                        <div>
                          <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                            🎵 Música
                          </label>
                          <audio
                            controls
                            src={apiService.getAudioURL(story.music_path)}
                            className="w-full"
                            style={{ height: '32px' }}
                          />
                        </div>
                      )}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => {
                        navigator.clipboard.writeText(story.text);
                        toast.success('Texto copiado!');
                      }}
                      className="flex-1"
                    >
                      Copiar
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(story.id)}
                      className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}

        {/* Stats */}
        {filteredStories.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-12 text-center text-gray-600 dark:text-gray-400"
          >
            <p>
              Mostrando {filteredStories.length} de {stories.length} histórias
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Gallery;
