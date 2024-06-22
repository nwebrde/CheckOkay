import { Provider } from 'app/provider'
import { Slot } from 'expo-router'

import "app/global.css"

export default function Root() {
    return (
        <Provider>
            <Slot />
        </Provider>
    )
}
