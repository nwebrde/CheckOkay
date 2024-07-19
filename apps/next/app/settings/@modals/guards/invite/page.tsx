'use client';

import React, { useRef } from 'react'
import {Modal} from 'app/design/modal/modal'
import { HandlerRef, ModalRef } from 'app/design/modal/types'
import { Invite } from 'app/features/settings/guards/Invite'

export default function Page() {
    const ref = useRef<HandlerRef>(null);
    const modalRef = useRef<ModalRef>(null);
    return (
        <Modal title="Beschützer einladen" cancelLabel="Abbrechen" proceedLabel="Hinzufügen" childRef={ref} routeIdentifier="invite">
            <Invite modalRef={modalRef} ref={ref} />
        </Modal>
    )
}