'use client'

import { SettingsScreen } from 'app/features/settings/index/SettingsScreen'
import { useLargeSettings } from '../../../hooks/windowDimensions'
import { useRouter } from 'next/navigation'

export default function Screen() {
    const largeSettings = useLargeSettings()
    const router = useRouter()
    if(largeSettings) {
        router.push("/settings/user")
        return <></>
    }
    else {
        return <SettingsScreen />
    }

}