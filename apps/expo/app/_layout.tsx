import { Provider } from 'app/provider'
import { Slot } from 'expo-router'

export default function Root() {
    return (
        <Provider>
            <Slot />
        </Provider>
    )
}
