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

            //website colors
            border: "hsl(var(--border))",
            input: "hsl(var(--input))",
            ring: "hsl(var(--ring))",
            background: "hsl(var(--background))",
            foreground: "hsl(var(--foreground))",
            destructive: {
                DEFAULT: "hsl(var(--destructive))",
                foreground: "hsl(var(--destructive-foreground))",
            },
            muted: {
                DEFAULT: "hsl(var(--muted))",
                foreground: "hsl(var(--muted-foreground))",
            },
            accent: {
                DEFAULT: "hsl(var(--accent))",
                foreground: "hsl(var(--accent-foreground))",
            },
            popover: {
                DEFAULT: "hsl(var(--popover))",
                foreground: "hsl(var(--popover-foreground))",
            },
            card: {
                DEFAULT: "hsl(var(--card))",
                foreground: "hsl(var(--card-foreground))",
            },
        },
        height: {
            screen: ['100vh /* fallback for Opera, IE and etc. */', '100dvh'],
        },
        maxHeight: {
            screen: ['100vh /* fallback for Opera, IE and etc. */', '100dvh'],
        },
        maxWidth: {
            '4xl': '58rem'
        },
        screens: {
            'bxl': '576px',
            'b2xl': '672px',
            'b3xl': '768px',
            'b4xl': '928px',
        },
    },
}

module.exports = {
    theme,
}
