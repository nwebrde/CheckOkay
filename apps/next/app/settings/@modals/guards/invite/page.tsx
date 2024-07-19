'use client';

import React, { useRef } from 'react'
import {Modal} from 'app/design/modal/modal'
import { HandlerRef } from 'app/design/modal/types'
import { Invite } from 'app/features/settings/guards/Invite'

export default function Page() {
    const ref = useRef<HandlerRef>(null);
    return (
        <Modal title="Beschützer einladen" cancelLabel="Abbrechen" proceedLabel="Hinzufügen" childRef={ref} routeIdentifier="addMail">
            <Invite ref={ref} />
        </Modal>
    )
}