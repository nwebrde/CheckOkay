import React from 'react'
import { I18nManager, StyleSheet } from 'react-native'
import * as Burnt from "burnt";
import { FlatList } from 'react-native-gesture-handler';

import {SwipeableToDelete} from 'app/design/lists/swipeableRow/swipeableToDelete'
import { View } from 'app/design/view'
import { Text } from 'app/design/typography'
import { trpc } from 'app/provider/trpc-client'
import { Skeleton } from 'moti/skeleton'
import { UTCToLocal } from 'app/lib/time'


//  To toggle LTR/RTL change to `true`
I18nManager.allowRTL(false);

const Row = ({text}) => (
        <View className="w-full flex bg-white rounded-2xl border border-[#c9ba97] p-3 pl-4 pr-4">
            <Text type="unstyled" className="text-2xl font-medium tracking-widest text-slate-900">{text}</Text>
        </View>
);

const formatTime = (hour, minute) => {
    return UTCToLocal(hour, minute).date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
}



export default function ChecksList() {
    const query = trpc.checks.get.useQuery()
    const utils = trpc.useUtils()

    const deleteCheck = trpc.checks.remove.useMutation({
        onMutate: async (mutation) => {
            await utils.checks.get.cancel();
            const previousChecks = utils.checks.get.getData()
            utils.checks.get.setData(undefined, (old) => {
                return old!.map(curr => {
                    if(curr.id == mutation.checkId) {
                        return {
                            ...curr,
                            deleted: true
                        }
                    }
                    return curr
                })
            })
            return { previousChecks }
        },
        onError: (err, _, context) => {
            utils.checks.get.setData(undefined, context!.previousChecks)
            Burnt.toast({
                title: "Fehler", // required

                preset: "error", // or "error", "none", "custom"

                message: "Check wurde nicht entfernt", // optional

                haptic: "error", // or "success", "warning", "error"

                duration: 2, // duration in seconds

                shouldDismissByDrag: true,

                from: "top", // "top" or "bottom"
            });
        },
        onSettled: () => {
            utils.checks.get.invalidate()
        }
    })

    const renderItem = ({item}) => {
        return (
            <View className="flex-1">
                <SwipeableToDelete action={() => {deleteCheck.mutate({
                    checkId: item.id
                })}} isDeleting={item.deleted}>
                    <Row text={formatTime(item.hour, item.minute) + " Uhr"} />
                </SwipeableToDelete>
            </View>

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
                numColumns={2}
                ItemSeparatorComponent={() => <View className="h-2" />}
                columnWrapperStyle={style.row}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
            />
        </Skeleton>
    );

}

const style = StyleSheet.create({
    row: {
        flex: 1,
        width: "100%",
        gap: 10,
        justifyContent: "space-between"
    }
});