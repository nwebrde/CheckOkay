import React, { ReactNode } from 'react'
import { ScrollView } from 'app/design/scrollView'
import { clsx } from 'clsx'

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
    paddingSide = true
                       }: {
    children: ReactNode
    stickyHeaderIndices: number[]
    paddingSide: boolean
    stickyHeaderWeb?: number
}) => {

    return (


                    <ScrollView className="screenWrapper w-full items-center flex-1"
                                stickyHeaderIndices={stickyHeaderWeb ? [stickyHeaderWeb] : stickyHeaderIndices}
                                contentClassName={clsx("grow justify-center py-3", paddingSide ? "px-3" : "")}>
                                {children}
                    </ScrollView>


    )
}
export default Screen