import React, { useState } from 'react'
import { ActivityIndicator, I18nManager } from 'react-native'
import * as Burnt from "burnt";
import { FlatList } from 'react-native-gesture-handler';

import {SwipeableToDelete} from 'app/design/swipeableRow/swipeableToDelete'
import { View } from 'app/design/view'
import { Text } from 'app/design/typography'
import { trpc } from 'app/provider/trpc-client'
import { Skeleton } from 'moti/skeleton'
import { StyledPressable } from 'app/design/button'
import { useRelativePush } from 'app/lib/router-push/push'
import { Plus } from '@nandorojo/heroicons/24/outline'


//  To toggle LTR/RTL change to `true`
I18nManager.allowRTL(false);

const Row = ({text}) => (
    <View className="flex flex-col w-full p-2" >
        <Text>{text}</Text>
    </View>
    );



export default function EmailsList() {
    const query = trpc.channels.get.useQuery()
    const utils = trpc.useUtils()

    const [state, setState] = useState(false)

    const deleteChannel = trpc.channels.remove.useMutation({
        onMutate: async (mutation) => {
            await utils.channels.get.cancel();
            const previousChannels = utils.channels.get.getData()
            utils.channels.get.setData(undefined, (old) => {
                return old!.map(curr => {
                    if(curr.address == mutation.address) {
                        return {
                            ...curr,
                            deleted: true
                        }
                    }
                    return curr
                })
            })
            return { previousChannels }
        },
        onError: (err, _, context) => {
            utils.channels.get.setData(undefined, context!.previousChannels)
            /*
            Burnt.toast({
                title: "Fehler", // required

                preset: "error", // or "error", "none", "custom"

                message: "Email wurde nicht entfernt", // optional

                haptic: "error", // or "success", "warning", "error"

                duration: 2, // duration in seconds

                shouldDismissByDrag: true,

                from: "top", // "top" or "bottom"
            });

             */
        },
        onSettled: () => {
            utils.channels.get.invalidate()
        }
    })

    const push = useRelativePush()

    const Header = () => (
        <StyledPressable onPress={() => push("addMail")}>
            <View className="flex flex-col w-full p-2 border-b border-[#c9ba97]" >
                <Text><Plus className="stroke-2 text-[#c9ba97]" /> Hinzufügen</Text>
            </View>
        </StyledPressable>
    );

    const renderItem = ({item}) => {
        return (
            <SwipeableToDelete action={() => {deleteChannel.mutate({
                address: item.address
            })}} isDeleting={item.deleted}>
                <Row text={item.address} />
            </SwipeableToDelete>
        );
    };

        return (
            <Skeleton
                colorMode="light"
                width={'100%'}
                show={query.isLoading}
            >
            <FlatList
                data={query.data}
                ListHeaderComponent={Header}
                ItemSeparatorComponent={() => <View className="border-b border-[#c9ba97]" />}
                renderItem={renderItem}
                keyExtractor={(item) => item.address}
                extraData={state}
            />
            </Skeleton>
        );

}