import { cssInterop } from 'nativewind';
import { XMark } from '@nandorojo/heroicons/24/outline'
import { Plus } from '@nandorojo/heroicons/24/outline'
import { ChevronRight } from '@nandorojo/heroicons/24/outline'
import { Cog6Tooth } from '@nandorojo/heroicons/24/solid'
import { Trash } from '@nandorojo/heroicons/20/solid'


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
interopIcon(Trash);
interopIcon(ChevronRight);
interopIcon(Plus);
interopIcon(Cog6Tooth)
export { XMark, ChevronRight, Plus, Cog6Tooth, Trash };