import {StyleProp, ViewStyle} from "react-native";
import {ReactNode} from "react";

export interface Props {
    children?: ReactNode;
    style?: StyleProp<ViewStyle>;
}