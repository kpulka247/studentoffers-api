/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/**/*.{js,jsx,ts,tsx}"
    ],
    darkMode: "class",
    theme: {
        extend: {
            animation: {
                blob: "blob 8s infinite",
                text: "text 1s ease-in-out",
                messages: "messages 1s ease-in-out"
            },
            keyframes: {
                blob: {
                    "0%": {
                        transform: 'translate(0px, 0px) scale(1)'
                    },
                    "33%": {
                        transform: 'translate(-60px, -40px) scale(1.1)'
                    },
                    "66%": {
                        transform: 'translate(30px, -40px) scale(0.9)'
                    },
                    "100%": {
                        transform: 'translate(0px, 0px) scale(1)'
                    }
                },
                text: {
                    "0%": {
                        transform: 'translateY(-50%) scale(0.9)',
                        opacity: 0
                    },
                    "100%": {
                        transform: 'translateY(-75%) scale(1)',
                        opacity: 1
                    }
                },
                messages: {
                    "0%": {
                        transform: 'translateX(-40%)',
                        opacity: 0
                    },
                    "100%": {
                        transform: 'translateX(0%)',
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
