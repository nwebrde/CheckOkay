import React, { MutableRefObject, useRef, useState } from 'react'
import { ActivityIndicator, Animated, View } from 'react-native'

import { Swipeable } from 'react-native-gesture-handler';
import { StyledPressable } from 'app/design/button'
import { Trash } from 'app/design/icons'

const AnimatedView = Animated.createAnimatedComponent(View);

export function SwipeableToDelete({ children, action, isDeleting }) {
    const renderRightActions = (
        _progress: Animated.AnimatedInterpolation<number>,
        dragX: Animated.AnimatedInterpolation<number>
    ) => {
        const scale = dragX.interpolate({
            inputRange: [-80, 0],
            outputRange: [1, 0],
            extrapolate: 'clamp',
        });
        return (
            <StyledPressable className="flex text-white pr-5 flex-row-reverse items-center bg-red-500 w-full h-full"
                             onPress={action}>
                <AnimatedView style={[{ transform: [{ scale }] }]}>
                    { !isDeleting &&
                    <Trash className="text-white" />
                    }
                    { isDeleting &&
                        <ActivityIndicator size="small" color="white" />
                    }
                </AnimatedView>
            </StyledPressable>
        );
    };


    const rowRef: MutableRefObject<Swipeable | null> = useRef(null);
    /*
    const close = () => {
        rowRef.current?.close();
    };

     */

    return (
        <Swipeable
            ref={rowRef}
            friction={2}
            enableTrackpadTwoFingerGesture
            onSwipeableOpen={action}
            renderRightActions={renderRightActions}>
            {children}
        </Swipeable>
    );
}