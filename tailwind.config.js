/** @type {import('tailwindcss').Config} */
export default {
    // Archivos que Tailwind debe escanear
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}", // Incluye todos tus archivos de React
    ],
    theme: {
        extend: {},
    },
    plugins: [],
}