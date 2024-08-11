import { remapProps } from "nativewind";
import { ScrollView as ScrollViewNative } from "react-native";

export const ScrollView = remapProps(ScrollViewNative, {
    className: "style",
    contentClassName: "contentContainerStyle",
});