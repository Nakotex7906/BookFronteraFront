import React, { useState } from 'react';
import type { LoginFormData } from "../../types/LoginFormData";
import API_BASE from "../../apiconfig";

/**
 * Componente de Login para autenticar al usuario.
 *
 * Este componente maneja el formulario de login y se encarga de
 * hacer una solicitud al backend para autenticar al usuario.
 *
 * @component
 * @example
 * return (
 *   <Login />
 * )
 */
const Login: React.FC = () => {
    const [formData, setFormData] = useState<LoginFormData>({
        username: '',
        password: '',
        rememberMe: false,
    });

    /**
     * Maneja el cambio de los valores en los campos del formulario.
     *
     * @param {React.ChangeEvent<HTMLInputElement>} e - El evento de cambio del input.
     */
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    /**
     * Maneja el envío del formulario de login.
     *
     * @param {React.FormEvent} e - El evento de envío del formulario.
     */
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const response = await fetch(`${API_BASE}/login`, { // Endpoint de login que falta implementar en el backend
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: formData.username,
                    password: formData.password,
                }),
            });

            if (response.ok) {
                const data = await response.json();
                console.log(data); // Aqui se puede manejar el token o la respuesta del backend
                // Redirigir o actualizar el estado de la aplicación según sea necesario
            } else {
                console.error('Error al iniciar sesión');
            }
        } catch (error) {
            console.error('Error al iniciar sesión:', error);
        }
    };

    return (
        <div>
            <h1>Login</h1>
            <a>Guille falta hacer el html y css</a>
        </div>
    );
};

export default Login;
