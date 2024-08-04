import React, { ReactNode } from 'react'
import { trpc } from 'app/provider/trpc-client'
import { View } from 'app/design/view'
import { clsx } from 'clsx'
import { AvatarName } from 'app/features/user/AvatarName'
import { AnimatedLink, AnimatedPressable } from 'app/design/button'
import { ChevronLeft, Cog6Tooth } from 'app/design/icons'
import { ScrollView } from 'moti'
import { RefreshControl } from 'react-native'
import { Text } from 'app/design/typography'
import { usePathname, useRouter } from 'next/navigation'
import useScreenSize, { useLargeSettings } from 'next-app/hooks/windowDimensions'

const Screen = ({
                           children,
                           stickyHeaderIndices,
                           paddingTop = true,
                           width = 'max-w-2xl',
                       }: {
    children: ReactNode
    stickyHeaderIndices: number[]
    paddingTop: boolean
    width: 'max-w-xl' | 'max-w-2xl' | 'max-w-3xl' | 'max-w-4xl'
}) => {
    const [refreshing, setRefreshing] = React.useState(false);

    const utils = trpc.useUtils();

    const onRefresh = React.useCallback(async () => {
        setRefreshing(true);
        await utils.invalidate();
        setRefreshing(false);
    }, []);

    const router = useRouter()
    const path = usePathname()
    const useLarge = useLargeSettings();

    return (
        <>
            <View className="center flex-1 items-center md:justify-center">

                {(!path.includes("/settings") || !useLarge) &&
                <View className={clsx("w-full z-50 bg-secondary h-20 md:fixed top-0 rounded-b-2xl flex flex-row justify-between items-center p-3", width)}>

                    {path != "/" &&
                    <AnimatedLink href=".">
                        <View className="flex flex-row gap-2 items-center">
                            <ChevronLeft className="text-primary stroke-primary stroke-2" />
                            <Text type="label" className="text-primary">Zurück</Text>
                        </View>
                    </AnimatedLink>
                    }

                    {path == "/" &&
                    <View className="basis-2/4">
                        <AvatarName />
                    </View>
                    }

                    {!path.startsWith("/settings") &&
                    <AnimatedLink href="/settings">
                        <Cog6Tooth className="text-primary stroke-primary" />
                    </AnimatedLink>
                    }

                </View>
                }

                <View className={clsx('w-full', width)}>
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        className={clsx("p-3", paddingTop ? "" : "pt-0")}
                        stickyHeaderIndices={stickyHeaderIndices}
                        refreshControl={
                            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                        }
                    >

                        {children}
                    </ScrollView>
                </View>
            </View>
        </>
    )
}
export default Screen