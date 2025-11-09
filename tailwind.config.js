/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            // Aquí añades colores, fuentes, etc.
            colors: {
                'ufro-blue': '#0a3fa6',
                'ufro-blue-dark': '#072d78',
                'ufro-muted': '#6b7280',
                'ufro-bg': '#f9fafb',
            }
        },
    },
    plugins: [],
}