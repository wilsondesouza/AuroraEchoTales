import React from 'react';
import { motion } from 'framer-motion';
import {
  SparklesIcon,
  MicrophoneIcon,
  MusicalNoteIcon,
  SpeakerWaveIcon,
  HeartIcon,
  CpuChipIcon,
} from '@heroicons/react/24/outline';
import Card from '../components/ui/Card';

interface ModelInfo {
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  features: string[];
  color: string;
}

const models: ModelInfo[] = [
  {
    name: 'Audio Analyzer',
    description: 'Análise avançada de áudio usando OpenL3 para extração de embeddings e detecção de padrões emocionais.',
    icon: MicrophoneIcon,
    features: [
      'Extração de embeddings com OpenL3',
      'Análise de características acústicas',
      'Detecção de tom emocional',
      'Suporte para diversos formatos de áudio',
    ],
    color: 'text-blue-500',
  },
  {
    name: 'Emotion Integrator',
    description: 'Integração inteligente de emoções de múltiplas fontes para criar um contexto emocional rico.',
    icon: HeartIcon,
    features: [
      'Fusão de dados de áudio e texto',
      'Ponderação adaptativa de fontes',
      'Cálculo de emoção dominante',
      'Scores de confiança por emoção',
    ],
    color: 'text-red-500',
  },
  {
    name: 'Story Generator',
    description: 'Geração criativa de histórias usando GPT-2 adaptado ao contexto emocional.',
    icon: SparklesIcon,
    features: [
      'Modelo GPT-2 fine-tuned',
      'Adaptação ao contexto emocional',
      'Controle de temperatura e criatividade',
      'Geração de histórias personalizadas',
    ],
    color: 'text-purple-500',
  },
  {
    name: 'TTS Narrator (MeloTTS)',
    description: 'Síntese de voz natural e expressiva usando MeloTTS para narração das histórias.',
    icon: SpeakerWaveIcon,
    features: [
      'Síntese de voz multilíngue',
      'Suporte para Português BR',
      'Controle de velocidade e estilo',
      'Qualidade de áudio profissional',
    ],
    color: 'text-green-500',
  },
  {
    name: 'Music Generator (MusicGen)',
    description: 'Geração de trilhas sonoras únicas usando MusicGen da Meta para criar atmosferas emocionais.',
    icon: MusicalNoteIcon,
    features: [
      'Modelo MusicGen da Meta',
      '6 estilos musicais (ambient, orchestral, piano, etc)',
      '6 moods emocionais',
      '3 tempos (slow, medium, fast)',
    ],
    color: 'text-yellow-500',
  },
];

const About: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="flex justify-center mb-6">
            <motion.div
              animate={{
                rotate: [0, 10, -10, 0],
                scale: [1, 1.1, 1.1, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatDelay: 3,
              }}
            >
              <SparklesIcon className="w-20 h-20 text-primary-500" />
            </motion.div>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Aurora EchoTales
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Uma experiência imersiva de storytelling alimentada por 5 modelos de IA que transformam
            suas emoções em histórias únicas com narração e trilha sonora personalizadas.
          </p>
        </motion.div>

        {/* How It Works */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            Como Funciona
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {[
              {
                step: 1,
                title: 'Grave',
                description: 'Grave sua voz falando naturalmente',
                icon: MicrophoneIcon,
              },
              {
                step: 2,
                title: 'Analise',
                description: 'IA analisa suas emoções no áudio',
                icon: CpuChipIcon,
              },
              {
                step: 3,
                title: 'Gere',
                description: 'História criada com base nas emoções',
                icon: SparklesIcon,
              },
              {
                step: 4,
                title: 'Narre',
                description: 'TTS narra a história em voz natural',
                icon: SpeakerWaveIcon,
              },
              {
                step: 5,
                title: 'Ouça',
                description: 'Música de fundo personalizada',
                icon: MusicalNoteIcon,
              },
            ].map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.step}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                >
                  <Card className="text-center h-full">
                    <div className="bg-gradient-to-br from-primary-100 to-accent-100 dark:from-primary-900/30 dark:to-accent-900/30 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                      <Icon className="w-8 h-8 text-primary-600 dark:text-primary-400" />
                    </div>
                    <div className="text-2xl font-bold text-primary-600 dark:text-primary-400 mb-2">
                      {item.step}
                    </div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                      {item.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {item.description}
                    </p>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* AI Models */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            Modelos de IA
          </h2>

          <div className="space-y-6">
            {models.map((model, index) => {
              const Icon = model.icon;
              return (
                <motion.div
                  key={model.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                >
                  <Card className="p-6">
                    <div className="flex items-start gap-4">
                      <div className={`${model.color} flex-shrink-0`}>
                        <Icon className="w-12 h-12" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                          {model.name}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300 mb-4">
                          {model.description}
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {model.features.map((feature, idx) => (
                            <div
                              key={idx}
                              className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400"
                            >
                              <div className="w-1.5 h-1.5 rounded-full bg-primary-500" />
                              {feature}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Tech Stack */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            Tecnologias
          </h2>

          <Card className="p-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              {[
                { name: 'React 18', desc: 'Frontend' },
                { name: 'TypeScript', desc: 'Type Safety' },
                { name: 'Tailwind CSS', desc: 'Styling' },
                { name: 'Framer Motion', desc: 'Animations' },
                { name: 'FastAPI', desc: 'Backend' },
                { name: 'PyTorch', desc: 'Deep Learning' },
                { name: 'Transformers', desc: 'NLP' },
                { name: 'Vite', desc: 'Build Tool' },
              ].map((tech, index) => (
                <motion.div
                  key={tech.name}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1 + index * 0.05 }}
                  whileHover={{ scale: 1.05 }}
                  className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800"
                >
                  <div className="font-bold text-gray-900 dark:text-white mb-1">
                    {tech.name}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {tech.desc}
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Footer Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="text-center"
        >
          <Card className="p-8 bg-gradient-to-br from-primary-50 to-accent-50 dark:from-gray-800 dark:to-gray-700">
            <HeartIcon className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Criado com ❤️ por Wilson de Souza
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Um projeto que combina IA, criatividade e emoção para criar experiências únicas de storytelling.
            </p>
            <div className="flex justify-center gap-4">
              <a
                href="https://github.com/wilsondesouza"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-600 dark:text-primary-400 hover:underline"
              >
                GitHub
              </a>
              <span className="text-gray-400">•</span>
              <a
                href="/"
                className="text-primary-600 dark:text-primary-400 hover:underline"
              >
                Criar História
              </a>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default About;
