import React, {useState} from 'react';
import {
    SafeAreaView,
    StyleSheet,
    StatusBar,
    Pressable,
    Alert,
} from 'react-native';

import SwipeableFlatList from 'react-native-swipeable-list';
import { View } from 'app/design/view'
import { Text } from 'app/design/typography'
import { trpc } from 'app/provider/trpc-client/index.native'

const darkColors = {
    background: '#121212',
    primary: '#BB86FC',
    primary2: '#3700b3',
    secondary: '#03DAC6',
    onBackground: '#FFFFFF',
    error: '#CF6679',
};

const colorEmphasis = {
    high: 0.87,
    medium: 0.6,
    disabled: 0.38,
};

const extractItemKey = item => {
    return item.address;
};

const Item = ({item, deleteItem}) => {
    return (
        <>
            <View>
                <Text>{item.address}</Text>
            </View>
        </>
    );
};

function renderItemSeparator() {
    return <View style={styles.itemSeparator} />;
}

const EmailList = () => {
    const query = trpc.channels.get.useQuery()
    const deleteMutation = trpc.channels.remove.useMutation()

    const deleteItem = itemId => {
        // ! Please don't do something like this in production. Use proper state management.
        deleteMutation.mutate({
            address: itemId
        })
    };


    const QuickActions = (index, qaItem) => {
        return (
            <View>
                <View>
                    <Pressable onPress={() => deleteItem(qaItem.id)}>
                        <Text>Delete</Text>
                    </Pressable>
                </View>
            </View>
        );
    };

    return (
                <SwipeableFlatList
                    keyExtractor={extractItemKey}
                    data={query.data}
                    renderItem={({item}) => (
                        <Item item={item} deleteItem={() => deleteItem} />
                    )}
                    maxSwipeDistance={240}
                    renderQuickActions={({index, item}) => QuickActions(index, item)}
                    contentContainerStyle={styles.contentContainerStyle}
                    shouldBounceOnMount={true}
                    ItemSeparatorComponent={renderItemSeparator}
                />
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#121212',
    },
    headerContainer: {
        height: 80,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 10,
    },
    headerText: {
        fontSize: 30,
        fontWeight: '800',
        color: darkColors.onBackground,
        opacity: colorEmphasis.high,
    },
    item: {
        backgroundColor: '#121212',
        height: 80,
        flexDirection: 'row',
        padding: 10,
    },
    itemSeparator: {
        height: StyleSheet.hairlineWidth,
        backgroundColor: darkColors.onBackground,
        opacity: colorEmphasis.medium,
    },
    qaContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    button: {
        width: 80,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        fontWeight: 'bold',
        opacity: colorEmphasis.high,
    },
    button1Text: {
        color: darkColors.primary,
    },
    button2Text: {
        color: darkColors.secondary,
    },
    button3Text: {
        color: darkColors.error,
    }
});

export default EmailList;