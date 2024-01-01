'use client'
import { A, H1, P, Text, TextLink } from 'app/design/typography'
import { Row } from 'app/design/layout'
import { View } from 'app/design/view'

import { MotiLink } from 'solito/moti/app'
import { trpc } from 'app/provider/trpc-client'
import { useAuth } from 'app/provider/auth-context'
import { Button } from 'app/design/button'

import { AcademicCap } from '@nandorojo/heroicons/24/outline'
import {TimePicker} from "app/design/timepicker/timepicker";
import ChecksList from "app/features/settings/checks/ChecksList";


export function HomeScreen() {
    const { isLoading, isError, data, error } = trpc.checks.test.useQuery()

    const { user, signOut } = useAuth()!

    return (
        <View className="flex-1 items-center justify-center p-3">
            <View className="bg-secondary rounded w-full max-w-xl h-32">

            </View>

          <Button text="ss" />
          <MotiLink

            animate={({ hovered, pressed }) => {
              'worklet'

              return {
                scale: pressed ? 0.95 : hovered ? 1.1 : 1,
                rotateZ: pressed
                  ? '0deg'
                  : hovered
                    ? '-3deg'
                    : '0deg',
              }
            }}
            transition={{
              type: 'timing',
              duration: 150,
            }}>
            <AcademicCap color="red" className="text-green-500" />
          </MotiLink>

          <AcademicCap color="red" />

          <View className="w-full h-56">
            <ChecksList />
          </View>


          <H1>Welcome to Solito.</H1>
            {!isLoading && <H1>UserId: {user?.name}</H1>}
            <View className="max-w-xl">
                <P className="text-center text-green-500">
                    Here is a basic starter to show you how you can navigate
                    from one screen to another. This screen uses the same code
                    on Next.js and React Native.
                </P>

                <P className="text-center">
                    Solito is made by{' '}
                    <A
                        href="https://twitter.com/fernandotherojo"
                        hrefAttrs={{
                            target: '_blank',
                            rel: 'noreferrer',
                        }}
                    >
                        Fernando Rojo
                    </A>
                    .
                </P>
                <P className="text-center">
                    NativeWind is made by{' '}
                    <A
                        href="https://twitter.com/mark__lawlor"
                        hrefAttrs={{
                            target: '_blank',
                            rel: 'noreferrer',
                        }}
                    >
                        Mark Lawlor
                    </A>
                    .
                </P>
            </View>
            <View className="h-[32px]" />
            <Row className="space-x-8">
                <TextLink href="/user/fernando">Regular Link</TextLink>
                <MotiLink
                    href="/user/fernando"
                    animate={({ hovered, pressed }) => {
                        'worklet'

                        return {
                            scale: pressed ? 0.95 : hovered ? 1.1 : 1,
                            rotateZ: pressed
                                ? '0deg'
                                : hovered
                                ? '-3deg'
                                : '0deg',
                        }
                    }}
                    transition={{
                        type: 'timing',
                        duration: 150,
                    }}
                >
                    <Text selectable={false} className="text-base font-bold">
                        Moti Link
                    </Text>
                </MotiLink>
            </Row>
            <Button text="Logout" onClick={signOut} />
        </View>
    )
}
