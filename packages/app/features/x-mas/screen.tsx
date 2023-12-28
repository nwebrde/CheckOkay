import { A, H1, P, Text, TextLink } from 'app/design/typography'
import { Row } from 'app/design/layout'
import { View } from 'app/design/view'

import { MotiLink } from 'solito/moti'
import { useAuth } from 'app/provider/auth-context/index.native'

export function XMasScreen() {
  const { signIn, refreshToken } = useAuth()!
  return (
    <View className="flex-1 items-center justify-center p-3">
      <H1>Ho ho. Merry X-Mas!</H1>
      <View className="h-[32px]" />
      <View className="max-w-xl">
        <P className="">
          Schon bald analysiert diese App deine Schritte. Bewegst du dich eine
          längere Zeit nicht, frägt dich die App wie es dir geht.{'\n'}
          Bleibt eine Antwort aus, benachrichtigt sie Michael und mich.
        </P>
        <View className="h-[12px]" />
        <P className="">
          BeingWell wird entwickelt von{' '}
          <A
            href="https://nweber.de"
            hrefAttrs={{
              target: '_blank',
              rel: 'noreferrer',
            }}
          >
            Niklas
          </A>
          .
        </P>
      </View>
    </View>
  )
}
