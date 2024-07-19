'use client';

import React, { useRef } from 'react'
import {Modal} from 'app/design/modal/modal'
import { HandlerRef } from 'app/design/modal/types'
import { AddCheck } from 'app/features/settings/checks/AddCheck'

export default function Page() {
    const ref = useRef<HandlerRef>(null);
    return (
        <Modal title="Kontrollzeitpunkt hinzufügen" cancelLabel="Abbrechen" proceedLabel="Hinzufügen" childRef={ref} routeIdentifier="addMail">
            <AddCheck />
        </Modal>
    )
}