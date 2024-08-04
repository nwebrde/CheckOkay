import { useState, useEffect } from 'react';

type screen = {
    width: undefined | number;
    height: undefined | number;
}

export const useScreenSize = () => {
    const [screenSize, setScreenSize] = useState<screen>({
        width: undefined,
        height: undefined,
    });

    useEffect(() => {
        const handleResize = () => {
            setScreenSize({
                width: window.innerWidth,
                height: window.innerHeight,
            });
        };

        window.addEventListener('resize', handleResize);

        handleResize();

        // Clean up the event listener when the component unmounts
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return screenSize;
};

export const useLargeSettings = () => {
    const {width} = useScreenSize()

    if(!width) {
        return undefined
    }

    return width > 1200;
};



export default useScreenSize;