"use client"

import { clsx } from 'clsx'
import { View } from 'app/design/view'
import { AnimatedLink } from 'app/design/button'
import { ChevronLeft, Cog6Tooth } from 'app/design/icons'
import { Text } from 'app/design/typography'
import { AvatarName } from 'app/features/user/AvatarName'
import React from 'react'
import { usePathname } from 'next/navigation'
import { useLargeSettings } from '../../hooks/windowDimensions'
import { AppBanner } from '../../components/AppBanner'

const getWidthForPath = (path: string) => {
    if(path.startsWith("settings")) {
        return "max-w-xl"
    }
    else return "max-w-4xl"
}

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

const getBreakpointDependantStyles = (width: 'max-w-xl' | 'max-w-2xl' | 'max-w-3xl' | 'max-w-4xl') => {
    /*
pt-20 in scrollView is enabled on large screens when the header has margin to the ends of the screen to let the scrollbar scroll up to the top of the screen.
On mobile, pt-20 is removed to let the scrollbar start right below the header (as the header spans the full screen width)
 */
    switch (width) {
        case 'max-w-xl':
            return {
                header: "bxl:rounded-b-2xl bxl:fixed",
                scrollView: "bxl:max-h-screen bxl:pt-20",
                root: "bxl:justify-center"
            }
        case 'max-w-2xl':
            return {
                header: "b2xl:rounded-b-2xl b2xl:fixed",
                scrollView: "b2xl:max-h-screen b2xl:pt-20",
                root: "b2xl:justify-center"
            }
        case 'max-w-3xl':
            return {
                header: "b3xl:rounded-b-2xl b3xl:fixed",
                scrollView: "b3xl:max-h-screen b3xl:pt-20",
                root: "b3xl:justify-center"
            }
        case 'max-w-4xl':
            return {
                header: "b4xl:rounded-b-2xl b4xl:fixed",
                scrollView: "b4xl:max-h-screen b4xl:pt-20",
                root: "b4xl:justify-center"
            }
    }
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {

    const path = usePathname()
    const useLarge = useLargeSettings();

    const topbarVisible = () => {
        if(path.includes("/settings") && useLarge) {
            return false
        }
        if(path.includes("/auth")) {
            return false
        }
        return true
    }

    const appbarVisible = () => {
        if(path.includes("/auth")) {
            return false
        }
        return true
    }

    const width = getWidthForPath(path)

    return (
        <>

                        <View className={clsx("center flex-1 items-center max-h-screen", getBreakpointDependantStyles(width).root)}>

                            {topbarVisible() &&
                                <View className={clsx("w-full border-[#c9ba97] border top-0 z-50 bg-secondary h-20 flex flex-row justify-between items-center p-3", getBreakpointDependantStyles(width).header, width)}>

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



                            <View className={clsx('w-full w-fit', topbarVisible() ? getBreakpointDependantStyles(width).scrollView : "max-h-screen", topbarVisible() ? "max-h-[calc(100dvh-5rem)]" : "", getW(width))}>
                                {children}
                            </View>
                        </View>
            {appbarVisible() &&
            <AppBanner />
            }
        </>
    )
}
