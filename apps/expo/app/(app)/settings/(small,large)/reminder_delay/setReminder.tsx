import React, { useRef } from 'react'
import { SetReminder } from 'app/features/settings/notifications/SetReminder'
import Modal from 'app/design/modal/modal'
import { HandlerRef } from 'app/design/modal/types'


export default function Page() {
    const ref = useRef<HandlerRef>(null)
    return (
        <Modal title="Erinnerung" proceedLabel="Fertig" cancelLabel="Abbrechen" childRef={ref} routeIdentifier="">
            <SetReminder ref={ref} />
        </Modal>
    )
}