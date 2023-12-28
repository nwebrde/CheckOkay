import { Button, ScrollView, Text, View } from 'react-native'
import { useAuth } from 'app/provider/auth-context/index.native'

export default function OAuth() {
  const { refreshToken, accessToken, signOut, signIn, refresh } = useAuth()!

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      {refreshToken ? (
        <View
          style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
        >
          <View>
            <ScrollView style={{ flex: 1, maxHeight: 300 }}>
              <Text>AccessToken: {accessToken}</Text>
              <Text>refreshToken: {refreshToken}</Text>
            </ScrollView>
          </View>
          <View>
            <Button title="Refresh" onPress={refresh} />
            <Button title="Logout" onPress={signOut} />
          </View>
        </View>
      ) : (
        <Button title="Login" onPress={signIn} />
      )}
    </View>
  )
}
