/** @jsxImportSource react */

import 'app/global.css';
import '../web.css';

import { Provider } from 'app/provider'
import 'setimmediate'
import 'raf/polyfill'
import { StylesProvider } from './styles-provider'
import React from 'react'

export const metadata = {
    title: 'CheckOkay',
    description: 'Deine Freunde beschützen dich',
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
