'use client'

import { SignInScreen as Inner } from 'app/features/signIn/screen'
import { Suspense } from 'react'

export default function SignInScreen() {
    return(<Suspense>
        <Inner />
    </Suspense>)
}