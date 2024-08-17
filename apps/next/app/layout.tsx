/** @jsxImportSource react */

import 'app/global.css';
import '../web.css';

import { Provider } from 'app/provider'
import 'setimmediate'
import 'raf/polyfill'
import { StylesProvider } from './styles-provider'
import React from 'react'
import { appLinks } from '../appLinks'

export const metadata = {
    title: 'CheckOkay App',
    description: 'Deine Freunde beschützen dich',
    keywords: [
        "Schutzengel",
        "Aufpasser",
        "Notfall Erkennung",
        "Zustandsabfragen",
        "Geht es dir gut?",
    ],
    authors: [{ name: "Niklas Weber", url: "https://github.com/nikwebr" }],
    creator: "Niklas Weber",
    other: {
        'apple-itunes-app': 'app-id='+appLinks.ios.id+', app-argument=',
    },
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {

    return (
        <html lang="en">
            <body>
                <StylesProvider>
                    <Provider>
                        {children}
                    </Provider>
                </StylesProvider>
            </body>
        </html>
    )
}
