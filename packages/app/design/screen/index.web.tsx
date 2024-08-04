import React, { ReactNode } from 'react'
import { View } from 'app/design/view'
import { clsx } from 'clsx'
import { AvatarName } from 'app/features/user/AvatarName'
import { AnimatedLink } from 'app/design/button'
import { ChevronLeft, Cog6Tooth } from 'app/design/icons'
import { ScrollView } from 'moti'
import { Text } from 'app/design/typography'
import { usePathname } from 'next/navigation'
import { useLargeSettings } from 'next-app/hooks/windowDimensions'

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

    const path = usePathname()
    const useLarge = useLargeSettings();

    const topbarVisible = () => {
        return !path.includes("/settings") || (!useLarge && useLarge !== undefined)
    }

    return (
        <>
            <View className="center flex-1 items-center md:mt-auto md:mb-auto p-3 pt-0">

                {topbarVisible() &&
                <View className={clsx("w-full border-[#c9ba97] border z-50 bg-secondary h-20 fixed top-0 rounded-b-2xl flex flex-row justify-between items-center p-3", width)}>

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

                <View className={clsx('w-full overflow-scroll', width, topbarVisible() ? "pt-20" : "")}>
                    <ScrollView
                        showsVerticalScrollIndicator={false}
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