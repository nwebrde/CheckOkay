import React from 'react'
import { I18nManager } from 'react-native'
import * as Burnt from "burnt";
import { FlatList } from 'react-native-gesture-handler';

import {SwipeableToDelete} from 'app/design/lists/swipeableRow/swipeableToDelete'
import { View } from 'app/design/view'
import { Text } from 'app/design/typography'
import { trpc } from 'app/provider/trpc-client'
import { Skeleton } from 'moti/skeleton'


//  To toggle LTR/RTL change to `true`
I18nManager.allowRTL(false);

const Row = ({text}) => (
    <View className="flex flex-col w-full p-2" >
        <Text>{text}</Text>
    </View>
    );



export default function GuardsList() {
    const query = trpc.getUser.useQuery()
    const utils = trpc.useUtils()

    const deleteGuard = trpc.guards.deleteGuard.useMutation({
        onMutate: async (mutation) => {
            await utils.getUser.cancel();
            const previousUser = utils.getUser.getData()
            utils.getUser.setData(undefined, (old) => {
                return {
                    ...old,
                    guards: old!.guards.map(curr => {
                        if(curr.id == mutation.guardUserId) {
                            return {
                                ...curr,
                                deleted: true
                            }
                        }
                        return curr
                    })
                }
            })
            return { previousUser }
        },
        onError: (err, _, context) => {
            utils.getUser.setData(undefined, context!.previousUser)
            Burnt.toast({
                title: "Fehler", // required

                preset: "error", // or "error", "none", "custom"

                message: "Beschützer wurde nicht entfernt", // optional

                haptic: "error", // or "success", "warning", "error"

                duration: 2, // duration in seconds

                shouldDismissByDrag: true,

                from: "top", // "top" or "bottom"
            });
        },
        onSettled: () => {
            utils.getUser.invalidate()
        }
    })

    const renderItem = ({item}) => {
        return (
            <SwipeableToDelete action={() => {deleteGuard.mutate({
                guardUserId: item.id
            })}} isDeleting={item.deleted}>
                <Row text={item.email} />
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
                data={query.data?.guards}
                ItemSeparatorComponent={() => <View className="border-b border-[#c9ba97]" />}
                renderItem={renderItem}
                keyExtractor={(item) => item.email}
            />
            </Skeleton>
        );

}