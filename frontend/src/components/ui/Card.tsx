import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface CardProps {
    children: ReactNode;
    className?: string;
    hover?: boolean;
    onClick?: () => void;
}

const Card: React.FC<CardProps> = ({
    children,
    className = '',
    hover = false,
    onClick
}) => {
    return (
        <motion.div
            whileHover={hover ? { scale: 1.02, y: -4 } : undefined}
            className={`card ${hover && 'card-hover cursor-pointer'} ${className}`}
            onClick={onClick}
        >
            {children}
        </motion.div>
    );
};

export default Card;