import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useEffect } from 'react';

export const ProtectedRoute = () => {
    const { user, isLoading, openLoginModal } = useAuth();

    useEffect(() => {
        if (!isLoading && !user) {
            openLoginModal();
        }
    }, [isLoading, user, openLoginModal]);

    if (isLoading) {
        return (
            <div style={{ padding: '4rem', textAlign: 'center' }}>
                Verificando sesión...
            </div>
        );
    }

    if (!user) {
        // 3. SI NO HAY USUARIO:
        // El Effect de arriba abrirá el modal.
        // Mientras tanto, redirigimos al usuario a la página de inicio ('/')
        // para que el modal aparezca SOBRE la página Home.
        return <Navigate to="/" replace />;
    }

    // 4. Si hay usuario, muestra la página protegida
    return <Outlet />;
};