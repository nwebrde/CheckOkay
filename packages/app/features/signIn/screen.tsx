import { A, H1, P, Text, TextLink } from 'app/design/typography'
import { Row } from 'app/design/layout'
import { View } from 'app/design/view'

import { MotiLink } from 'solito/moti'
import { useAuth } from 'app/provider/auth-context'
import { ActivityIndicator } from 'react-native'
import { Button } from 'app/design/button'

export function SignInScreen() {
  const { signIn, user, isLoading } = useAuth()!

  if (isLoading) {
    return <ActivityIndicator />
  }

  return (
    <View className="flex-1 items-center justify-center p-3">
      <H1>Welcome to BeingWell.</H1>
      <View className="max-w-xl">
        <P className="text-center">
          Here is a basic starter to show you how you can navigate from one
          screen to another. This screen uses the same code on Next.js and React
          Native.
        </P>
        <Button text="Login" onClick={signIn} />
      </View>
    </View>
  )
}
