import React, { createContext, useState, useContext, useEffect, type ReactNode } from 'react';
import { http } from '../services/http';
import API_BASE from '../apiconfig';

interface User {
    id: number;
    email: string;
    nombre: string;
    rol: 'STUDENT' | 'ADMIN';
}

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    logout: () => void;
    isLoginModalOpen: boolean;
    openLoginModal: () => void;
    closeLoginModal: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const { data } = await http.get<User>('/users/me');
                setUser(data);
            } catch (error) {
                console.log("No hay sesión activa o error al obtener usuario.");
                setUser(null);
            } finally {
                setIsLoading(false);
            }
        };

        fetchUser();
    }, []);

    const logout = () => {
        window.location.href = `${API_BASE || 'http://localhost:8080/api/v1'}/logout`;
    };

    const openLoginModal = () => setIsLoginModalOpen(true);
    const closeLoginModal = () => setIsLoginModalOpen(false);

    return (
        <AuthContext.Provider value={{
            user,
            isLoading,
            logout,
            isLoginModalOpen,
            openLoginModal,
            closeLoginModal
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};