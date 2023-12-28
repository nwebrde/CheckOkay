import {Pressable, Text, View} from "react-native";
import React from "react";
import DateTimePicker from "@react-native-community/datetimepicker";
import {TimePicker} from "./TimePicker";

const renderItem = ({ item }: { item: number }) => {
    return (
        <Pressable

        >
            <View style={{flex: 1, flexDirection: 'row', justifyContent: 'center', width: '100%'}}>
                <TimePicker style={{flex: 1, backgroundColor: 'red', width: '100%'}} />
                <Text style={{flex: 1, backgroundColor: 'red'}}>Cell Id: {item}</Text>
            </View>
        </Pressable>
    );
};

export default renderItem;