import React, { useState } from 'react';
import type { LoginFormData } from "../../types/LoginFormData";
import API_BASE from "../../apiconfig";
import stylesLogin from "./Login.module.css";
import {Link} from "react-router-dom";

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
        <div className={stylesLogin["login-container"]}>
            <div className={stylesLogin["login-card"]}>
                <div className={stylesLogin["login-header"]}>
                    <h1 className={stylesLogin["login-title"]}>BookFrontera</h1>
                </div>
                <form className={stylesLogin["login-form"]} onSubmit={handleSubmit}>
                    <div>
                        <label className={stylesLogin["form-label"]} htmlFor="usuario">Usuario</label>
                        <input
                            className={stylesLogin["form-input"]} id="usuario" name="username" value={formData.username}
                            onChange={handleChange} placeholder="Ingrese su usuario" type="text"
                        />
                    </div>
                    <div>
                        <label className={stylesLogin["form-label"]} htmlFor="contrasena">Contraseña</label>
                        <input
                            className={stylesLogin["form-input"]} id="contrasena" name="password"
                            value={formData.password} onChange={handleChange} placeholder="Ingrese su contraseña" type="password"
                        />
                    </div>
                    <div className={stylesLogin["form-options"]}>
                        <div className={stylesLogin["remember-me"]}>
                            <input
                                className={stylesLogin["form-checkbox"]} id="recordarme" name="rememberMe"
                                checked={formData.rememberMe} onChange={handleChange} type="checkbox"
                            />
                            <label className={stylesLogin["form-label-checkbox"]} htmlFor="recordarme">Recordarme</label>
                        </div>
                        <div className={stylesLogin["forgot-password"]}>
                            <a href="#">¿Olvidaste tu contraseña?</a>
                        </div>
                    </div>
                    <div>
                        <button className={stylesLogin["submit-button"]} type="submit">
                            Ingresar
                        </button>
                    </div>
                    <div>
                        <Link to="/" className={stylesLogin["home-link"]}>Volver al inicio</Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;
