// @ts-check

/** @type {import('tailwindcss').Config['theme']} */
const theme = {
    fontWeight: {
        thin: '100',
        extralight: '200',
        light: '300',
        normal: '400',
        medium: '500',
        semibold: '600',
        bold: '700',
        extrabold: '800',
        black: '900',
    },
    screens: {
        'xxxxxs': '400px',
        'b-max-w-xl': '576px',
        'sm': '576px',
        'b-max-w-2xl': '672px',
        'b-max-w-3xl': '768px',
        'b-max-w-4xl': '896px',
        'md': '960px',
        'lg': '1440px',
        'xl': '1280px',
        '2xl': '1536px',
    },
    extend: {
        colors: {
            primary: {
                light: '#2F5651',
                DEFAULT: '#2F5651',
                dark: '#F1EDE1',
            },
            secondary: {
                light: '#F1EDE1',
                DEFAULT: '#F1EDE1',
            },
            brown: {
                light: '#CBA780',
                DEFAULT: '#CBA780',
            },
            ok: {
                light: '#d9f99d',
                DEFAULT: '#d9f99d',
            },
        },
        height: {
            screen: ['100vh /* fallback for Opera, IE and etc. */', '100dvh'],
        },
        maxHeight: {
            screen: ['100vh /* fallback for Opera, IE and etc. */', '100dvh'],
        }
    },
}

module.exports = {
    theme,
}
