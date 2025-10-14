import React from "react";
import stylesLogin from "./Login.module.css";

/**
 * Login page component for BookFrontera.
 * Provides login via Google OAuth2.
 */
const Login: React.FC = () => {
    // URL absoluta al backend para forzar la navegación fuera de la SPA
    const googleLoginUrl = "http://localhost:8080/oauth2/authorization/google";

    return (
        <div className={stylesLogin.page}>
            <div className={stylesLogin.card}>
                <header className={stylesLogin.header}>
                    <h1 className={stylesLogin.title}>BookFrontera</h1>
                    <p style={{ textAlign: 'center', marginTop: '0.5rem' }}>
                        Inicia sesión para continuar
                    </p>
                </header>

                {/* --- Botón Google (Spring Security OAuth2 Login) --- */}
                <a
                    className={stylesLogin.googleButton}
                    href={googleLoginUrl}
                    rel="noopener noreferrer"
                >
                    <svg
                        className={stylesLogin.googleIcon}
                        viewBox="0 0 48 48"
                        aria-hidden="true"
                    >
                        <path
                            fill="#FFC107"
                            d="M43.6 20.5h-1.8V20H24v8h11.3C33.8 31.9 29.3 35 24 35 16.8 35 11
      29.2 11 22s5.8-13 13-13c3.3 0 6.3 1.2 8.6 3.2l5.7-5.7C34.4 3 29.5 1 24 1 11.8 1 2 10.8 2 23s9.8
      22 22 22c11.3 0 21-8.2 21-22 0-1.3-.1-2.7-.4-3.9z"
                        />
                        <path
                            fill="#FF3D00"
                            d="M6.3 14.7l6.6 4.8C14.6 16 18.9 13 24 13c3.3 0 6.3 1.2 8.6
      3.2l5.7-5.7C34.4 3 29.5 1 24 1 15.3 1 7.9 6 4.6 13.2l1.7 1.5z"
                        />
                        <path
                            fill="#4CAF50"
                            d="M24 45c5.2 0 10.1-2 13.7-5.3l-6.3-5.2C29.2 36.6 26.7 37.5 24
      37.5c-5.2 0-9.6-3.3-11.2-8l-6.5 5.1C9.6 39.9 16.3 45 24 45z"
                        />
                        <path
                            fill="#1976D2"
                            d="M43.6 20.5H24v8h11.3c-1 3-3.4 5.4-6.6 6.6l6.3 5.2C38.9 38.8 43 33
      43 23c0-1.3-.1-2.7-.4-3.9z"
                        />
                    </svg>
                    <span>Iniciar Sesión con Google</span>
                </a>
            </div>
        </div>
    );
};

export default Login;
