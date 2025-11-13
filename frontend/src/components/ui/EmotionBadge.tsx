import React from 'react';
import type { EmotionType } from '../../types';
import {
    FaceSmileIcon,
    FaceFrownIcon,
    FireIcon,
    BoltIcon,
    SparklesIcon,
    ExclamationCircleIcon,
    MinusCircleIcon,
} from '@heroicons/react/24/solid';

interface EmotionBadgeProps {
    emotion: EmotionType;
    intensity?: number;
    showIcon?: boolean;
    size?: 'sm' | 'md' | 'lg';
}

const emotionConfig = {
    joy: { icon: FaceSmileIcon, label: 'Joy', class: 'emotion-joy' },
    sadness: { icon: FaceFrownIcon, label: 'Sadness', class: 'emotion-sadness' },
    anger: { icon: FireIcon, label: 'Anger', class: 'emotion-anger' },
    fear: { icon: BoltIcon, label: 'Fear', class: 'emotion-fear' },
    surprise: { icon: SparklesIcon, label: 'Surprise', class: 'emotion-surprise' },
    disgust: { icon: ExclamationCircleIcon, label: 'Disgust', class: 'emotion-disgust' },
    neutral: { icon: MinusCircleIcon, label: 'Neutral', class: 'emotion-neutral' },
};

const EmotionBadge: React.FC<EmotionBadgeProps> = ({
    emotion,
    intensity,
    showIcon = true,
    size = 'md'
}) => {
    const config = emotionConfig[emotion];
    const Icon = config.icon;

    const sizeClasses = {
        sm: 'text-xs px-2 py-0.5',
        md: 'text-sm px-3 py-1',
        lg: 'text-base px-4 py-2',
    };

    return (
        <span className={`emotion-badge ${config.class} ${sizeClasses[size]}`}>
            {showIcon && <Icon className="w-4 h-4" />}
            <span>{config.label}</span>
            {intensity !== undefined && (
                <span className="font-bold ml-1">
                    {Math.round(intensity * 100)}%
                </span>
            )}
        </span>
    );
};

export default EmotionBadge;