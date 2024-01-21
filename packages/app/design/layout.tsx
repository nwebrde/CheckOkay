import { styled } from 'nativewind'
import { CheckOkay } from 'app/features/checkIn/CheckOkay'
import { Guards } from 'app/features/settings/guards/Guards'
import { ReactNode } from 'react'
import { View } from 'app/design/view'

export const Row = styled(View, 'flex-row')

export const VSpacer = styled(View, 'h-12')
export const HSpacer = styled(View, 'w-12')

export const Card = styled(View, 'p-5 rounded-xl shadow-sm')

export const Screen = ({
    children,
    width,
}: {
    children: ReactNode
    width: 'max-w-xl' | 'max-w-2xl'
}) => {
    return (
        <View className="center flex-1 items-center p-3 pt-7 md:justify-center md:pt-0">
            <View className={'w-full' + ' ' + width}>{children}</View>
        </View>
    )
}
