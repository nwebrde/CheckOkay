/** @jsxImportSource react */

import 'app/global.css';

import { Provider } from 'app/provider'
import 'setimmediate'
import 'raf/polyfill'
import { StylesProvider } from './styles-provider'

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
                    <Provider>{children}</Provider>
                </StylesProvider>
            </body>
        </html>
    )
}
