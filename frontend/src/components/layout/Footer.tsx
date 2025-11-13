import React from 'react';
import { HeartIcon } from '@heroicons/react/24/solid';

const Footer: React.FC = () => {
    return (
        <footer className="bg-gray-100 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 py-8">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="text-gray-600 dark:text-gray-400 text-sm">
                        © 2025 Aurora EchoTales. Powered by AI 🧠
                    </div>

                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 text-sm">
                        Feito com <HeartIcon className="w-4 h-4 text-red-500" /> por Wilson de Souza
                    </div>

                    <div className="flex gap-4">
                        <a href="/about" className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 text-sm">
                            About
                        </a>
                        <a href="https://github.com/wilsondesouza" target='_blank' className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 text-sm">
                            GitHub
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;