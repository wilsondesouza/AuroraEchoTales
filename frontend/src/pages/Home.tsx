import React from 'react';
import { Link } from 'react-router-dom';
import {
    SparklesIcon,
    MicrophoneIcon,
    BookOpenIcon,
    MusicalNoteIcon,
    HeartIcon
} from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';
import Button from '../components/ui/Button';

const Home: React.FC = () => {
    const features = [
        {
            icon: MicrophoneIcon,
            title: 'Voice Input',
            description: 'Compartilhe suas emoções através da voz.',
            color: 'text-primary-600',
        },
        {
            icon: HeartIcon,
            title: 'Emotion Analysis',
            description: 'A IA detecta seu estado emocional',
            color: 'text-accent-600',
        },
        {
            icon: BookOpenIcon,
            title: 'Story Generation',
            description: 'Crie narrativas personalizadas',
            color: 'text-purple-600',
        },
        {
            icon: MusicalNoteIcon,
            title: 'Soundtrack',
            description: 'Música e narração adaptativas',
            color: 'text-pink-600',
        },
    ];

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="relative gradient-hero py-20 px-4">
                <div className="container mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="flex justify-center mb-6">
                            <SparklesIcon className="w-20 h-20 text-white animate-pulse-slow" />
                        </div>

                        <h1 className="text-5xl md:text-7xl font-display font-bold text-white mb-6">
                            Aurora EchoTales
                        </h1>

                        <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto">
                            Interactive storytelling powered by emotion recognition and AI
                        </p>

                        <Link to="/create">
                            <Button
                                variant="primary"
                                size="lg"
                                className="bg-white text-primary-700 hover:bg-gray-100"
                            >
                                Start Creating
                                <SparklesIcon className="w-5 h-5" />
                            </Button>
                        </Link>
                    </motion.div>
                </div>
            </section>

            {/* Features */}
            <section className="py-20 px-4">
                <div className="container mx-auto">
                    <h2 className="text-3xl md:text-4xl font-display font-bold text-center mb-12">
                        How It Works
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {features.map((feature, index) => (
                            <motion.div
                                key={feature.title}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="card p-6 text-center"
                            >
                                <feature.icon className={`w-12 h-12 ${feature.color} mx-auto mb-4`} />
                                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                                <p className="text-gray-600 dark:text-gray-400">
                                    {feature.description}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;