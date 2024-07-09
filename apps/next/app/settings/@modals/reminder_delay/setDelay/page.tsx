'use client'

import React, { useRef } from 'react'
import Modal from 'app/design/modal/modal'
import { HandlerRef } from 'app/design/modal/types'
import { SetDelay } from 'app/features/settings/notifications/SetDelay'

export default function Page() {
    const ref = useRef<HandlerRef>(null)

    return (
        <Modal routeIdentifier="setDelay" proceedLabel="Fertig" cancelLabel="Abbrechen" title="Zeitverzögerte Warnungen"
               childRef={ref}>
            <SetDelay ref={ref} />
        </Modal>
    )
}