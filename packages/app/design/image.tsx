import { SolitoImage } from 'solito/image'
import { cssInterop } from 'nativewind'

export function Image({ className, ...props }) {
    return (<SolitoImage className={className} {...props } />)
}

cssInterop(Image, {
    className: {
        target: "style", // map className->style
        nativeStyleToProp: {
            width: true, // extract `textAlign` styles and pass them to the `textAlign` prop
            height: true
        },
    },
});
