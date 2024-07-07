import { cssInterop } from 'nativewind';
import { XMark } from '@nandorojo/heroicons/24/outline'
import { Plus } from '@nandorojo/heroicons/20/solid'
import { ChevronRight } from '@nandorojo/heroicons/24/outline'

function interopIcon(icon: any) {
    cssInterop(icon, {
        className: {
            target: 'style',
            nativeStyleToProp: {
                width: true, height: true, color: true
            },
        },
    });
}

interopIcon(XMark);
interopIcon(ChevronRight);
interopIcon(Plus);
export { XMark, ChevronRight };