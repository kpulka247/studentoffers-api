/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/**/*.{js,jsx,ts,tsx}"
    ],
    darkMode: "class",
    theme: {
        extend: {
            animation: {
                text: "text 1s ease-in-out",
            },
            keyframes: {
                text: {
                    "0%": {
                        transform: 'translateY(-50%) scale(0.9)',
                        opacity: 0
                    },
                    "100%": {
                        transform: 'translateY(-75%) scale(1)',
                        opacity: 1
                    }
                }
            },
            transitionProperty: {
                "move": "top, right, left, bottom, font-size, line-height"
            },
            height: {
                "100": '30rem',
                "106": '36rem',
                "112": '42rem'
            },
            width: {
                "100": '30rem',
                "106": '36rem',
                "112": '42rem'
            },
            maxHeight: {
                "8xl": '90%'
            },
            maxWidth: {
                "8xl": '90%'
            },
            flex: {
                "2": '1 1 25%'
            },
            blur: {
                "4xl": '88px',
                "5xl": '128px',
                "6xl": '164px',
                "7xl": '248px'
            },
            padding: {
                "18": '72px'
            }
        }
    },
    plugins: []
}
