import React, { createContext, useState, useContext, useEffect, type ReactNode } from 'react';
import API_BASE from '../apiconfig';

interface User {
    id: number;
    email: string;
    nombre: string;
    rol: 'USER' | 'ADMIN';
}
interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    logout: () => void;
}
const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);

    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const controller = new AbortController();
        const signal = controller.signal;

        // Si el backend está caído, falla en 2 segundos
        const timeoutId = setTimeout(() => {
            console.warn("Auth fetch timed out.");
            controller.abort();
        }, 2000); // 2 segundos

        const fetchUser = async () => {
            try {
                const response = await fetch(`${API_BASE}/users/me`, {
                    credentials: 'include',
                    signal: signal, // Pasar el 'signal' al fetch
                });

                if (response.ok) {
                    const userData = await response.json();
                    setUser(userData);
                } else {
                    setUser(null);
                }
            } catch (error: any) {
                if (error.name === 'AbortError') {
                    console.log("Fetch aborted (timeout).");
                } else {
                    console.error("Error fetching user:", error);
                }
                setUser(null);
            } finally {
                // Limpiar el timeout y terminar el loading
                clearTimeout(timeoutId);
                setIsLoading(false);
            }
        };

        fetchUser();

        return () => {
            clearTimeout(timeoutId);
            controller.abort();
        };
    }, []);

    const logout = () => {
        window.location.href = `${API_BASE}/logout`;
    };

    return (
        <AuthContext.Provider value={{ user, isLoading, logout }}>
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