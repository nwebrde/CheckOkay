import React, { ReactNode } from 'react'
import { ScrollView } from 'react-native'

/**
 *
 * @param children
 * @param stickyHeaderIndices
 * @param stickyHeaderWeb if defined, this replaces the native stickyHeaderIndices. Useful as on web, multiple sticky elements stick together which messes up the layout
 * @param width
 * @constructor
 */
const Screen = ({
                           children,
                           stickyHeaderIndices,
                           stickyHeaderWeb,
                       }: {
    children: ReactNode
    stickyHeaderIndices: number[]
    stickyHeaderWeb?: number
}) => {

    return (


                    <ScrollView className="screenWrapper w-full items-center"
                                stickyHeaderIndices={stickyHeaderWeb ? [stickyHeaderWeb] : stickyHeaderIndices}
                    >
                                {children}
                    </ScrollView>


    )
}
export default Screen