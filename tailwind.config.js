/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                arena: {
                    base: '#020617',
                    dark: '#0f172a',
                    cyan: '#22d3ee',
                    magenta: '#d946ef',
                    gold: '#eab308',
                },
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
                mono: ['JetBrains Mono', 'monospace'],
            },
            animation: {
                'pulse-slow': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'blink': 'blink 1s step-end infinite',
                'ticker': 'ticker 30s linear infinite',
                'glow-cyan': 'glowCyan 2s ease-in-out infinite alternate',
                'glow-magenta': 'glowMagenta 1.5s ease-in-out infinite alternate',
            },
            keyframes: {
                blink: {
                    '0%, 100%': { opacity: '1' },
                    '50%': { opacity: '0' },
                },
                ticker: {
                    '0%': { transform: 'translateX(100%)' },
                    '100%': { transform: 'translateX(-100%)' },
                },
                glowCyan: {
                    '0%': { boxShadow: '0 0 5px #22d3ee40, 0 0 20px #22d3ee20' },
                    '100%': { boxShadow: '0 0 10px #22d3ee60, 0 0 40px #22d3ee30' },
                },
                glowMagenta: {
                    '0%': { boxShadow: '0 0 5px #d946ef40, 0 0 20px #d946ef20' },
                    '100%': { boxShadow: '0 0 15px #d946ef80, 0 0 50px #d946ef40' },
                },
            },
        },
    },
    plugins: [],
}
