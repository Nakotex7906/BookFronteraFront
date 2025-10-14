import React, { createContext, useState, useContext, useEffect, type ReactNode } from 'react';
import API_BASE from '../apiconfig'; // Asegúrate que la ruta a tu apiconfig es correcta

// 1. Define la estructura del objeto User, debe coincidir con el UserDto del backend
interface User {
    id: number;
    email: string;
    nombre: string;
    rol: 'USER' | 'ADMIN';
}

// 2. Define la estructura del Context
interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    logout: () => void;
}

// 3. Crea el Context con un valor por defecto
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 4. Crea el componente "Proveedor" del contexto
interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Al cargar la app, pregunta al backend quién es el usuario actual
        const fetchUser = async () => {
            try {
                const response = await fetch(`${API_BASE}/users/me`, {
                    credentials: 'include', // ¡Muy importante para enviar la cookie de sesión!
                });

                if (response.ok) {
                    const userData = await response.json();
                    setUser(userData);
                } else {
                    setUser(null);
                }
            } catch (error) {
                console.error("Error fetching user:", error);
                setUser(null);
            } finally {
                setIsLoading(false);
            }
        };

        fetchUser();
    }, []);

    const logout = () => {
        // Redirige al endpoint de logout del backend
        // El backend se encargará de limpiar la sesión y la cookie
        window.location.href = `${API_BASE}/logout`;
    };

    return (
        <AuthContext.Provider value={{ user, isLoading, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

// 5. Crea un hook personalizado para consumir el contexto fácilmente
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};