import React, { useState, ReactNode } from 'react';
import Header from './Header';
import Footer from './Footer';
import ModelLoader from '../ModelLoader';

interface LayoutProps {
    children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <div className="min-h-screen flex flex-col">
            <Header
                onMenuToggle={() => setIsMenuOpen(!isMenuOpen)}
                isMenuOpen={isMenuOpen}
            />

            <main className="flex-1 pt-16">
                {children}
            </main>

            <Footer />
            
            {/* Botão flutuante de gerenciamento de modelos */}
            <ModelLoader />
        </div>
    );
};

export default Layout;