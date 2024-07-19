import React, { useRef } from 'react'
import {Modal} from 'app/design/modal/modal'
import { HandlerRef, ModalRef } from 'app/design/modal/types'
import { Invite } from 'app/features/settings/guards/Invite'
import { ShareButton } from 'app/design/sharebutton/sharebutton'

export default function Page() {
    const ref = useRef<HandlerRef>(null);
    const modalRef = useRef<ModalRef>(null);
    return (
            <Modal ref={modalRef} title="Beschützer einladen" cancelLabel="Abbrechen" childRef={ref} routeIdentifier="invite">
                <Invite ref={ref} modalRef={modalRef} />
            </Modal>
        )
}