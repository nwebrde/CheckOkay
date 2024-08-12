'use client'

import { ActivityIndicator } from 'react-native'
import { useEffect, useState } from 'react'
import { Text } from 'app/design/typography'

export default function SignInScreen() {
    const [loading, setLoading] = useState(true)
    useEffect(() => {
        document.cookie = "demo=true; max-age=300; path=/;";
        setLoading(false)
    }, [])
    return(
        <>
        { loading &&
        <ActivityIndicator />
        }

            { !loading &&
                <Text type="H2">Proceed by opening the CheckOkay App and tap on "Anmelden"</Text>
            }
        </>
    )
}