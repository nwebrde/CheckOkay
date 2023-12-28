import { Redirect, Stack } from 'expo-router'
import { Text } from 'react-native'
import { useAuth } from 'app/provider/auth-context/index.native'

export default function AppLayout() {
  const { refreshToken, isLoading } = useAuth()!

  // You can keep the splash screen open, or render a loading screen like we do here.
  if (isLoading) {
    return <Text>Loading...</Text>
  }

  // Only require authentication within the (app) group's layout as users
  // need to be able to access the (auth) group and sign in again.
  if (!refreshToken || refreshToken === '') {
    // On web, static rendering will stop here as the user is not authenticated
    // in the headless Node process that the pages are rendered in.
    return <Redirect href="/OAuth" />
  }

  // This layout can be deferred because it's not the root layout.
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: '#f4511e',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    />
  )
}
