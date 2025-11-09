import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const ProtectedRoute = () => {
    const { user, isLoading } = useAuth();

    if (isLoading) {
        return (
            <div style={{ padding: '4rem', textAlign: 'center' }}>
                Verificando sesión...
            </div>
        );
    }

    if (!user) {
        // 3. Si NO está cargando Y NO hay usuario, redirige
        return <Navigate to="/login" replace />;
    }

    // 4. Si NO está cargando y SÍ hay usuario, muestra la página
    return <Outlet />;
};