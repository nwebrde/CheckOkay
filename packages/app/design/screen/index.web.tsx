import React, { ReactNode } from 'react'
import { View } from 'app/design/view'
import { clsx } from 'clsx'
import { AvatarName } from 'app/features/user/AvatarName'
import { AnimatedLink } from 'app/design/button'
import { ChevronLeft, Cog6Tooth } from 'app/design/icons'
import { Text } from 'app/design/typography'
import { usePathname } from 'next/navigation'
import { useLargeSettings } from 'next-app/hooks/windowDimensions'
import { ScrollView } from 'react-native'

const getW = (width: 'max-w-xl' | 'max-w-2xl' | 'max-w-3xl' | 'max-w-4xl') => {
    switch (width) {
        case 'max-w-xl':
            return "wxl"
        case 'max-w-2xl':
            return "w2xl"
        case 'max-w-3xl':
            return "w3xl"
        case 'max-w-4xl':
            return "w4xl"
    }
}

const Screen = ({
                           children,
                           stickyHeaderIndices,
                           width = 'max-w-2xl',
                       }: {
    children: ReactNode
    stickyHeaderIndices: number[]
    width: 'max-w-xl' | 'max-w-2xl' | 'max-w-3xl' | 'max-w-4xl'
}) => {

    const path = usePathname()
    const useLarge = useLargeSettings();

    const topbarVisible = () => {
        return !path.includes("/settings") || (!useLarge && useLarge !== undefined)
    }

    return (
        <>
            <View className="center flex-1 items-center md:justify-center max-h-screen">

                {topbarVisible() &&
                <View className={clsx("w-[calc(100vw-1.5rem)] border-[#c9ba97] fixed border top-0 z-50 bg-secondary h-20 rounded-b-2xl flex flex-row justify-between items-center p-3", width)}>

                    {path != "/" &&
                    <AnimatedLink href=".">
                        <View className="flex flex-row gap-2 items-center">
                            <ChevronLeft className="text-primary stroke-primary stroke-2" />
                            <Text type="label" className="text-primary">Zurück</Text>
                        </View>
                    </AnimatedLink>
                    }

                    {path == "/" &&
                    <View className="basis-3/4">
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

                <View className={clsx('w-full max-h-full h-fit')}>
                    <ScrollView className={clsx("p-3 items-center screenWrapper", topbarVisible() ? "pt-[4.3rem]" : "", getW(width))}
                                stickyHeaderIndices={stickyHeaderIndices}
                    >

                                {children}

                    </ScrollView>
                </View>
            </View>
        </>
    )
}
export default Screen